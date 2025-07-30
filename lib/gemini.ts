
import axios from 'axios';

const ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export async function callGemini(prompt: string): Promise<string> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error('Missing GEMINI_API_KEY');
  const url = `${ENDPOINT}?key=${key}`;
  const body = { contents: [{ role: 'user', parts: [{ text: prompt }] }] };
  const res = await axios.post(url, body);
  return res.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

export const generateSummary = async (content: string) =>
  callGemini(`Summarize the following article in 3‑4 sentences:\n\n${content}`);

export async function generateNewsletter(
  title: string,
  items: { title: string; summary: string; url?: string }[]
) {
  const joined = items
    .map((it) => `### ${it.title}\n\n${it.summary}\n\n[Read more](${it.url ?? '#'})`)
    .join('\n\n');
  const prompt = `Write a cohesive newsletter titled "${title}". Use engaging language and markdown. Combine: \n\n${joined}`;
  return callGemini(prompt);
}
