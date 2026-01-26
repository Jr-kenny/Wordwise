import { motion } from 'framer-motion';

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
];

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  usedLetters: Set<string>;
  revealedLetters: Set<string>;
  wrongGuesses: string[];
  disabled?: boolean;
}

export const Keyboard = ({
  onKeyPress,
  usedLetters,
  revealedLetters,
  wrongGuesses,
  disabled = false,
}: KeyboardProps) => {
  const getKeyStatus = (key: string): 'correct' | 'wrong' | 'unused' => {
    if (revealedLetters.has(key)) return 'correct';
    if (wrongGuesses.includes(key)) return 'wrong';
    return 'unused';
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-1.5">
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <motion.div
          key={rowIndex}
          className="flex justify-center gap-1"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: rowIndex * 0.05 }}
        >
          {row.map((key) => {
            const status = getKeyStatus(key);
            const isUsed = usedLetters.has(key);

            return (
              <motion.button
                key={key}
                onClick={() => !disabled && !isUsed && onKeyPress(key)}
                disabled={disabled || isUsed}
                className={`
                  w-8 sm:w-9 h-11 sm:h-12
                  flex items-center justify-center
                  font-semibold text-sm uppercase
                  rounded-md border
                  transition-all duration-150
                  ${status === 'correct' 
                    ? 'bg-success text-success-foreground border-success' 
                    : status === 'wrong'
                    ? 'bg-muted/50 text-muted-foreground border-muted opacity-40'
                    : 'bg-secondary text-foreground border-border hover:bg-foreground hover:text-background'
                  }
                  ${(disabled || isUsed) ? 'cursor-not-allowed' : 'cursor-pointer'}
                `}
                whileTap={(disabled || isUsed) ? {} : { scale: 0.92 }}
              >
                {key}
              </motion.button>
            );
          })}
        </motion.div>
      ))}
    </div>
  );
};
