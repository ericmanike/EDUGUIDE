/**
 * Utility for interacting with OpenRouter API
 */

export interface OpenRouterMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface CallOpenRouterOptions {
  messages: OpenRouterMessage[];
  model?: string;
  temperature?: number;
  max_tokens?: number;
  response_format?: { type: "json_object" | "text" };
}

const DEFAULT_MODELS = [
  "google/gemini-2.5-flash",
  "openai/gpt-4o-mini",
  "meta-llama/llama-3.3-70b-instruct:free",
  "mistralai/mistral-7b-instruct",
];

export async function callOpenRouter(options: CallOpenRouterOptions): Promise<string> {
  const apiKey = process.env.OPEN_ROUTER_API_KEY;

  if (!apiKey) {
    throw new Error("OPEN_ROUTER_API_KEY is not configured in process.env");
  }

  const requestedModel = options.model || DEFAULT_MODELS[0];
  const modelsToTry = [requestedModel, ...DEFAULT_MODELS.filter((m) => m !== requestedModel)];

  let lastError: Error | null = null;

  for (const model of modelsToTry) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey.trim()}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://skillsbank.edtech",
          "X-Title": "SkillsBank EdTech",
        },
        body: JSON.stringify({
          model,
          messages: options.messages,
          temperature: options.temperature ?? 0.7,
          max_tokens: options.max_tokens ?? 2000,
          response_format: options.response_format,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`OpenRouter API call failed for model ${model} (${response.status}):`, errorText);
        lastError = new Error(`HTTP ${response.status}: ${errorText}`);
        continue; // Try next model fallback
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error("Empty response returned from OpenRouter API choice");
      }

      return content;
    } catch (err: any) {
      console.warn(`Error using model ${model}:`, err.message);
      lastError = err;
    }
  }

  throw lastError || new Error("Failed to obtain response from OpenRouter models");
}
