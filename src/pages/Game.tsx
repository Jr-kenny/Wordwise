import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WordDisplay } from '@/components/game/WordDisplay';
import { WrongGuesses } from '@/components/game/WrongGuesses';
import { Keyboard } from '@/components/game/Keyboard';
import { GameOverModal } from '@/components/game/GameOverModal';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useHangmanGame } from '@/hooks/useHangmanGame';
import { CONTRACT_ADDRESS } from '@/lib/genlayer';

const Game = () => {
  const navigate = useNavigate();
  const {
    word,
    definition,
    revealedLetters,
    wrongGuesses,
    usedLetters,
    gameOver,
    won,
    isLoading,
    maxWrongGuesses,
    handleKeyPress,
    playAgain,
  } = useHangmanGame();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center space-y-3"
        >
          <div className="w-10 h-10 border-2 border-foreground border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground text-sm">Loading...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar with back button and theme toggle */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/')}
          className="w-9 h-9 rounded-md"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back to home</span>
        </Button>
        <ThemeToggle />
      </div>

      <div className="container mx-auto px-4 py-16 sm:py-20 max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-10"
        >
          {/* Header */}
          <div className="text-center">
            <h1 className="font-display text-2xl font-bold text-foreground tracking-tight">
              WORDWISE
            </h1>
          </div>

          {/* Word to guess - 4 boxes at top */}
          <WordDisplay 
            word={word} 
            revealedLetters={revealedLetters} 
          />

          {/* Wrong guesses - 8 boxes at bottom */}
          <WrongGuesses 
            wrongGuesses={wrongGuesses} 
            maxWrongGuesses={maxWrongGuesses} 
          />

          {/* Keyboard */}
          <Keyboard
            onKeyPress={handleKeyPress}
            usedLetters={usedLetters}
            revealedLetters={revealedLetters}
            wrongGuesses={wrongGuesses}
            disabled={gameOver}
          />

          {/* Contract address */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center text-[10px] text-muted-foreground/40 break-all"
          >
            {CONTRACT_ADDRESS}
          </motion.p>
        </motion.div>
      </div>

      <GameOverModal
        isOpen={gameOver}
        won={won}
        word={word}
        definition={definition}
        wrongGuessCount={wrongGuesses.length}
        onPlayAgain={playAgain}
        onGoHome={() => navigate('/')}
      />
    </div>
  );
};

export default Game;
