// src/lib/genlayer.tsx
import { createClient, createAccount } from "genlayer-js";
import { studionet } from "genlayer-js/chains"; // ✅ built-in Studio chain

export const CONTRACT_ADDRESS = "0x080b0f59764F4aF7f1d73eDceF8B28328f3CAe98";

let client: any = null;

const WORD_BANK = [
  { word: "GAME", definition: "An activity for entertainment or competition." },
  { word: "NODE", definition: "A point in a network or diagram at which lines intersect." },
];

// Fallback word generator
export function getWordSync() {
  return WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)];
}

// Initialize GenLayer client and consensus
export const initializeGenLayer = async () => {
  if (client) return client;

  // ✅ Reference private key from environment variable
  const privateKey = import.meta.env.VITE_GENLAYER_KEY || "";
  if (!privateKey) {
    throw new Error("Missing VITE_GENLAYER_KEY in environment");
  }

  const account = createAccount(privateKey);
  client = createClient({ chain: studionet, account });

  await client.initializeConsensusSmartContract();
  console.log("Consensus initialized");

  return client;
};

// Read contract state
export const getWord = async () => {
  try {
    const activeClient = await initializeGenLayer();

    const result = await activeClient.readContract({
      address: CONTRACT_ADDRESS,
      functionName: "get_game_data",
      args: [],
    });

    if (!result) return getWordSync();

    const data = JSON.parse(result);
    return { word: data.word.toUpperCase(), definition: data.definition };
  } catch (e) {
    console.error("GenLayer SDK Read Error:", e);
    return getWordSync();
  }
};

// Write contract state (generate new word)
export const generateNewWord = async () => {
  try {
    const activeClient = await initializeGenLayer();

    const hash = await activeClient.writeContract({
      address: CONTRACT_ADDRESS,
      functionName: "generate_new_word",
      args: [],
    });

    console.log("Transaction sent! Hash:", hash);

    // FIX: Wait for 'ACCEPTED' instead of 'FINALIZED'
    // This is much faster and confirms the state has updated.
    await activeClient.waitForTransactionReceipt({
      hash,
      status: "ACCEPTED", 
      retries: 50,      // Optional: ensure enough attempts
      interval: 2000,   // Optional: check every 2 seconds
    });

    console.log("Transaction accepted! Fetching updated word...");
    return await getWord();
  } catch (e) {
    console.error("GenLayer SDK Write Error:", e);
    return null;
  }
};