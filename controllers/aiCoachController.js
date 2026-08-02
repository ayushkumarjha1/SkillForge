const User = require("../models/User");
const Project = require("../models/Project");
const CareerItem = require("../models/CareerItem");
const { askOpenRouter, isConfigured } = require("../utils/ai");

exports.coachPage = (req, res) => {
    res.render("ai/coach", {
        guidance: null,
        error: null,
        configured: isConfigured(),
    });
};

exports.generateGuidance = async (req, res) => {
    try {
        const userId = req.session.user.id;
        const [user, projects, careerItems] = await Promise.all([
            User.findById(userId),
            Project.find({ user: userId }).sort({ createdAt: -1 }).limit(10),
            CareerItem.find({ user: userId }).sort({ createdAt: -1 }).limit(10),
        ]);

        const profileInfo = `
Name: ${user?.fullName || "Student"}
Bio: ${user?.bio || "None provided"}
Skills: ${(user?.skills || []).join(", ") || "None specified"}
Education: ${user?.education?.college || "N/A"} (${user?.education?.degree || "N/A"}, Batch: ${user?.education?.batch || "N/A"})
        `.trim();

        const projectInfo = (projects && projects.length > 0)
            ? projects.map(p => `- ${p.title} (${p.category || "General"}, Stack: ${p.techStack}): ${p.description}`).join("\n")
            : "No projects added yet.";

        const goalsInfo = (careerItems && careerItems.length > 0)
            ? careerItems.map(c => `- [${c.type}] ${c.title} (Status: ${c.status}, Target: ${c.targetDate || "N/A"})`).join("\n")
            : "No career goals logged yet.";

        const systemPrompt = `You are a high-level Tech Career Coach & Mentor on SkillForge.
Analyze the student's current profile, technical projects, and career planner goals.
Provide constructive, high-impact, realistic career mentorship.

Structure your advice with the following clear headings:
1. Executive Summary & Profile Strengths
2. Skill & Portfolio Gap Analysis (What's missing for market readiness)
3. 30-60-90 Day Action Plan
4. High-Yield Project Recommendations
5. Targeted Internship / Job Search Strategy

Keep your advice actionable, encouraging, and tailored directly to the specific tech stack and goals provided.`;

        const userPrompt = `Student Background:\n${profileInfo}\n\nStudent Projects:\n${projectInfo}\n\nCareer Goals & Planner Items:\n${goalsInfo}\n\nPlease generate my tailored career coaching guidance.`;

        const guidance = await askOpenRouter(systemPrompt, userPrompt);

        res.render("ai/coach", {
            guidance,
            error: null,
            configured: true,
        });
    } catch (error) {
        console.error("AI Coach Error:", error);
        res.render("ai/coach", {
            guidance: null,
            error: error.message || "Failed to generate coaching guidance.",
            configured: isConfigured(),
        });
    }
};