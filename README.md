# ☕ Starbucks Voice Ordering Agent

An intelligent AI voice agent that provides a seamless Starbucks coffee ordering experience with real-time voice interaction, smart menu auto-selection, and a fully responsive interface.

## 🎯 Project Overview

This project demonstrates an advanced voice-powered ordering system built for Starbucks, featuring:
- **Real-time voice interaction** using LiveKit Agents
- **Smart menu auto-selection** that highlights items as they're mentioned
- **Responsive design** that adapts from mobile to desktop
- **Indian Rupee (₹) pricing** throughout the application
- **Live conversation transcript** with visible chat bubbles
- **Order management** with JSON-based order history

## 🚀 Features

### Voice AI Agent
- Natural conversation flow for taking coffee orders
- Understands drink names, sizes (Tall/Grande/Venti), milk preferences, and extras
- Contextual responses using LiveKit's Turn Detector
- Order confirmation and review functionality
- Powered by **Murf Falcon TTS** for ultra-fast, natural voice synthesis

### Smart Menu Panel
- Real-time auto-selection based on user's spoken/typed orders
- Keyword-based matching for drinks, sizes, milk options, and extras
- Visual highlighting of selected items with smooth transitions
- Filters user messages to avoid false matches from agent suggestions
- Comprehensive menu with 8 beverages and multiple customization options

### Responsive UI
- **Mobile-first design** with menu panel hidden on small screens
- **Tablet/Desktop layout** with persistent menu sidebar
- Circular Starbucks logo with floating animation
- Dark mode support with Starbucks brand colors
- Smooth transitions and animations throughout

### Chat Transcript
- Always-visible conversation history
- Distinct styling for user (blue) and agent (gray) messages
- Scrollable transcript with auto-scroll for new messages
- Real-time updates as conversation progresses

## 🛠️ Tech Stack

### Backend
- **LiveKit Agents** - Real-time voice agent framework
- **Murf Falcon TTS** - Ultra-fast text-to-speech
- **Deepgram/Google STT** - Speech-to-text recognition
- **Python 3.12** - Backend runtime

### Frontend
- **Next.js 15.5.2** - React framework with Turbopack
- **React 19** - UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Motion/Framer Motion** - Smooth animations
- **LiveKit Components** - Real-time communication

## 📁 Repository Structure

```
Day_2/
├── backend/              # Python backend with voice agent
│   ├── src/
│   │   └── agent.py     # Main agent logic with order handling
│   ├── orders/          # JSON order history
│   └── pyproject.toml   # Python dependencies
├── frontend/            # Next.js frontend
│   ├── components/
│   │   ├── app/        # Application components
│   │   │   ├── menu-panel.tsx        # Smart menu with auto-selection
│   │   │   ├── chat-transcript.tsx   # Conversation display
│   │   │   ├── session-view.tsx      # Main session layout
│   │   │   └── welcome-view.tsx      # Landing page
│   │   └── livekit/    # LiveKit UI components
│   ├── hooks/          # Custom React hooks
│   └── styles/         # Global styles
├── challenges/         # Challenge documentation
└── README.md          # This file
```

### Welcome View
- Circular Starbucks logo with floating animation
- "Welcome to STARBUCKS" branding
- "Start Your Order" call-to-action
- Theme toggle (light/dark mode)
- Fully responsive across all breakpoints

### Menu Panel (Right Sidebar)
- 8 coffee beverages with rupee pricing
- Size selection (Tall/Grande/Venti)
- 7 milk options (2%, Whole, Nonfat, Oat, Almond, Soy, Coconut)
- 6 extras (Whipped Cream, Extra Shot, Caramel, etc.)
- Auto-highlights selected items in green
- Smooth animations and transitions

### Chat Transcript
- User messages in blue bubbles (right-aligned)
- Agent messages in gray bubbles (left-aligned)
- Auto-scroll to latest message
- Timestamp on hover
- Always visible during conversation

### Session Controls
- Microphone toggle with visual feedback
- Chat input panel
- Camera/screen share controls
- End call button
- Responsive control bar

## 🚀 Getting Started

### Prerequisites

- **Python 3.12+** with virtual environment
- **Node.js 18+** with pnpm
- **LiveKit Server** (included as executable)
- **API Keys**:
  - Murf API Key (for Falcon TTS)
  - Google/Gemini API Key (for LLM)
  - Deepgram API Key (for STT)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Ayushnema704/Starbucks-Coffee-Agent.git
cd Starbucks-Coffee-Agent
```

2. **Backend Setup**
```bash
cd backend

# Create virtual environment
python -m venv .venv
.venv\Scripts\activate  # Windows
# or
source .venv/bin/activate  # Mac/Linux

# Install dependencies
pip install -e .

# Configure environment variables
cp .env.example .env.local
# Edit .env.local with your API keys:
# - LIVEKIT_URL=http://localhost:7880
# - LIVEKIT_API_KEY=your_key
# - LIVEKIT_API_SECRET=your_secret
# - MURF_API_KEY=your_murf_key
# - GOOGLE_API_KEY=your_google_key
# - DEEPGRAM_API_KEY=your_deepgram_key
```

3. **Frontend Setup**
```bash
cd ../frontend

