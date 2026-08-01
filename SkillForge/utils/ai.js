// Shared helper for the 3 AI modules (Career Coach, Resume Analyzer, Mock Interview).
// Requires ANTHROPIC_API_KEY in .env. Without it, callers get a clear error
// instead of a crash — the routes still work, they just explain what's missing.

const isConfigured = () => !!process.env.ANTHROPIC_API_KEY;

const askClaude = async (systemPrompt, userPrompt) => {
    if (!isConfigured()) {
        const err = new Error(
            "AI features need an ANTHROPIC_API_KEY in your .env file. Get one at https://console.anthropic.com, add it, and restart the server."
        );
        err.code = "NO_API_KEY";
        throw err;
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
            model: "claude-sonnet-4-5",
            max_tokens: 1024,
            system: systemPrompt,
            messages: [{ role: "user", content: userPrompt }],
        }),
    });

    if (!response.ok) {
        const errBody = await response.text();
        const err = new Error(`Anthropic API error (${response.status}): ${errBody.slice(0, 300)}`);
        err.code = "API_ERROR";
        throw err;
    }

    const data = await response.json();
    const textBlock = data.content.find((block) => block.type === "text");
    return textBlock ? textBlock.text : "";
};

module.exports = { askClaude, isConfigured };
