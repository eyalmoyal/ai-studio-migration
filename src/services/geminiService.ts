import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

let genAI: GoogleGenerativeAI | null = null;

if (GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
}

export const generateLyrics = async (
  recipientName: string,
  recipientAge: number,
  relationship: string,
  genre: string,
  memories: string
): Promise<string> => {
  if (!genAI) {
    throw new Error('Gemini API is not configured. Please add GEMINI_API_KEY to use AI features.');
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `Write personalized song lyrics for ${recipientName}, who is ${recipientAge} years old. 
  They are my ${relationship}. Genre: ${genre}. 
  Include these memories and themes: ${memories}.
  Make it heartfelt, memorable, and fitting for the ${genre} genre.
  Include verses, chorus, and bridge. Format it clearly.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
};

export const generateAlbumArt = async (
  recipientName: string,
  genre: string,
  theme: string
): Promise<string> => {
  if (!genAI) {
    throw new Error('Gemini API is not configured. Please add GEMINI_API_KEY to use AI features.');
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });

  const prompt = `Create album artwork concept for a ${genre} song dedicated to ${recipientName}. 
  Theme: ${theme}. 
  Describe a visually stunning album cover that captures the emotion and style of the music.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
};
