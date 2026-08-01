const User = require("../models/User");
const Project = require("../models/Project");
const CareerItem = require("../models/CareerItem");
const { askClaude, isConfigured } = require("../utils/ai");

exports.coachPage = (req, res) => {
    res.render("ai/coach", { guidance: null, error: null, configured: isConfigured() });
};

exports.generateGuidance = async (req, res) => {
    try {
        const userId = req.session.user.id;

        const [user, projects, careerItems] = await Promise.all([
            User.findById(userId),
            Project.find({ user: userId }).limit(5),
            CareerItem.find({ user: userId }),
        ]);

        const profileSummary = `
Name: ${user.fullName}
Bio: ${user.bio || "N/A"}
About: ${user.about || "N/A"}
Skills: ${(user.skills || []).join(", ") || "N/A"}
Education: ${(user.education || []).map((e) => `${e.degree} ${e.field} at ${e.institution}`).join("; ") || "N/A"}
Recent Projects: ${projects.map((p) => `${p.title} (${p.techStack})`).join("; ") || "N/A"}
Current Goals/Tasks: ${careerItems.map((c) => `${c.type}: ${c.title} [${c.status}]`).join("; ") || "None set"}
        `.trim();

        const systemPrompt =
            "You are a supportive, practical career coach for a college student preparing for tech placements. Give specific, actionable advice grounded only in the information provided. Do not invent facts about the student. Keep it encouraging but honest. Structure your answer with short headers and bullet points.";

        const userPrompt = `Here is my current profile:\n\n${profileSummary}\n\nGive me: 1) a short honest assessment of where I stand, 2) 3-5 concrete next steps for the next 2 weeks, 3) what skill gap to prioritize for placements.`;

        const guidance = await askClaude(systemPrompt, userPrompt);

        res.render("ai/coach", { guidance, error: null, configured: true });

    } catch (error) {
        console.log(error);
        const configured = isConfigured();
        res.render("ai/coach", { guidance: null, error: error.message, configured });
    }
};
