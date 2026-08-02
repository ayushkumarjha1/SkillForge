const { askOpenRouter, isConfigured } = require("../utils/ai");

const TYPES = ["HR", "Technical", "Coding"];

exports.interviewPage = (req, res) => {
    res.render("ai/mock-interview", {
        question: null,
        type: null,
        feedback: null,
        error: null,
        configured: isConfigured(),
        TYPES,
    });
};

exports.generateQuestion = async (req, res) => {
    try {
        const { type } = req.body;
        const interviewType = TYPES.includes(type) ? type : "HR";

        const systemPrompt = `You are an expert technical interviewer conducting a ${interviewType} mock interview for an aspiring software engineer.
Generate exactly ONE realistic, high-quality ${interviewType} interview question.
Do NOT include any greetings, answer hints, solution code, or numbering. Return ONLY the question prompt itself.`;

        const question = await askOpenRouter(systemPrompt, `Generate a challenging but fair ${interviewType} interview question.`);

        res.render("ai/mock-interview", {
            question: question.trim(),
            type: interviewType,
            feedback: null,
            error: null,
            configured: true,
            TYPES,
        });

    } catch (error) {
        console.error("Interview Question Generation Error:", error);
        res.render("ai/mock-interview", {
            question: null,
            type: null,
            feedback: null,
            error: error.message || "Failed to generate interview question.",
            configured: isConfigured(),
            TYPES,
        });
    }
};

exports.submitAnswer = async (req, res) => {
    try {
        const { type, question, answer } = req.body;
        const interviewType = TYPES.includes(type) ? type : "HR";

        if (!answer || !answer.trim()) {
            return res.render("ai/mock-interview", {
                question,
                type: interviewType,
                feedback: null,
                error: "Please provide an answer before submitting.",
                configured: isConfigured(),
                TYPES,
            });
        }

        const systemPrompt = `You are a senior tech hiring manager reviewing a candidate's answer to a ${interviewType} interview question.
Evaluate the candidate's answer with constructive, detailed feedback.
Structure your review with:
1. Overall Rating (Score / 10 with a 1-line verdict)
2. What Was Done Well (Key strengths observed in the response)
3. Areas for Improvement & Gaps (Missing edge cases, depth, clarity, or structure)
4. Exemplary / Model Answer (How a top-tier candidate would answer this question)

Be objective, honest, and educational.`;

        const userPrompt = `Question: ${question}\n\nCandidate's Answer:\n${answer}`;

        const feedback = await askOpenRouter(systemPrompt, userPrompt);

        res.render("ai/mock-interview", {
            question,
            type: interviewType,
            feedback,
            error: null,
            configured: true,
            TYPES,
        });

    } catch (error) {
        console.error("Interview Feedback Error:", error);
        res.render("ai/mock-interview", {
            question: req.body.question || null,
            type: req.body.type || null,
            feedback: null,
            error: error.message || "Failed to evaluate your answer.",
            configured: isConfigured(),
            TYPES,
        });
    }
};
