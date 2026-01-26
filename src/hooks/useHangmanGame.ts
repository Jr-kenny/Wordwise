import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getWordSync, generateNewWord } from '@/lib/genlayer';

const MAX_WRONG_GUESSES = 8;

interface LocationState {
  word?: string;
  definition?: string;
  useFallback?: boolean;
}

export const useHangmanGame = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | null;
  
  const [word, setWord] = useState('');
  const [definition, setDefinition] = useState('');
  const [revealedLetters, setRevealedLetters] = useState<Set<string>>(new Set());
  const [wrongGuesses, setWrongGuesses] = useState<string[]>([]);
  const [usedLetters, setUsedLetters] = useState<Set<string>>(new Set());
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isContractWord, setIsContractWord] = useState(false);

  // Initialize game from route state (passed from Loading page)
  useEffect(() => {
    if (state?.word && state?.definition) {
      // Word came from contract via Loading page
      setWord(state.word.toUpperCase());
      setDefinition(state.definition);
      setIsContractWord(true);
      console.log('Using contract word:', state.word);
    } else if (state?.useFallback) {
      // Fallback was triggered
      const fallback = getWordSync();
      setWord(fallback.word.toUpperCase());
      setDefinition(fallback.definition);
      setIsContractWord(false);
      console.log('Using fallback word');
    } else {
      // Direct navigation to /game without going through loading - redirect
      navigate('/');
    }
  }, [state, navigate]);

  // Play again - go back through loading flow
  const playAgain = useCallback(() => {
    navigate('/loading');
  }, [navigate]);

  const checkWin = useCallback((revealed: Set<string>, targetWord: string) => {
    // Check if all unique letters in the word have been revealed
    const uniqueLetters = new Set(targetWord.split(''));
    for (const letter of uniqueLetters) {
      if (!revealed.has(letter)) {
        return false;
      }
    }
    return true;
  }, []);

  const handleKeyPress = useCallback((key: string) => {
    if (gameOver || isLoading) return;
    
    const letter = key.toUpperCase();
    
    // Only handle single letters
    if (!/^[A-Z]$/.test(letter)) return;
    
    // Already used this letter
    if (usedLetters.has(letter)) return;

    const newUsedLetters = new Set(usedLetters);
    newUsedLetters.add(letter);
    setUsedLetters(newUsedLetters);

    if (word.includes(letter)) {
      // Correct guess - reveal the letter
      const newRevealed = new Set(revealedLetters);
      newRevealed.add(letter);
      setRevealedLetters(newRevealed);

      // Check for win
      if (checkWin(newRevealed, word)) {
        setWon(true);
        setGameOver(true);
      }
    } else {
      // Wrong guess
      const newWrongGuesses = [...wrongGuesses, letter];
      setWrongGuesses(newWrongGuesses);

      // Check for loss
      if (newWrongGuesses.length >= MAX_WRONG_GUESSES) {
        setGameOver(true);
      }
    }
  }, [gameOver, isLoading, word, usedLetters, revealedLetters, wrongGuesses, checkWin]);

  // Physical keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      
      if (/^[A-Z]$/.test(key)) {
        e.preventDefault();
        handleKeyPress(key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyPress]);

  return {
    word,
    definition,
    revealedLetters,
    wrongGuesses,
    usedLetters,
    gameOver,
    won,
    isLoading,
    isContractWord,
    maxWrongGuesses: MAX_WRONG_GUESSES,
    handleKeyPress,
    playAgain,
  };
};
