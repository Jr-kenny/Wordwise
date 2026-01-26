import { motion } from 'framer-motion';

interface WordDisplayProps {
  word: string;
  revealedLetters: Set<string>;
}

export const WordDisplay = ({ word, revealedLetters }: WordDisplayProps) => {
  return (
    <div className="flex justify-center gap-3">
      {word.split('').map((letter, index) => {
        const isRevealed = revealedLetters.has(letter);
        
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`
              w-16 h-16 sm:w-20 sm:h-20
              flex items-center justify-center
              rounded-lg border-2
              font-display font-bold text-3xl sm:text-4xl uppercase
              transition-all duration-300
              ${isRevealed 
                ? 'bg-success/20 border-success text-success' 
                : 'bg-card border-border text-transparent'
              }
            `}
          >
            <motion.span
              initial={isRevealed ? { scale: 0, rotateY: 180 } : false}
              animate={isRevealed ? { scale: 1, rotateY: 0 } : {}}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              {isRevealed ? letter : '_'}
            </motion.span>
          </motion.div>
        );
      })}
    </div>
  );
};
