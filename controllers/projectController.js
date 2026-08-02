const fs = require("fs");
const path = require("path");
const Project = require("../models/Project");
const { coverDir } = require("../config/upload");

// ==============================
// Helpers
// ==============================
const parseTags = (tagsInput) => {
    if (!tagsInput) return [];
    return tagsInput
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
};

const removeCoverImage = (filename) => {
    if (!filename) return;
    const filePath = path.join(coverDir, filename);
    fs.unlink(filePath, (err) => {
        if (err && err.code !== "ENOENT") {
            console.error("Failed to remove cover image:", err.message);
        }
    });
};

// ==============================
// Show All Projects (search, filter, sort, paginate)
// ==============================
exports.getProjects = async (req, res) => {
    try {
        const { q, status, category, sort, page } = req.query;

        const query = { user: req.session.user.id };

        if (q) {
            query.$or = [
                { title: { $regex: q, $options: "i" } },
                { techStack: { $regex: q, $options: "i" } },
                { tags: { $regex: q, $options: "i" } },
            ];
        }

        if (status) query.status = status;
        if (category) query.category = category;

        const sortOptions = {
            newest: { createdAt: -1 },
            oldest: { createdAt: 1 },
            "title-asc": { title: 1 },
            "title-desc": { title: -1 },
        };
        const sortBy = sortOptions[sort] || sortOptions.newest;

        const requestedPage = Math.max(parseInt(page, 10) || 1, 1);
        const perPage = 6;

        const totalProjects = await Project.countDocuments(query);
        const totalPages = Math.max(Math.ceil(totalProjects / perPage), 1);
        const currentPage = Math.min(requestedPage, totalPages);

        const projects = await Project.find(query)
            .sort(sortBy)
            .skip((currentPage - 1) * perPage)
            .limit(perPage);

        res.render("projects/index", {
            projects,
            filters: { q: q || "", status: status || "", category: category || "", sort: sort || "newest" },
            pagination: { currentPage, totalPages, totalProjects },
        });

    } catch (error) {
        console.log(error);
        res.send("Unable to load projects.");
    }
};

// ==============================
// Add Project
// ==============================
exports.addProjectPage = (req, res) => {
    res.render("projects/addProject");
};

exports.createProject = async (req, res) => {
    try {
        const { title, description, techStack, githubLink, liveLink, status, category, tags } = req.body;

        const initialStatus = status || "Planning";

        await Project.create({
            title,
            description,
            techStack,
            githubLink,
            liveLink,
            status: initialStatus,
            category,
            tags: parseTags(tags),
            coverImage: req.file ? req.file.filename : "",
            statusHistory: [{ status: initialStatus }],
            user: req.session.user.id,
        });

        res.redirect("/projects");

    } catch (error) {
        console.log(error);
        if (req.file) removeCoverImage(req.file.filename);
        res.send("Project creation failed.");
    }
};

// ==============================
// Edit Project
// ==============================
exports.editProjectPage = async (req, res) => {
    try {

        const project = await Project.findOne({
            _id: req.params.id,
            user: req.session.user.id,
        });

        if (!project) {
            return res.send("Project not found.");
        }

        res.render("projects/editProject", { project });

    } catch (error) {
        console.log(error);
        res.send("Unable to open project.");
    }
};

exports.updateProject = async (req, res) => {
    try {
        const { title, description, techStack, githubLink, liveLink, status, category, tags } = req.body;

        const existing = await Project.findOne({
            _id: req.params.id,
            user: req.session.user.id,
        });

        if (!existing) {
            if (req.file) removeCoverImage(req.file.filename);
            return res.send("Project not found.");
        }

        const update = {
            title,
            description,
            techStack,
            githubLink,
            liveLink,
            status,
            category,
            tags: parseTags(tags),
        };

        // Only append to history when the status actually changed
        if (status && status !== existing.status) {
            update.statusHistory = [
                ...existing.statusHistory,
                { status },
            ];
        }

        // Replace cover image only if a new one was uploaded
        if (req.file) {
            update.coverImage = req.file.filename;
        }

        await Project.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.session.user.id,
            },
            update
        );

        // Clean up the old file only after the update succeeds
        if (req.file && existing.coverImage) {
            removeCoverImage(existing.coverImage);
        }

        res.redirect("/projects");

    } catch (error) {
        console.log(error);
        if (req.file) removeCoverImage(req.file.filename);
        res.send("Update failed.");
    }
};

// ==============================
// Delete Project
// ==============================
exports.deleteProject = async (req, res) => {
    try {

        const deleted = await Project.findOneAndDelete({
            _id: req.params.id,
            user: req.session.user.id,
        });

        if (deleted && deleted.coverImage) {
            removeCoverImage(deleted.coverImage);
        }

        res.redirect("/projects");

    } catch (error) {
        console.log(error);
        res.send("Delete failed.");
    }
};