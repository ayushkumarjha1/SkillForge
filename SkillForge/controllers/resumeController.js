const Resume = require("../models/Resume");
const User = require("../models/User");
const Project = require("../models/Project");

// ==============================
// Helpers
// ==============================
const parseList = (input) => {
    if (!input) return [];
    return input
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
};

// A simple, transparent completeness score — not AI, just section coverage.
// Weighted toward the sections that matter most on an ATS resume.
const calculateScore = (resume) => {
    const checks = [
        { pass: !!(resume.fullName && resume.contactEmail), weight: 15 },
        { pass: !!(resume.summary && resume.summary.trim().length > 20), weight: 15 },
        { pass: resume.skills && resume.skills.length >= 3, weight: 20 },
        { pass: resume.education && resume.education.length > 0, weight: 15 },
        { pass: resume.experience && resume.experience.length > 0, weight: 15 },
        { pass: resume.projects && resume.projects.length > 0, weight: 20 },
    ];

    return checks.reduce((total, check) => total + (check.pass ? check.weight : 0), 0);
};

// ==============================
// List All Resumes
// ==============================
exports.listResumes = async (req, res) => {
    try {
        const resumes = await Resume.find({ user: req.session.user.id }).sort({ updatedAt: -1 });

        const resumesWithScores = resumes.map((r) => ({
            doc: r,
            score: calculateScore(r),
        }));

        res.render("resume/index", { resumesWithScores });

    } catch (error) {
        console.log(error);
        res.send("Unable to load resumes.");
    }
};

// ==============================
// Create New Resume (auto-imports from Profile + Projects)
// ==============================
exports.createResume = async (req, res) => {
    try {
        const user = await User.findById(req.session.user.id);
        const projects = await Project.find({ user: req.session.user.id }).sort({ createdAt: -1 }).limit(6);

        const resume = await Resume.create({
            user: req.session.user.id,
            title: `${user.fullName}'s Resume`,
            fullName: user.fullName,
            contactEmail: user.email,
            summary: user.about || user.bio || "",
            skills: user.skills || [],
            education: user.education || [],
            experience: user.experience || [],
            projects: projects.map((p) => ({
                title: p.title,
                description: p.description,
                techStack: p.techStack,
                link: p.liveLink || p.githubLink || "",
            })),
        });

        res.redirect(`/resume/${resume._id}/edit`);

    } catch (error) {
        console.log(error);
        res.send("Unable to create resume.");
    }
};

// ==============================
// Edit Resume Page
// ==============================
exports.editResumePage = async (req, res) => {
    try {
        const resume = await Resume.findOne({ _id: req.params.id, user: req.session.user.id });

        if (!resume) {
            return res.send("Resume not found.");
        }

        res.render("resume/edit", { resume, score: calculateScore(resume) });

    } catch (error) {
        console.log(error);
        res.send("Unable to load resume editor.");
    }
};

// ==============================
// Update Resume
// ==============================
exports.updateResume = async (req, res) => {
    try {
        const {
            title,
            template,
            fullName,
            contactEmail,
            contactPhone,
            location,
            summary,
            skills,
            certifications,
        } = req.body;

        const resume = await Resume.findOne({ _id: req.params.id, user: req.session.user.id });

        if (!resume) {
            return res.send("Resume not found.");
        }

        const eduInstitution = [].concat(req.body.eduInstitution || []);
        const eduDegree = [].concat(req.body.eduDegree || []);
        const eduField = [].concat(req.body.eduField || []);
        const eduStartYear = [].concat(req.body.eduStartYear || []);
        const eduEndYear = [].concat(req.body.eduEndYear || []);

        const education = eduInstitution
            .map((institution, i) => ({
                institution,
                degree: eduDegree[i] || "",
                field: eduField[i] || "",
                startYear: eduStartYear[i] || "",
                endYear: eduEndYear[i] || "",
            }))
            .filter((entry) => entry.institution && entry.institution.trim());

        const expCompany = [].concat(req.body.expCompany || []);
        const expRole = [].concat(req.body.expRole || []);
        const expStartDate = [].concat(req.body.expStartDate || []);
        const expEndDate = [].concat(req.body.expEndDate || []);
        const expDescription = [].concat(req.body.expDescription || []);

        const experience = expCompany
            .map((company, i) => ({
                company,
                role: expRole[i] || "",
                startDate: expStartDate[i] || "",
                endDate: expEndDate[i] || "",
                description: expDescription[i] || "",
            }))
            .filter((entry) => entry.company && entry.company.trim());

        const projTitle = [].concat(req.body.projTitle || []);
        const projDescription = [].concat(req.body.projDescription || []);
        const projTechStack = [].concat(req.body.projTechStack || []);
        const projLink = [].concat(req.body.projLink || []);

        const projects = projTitle
            .map((title, i) => ({
                title,
                description: projDescription[i] || "",
                techStack: projTechStack[i] || "",
                link: projLink[i] || "",
            }))
            .filter((entry) => entry.title && entry.title.trim());

        await Resume.findByIdAndUpdate(resume._id, {
            title: title || resume.title,
            template: template || resume.template,
            fullName,
            contactEmail,
            contactPhone,
            location,
            summary,
            skills: parseList(skills),
            certifications: parseList(certifications),
            education,
            experience,
            projects,
        });

        res.redirect(`/resume/${resume._id}/edit`);

    } catch (error) {
        console.log(error);
        res.send("Unable to update resume.");
    }
};

// ==============================
// Delete Resume
// ==============================
exports.deleteResume = async (req, res) => {
    try {
        await Resume.findOneAndDelete({ _id: req.params.id, user: req.session.user.id });
        res.redirect("/resume");

    } catch (error) {
        console.log(error);
        res.send("Unable to delete resume.");
    }
};

// ==============================
// Printable / Exportable View
// ==============================
exports.viewResume = async (req, res) => {
    try {
        const resume = await Resume.findOne({ _id: req.params.id, user: req.session.user.id });

        if (!resume) {
            return res.send("Resume not found.");
        }

        res.render("resume/print", { resume });

    } catch (error) {
        console.log(error);
        res.send("Unable to load resume.");
    }
};
