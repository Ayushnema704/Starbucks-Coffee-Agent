'use client';

import { ScrollArea } from '../livekit/scroll-area/scroll-area';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import type { ReceivedChatMessage } from '@livekit/components-react';

const MotionDiv = motion.create('div');

const menuItems = {
  drinks: [
    { name: 'Latte', price: '₹410', icon: '☕', keywords: ['latte', 'caffe latte'] },
    { name: 'Cappuccino', price: '₹395', icon: '☕', keywords: ['cappuccino', 'cappucino'] },
    { name: 'Americano', price: '₹330', icon: '☕', keywords: ['americano'] },
    { name: 'Mocha', price: '₹435', icon: '🍫', keywords: ['mocha', 'chocolate'] },
    { name: 'Espresso', price: '₹245', icon: '☕', keywords: ['espresso', 'expresso'] },
    { name: 'Cold Brew', price: '₹370', icon: '🧊', keywords: ['cold brew', 'cold coffee'] },
    { name: 'Macchiato', price: '₹385', icon: '☕', keywords: ['macchiato'] },
    { name: 'Flat White', price: '₹400', icon: '☕', keywords: ['flat white'] },
  ],
  sizes: [
    { name: 'Tall', size: '12 oz', keywords: ['tall', 'small'] },
    { name: 'Grande', size: '16 oz', keywords: ['grande', 'medium', 'regular'] },
    { name: 'Venti', size: '20 oz', keywords: ['venti', 'large'] },
  ],
  milkOptions: [
    { name: '2% Milk', icon: '🥛', keywords: ['2%', '2 percent', 'two percent', 'regular milk'] },
    { name: 'Whole Milk', icon: '🥛', keywords: ['whole', 'full fat'] },
    { name: 'Nonfat Milk', icon: '🥛', keywords: ['nonfat', 'skim', 'fat free', 'no fat'] },
    { name: 'Oat Milk', icon: '🌾', keywords: ['oat', 'oatmilk'] },
    { name: 'Almond Milk', icon: '🌰', keywords: ['almond'] },
    { name: 'Soy Milk', icon: '🫘', keywords: ['soy', 'soya'] },
    { name: 'Coconut Milk', icon: '🥥', keywords: ['coconut'] },
  ],
  extras: [
    { name: 'Whipped Cream', icon: '🍦', keywords: ['whipped cream', 'whip', 'whipped', 'cream'] },
    { name: 'Extra Shot', icon: '☕', keywords: ['extra shot', 'double shot', 'additional shot', 'extra espresso'] },
    { name: 'Caramel Drizzle', icon: '🍯', keywords: ['caramel', 'caramel drizzle'] },
    { name: 'Chocolate Chips', icon: '🍫', keywords: ['chocolate chips', 'choco chips', 'chocolate'] },
    { name: 'Vanilla Syrup', icon: '🧴', keywords: ['vanilla', 'vanilla syrup'] },
    { name: 'Hazelnut Syrup', icon: '🧴', keywords: ['hazelnut', 'hazelnut syrup'] },
  ],
};

interface MenuPanelProps {
  messages?: ReceivedChatMessage[];
}

