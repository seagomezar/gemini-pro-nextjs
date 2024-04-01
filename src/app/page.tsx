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
    <main className="flex min-h-screen flex-col items-center justify-between bg-black ">
      <div className="z-10 max-w-5xl w-full items-center bg-slate-400 justify-center h-screen font-mono text-sm lg:flex">
        <div>
          <div className="bg-blue-600 rounded-xl my-6">
            <h1 className="text-2xl p-4">
              Setting Up Google Gemini in Next.js
            </h1>
          </div>
          <h1>Output</h1>
          <textarea
            value={responseData}
            readOnly
            rows={40}
            className="w-full"
          ></textarea>
          <div className="flex flex-col m-4">
            <h1>Input</h1>
            <textarea
              className="w-full"
              value={input}
              rows={3}
              onChange={(e) => setInput(e.target.value)}
            ></textarea>
            <button
              className="m-4 bg-slate-200 rounded-xl hover:bg-slate-700"
              onClick={runChat}
            >
              Run Gemini-Pro
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

