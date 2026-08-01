const session = require("express-session");
const { MongoStore } = require("connect-mongo");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const express = require("express");
const path = require("path");
const connectDB = require("./config/db");

const app = express();

if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
}

// Security headers. CSP is relaxed for inline <style>/<script> and the CDN
// fonts/Chart.js this app already uses — a strict default CSP would break
// every existing page. This is a deliberate tradeoff, not an oversight:
// tightening it further means moving all inline styles/scripts into files first.
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
                fontSrc: ["'self'", "https://fonts.gstatic.com"],
                scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
                imgSrc: ["'self'", "data:", "https:"],
                connectSrc: ["'self'"],
            },
        },
    })
);

// Rate limiting: general cap on all routes, stricter cap on auth routes
// (login/register) to slow down brute-force / credential-stuffing attempts.
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: "Too many attempts. Try again in 15 minutes.",
});

app.use(generalLimiter);
app.use(["/login", "/register"], authLimiter);
connectDB();

const PORT = process.env.PORT || 3000;

// Import Routes
const homeRoutes = require("./routes/homeRoutes");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const projectRoutes = require("./routes/projectRoutes");
const profileRoutes = require("./routes/profileRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");
const certificateRoutes = require("./routes/certificateRoutes");
const internshipRoutes = require("./routes/internshipRoutes");
const jobRoutes = require("./routes/jobRoutes");
const learningRoutes = require("./routes/learningRoutes");
const dsaRoutes = require("./routes/dsaRoutes");
const careerRoutes = require("./routes/careerRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const githubRoutes = require("./routes/githubRoutes");
const adminRoutes = require("./routes/adminRoutes");
const aiRoutes = require("./routes/aiRoutes");

// View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Session
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI,
            collectionName: "sessions",
            ttl: 14 * 24 * 60 * 60, // 14 days
        }),
        cookie: {
            maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
            secure: process.env.NODE_ENV === "production",
            httpOnly: true,
        },
    })
);

// Load Routes
app.use("/", homeRoutes);
app.use("/", authRoutes);
app.use("/", dashboardRoutes);
app.use("/", projectRoutes);
app.use("/", profileRoutes);
app.use("/", resumeRoutes);
app.use("/", portfolioRoutes);
app.use("/", certificateRoutes);
app.use("/", internshipRoutes);
app.use("/", jobRoutes);
app.use("/", learningRoutes);
app.use("/", dsaRoutes);
app.use("/", careerRoutes);
app.use("/", analyticsRoutes);
app.use("/", settingsRoutes);
app.use("/", notificationRoutes);
app.use("/", githubRoutes);
app.use("/", adminRoutes);
app.use("/", aiRoutes);

// 404 Page
app.use((req, res) => {
    res.status(404).render("errors/404");
});

// Error Handler (e.g. Multer upload rejections, uncaught controller errors)
app.use((err, req, res, next) => {
    console.error(err);
    const message = process.env.NODE_ENV === "production" ? null : err.message;
    res.status(err.status || 400).render("errors/500", { message });
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 SkillForge running at http://localhost:${PORT}`);
});