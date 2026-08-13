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
  "google/gemini-2.0-flash-lite-001",
  "openai/gpt-4o-mini",
  "meta-llama/llama-3.1-8b-instruct",
  "qwen/qwen-2.5-72b-instruct",
  "deepseek/deepseek-chat",
  "meta-llama/llama-3.3-70b-instruct:free",
];

// Parses OpenRouter's 402 body, e.g. "...but can only afford 1834 tokens..."
const AFFORDABLE_TOKENS_REGEX = /can only afford (\d+) tokens/i;
// Below this, a 10-question JSON payload can't fit; not worth attempting.
const MIN_VIABLE_TOKENS = 300;

export async function callOpenRouter(options: CallOpenRouterOptions): Promise<string> {
  const apiKey = process.env.OPEN_ROUTER_API_KEY;

  if (!apiKey) {
    throw new Error("OPEN_ROUTER_API_KEY is not configured in process.env");
  }

  const requestedModel = options.model || DEFAULT_MODELS[0];
  const modelsToTry = [requestedModel, ...DEFAULT_MODELS.filter((m) => m !== requestedModel)];

  let lastErrorText = "";

  for (const model of modelsToTry) {
    let maxTokensForAttempt = options.max_tokens ?? 850;
    let retriedWithReducedBudget = false;

    // Loop at most twice per model: once at the requested budget, and once
    // more at whatever budget the account can actually afford if OpenRouter
    // tells us via a 402 response.
    while (true) {
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
            max_tokens: maxTokensForAttempt,
            response_format: options.response_format,
          }),
        });

        if (!response.ok) {
          const errorBody = await response.text();
          console.warn(`OpenRouter API call failed for model ${model} (${response.status}):`, errorBody);
          lastErrorText = `HTTP ${response.status}: ${errorBody}`;

          if (response.status === 402 && !retriedWithReducedBudget) {
            const affordable = parseInt(errorBody.match(AFFORDABLE_TOKENS_REGEX)?.[1] || "", 10);
            if (Number.isFinite(affordable) && affordable >= MIN_VIABLE_TOKENS && affordable < maxTokensForAttempt) {
              console.warn(`Retrying ${model} with reduced max_tokens=${affordable} to fit account balance`);
              maxTokensForAttempt = affordable;
              retriedWithReducedBudget = true;
              continue; // retry same model at the affordable budget
            }
          }
          break; // move on to the next model
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;

        if (!content) {
          throw new Error("Empty response returned from OpenRouter API choice");
        }

        if (data.choices?.[0]?.finish_reason === "length") {
          console.warn(`OpenRouter response from ${model} was truncated (hit max_tokens); skipping to next model`);
          lastErrorText = `Response from ${model} was truncated before completion (max_tokens too low)`;
          break;
        }

        return content;
      } catch (err: any) {
        console.warn(`Error using model ${model}:`, err.message);
        lastErrorText = err.message || String(err);
        break;
      }
    }
  }

  throw new Error(lastErrorText || "Failed to obtain response from OpenRouter models");
}
