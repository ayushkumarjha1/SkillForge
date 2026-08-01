const { askClaude, isConfigured } = require("../utils/ai");

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

        const systemPrompt = `You are conducting a ${interviewType} mock interview for a college student applying to entry-level tech roles. Ask exactly ONE realistic ${interviewType} interview question. Return only the question text, no preamble, no numbering.`;

        const question = await askClaude(systemPrompt, `Give me one ${interviewType} interview question.`);

        res.render("ai/mock-interview", {
            question: question.trim(),
            type: interviewType,
            feedback: null,
            error: null,
            configured: true,
            TYPES,
        });

    } catch (error) {
        console.log(error);
        res.render("ai/mock-interview", {
            question: null,
            type: null,
            feedback: null,
            error: error.message,
            configured: isConfigured(),
            TYPES,
        });
    }
};

exports.submitAnswer = async (req, res) => {
    try {
        const { type, question, answer } = req.body;
        const interviewType = TYPES.includes(type) ? type : "HR";

        const systemPrompt = `You are an interview coach reviewing a candidate's answer to a ${interviewType} interview question. Give a score out of 10, then 2-3 bullet points on what was good, then 2-3 bullet points on what to improve. Be honest and specific, based only on what the candidate actually wrote.`;

        const userPrompt = `Question: ${question}\n\nCandidate's Answer: ${answer}`;

        const feedback = await askClaude(systemPrompt, userPrompt);

        res.render("ai/mock-interview", {
            question,
            type: interviewType,
            feedback,
            error: null,
            configured: true,
            TYPES,
        });

    } catch (error) {
        console.log(error);
        res.render("ai/mock-interview", {
            question: req.body.question || null,
            type: req.body.type || null,
            feedback: null,
            error: error.message,
            configured: isConfigured(),
            TYPES,
        });
    }
};