# Install dependencies
pnpm install

# Configure environment
cp .env.example .env.local
# Add the same LiveKit credentials
```

### Running the Application

**Option 1: Automated (Windows)**
```bash
# From the root directory
1-start-livekit.bat    # Terminal 1: Starts LiveKit server
2-start-backend.bat    # Terminal 2: Starts Python agent
3-start-frontend.bat   # Terminal 3: Starts Next.js app
4-open-browser.bat     # Opens http://localhost:3000
```

**Option 2: Manual Start**
```bash
# Terminal 1 - LiveKit Server
livekit-server --dev --bind 127.0.0.1

# Terminal 2 - Backend Agent
cd backend
.venv/Scripts/python src/agent.py dev

# Terminal 3 - Frontend
cd frontend
pnpm dev
```

Access the application at **http://localhost:3000**

## 📖 Usage

1. **Start Your Order**: Click the "Start Your Order" button
2. **Grant Permissions**: Allow microphone access when prompted
3. **Place Your Order**: Speak naturally, e.g.:
   - "I want a grande cappuccino"
   - "Can I get a venti latte with oat milk?"
   - "Add whipped cream and an extra shot"
4. **Watch the Menu**: Selected items highlight automatically in green
5. **Review**: The agent will confirm your order before completion
6. **View Chat**: See the full conversation transcript with timestamps

## 🎯 Key Features Explained

### Smart Auto-Selection
The menu panel uses keyword matching to detect mentioned items:
- **Drinks**: Matches variations like "cappuccino", "cappucino"
- **Sizes**: Recognizes "small" → Tall, "medium" → Grande, "large" → Venti
- **Milk**: Detects "oat", "almond", "soy", etc.
- **Extras**: Identifies "whip", "extra shot", "caramel", etc.

Only **user messages** are analyzed to avoid false positives from agent suggestions.

### Responsive Design Breakpoints
- **Mobile (< 768px)**: Menu hidden, full-width chat and video
- **Tablet (768px - 1024px)**: Menu visible (320px), adjusted spacing
- **Desktop (> 1024px)**: Full menu (384px), optimal spacing

### Order Management
Orders are saved as JSON files in `backend/orders/` with:
- Timestamp
- Drink details (name, size, milk, extras)
- Total price in rupees
- Order status

## 🔧 Customization

### Modify Menu Items
Edit `frontend/components/app/menu-panel.tsx`:
```typescript
const menuItems = {
  drinks: [
    { name: 'Your Drink', price: '₹XXX', icon: '☕', keywords: ['keyword1', 'keyword2'] }
  ],
  // Add more categories
}
```

### Adjust Agent Behavior
Edit `backend/src/agent.py`:
- Modify `INSTRUCTIONS` for different personality
- Update `DRINK_PRICES` for pricing changes
- Customize greeting messages

### Change Branding
- Replace `frontend/public/logo.png` with your logo
- Update colors in `frontend/components/app/` components
- Modify welcome text in `welcome-view.tsx`

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## 📄 License

This project is licensed under the Apache 2.0 License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

Built for the **AI Voice Agents Challenge** by [Murf.ai](https://murf.ai)
- **LiveKit** - Real-time communication platform
- **Murf Falcon** - Ultra-fast TTS API
- **Next.js** - React framework
- **Tailwind CSS** - Styling framework

## 📞 Support

For issues or questions:
- Create an issue on GitHub
- Check the [challenges](./challenges/) folder for task documentation
- Review component-specific README files

## 🎬 Demo

Experience the live demo at your local server after setup:
```
http://localhost:3000
```

Try ordering:
- "I'd like a grande cappuccino with oat milk and whipped cream"
- "Can I get a venti cold brew?"
- "Small mocha with extra shot, please"

Watch as the menu auto-selects your choices in real-time! ☕✨

---

**Built with ❤️ for the Murf.ai Voice Agents Challenge**
- Replace `frontend/public/logo.png` with your logo
- Update colors in `frontend/components/app/` components
- Modify welcome text in `welcome-view.tsx`

## 📚 Documentation

- [Backend Agent Logic](./backend/README.md)
- [Frontend Components](./frontend/README.md)
- [LiveKit Agents Guide](https://docs.livekit.io/agents)
- [Murf Falcon TTS API](https://murf.ai/api/docs)

## Testing

The backend includes a comprehensive test suite:

```bash
cd backend
uv run pytest
```

Learn more about testing voice agents in the [LiveKit testing documentation](https://docs.livekit.io/agents/build/testing/).

## Contributing & Community

This is a challenge repository, but we encourage collaboration and knowledge sharing!

- Share your solutions and learnings on GitHub
- Post about your progress on LinkedIn
- Join the [LiveKit Community Slack](https://livekit.io/join-slack)
- Connect with other challenge participants

## License

This project is based on MIT-licensed templates from LiveKit and includes integration with Murf Falcon. See individual LICENSE files in backend and frontend directories for details.

## Have Fun!

Remember, the goal is to learn, experiment, and build amazing voice AI agents. Don't hesitate to be creative and push the boundaries of what's possible with Murf Falcon and LiveKit!

Good luck with the challenge!

---

Built for the AI Voice Agents Challenge by murf.ai
