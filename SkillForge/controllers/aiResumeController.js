const Resume = require("../models/Resume");
const { askClaude, isConfigured } = require("../utils/ai");

exports.analyzerPage = async (req, res) => {
    try {
        const resumes = await Resume.find({ user: req.session.user.id }).sort({ updatedAt: -1 });
        res.render("ai/resume-analyzer", { resumes, analysis: null, error: null, configured: isConfigured(), selectedId: null });
    } catch (error) {
        console.log(error);
        res.send("Unable to load resume analyzer.");
    }
};

exports.analyzeResume = async (req, res) => {
    try {
        const resumes = await Resume.find({ user: req.session.user.id }).sort({ updatedAt: -1 });
        const resume = await Resume.findOne({ _id: req.body.resumeId, user: req.session.user.id });

        if (!resume) {
            return res.render("ai/resume-analyzer", { resumes, analysis: null, error: "Resume not found.", configured: isConfigured(), selectedId: null });
        }

        const resumeText = `
Name: ${resume.fullName}
Summary: ${resume.summary || "N/A"}
Skills: ${(resume.skills || []).join(", ") || "N/A"}
Experience: ${(resume.experience || []).map((e) => `${e.role} at ${e.company} (${e.startDate} - ${e.endDate}): ${e.description}`).join(" | ") || "N/A"}
Projects: ${(resume.projects || []).map((p) => `${p.title} (${p.techStack}): ${p.description}`).join(" | ") || "N/A"}
Education: ${(resume.education || []).map((e) => `${e.degree} ${e.field} at ${e.institution}`).join(" | ") || "N/A"}
Certifications: ${(resume.certifications || []).join(", ") || "N/A"}
        `.trim();

        const systemPrompt =
            "You are an ATS (Applicant Tracking System) resume reviewer for tech/software roles. Be specific and critical but constructive. Base feedback only on the resume content given — never invent experience. Structure your response with: an ATS Score out of 100 with one-line justification, Strengths (bullets), Weaknesses (bullets), and 3-5 Specific Rewrite Suggestions.";

        const userPrompt = `Review this resume:\n\n${resumeText}`;

        const analysis = await askClaude(systemPrompt, userPrompt);

        res.render("ai/resume-analyzer", { resumes, analysis, error: null, configured: true, selectedId: resume._id.toString() });

    } catch (error) {
        console.log(error);
        const resumes = await Resume.find({ user: req.session.user.id }).sort({ updatedAt: -1 });
        res.render("ai/resume-analyzer", { resumes, analysis: null, error: error.message, configured: isConfigured(), selectedId: null });
    }
};
