import logging
import json
import os
from datetime import datetime
from pathlib import Path
from typing import Annotated
from dataclasses import dataclass, field

from dotenv import load_dotenv
from pydantic import Field
from livekit.agents import (
    Agent,
    AgentSession,
    JobContext,
    JobProcess,
    MetricsCollectedEvent,
    RoomInputOptions,
    WorkerOptions,
    cli,
    metrics,
    tokenize,
    function_tool,
    RunContext,
    ToolError
)
from livekit.plugins import murf, silero, google, deepgram, noise_cancellation

logger = logging.getLogger("agent")

load_dotenv(".env.local")

# Create orders directory if it doesn't exist
ORDERS_DIR = Path(__file__).parent.parent / "orders"
ORDERS_DIR.mkdir(exist_ok=True)

# Menu prices (in rupees ₹)
DRINK_PRICES = {
    "espresso": {"small": 245, "medium": 285, "large": 330},
    "latte": {"small": 370, "medium": 410, "large": 450},
    "cappuccino": {"small": 350, "medium": 395, "large": 435},
    "americano": {"small": 285, "medium": 330, "large": 370},
    "mocha": {"small": 410, "medium": 450, "large": 495},
    "cold_brew": {"small": 330, "medium": 370, "large": 410},
    "macchiato": {"small": 350, "medium": 395, "large": 435},
    "flat_white": {"small": 370, "medium": 410, "large": 450},
}

EXTRA_PRICES = {
    "extra_shot": 65,
    "whipped_cream": 60,
    "caramel_drizzle": 50,
    "vanilla_syrup": 50,
    "hazelnut_syrup": 50,
    "chocolate_chips": 60,
}

MILK_UPCHARGE = {
    "oat": 60,
    "almond": 60,
    "soy": 60,
}


@dataclass
class OrderItem:
    """Represents a single item in the order."""
    order_id: str
    drink_type: str
    size: str
    milk: str
    extras: list[str] = field(default_factory=list)
    price: float = 0.0

    def calculate_price(self) -> float:
        """Calculate the total price for this item."""
        base_price = DRINK_PRICES.get(self.drink_type, {}).get(self.size, 0.0)
        milk_charge = MILK_UPCHARGE.get(self.milk, 0.0)
        extras_charge = sum(EXTRA_PRICES.get(extra, 0.0) for extra in self.extras)
        self.price = base_price + milk_charge + extras_charge
        return self.price

    def to_dict(self) -> dict:
        """Convert to dictionary for JSON serialization."""
        return {
            "order_id": self.order_id,
            "drink_type": self.drink_type,
            "size": self.size,
            "milk": self.milk,
            "extras": self.extras,
            "price": self.price,
        }


