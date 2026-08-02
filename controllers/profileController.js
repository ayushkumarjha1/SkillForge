const fs = require("fs");
const path = require("path");
const User = require("../models/User");
const Project = require("../models/Project");
const { avatarDir } = require("../config/upload");

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

const removeAvatar = (filename) => {
    if (!filename) return;
    const filePath = path.join(avatarDir, filename);
    fs.unlink(filePath, (err) => {
        if (err && err.code !== "ENOENT") {
            console.error("Failed to remove avatar:", err.message);
        }
    });
};

const slugifyUsername = (fullName, id) => {
    const base = fullName
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    return `${base}-${id.toString().slice(-4)}`;
};

// ==============================
// View Own Profile
// ==============================
exports.viewProfile = async (req, res) => {
    try {
        const user = await User.findById(req.session.user.id);

        if (!user) {
            return res.send("Profile not found.");
        }

        res.render("profile/view", { profileUser: user });

    } catch (error) {
        console.log(error);
        res.send("Unable to load profile.");
    }
};

// ==============================
// Edit Profile Page
// ==============================
exports.editProfilePage = async (req, res) => {
    try {
        const user = await User.findById(req.session.user.id);

        if (!user) {
            return res.send("Profile not found.");
        }

        res.render("profile/edit", { profileUser: user });

    } catch (error) {
        console.log(error);
        res.send("Unable to load profile editor.");
    }
};

// ==============================
// Update Profile
// ==============================
exports.updateProfile = async (req, res) => {
    try {
        const {
            bio,
            about,
            skills,
            languages,
            github,
            linkedin,
            twitter,
            website,
            resumeLink,
            portfolioLink,
            username,
        } = req.body;

        const user = await User.findById(req.session.user.id);

        if (!user) {
            if (req.file) removeAvatar(req.file.filename);
            return res.send("Profile not found.");
        }

        // Education entries arrive as parallel arrays from repeated form rows
        const institutions = [].concat(req.body.eduInstitution || []);
        const degrees = [].concat(req.body.eduDegree || []);
        const fields = [].concat(req.body.eduField || []);
        const startYears = [].concat(req.body.eduStartYear || []);
        const endYears = [].concat(req.body.eduEndYear || []);

        const education = institutions
            .map((institution, i) => ({
                institution,
                degree: degrees[i] || "",
                field: fields[i] || "",
                startYear: startYears[i] || "",
                endYear: endYears[i] || "",
            }))
            .filter((entry) => entry.institution && entry.institution.trim());

        const companies = [].concat(req.body.expCompany || []);
        const roles = [].concat(req.body.expRole || []);
        const expStart = [].concat(req.body.expStartDate || []);
        const expEnd = [].concat(req.body.expEndDate || []);
        const expDesc = [].concat(req.body.expDescription || []);

        const experience = companies
            .map((company, i) => ({
                company,
                role: roles[i] || "",
                startDate: expStart[i] || "",
                endDate: expEnd[i] || "",
                description: expDesc[i] || "",
            }))
            .filter((entry) => entry.company && entry.company.trim());

        let finalUsername = user.username;
        if (username && username.trim()) {
            const candidate = username.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
            const taken = await User.findOne({ username: candidate, _id: { $ne: user._id } });
            if (taken) {
                if (req.file) removeAvatar(req.file.filename);
                return res.send("That username is already taken. Go back and pick another.");
            }
            finalUsername = candidate;
        } else if (!finalUsername) {
            finalUsername = slugifyUsername(user.fullName, user._id);
        }

        const update = {
            bio: (bio || "").slice(0, 160),
            about: about || "",
            education,
            experience,
            skills: parseList(skills),
            languages: parseList(languages),
            socialLinks: { github: github || "", linkedin: linkedin || "", twitter: twitter || "", website: website || "" },
            resumeLink: resumeLink || "",
            portfolioLink: portfolioLink || "",
            username: finalUsername,
        };

        if (req.file) {
            update.avatar = req.file.filename;
        }

        await User.findByIdAndUpdate(user._id, update);

        if (req.file && user.avatar) {
            removeAvatar(user.avatar);
        }

        // Keep session display name in sync
        req.session.user.fullName = user.fullName;

        res.redirect("/profile");

    } catch (error) {
        console.log(error);
        if (req.file) removeAvatar(req.file.filename);
        res.send("Unable to update profile.");
    }
};

// ==============================
// Public Profile Page
// ==============================
exports.publicProfile = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });

        if (!user) {
            return res.status(404).send("Profile not found.");
        }

        const featuredProjects = await Project.find({ user: user._id, featured: true }).sort({ createdAt: -1 });

        res.render("profile/public", { profileUser: user, featuredProjects });

    } catch (error) {
        console.log(error);
        res.send("Unable to load profile.");
    }
};
