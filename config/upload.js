const path = require("path");
const fs = require("fs");
const multer = require("multer");

const uploadsRoot = path.join(__dirname, "..", "uploads");
const coverDir = path.join(uploadsRoot, "covers");
const avatarDir = path.join(uploadsRoot, "avatars");
const certificateDir = path.join(uploadsRoot, "certificates");

// Ensure upload directories exist at boot
[coverDir, avatarDir, certificateDir].forEach((dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

const allowedTypes = /jpeg|jpg|png|webp|gif/;

const imageFileFilter = (req, file, cb) => {
    const extOk = allowedTypes.test(
        path.extname(file.originalname).toLowerCase()
    );
    const mimeOk = allowedTypes.test(file.mimetype);

    if (extOk && mimeOk) {
        return cb(null, true);
    }

    cb(new Error("Only image files (jpg, png, webp, gif) are allowed."));
};

// Builds a Multer instance that stores images in the given directory
const makeImageUploader = (destinationDir) => {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, destinationDir);
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
            cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
        },
    });

    return multer({
        storage,
        fileFilter: imageFileFilter,
        limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    });
};

const uploadCoverImage = makeImageUploader(coverDir);
const uploadAvatar = makeImageUploader(avatarDir);
const uploadCertificate = makeImageUploader(certificateDir);

module.exports = { uploadCoverImage, uploadAvatar, uploadCertificate, coverDir, avatarDir, certificateDir };
