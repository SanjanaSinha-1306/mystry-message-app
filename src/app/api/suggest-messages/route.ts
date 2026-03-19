import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey || "");
    
    // FIX: Change to gemini-2.5-flash (The 1.5 series is retired)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = "Generate three unique, short anonymous questions for a social media profile. Separate them with '||'.";
    
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return NextResponse.json({ text });
  } catch (error: any) {
    // This will now catch the error and show it in your browser console too
    console.error("Gemini Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}