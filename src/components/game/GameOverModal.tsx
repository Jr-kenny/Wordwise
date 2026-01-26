import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface GameOverModalProps {
  isOpen: boolean;
  won: boolean;
  word: string;
  definition: string;
  wrongGuessCount: number;
  onPlayAgain: () => void;
  onGoHome: () => void;
}

export const GameOverModal = ({
  isOpen,
  won,
  word,
  definition,
  wrongGuessCount,
  onPlayAgain,
  onGoHome,
}: GameOverModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="bg-card border border-border rounded-xl p-6 sm:p-8 max-w-sm w-full text-center space-y-5"
          >
            <div className={`text-5xl ${won ? '' : 'grayscale opacity-70'}`}>
              {won ? '🎉' : '💀'}
            </div>

            <div>
              <h2 className={`font-display text-2xl font-bold ${won ? 'text-success' : 'text-destructive'}`}>
                {won ? 'Nice!' : 'Game Over'}
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                {won
                  ? `Solved with ${wrongGuessCount} wrong ${wrongGuessCount === 1 ? 'guess' : 'guesses'}`
                  : 'Better luck next time'}
              </p>
            </div>

            <div className="bg-muted/50 border border-border rounded-lg p-4 space-y-2">
              <p className="font-display text-2xl font-bold text-foreground tracking-widest">
                {word}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {definition}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Button
                onClick={onPlayAgain}
                className="w-full h-11 font-display font-semibold bg-foreground text-background hover:bg-foreground/90"
              >
                Play Again
              </Button>
              <Button
                variant="ghost"
                onClick={onGoHome}
                className="w-full h-10 font-display text-muted-foreground hover:text-foreground"
              >
                Back to Home
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