export function MenuPanel({ messages = [] }: MenuPanelProps) {
  const [selectedItems, setSelectedItems] = useState<{
    drink?: string;
    size?: string;
    milk?: string;
    extras: string[];
  }>({ extras: [] });

  // Auto-select items based on conversation with improved keyword matching
  useEffect(() => {
    if (messages.length === 0) return;
    
    // Only check user messages (local messages), not agent responses
    const userMessages = messages
      .filter(m => m.from?.isLocal === true)
      .map(m => m.message.toLowerCase())
      .join(' ');
    
    if (!userMessages) return;
    
    // Build all updates in a single batch
    const updates: {
      drink?: string;
      size?: string;
      milk?: string;
      extras: string[];
    } = { extras: [] };
    
    // Detect drink (keep only last match)
    let foundDrink = '';
    menuItems.drinks.forEach(drink => {
      const matches = drink.keywords.some(keyword => userMessages.includes(keyword.toLowerCase()));
      if (matches) {
        foundDrink = drink.name;
      }
    });
    if (foundDrink) updates.drink = foundDrink;

    // Detect size (keep only last match)
    let foundSize = '';
    menuItems.sizes.forEach(size => {
      const matches = size.keywords.some(keyword => userMessages.includes(keyword));
      if (matches) {
        foundSize = size.name;
      }
    });
    if (foundSize) updates.size = foundSize;

    // Detect milk (keep only last match)
    let foundMilk = '';
    menuItems.milkOptions.forEach(milk => {
      const matches = milk.keywords.some(keyword => userMessages.includes(keyword));
      if (matches) {
        foundMilk = milk.name;
      }
    });
    if (foundMilk) updates.milk = foundMilk;

    // Detect extras (accumulate all)
    const detectedExtras: string[] = [];
    menuItems.extras.forEach(extra => {
      const matches = extra.keywords.some(keyword => userMessages.includes(keyword));
      if (matches) {
        detectedExtras.push(extra.name);
      }
    });
    if (detectedExtras.length > 0) {
      updates.extras = Array.from(new Set(detectedExtras));
    }

    // Update state only once if there are changes
    setSelectedItems(prev => {
      const newState = {
        drink: updates.drink || prev.drink,
        size: updates.size || prev.size,
        milk: updates.milk || prev.milk,
        extras: updates.extras.length > 0 ? Array.from(new Set([...prev.extras, ...updates.extras])) : prev.extras,
      };
      
      // Only update if something actually changed
      if (
        newState.drink === prev.drink &&
        newState.size === prev.size &&
        newState.milk === prev.milk &&
        JSON.stringify(newState.extras.sort()) === JSON.stringify(prev.extras.sort())
      ) {
        return prev;
      }
      
      return newState;
    });
  }, [messages]);
  return (
    <MotionDiv
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="hidden md:block fixed right-0 top-0 bottom-0 w-80 lg:w-96 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-l border-[#00704A]/20 dark:border-[#1fbc79]/20 shadow-2xl z-40 overflow-hidden"
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-4 md:p-5 lg:p-6 border-b border-[#00704A]/20 dark:border-[#1fbc79]/20 flex-shrink-0">
          <h2 className="text-xl md:text-2xl font-bold text-[#00704A] dark:text-[#1fbc79] flex items-center gap-2">
            <span>📋</span>
            Menu
          </h2>
          <p className="text-xs md:text-sm text-[#4a5f53] dark:text-[#8fa898] mt-1">
            Speak to order any item
          </p>
        </div>

        {/* Menu Content */}
        <ScrollArea className="flex-1 p-4 md:p-5 lg:p-6">
          <div className="space-y-6">
            {/* Drinks */}
            <div>
              <h3 className="text-lg font-bold text-[#00704A] dark:text-[#1fbc79] mb-3 flex items-center gap-2">
                <span>☕</span>
                Beverages
              </h3>
              <div className="space-y-2">
                {menuItems.drinks.map((drink) => {
                  const isSelected = selectedItems.drink === drink.name;
                  return (
                  <div
                    key={drink.name}
                    className={`flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-[#00704A] dark:bg-[#1fbc79] ring-2 ring-[#00704A] dark:ring-[#1fbc79] scale-105 shadow-lg'
                        : 'bg-[#f5f5f0] dark:bg-gray-800 hover:bg-[#e8f5e9] dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{drink.icon}</span>
                      <span className={`font-medium ${
                        isSelected ? 'text-white' : 'text-[#1e3932] dark:text-[#c9e7dc]'
                      }`}>
                        {drink.name}
                      </span>
                    </div>
                    <span className={`text-sm font-semibold ${
                      isSelected ? 'text-white' : 'text-[#00704A] dark:text-[#1fbc79]'
                    }`}>
                      {drink.price}
                    </span>
                  </div>
                );
                })}
              </div>
            </div>

            {/* Sizes */}
            <div>
              <h3 className="text-lg font-bold text-[#00704A] dark:text-[#1fbc79] mb-3 flex items-center gap-2">
                <span>📏</span>
                Sizes
              </h3>
              <div className="space-y-2">
                {menuItems.sizes.map((size) => {
                  const isSelected = selectedItems.size === size.name;
                  return (
                  <div
                    key={size.name}
                    className={`flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#00704A] dark:bg-[#1fbc79] ring-2 ring-[#00704A] dark:ring-[#1fbc79] scale-105 shadow-lg'
                        : 'bg-[#f5f5f0] dark:bg-gray-800 hover:bg-[#e8f5e9] dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className={`font-medium ${
                      isSelected ? 'text-white' : 'text-[#1e3932] dark:text-[#c9e7dc]'
                    }`}>
                      {size.name}
                    </span>
                    <span className={`text-sm ${
                      isSelected ? 'text-white' : 'text-[#4a5f53] dark:text-[#8fa898]'
                    }`}>
                      {size.size}
                    </span>
                  </div>
                );
                })}
              </div>
            </div>

            {/* Milk Options */}
            <div>
              <h3 className="text-lg font-bold text-[#00704A] dark:text-[#1fbc79] mb-3 flex items-center gap-2">
                <span>🥛</span>
                Milk Options
              </h3>
              <div className="space-y-2">
                {menuItems.milkOptions.map((milk) => {
                  const isSelected = selectedItems.milk === milk.name;
                  return (
                  <div
                    key={milk.name}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#00704A] dark:bg-[#1fbc79] ring-2 ring-[#00704A] dark:ring-[#1fbc79] scale-105 shadow-lg'
                        : 'bg-[#f5f5f0] dark:bg-gray-800 hover:bg-[#e8f5e9] dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className="text-2xl">{milk.icon}</span>
                    <span className={`font-medium ${
                      isSelected ? 'text-white' : 'text-[#1e3932] dark:text-[#c9e7dc]'
                    }`}>
                      {milk.name}
                    </span>
                  </div>
                );
                })}
              </div>
            </div>

            {/* Extras */}
            <div>
              <h3 className="text-lg font-bold text-[#00704A] dark:text-[#1fbc79] mb-3 flex items-center gap-2">
                <span>✨</span>
                Add-ons & Extras
              </h3>
              <div className="space-y-2">
                {menuItems.extras.map((extra) => {
                  const isSelected = selectedItems.extras.includes(extra.name);
                  return (
                  <div
                    key={extra.name}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#00704A] dark:bg-[#1fbc79] ring-2 ring-[#00704A] dark:ring-[#1fbc79] scale-105 shadow-lg'
                        : 'bg-[#f5f5f0] dark:bg-gray-800 hover:bg-[#e8f5e9] dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className="text-2xl">{extra.icon}</span>
                    <span className={`font-medium ${
                      isSelected ? 'text-white' : 'text-[#1e3932] dark:text-[#c9e7dc]'
                    }`}>
                      {extra.name}
                    </span>
                  </div>
                );
                })}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </MotionDiv>
  );
}
