import { Button } from '@/components/livekit/button';
import { ThemeToggle } from '@/components/app/theme-toggle';
import Image from 'next/image';

function StarbucksLogo() {
  return (
    <div className="relative pt-4 sm:pt-6 md:pt-8 lg:pt-10 mb-4 sm:mb-6 md:mb-8 lg:mb-10 animate-fade-in-up flex justify-center items-center">
      <div className="animate-float">
        <Image
          src="/logo.png"
          alt="Starbucks Logo"
          width={176}
          height={176}
          className="drop-shadow-2xl rounded-full w-24 h-24 xs:w-28 xs:h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48"
          priority
        />
      </div>
    </div>
  );
}

interface WelcomeViewProps {
  startButtonText: string;
  onStartCall: () => void;
}

export const WelcomeView = ({
  startButtonText,
  onStartCall,
  ref,
}: React.ComponentProps<'div'> & WelcomeViewProps) => {
  return (
    <div ref={ref} className="min-h-screen flex flex-col bg-gradient-to-br from-[#f5f5f0] via-[#e8f5e9] to-[#d4ebe4] dark:from-[#1a2f2a] dark:via-[#0d1f1a] dark:to-[#00332a] transition-colors duration-300 overflow-x-hidden">
      {/* Theme Toggle Button */}
      <div className="fixed top-3 right-3 sm:top-4 sm:right-4 md:top-6 md:right-6 z-50">
        <ThemeToggle className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-300 scale-90 sm:scale-100" />
      </div>
      
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10 max-w-4xl w-full mx-auto pt-16 sm:pt-20">
        <StarbucksLogo />

        <p className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-3 text-[#00704A] dark:text-[#1fbc79] animate-fade-in-up animation-delay-100">
          Welcome to
        </p>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 sm:mb-5 md:mb-6 tracking-tighter text-[#00704A] dark:text-[#1fbc79] animate-fade-in-up animation-delay-200">
          STARBUCKS
        </h1>
        
        <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3 mb-5 sm:mb-6 md:mb-7 animate-fade-in-up animation-delay-300">
          <div className="w-6 sm:w-8 h-0.5 bg-[#00704A] dark:bg-[#1fbc79] animate-expand-width"></div>
          <span className="text-sm sm:text-base md:text-lg font-semibold text-[#00704A] dark:text-[#1fbc79]">AI VOICE ORDERING</span>
          <div className="w-6 sm:w-8 h-0.5 bg-[#00704A] dark:bg-[#1fbc79] animate-expand-width"></div>
        </div>
        
        <p className="text-foreground max-w-xl pt-2 sm:pt-3 leading-6 sm:leading-7 md:leading-8 font-bold text-lg sm:text-xl md:text-2xl mb-3 sm:mb-4 text-[#1e3932] dark:text-[#c9e7dc] animate-fade-in-up animation-delay-400 px-2">
          Order Your Favorite Drink with Your Voice
        </p>
        
        <p className="text-muted-foreground max-w-lg pt-1 leading-5 sm:leading-6 text-base sm:text-lg mb-5 sm:mb-6 text-[#4a5f53] dark:text-[#8fa898] animate-fade-in-up animation-delay-500 px-2">
          Experience the future of coffee ordering with our intelligent AI barista
        </p>

        <Button 
          variant="primary" 
          size="lg" 
          onClick={onStartCall} 
          className="mt-6 sm:mt-8 md:mt-10 px-8 sm:px-12 md:px-16 py-4 sm:py-5 md:py-7 text-base sm:text-lg md:text-xl font-bold rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 sm:hover:scale-110 active:scale-95 uppercase tracking-wide bg-[#00704A] hover:bg-[#005a3c] dark:bg-[#1fbc79] dark:hover:bg-[#00a868] text-white animate-fade-in-up animation-delay-600 animate-pulse-slow relative overflow-hidden group"
        >
          <span className="relative z-10">{startButtonText} →</span>
          <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"></div>
        </Button>
        
        <div className="mt-8 sm:mt-10 md:mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 w-full max-w-3xl">
          <div className="flex flex-col items-center gap-2 sm:gap-3 p-4 sm:p-5 md:p-6 bg-white/60 dark:bg-gray-800/60 rounded-2xl sm:rounded-3xl backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 sm:hover:-translate-y-3 animate-fade-in-up animation-delay-700 cursor-pointer group">
            <div className="text-4xl sm:text-5xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-300">☕</div>
            <span className="font-bold text-base sm:text-lg text-[#00704A] dark:text-[#1fbc79]">Fresh Brewed</span>
            <span className="text-xs sm:text-sm text-center text-[#4a5f53] dark:text-[#8fa898]">Premium quality coffee every time</span>
          </div>
          <div className="flex flex-col items-center gap-2 sm:gap-3 p-4 sm:p-5 md:p-6 bg-white/60 dark:bg-gray-800/60 rounded-2xl sm:rounded-3xl backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 sm:hover:-translate-y-3 animate-fade-in-up animation-delay-800 cursor-pointer group">
            <div className="text-4xl sm:text-5xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-300">🎤</div>
            <span className="font-bold text-base sm:text-lg text-[#00704A] dark:text-[#1fbc79]">Voice Powered</span>
            <span className="text-xs sm:text-sm text-center text-[#4a5f53] dark:text-[#8fa898]">Just speak your order naturally</span>
          </div>
          <div className="flex flex-col items-center gap-2 sm:gap-3 p-4 sm:p-5 md:p-6 bg-white/60 dark:bg-gray-800/60 rounded-2xl sm:rounded-3xl backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 sm:hover:-translate-y-3 animate-fade-in-up animation-delay-900 cursor-pointer group sm:col-span-2 md:col-span-1">
            <div className="text-4xl sm:text-5xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-300">⚡</div>
            <span className="font-bold text-base sm:text-lg text-[#00704A] dark:text-[#1fbc79]">Lightning Fast</span>
            <span className="text-xs sm:text-sm text-center text-[#4a5f53] dark:text-[#8fa898]">Powered by Murf Falcon TTS</span>
          </div>
        </div>
        
        <div className="mt-6 sm:mt-8 md:mt-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm text-[#4a5f53] dark:text-[#8fa898] px-2">
          <span className="font-semibold">Available Drinks:</span>
          <span className="text-center">Latte • Cappuccino • Americano • Mocha • Espresso • Cold Brew</span>
        </div>
      </section>

      <div className="fixed bottom-3 sm:bottom-4 md:bottom-6 left-0 flex w-full items-center justify-center px-3 sm:px-4 animate-slide-up animation-delay-1000">
        <div className="backdrop-blur-md border-2 rounded-full px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 shadow-2xl bg-white/90 dark:bg-gray-800/90 border-[#00704A] dark:border-[#1fbc79] hover:scale-105 transition-transform duration-300 max-w-full">
          <p className="text-xs sm:text-sm leading-4 sm:leading-5 font-medium text-[#00704A] dark:text-[#1fbc79] text-center">
            ⭐ Inspired by <span className="font-bold">@Starbucks</span> • Built with ❤️ for{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://murf.ai"
              className="font-bold underline hover:no-underline"
            >
              #MurfAIVoiceAgentsChallenge
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
