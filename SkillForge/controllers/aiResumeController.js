const Resume = require("../models/Resume");
const { askOpenRouter, isConfigured } = require("../utils/ai");

exports.analyzerPage = async (req, res) => {
    try {
        const resumes = await Resume.find({ user: req.session.user.id }).sort({ updatedAt: -1 });
        res.render("ai/resume-analyzer", {
            resumes,
            analysis: null,
            error: null,
            configured: isConfigured(),
            selectedId: null,
        });
    } catch (error) {
        console.error("Resume Analyzer Error:", error);
        res.status(500).render("errors/500", { message: "Unable to load resume analyzer." });
    }
};

exports.analyzeResume = async (req, res) => {
    try {
        const resumes = await Resume.find({ user: req.session.user.id }).sort({ updatedAt: -1 });
        const resume = await Resume.findOne({ _id: req.body.resumeId, user: req.session.user.id });

        if (!resume) {
            return res.render("ai/resume-analyzer", {
                resumes,
                analysis: null,
                error: "Resume not found.",
                configured: isConfigured(),
                selectedId: null,
            });
        }

        const resumeText = `
Name: ${resume.fullName || "N/A"}
Contact: ${[resume.contactEmail, resume.contactPhone, resume.location].filter(Boolean).join(" | ")}
Target Role/Template: ${resume.template || "Modern"}
Summary: ${resume.summary || "N/A"}
Skills: ${(resume.skills || []).join(", ") || "N/A"}
Experience: ${(resume.experience || []).map((e) => `${e.role} at ${e.company} (${e.startDate} - ${e.endDate}): ${e.description}`).join(" | ") || "N/A"}
Projects: ${(resume.projects || []).map((p) => `${p.title} (${p.techStack}): ${p.description}`).join(" | ") || "N/A"}
Education: ${(resume.education || []).map((e) => `${e.degree} ${e.field} at ${e.institution} (${e.startYear} - ${e.endYear})`).join(" | ") || "N/A"}
Certifications: ${(resume.certifications || []).join(", ") || "N/A"}
        `.trim();

        const systemPrompt = `You are a Senior Technical Recruiter & ATS (Applicant Tracking System) Expert.
Analyze the provided resume with critical precision for tech industry standards (SWE, Fullstack, AI, DevOps).

Structure your feedback clearly under these sections:
1. 📊 ATS Match Score (Give a score out of 100 with a concise benchmark rationale)
2. 🌟 Top Strengths (3-4 bullet points on standout qualifications)
3. ⚠️ Critical Weaknesses & Missing Elements (Quantifiable metrics, action verbs, keywords, missing sections)
4. ✍️ Line-by-Line Bullet Point Rewrite Suggestions (Provide before-and-after examples using Google's X-Y-Z formula: "Accomplished [X] as measured by [Y], by doing [Z]")
5. 🎯 Next Action Items to Boost Interview Callback Rates

Base all feedback strictly on the resume provided. Be honest, rigorous, and actionable.`;

        const userPrompt = `Please analyze this resume:\n\n${resumeText}`;

        const analysis = await askOpenRouter(systemPrompt, userPrompt);

        res.render("ai/resume-analyzer", {
            resumes,
            analysis,
            error: null,
            configured: true,
            selectedId: resume._id.toString(),
        });

    } catch (error) {
        console.error("AI Resume Analyzer Error:", error);
        const resumes = await Resume.find({ user: req.session.user.id }).sort({ updatedAt: -1 }).catch(() => []);
        res.render("ai/resume-analyzer", {
            resumes,
            analysis: null,
            error: error.message || "Failed to analyze resume.",
            configured: isConfigured(),
            selectedId: req.body.resumeId || null,
        });
    }
};
