import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { generateNewWord } from '@/lib/genlayer';
import { ThemeToggle } from '@/components/ThemeToggle';

const Loading = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('Initializing...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initGame = async () => {
      try {
        setStatus('Connecting to GenLayer...');
        
        setStatus('Generating word via AI consensus...');
        const result = await generateNewWord();
        
        if (result) {
          setStatus('Word generated! Starting game...');
          // Small delay to show success message
          await new Promise(resolve => setTimeout(resolve, 500));
          navigate('/game', { state: { word: result.word, definition: result.definition } });
        } else {
          throw new Error('Failed to generate word from contract');
        }
      } catch (err) {
        console.error('Loading error:', err);
        setError('Could not connect to contract. Using fallback word.');
        // Navigate anyway with fallback
        setTimeout(() => {
          navigate('/game', { state: { useFallback: true } });
        }, 1500);
      }
    };

    initGame();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center space-y-6 px-6"
      >
        <div className="space-y-4">
          <motion.h1 
            className="font-display text-3xl sm:text-4xl font-bold text-foreground tracking-tight"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            YOU GUESS
          </motion.h1>
          
          {!error ? (
            <>
              <motion.div
                className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              />
              <motion.p
                className="text-muted-foreground text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {status}
              </motion.p>
            </>
          ) : (
            <motion.p
              className="text-destructive text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.p>
          )}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 0.5 }}
          className="text-xs text-muted-foreground"
        >
          Powered by GenLayer AI
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Loading;
