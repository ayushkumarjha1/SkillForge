const fs = require("fs");
const path = require("path");
const Certificate = require("../models/Certificate");
const { certificateDir } = require("../config/upload");
const { createNotification } = require("../utils/notify");

const removeImage = (filename) => {
    if (!filename) return;
    fs.unlink(path.join(certificateDir, filename), (err) => {
        if (err && err.code !== "ENOENT") console.error("Failed to remove certificate image:", err.message);
    });
};

exports.listCertificates = async (req, res) => {
    try {
        const certificates = await Certificate.find({ user: req.session.user.id }).sort({ createdAt: -1 });
        res.render("certificates/index", { certificates });
    } catch (error) {
        console.log(error);
        res.send("Unable to load certificates.");
    }
};

exports.addCertificatePage = (req, res) => {
    res.render("certificates/add");
};

exports.createCertificate = async (req, res) => {
    try {
        const { title, issuer, category, issueDate, credentialUrl } = req.body;

        await Certificate.create({
            title,
            issuer,
            category,
            issueDate,
            credentialUrl,
            image: req.file ? req.file.filename : "",
            user: req.session.user.id,
        });

        await createNotification(req.session.user.id, `Certificate added: "${title}"`, "success", "/certificates");

        res.redirect("/certificates");
    } catch (error) {
        console.log(error);
        if (req.file) removeImage(req.file.filename);
        res.send("Unable to add certificate.");
    }
};

exports.editCertificatePage = async (req, res) => {
    try {
        const certificate = await Certificate.findOne({ _id: req.params.id, user: req.session.user.id });
        if (!certificate) return res.send("Certificate not found.");
        res.render("certificates/edit", { certificate });
    } catch (error) {
        console.log(error);
        res.send("Unable to load certificate.");
    }
};

exports.updateCertificate = async (req, res) => {
    try {
        const { title, issuer, category, issueDate, credentialUrl } = req.body;

        const existing = await Certificate.findOne({ _id: req.params.id, user: req.session.user.id });
        if (!existing) {
            if (req.file) removeImage(req.file.filename);
            return res.send("Certificate not found.");
        }

        const update = { title, issuer, category, issueDate, credentialUrl };
        if (req.file) update.image = req.file.filename;

        await Certificate.findByIdAndUpdate(existing._id, update);

        if (req.file && existing.image) removeImage(existing.image);

        res.redirect("/certificates");
    } catch (error) {
        console.log(error);
        if (req.file) removeImage(req.file.filename);
        res.send("Unable to update certificate.");
    }
};

exports.deleteCertificate = async (req, res) => {
    try {
        const deleted = await Certificate.findOneAndDelete({ _id: req.params.id, user: req.session.user.id });
        if (deleted && deleted.image) removeImage(deleted.image);
        res.redirect("/certificates");
    } catch (error) {
        console.log(error);
        res.send("Unable to delete certificate.");
    }
};