class CoffeeBaristaAgent(Agent):
    """A friendly coffee shop barista agent that takes orders."""
    
    def __init__(self) -> None:
        super().__init__(
            instructions="""You are a friendly and enthusiastic barista at Starbucks, a premium coffee shop. 
            Your job is to help customers place their coffee orders in a warm, conversational way.
            
            WORKFLOW:
            1. Greet the customer warmly
            2. Take their order (drink, size, milk, extras)
            3. Ask for their name
            4. Review the complete order with pricing
            5. Confirm and process the order
            
            MENU ITEMS:
            - Espresso, Latte, Cappuccino, Americano, Mocha, Cold Brew, Macchiato, Flat White
            - Sizes: Small (₹245-₹410), Medium (₹285-₹450), Large (₹330-₹495)
            - Milk: Whole, Skim, Oat (+₹60), Almond (+₹60), Soy (+₹60), or None
            - Extras: Extra shot (+₹65), Whipped cream (+₹60), Caramel drizzle (+₹50), 
              Vanilla syrup (+₹50), Hazelnut syrup (+₹50), Chocolate chips (+₹60)
            
            IMPORTANT GUIDELINES:
            - Be warm, friendly, and conversational like a real barista
            - Ask questions naturally, one at a time
            - Offer suggestions if the customer seems unsure
            - After adding each item, use review_order to show them their current order
            - Before finalizing, ALWAYS call review_order to confirm the complete order with prices
            - Keep responses concise and conversational
            - Don't use emojis or special formatting in your speech
            - Multiple items can be ordered - ask if they want anything else
            - You can modify or remove items if requested
            
            Start by greeting the customer warmly and asking what they'd like to order today.""",
        )
        
        # Initialize order items list
        self.order_items: list[OrderItem] = []
        self.customer_name: str | None = None
        self.next_item_id = 1
    
    async def on_enter(self) -> None:
        """Called when the agent becomes active. Greets the customer."""
        await self.session.generate_reply(
            instructions="Warmly welcome the customer to Starbucks. Say something like 'Welcome to Starbucks! What can I get started for you today?' or 'Good day! Welcome to Starbucks, how may I help you?' Be friendly and inviting."
        )
    
    @function_tool
    async def add_item(
        self,
        context: RunContext,
        drink_type: Annotated[
            str,
            Field(description="The type of drink: espresso, latte, cappuccino, americano, mocha, cold_brew, macchiato, or flat_white")
        ],
        size: Annotated[
            str,
            Field(description="The size: small, medium, or large")
        ],
        milk: Annotated[
            str,
            Field(description="Milk type: whole, skim, oat, almond, soy, or none")
        ],
        extras: Annotated[
            list[str],
            Field(description="List of extras like extra_shot, whipped_cream, caramel_drizzle, vanilla_syrup, hazelnut_syrup, chocolate_chips")
        ] = None,
    ) -> str:
        """Add a complete item to the order. Call this when you have all details for one drink.
        
        Examples:
        - "I'll have a medium latte with oat milk" -> add_item("latte", "medium", "oat", [])
        - "Large mocha with whipped cream and extra shot" -> add_item("mocha", "large", "whole", ["whipped_cream", "extra_shot"])
        """
        if extras is None:
            extras = []
        
        # Normalize inputs
        drink_type = drink_type.lower().replace(" ", "_")
        size = size.lower()
        milk = milk.lower()
        extras = [e.lower().replace(" ", "_") for e in extras]
        
        # Validate drink type
        if drink_type not in DRINK_PRICES:
            raise ToolError(f"Sorry, we don't have {drink_type}. Available drinks: " + ", ".join(DRINK_PRICES.keys()))
        
        # Validate size
        if size not in ["small", "medium", "large"]:
            raise ToolError(f"Size must be small, medium, or large, not {size}")
        
        # Create order item
        order_id = f"item_{self.next_item_id}"
        self.next_item_id += 1
        
        item = OrderItem(
            order_id=order_id,
            drink_type=drink_type,
            size=size,
            milk=milk,
            extras=extras,
        )
        item.calculate_price()
        self.order_items.append(item)
        
        logger.info(f"Added item: {item.to_dict()}")
        return f"Added {size} {drink_type.replace('_', ' ')} to your order! Price: ₹{item.price:.0f}. Order ID: {order_id}"
    
    @function_tool
    async def remove_item(
        self,
        context: RunContext,
        order_id: Annotated[
            str,
            Field(description="The order_id of the item to remove (e.g., 'item_1'). Use review_order to see all order_ids.")
        ],
    ) -> str:
        """Remove an item from the order by its order_id.
        
        Use review_order first to see the order_ids of all items.
        """
        for i, item in enumerate(self.order_items):
            if item.order_id == order_id:
                removed_item = self.order_items.pop(i)
                logger.info(f"Removed item: {removed_item.to_dict()}")
                return f"Removed {removed_item.size} {removed_item.drink_type.replace('_', ' ')} from your order."
        
        raise ToolError(f"Item {order_id} not found. Use review_order to see all items.")
    
    @function_tool
    async def review_order(self, context: RunContext) -> str:
        """Review the current order with all items and total price.
        
        ALWAYS call this before asking the customer to confirm their order.
        """
        if not self.order_items:
            return "Your order is currently empty."
        
        order_summary = "Here's your current order:\n"
        total = 0.0
        
        for item in self.order_items:
            extras_text = ""
            if item.extras:
                extras_text = " with " + ", ".join(e.replace("_", " ") for e in item.extras)
            
            milk_text = "" if item.milk == "none" else f" with {item.milk} milk"
            
            order_summary += f"- {item.order_id}: {item.size.capitalize()} {item.drink_type.replace('_', ' ')}{milk_text}{extras_text} - ₹{item.price:.0f}\n"
            total += item.price
        
        order_summary += f"\nTotal: ₹{total:.0f}"
        
        if self.customer_name:
            order_summary += f"\nName: {self.customer_name}"
        
        logger.info(f"Order review: {order_summary}")
        return order_summary
    
    @function_tool
    async def show_menu(self, context: RunContext) -> str:
        """Show the complete menu with prices to the customer.
        
        Call this when the customer asks "What do you have?", "Show me the menu", 
        "What's available?", or seems unsure about what to order.
        """
        menu = "Here's our menu at Starbucks:\n\n"
        
        menu += "☕ SPECIALTY DRINKS (Small/Medium/Large):\n"
        for drink, prices in DRINK_PRICES.items():
            drink_name = drink.replace("_", " ").title()
            menu += f"  • {drink_name}: ₹{prices['small']:.0f} / ₹{prices['medium']:.0f} / ₹{prices['large']:.0f}\n"
        
        menu += "\n🥛 MILK OPTIONS:\n"
        menu += "  • Whole, Skim, or None - included\n"
        menu += "  • Oat, Almond, or Soy - add ₹60\n"
        
        menu += "\n✨ EXTRAS:\n"
        for extra, price in EXTRA_PRICES.items():
            extra_name = extra.replace("_", " ").title()
            menu += f"  • {extra_name} - add ₹{price:.0f}\n"
        
        logger.info("Menu displayed to customer")
        return menu
    
    @function_tool
    async def set_customer_name(self, context: RunContext, name: str) -> str:
        """Set or update the customer's name for the order.
        
        Args:
            name: The customer's name
        """
        self.customer_name = name
        logger.info(f"Customer name set: {name}")
        return f"Perfect! I have your name as {name}."
    
    @function_tool
    async def complete_order(self, context: RunContext) -> str:
        """Complete and save the order to a JSON file.
        
        ONLY call this after:
        1. At least one item has been added
        2. Customer name has been collected
        3. Order has been reviewed with review_order
        4. Customer has confirmed the order
        """
        # Validation
        if not self.order_items:
            raise ToolError("Cannot complete order - no items in the order. Please add items first.")
        
        if not self.customer_name:
            raise ToolError("Cannot complete order - customer name is missing. Please ask for their name.")
        
        # Calculate total
        total = sum(item.price for item in self.order_items)
        
        # Generate order ID and timestamp
        order_id = datetime.now().strftime("%Y%m%d_%H%M%S")
        timestamp = datetime.now().isoformat()
        
        # Create order data
        order_data = {
            "orderId": order_id,
            "timestamp": timestamp,
            "customerName": self.customer_name,
            "items": [item.to_dict() for item in self.order_items],
            "total": round(total, 2),
            "itemCount": len(self.order_items),
        }
        
        # Save to JSON file
        filename = ORDERS_DIR / f"order_{order_id}.json"
        with open(filename, "w") as f:
            json.dump(order_data, f, indent=2)
        
        logger.info(f"Order saved: {filename}")
        logger.info(f"Order details: {order_data}")
        
        # Store completed order details for response
        completed_order = {
            "order_id": order_id,
            "customer_name": self.customer_name,
            "item_count": len(self.order_items),
            "total": total,
        }
        
        # Reset for next customer
        self.order_items = []
        self.customer_name = None
        self.next_item_id = 1
        
        return f"Order completed! Order ID: {order_id}. Total: ₹{completed_order['total']:.0f}. Your {completed_order['item_count']} item(s) will be ready shortly, {completed_order['customer_name']}! Thank you for choosing Starbucks!"


