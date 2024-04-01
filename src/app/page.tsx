"use client";

import { useState } from "react";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const MODEL_NAME = "gemini-pro";
const API_KEY = process.env.NEXT_PUBLIC_API as string;
const instructions = ''

export default function Home() {

  const [input, setInput] = useState("");
  const [responseData, setResponseData] = useState("");

  async function runChat() {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const generationConfig = {
      temperature: 0.9,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
    };

    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];

    const chat = model.startChat({
      generationConfig,
      safetySettings,
      history: [],
    });

    const result = await chat.sendMessage(input + instructions);
    const response = result.response;
    console.log(response.text());
    setResponseData(response.text());
    setInput("");
  }

  

  return (
    <main className="min-h-screen flex flex-col bg-gray-800 text-white">
      <header className="py-6">
        <div className="container mx-auto">
          <h1 className="text-center text-3xl font-bold">Next.js Chat con Gemini-Pro</h1>
        </div>
      </header>

      <section className="container mx-auto flex-1 flex flex-col md:flex-row gap-4 p-4">
        <div className="flex-1">
          <h2 className="text-xl font-semibold">Output</h2>
          <textarea
            value={responseData}
            readOnly
            rows={20}
            className="w-full p-2 mt-2 bg-gray-700 rounded"
          ></textarea>
        </div>

        <div className="flex-1">
          <h2 className="text-xl font-semibold">Input</h2>
          <textarea
            className="w-full p-2 mt-2 bg-gray-700 rounded"
            value={input}
            rows={3}
            onChange={(e) => setInput(e.target.value)}
          ></textarea>
          <button
            className="mt-4 py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
            onClick={runChat}
          >
            Enviar
          </button>
        </div>
      </section>
    </main>
  );
}

