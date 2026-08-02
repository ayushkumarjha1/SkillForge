const axios = require("axios");

const isConfigured = () => {
    const key = process.env.OPENROUTER_API_KEY;
    return Boolean(key && key.trim() && key.trim() !== "your_openrouter_api_key_here");
};

/**
 * Sends a chat completion request to OpenRouter API using Axios.
 * @param {string} systemPrompt - System instructions for the model
 * @param {string} userPrompt - The user message/prompt
 * @param {object} options - Optional overrides (model, temperature, max_tokens)
 * @returns {Promise<string>} - The text response from the model
 */
const askOpenRouter = async (systemPrompt, userPrompt, options = {}) => {
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!isConfigured()) {
        throw new Error("OPENROUTER_API_KEY is not configured. Please add it to your .env file.");
    }

    const model = options.model || process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini";
    const temperature = typeof options.temperature === "number" ? options.temperature : 0.7;
    const max_tokens = options.max_tokens || 2000;

    const messages = [];
    if (systemPrompt && systemPrompt.trim()) {
        messages.push({ role: "system", content: systemPrompt.trim() });
    }
    messages.push({ role: "user", content: (userPrompt || "").trim() });

    try {
        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model,
                messages,
                temperature,
                max_tokens,
            },
            {
                headers: {
                    "Authorization": `Bearer ${apiKey.trim()}`,
                    "HTTP-Referer": "http://localhost:3000",
                    "X-Title": "SkillForge Platform",
                    "Content-Type": "application/json",
                },
                timeout: 45000,
            }
        );

        const reply = response.data?.choices?.[0]?.message?.content;
        if (!reply) {
            throw new Error("Received empty response from OpenRouter API.");
        }

        return reply.trim();
    } catch (error) {
        if (error.response?.data?.error?.message) {
            console.error("OpenRouter API Error:", error.response.data.error);
            throw new Error(`OpenRouter Error: ${error.response.data.error.message}`);
        }
        console.error("AI Request Failed:", error.message);
        throw error;
    }
};

module.exports = {
    askOpenRouter,
    askClaude: askOpenRouter, // Alias for backward compatibility
    isConfigured,
};