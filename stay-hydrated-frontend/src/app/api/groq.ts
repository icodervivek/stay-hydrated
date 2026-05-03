import { GROQ_API_KEY } from "../constants/env";

export type GroqVerifyResult = {
  isWater: boolean;
  message: string;
};

const SYSTEM_PROMPT = `You are a hydration assistant for a water-tracking app.
Analyze the image and determine if it clearly shows a glass, bottle, cup, mug, jug, or any container that appears to hold water or a clear/water-like drink.

Respond ONLY with a valid JSON object — no markdown, no explanation, no extra text:
{
  "isWater": true | false,
  "message": "<friendly short message under 12 words>"
}

If isWater is true: write an encouraging, emoji-rich hydration message.
If isWater is false: write a gentle, humorous message acknowledging it doesn't look like water.`;

export async function verifyWaterImage(imageUrl: string): Promise<GroqVerifyResult> {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [
        {
          role: "user",
          content: [
            { type: "image_url", image_url: { url: imageUrl } },
            { type: "text", text: SYSTEM_PROMPT },
          ],
        },
      ],
      max_tokens: 80,
      temperature: 0.4,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any)?.error?.message ?? "Groq API error");
  }

  const data = await res.json();
  const raw: string = data.choices?.[0]?.message?.content?.trim() ?? "";

  // Strip markdown code fences if the model wraps in ```json ... ```
  const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
  try {
    return JSON.parse(cleaned) as GroqVerifyResult;
  } catch {
    return { isWater: false, message: "Couldn't read the image, but intake logged! 📝" };
  }
}