def prewarm(proc: JobProcess):
    proc.userdata["vad"] = silero.VAD.load()


async def entrypoint(ctx: JobContext):
    # Logging setup
    # Add any other context you want in all log entries here
    ctx.log_context_fields = {
        "room": ctx.room.name,
    }

    # Set up a voice AI pipeline using OpenAI, Cartesia, AssemblyAI, and the LiveKit turn detector
    session = AgentSession(
        # Speech-to-text (STT) is your agent's ears, turning the user's speech into text that the LLM can understand
        # See all available models at https://docs.livekit.io/agents/models/stt/
        stt=deepgram.STT(model="nova-3"),
        # A Large Language Model (LLM) is your agent's brain, processing user input and generating a response
        # See all available models at https://docs.livekit.io/agents/models/llm/
        llm=google.LLM(
                model="gemini-2.5-flash",
            ),
        # Text-to-speech (TTS) is your agent's voice, turning the LLM's text into speech that the user can hear
        # See all available models as well as voice selections at https://docs.livekit.io/agents/models/tts/
        tts=murf.TTS(
                voice="en-US-matthew", 
                style="Conversation",
                tokenizer=tokenize.basic.SentenceTokenizer(min_sentence_len=2),
                text_pacing=True
            ),
        # VAD and turn detection are used to determine when the user is speaking and when the agent should respond
        # See more at https://docs.livekit.io/agents/build/turns
        # Using VAD-based turn detection for Windows compatibility
        vad=ctx.proc.userdata["vad"],
        # allow the LLM to generate a response while waiting for the end of turn
        # See more at https://docs.livekit.io/agents/build/audio/#preemptive-generation
        preemptive_generation=True,
    )

    # To use a realtime model instead of a voice pipeline, use the following session setup instead.
    # (Note: This is for the OpenAI Realtime API. For other providers, see https://docs.livekit.io/agents/models/realtime/))
    # 1. Install livekit-agents[openai]
    # 2. Set OPENAI_API_KEY in .env.local
    # 3. Add `from livekit.plugins import openai` to the top of this file
    # 4. Use the following session setup instead of the version above
    # session = AgentSession(
    #     llm=openai.realtime.RealtimeModel(voice="marin")
    # )

    # Metrics collection, to measure pipeline performance
    # For more information, see https://docs.livekit.io/agents/build/metrics/
    usage_collector = metrics.UsageCollector()

    @session.on("metrics_collected")
    def _on_metrics_collected(ev: MetricsCollectedEvent):
        metrics.log_metrics(ev.metrics)
        usage_collector.collect(ev.metrics)

    async def log_usage():
        summary = usage_collector.get_summary()
        logger.info(f"Usage: {summary}")

    ctx.add_shutdown_callback(log_usage)

    # # Add a virtual avatar to the session, if desired
    # # For other providers, see https://docs.livekit.io/agents/models/avatar/
    # avatar = hedra.AvatarSession(
    #   avatar_id="...",  # See https://docs.livekit.io/agents/models/avatar/plugins/hedra
    # )
    # # Start the avatar and wait for it to join
    # await avatar.start(session, room=ctx.room)

    # Start the session, which initializes the voice pipeline and warms up the models
    await session.start(
        agent=CoffeeBaristaAgent(),
        room=ctx.room,
        room_input_options=RoomInputOptions(
            # For telephony applications, use `BVCTelephony` for best results
            noise_cancellation=noise_cancellation.BVC(),
        ),
    )

    # Join the room and connect to the user
    await ctx.connect()


if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint, prewarm_fnc=prewarm))
