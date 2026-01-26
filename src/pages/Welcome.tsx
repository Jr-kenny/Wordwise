import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative">
      {/* Theme toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-8 px-6"
      >
        <div className="space-y-3">
          <motion.h1 
            className="font-display text-5xl sm:text-6xl font-bold text-foreground tracking-tight"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            YOU GUESS
          </motion.h1>
          <motion.p 
            className="text-muted-foreground text-sm sm:text-base max-w-xs mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Guess the 4-letter word, one letter at a time. You have 8 chances.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Button
            size="lg"
            onClick={() => navigate('/loading')}
            className="px-12 py-6 text-lg font-display font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
          >
            Start Game
          </Button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 0.8 }}
          className="text-xs text-muted-foreground"
        >
          Powered by GenLayer AI
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Welcome;
