import { motion } from 'framer-motion';

interface WrongGuessesProps {
  wrongGuesses: string[];
  maxWrongGuesses: number;
}

export const WrongGuesses = ({ wrongGuesses, maxWrongGuesses }: WrongGuessesProps) => {
  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground text-center uppercase tracking-wider">
        Wrong Guesses ({wrongGuesses.length}/{maxWrongGuesses})
      </p>
      <div className="flex justify-center gap-2">
        {Array.from({ length: maxWrongGuesses }).map((_, index) => {
          const letter = wrongGuesses[index];
          const isFilled = !!letter;
          
          return (
            <motion.div
              key={index}
              initial={isFilled ? { scale: 0.5, opacity: 0 } : { opacity: 1 }}
              animate={isFilled ? { scale: 1, opacity: 1 } : { opacity: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              className={`
                w-9 h-9 sm:w-10 sm:h-10
                flex items-center justify-center
                rounded-md border
                font-bold text-sm uppercase
                transition-colors duration-200
                ${isFilled 
                  ? 'border-destructive/60 bg-destructive/15 text-destructive' 
                  : 'border-border/50 bg-muted/30 text-muted-foreground/20'
                }
              `}
            >
              {letter || ''}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
