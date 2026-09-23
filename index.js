// qvac-chat — a tiny terminal chatbot powered entirely by on-device AI.
//
// It uses Tether's QVAC SDK to download a small language model once, load it
// into memory on YOUR machine, and answer questions with zero cloud calls,
// no API key, and no usage bill. Everything happens locally.

import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import {
  loadModel,
  completion,
  unloadModel,
  LLAMA_3_2_1B_INST_Q4_0,
} from "@qvac/sdk";

async function main() {
  console.log("qvac-chat — on-device AI, no cloud involved\n");
  console.log("Loading the model (first run downloads it, this can take a minute)...\n");

  // Step 1: load a small local model. The SDK caches it after the first run.
  const modelId = await loadModel({
    modelSrc: LLAMA_3_2_1B_INST_Q4_0,
    modelType: "llm",
    onProgress: (progress) => {
      // Prints download/load progress so the user isn't staring at a blank screen.
      process.stdout.write(`\rLoading: ${JSON.stringify(progress)}   `);
    },
  });

  console.log("\n\nModel loaded. Type a message and press Enter.");
  console.log("Type 'exit' to quit.\n");

  const rl = readline.createInterface({ input, output });

  // We keep the whole conversation so the model has context, like a real chat.
  const history = [];

  try {
    while (true) {
      const userInput = await rl.question("You: ");

      if (userInput.trim().toLowerCase() === "exit") {
        break;
      }

      history.push({ role: "user", content: userInput });

      // Step 2: run inference on-device and stream the answer token by token.
      const result = completion({ modelId, history, stream: true });

      process.stdout.write("AI:  ");
      let fullReply = "";
      for await (const token of result.tokenStream) {
        process.stdout.write(token);
        fullReply += token;
      }
      process.stdout.write("\n\n");

      history.push({ role: "assistant", content: fullReply });
    }
  } finally {
    rl.close();
    // Step 3: always free the model from memory when we're done.
    await unloadModel({ modelId });
    console.log("Model unloaded. Bye!");
  }
}

main().catch((error) => {
  console.error("\nSomething went wrong:", error);
  process.exit(1);
});
