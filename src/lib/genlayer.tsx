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

  console.log("🔑 Initializing GenLayer with private key...");
  
  const account = createAccount(privateKey);
  client = createClient({ chain: studionet, account });

  console.log("⏳ Initializing consensus smart contract...");
  await client.initializeConsensusSmartContract();
  console.log("✅ Consensus initialized successfully");

  return client;
};

// Read contract state
export const getWord = async () => {
  try {
    console.log("📖 Reading word from contract...");
    const activeClient = await initializeGenLayer();

    const result = await activeClient.readContract({
      address: CONTRACT_ADDRESS,
      functionName: "get_game_data",
      args: [],
    });

    if (!result) {
      console.warn("No result from contract, using fallback");
      return getWordSync();
    }

    const data = JSON.parse(result);
    console.log("✅ Word fetched from contract:", data.word);
    return { word: data.word.toUpperCase(), definition: data.definition };
  } catch (e) {
    console.error("❌ GenLayer Read Error:", e);
    console.error("Error details:", {
      message: (e as Error).message,
      stack: (e as Error).stack,
    });
    return getWordSync();
  }
};

// Write contract state (generate new word)
export const generateNewWord = async () => {
  try {
    console.log("🚀 Generating new word via contract...");
    const activeClient = await initializeGenLayer();

    const hash = await activeClient.writeContract({
      address: CONTRACT_ADDRESS,
      functionName: "generate_new_word",
      args: [],
    });

    console.log("📝 Transaction sent! Hash:", hash);

    // FIX: Wait for 'ACCEPTED' instead of 'FINALIZED'
    // This is much faster and confirms the state has updated.
    console.log("⏳ Waiting for transaction acceptance (timeout: 30s)...");
    
    try {
      await Promise.race([
        activeClient.waitForTransactionReceipt({
          hash,
          status: "ACCEPTED", 
          retries: 150,      // Increased for slower connections
          interval: 1500,    // Shorter interval for responsiveness
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Transaction wait timeout")), 30000)
        )
      ]);
    } catch (timeoutErr) {
      console.warn("⚠️ Transaction receipt timeout, but proceeding to fetch word:", timeoutErr);
      // Continue anyway - transaction may still be processing
    }

    console.log("✅ Transaction accepted! Fetching updated word...");
    const word = await getWord();
    console.log("🎉 Got new word:", word);
    return word;
  } catch (e) {
    console.error("❌ GenLayer Write Error:", e);
    console.error("Error details:", {
      message: (e as Error).message,
      stack: (e as Error).stack,
    });
    return null;
  }
};
