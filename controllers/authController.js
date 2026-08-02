const User = require("../models/User");
const bcrypt = require("bcrypt");

// ======================
// Show Login Page
// ======================
exports.loginPage = (req, res) => {
    if (req.session.user) {
        return res.redirect("/dashboard");
    }
    res.render("auth/login", { error: null });
};

// ======================
// Show Register Page
// ======================
exports.registerPage = (req, res) => {
    if (req.session.user) {
        return res.redirect("/dashboard");
    }
    res.render("auth/register", { error: null });
};

// ======================
// Register User
// ======================
exports.registerUser = async (req, res) => {
    try {
        const { fullName, email, password, confirmPassword } = req.body;

        if (!fullName || !email || !password || !confirmPassword) {
            return res.status(400).render("auth/register", { error: "All fields are required." });
        }

        if (password.length < 6) {
            return res.status(400).render("auth/register", { error: "Password must be at least 6 characters long." });
        }

        if (password !== confirmPassword) {
            return res.status(400).render("auth/register", { error: "Passwords do not match." });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const existingUser = await User.findOne({ email: normalizedEmail });

        if (existingUser) {
            return res.status(400).render("auth/register", { error: "An account with this email already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            fullName: fullName.trim(),
            email: normalizedEmail,
            password: hashedPassword,
        });

        await newUser.save();

        res.redirect("/login");

    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).render("auth/register", { error: "Registration failed. Please try again." });
    }
};

// ======================
// Login User
// ======================
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).render("auth/login", { error: "Please enter your email and password." });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            return res.status(400).render("auth/login", { error: "Invalid email or password." });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).render("auth/login", { error: "Invalid email or password." });
        }

        req.session.user = {
            id: user._id.toString(),
            fullName: user.fullName,
            email: user.email,
            role: user.role,
        };

        res.redirect("/dashboard");

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).render("auth/login", { error: "Login failed. Please try again." });
    }
};

// ======================
// 1-Click Guest & Recruiter Demo Login
// ======================
exports.demoLogin = async (req, res) => {
    try {
        const Project = require("../models/Project");
        const DsaProblem = require("../models/DsaProblem");
        const Job = require("../models/Job");
        const Certificate = require("../models/Certificate");
        const Resume = require("../models/Resume");

        let user = await User.findOne({ email: "demo@skillforge.dev" });
        if (!user) {
            const hashedPassword = await bcrypt.hash("password123", 10);
            user = await User.create({
                fullName: "Alex Rivera",
                email: "demo@skillforge.dev",
                password: hashedPassword,
                role: "student",
                username: "alexrivera",
                bio: "Full-Stack Software Engineer specializing in distributed systems, Node.js, React, and AI agents.",
                skills: ["TypeScript", "Node.js", "Go", "React", "Next.js", "PostgreSQL", "Redis", "Docker", "Kubernetes", "AWS"],
                portfolioTheme: "Dark",
                socialLinks: {
                    github: "https://github.com",
                    linkedin: "https://linkedin.com",
                    twitter: "https://twitter.com"
                }
            });
        }

        // Ensure rich data exists for the demo user
        const projectCount = await Project.countDocuments({ user: user._id });
        if (projectCount === 0) {
            await Project.create([
                {
                    user: user._id,
                    title: "Distributed Cloud Event Mesh",
                    description: "High-throughput asynchronous message broker supporting pub/sub semantics, Redis caching, and WebSocket streams.",
                    techStack: "Node.js, TypeScript, Redis, Docker, Kafka",
                    status: "Completed",
                    category: "DevOps/Tools",
                    githubLink: "https://github.com/alexrivera/event-mesh",
                    liveLink: "https://event-mesh.demo.app",
                    featured: true
                },
                {
                    user: user._id,
                    title: "AI Neural Code Reviewer",
                    description: "Automated GitHub pull request reviewer leveraging LLMs for security analysis, AST linting, and automated test suggestions.",
                    techStack: "Python, FastAPI, OpenAI API, React, Tailwind",
                    status: "Completed",
                    category: "AI/ML",
                    githubLink: "https://github.com/alexrivera/ai-reviewer",
                    liveLink: "https://neural-reviewer.dev",
                    featured: true
                },
                {
                    user: user._id,
                    title: "Real-Time Financial Orderbook",
                    description: "Matching engine processing 100k limit/market orders per second with lock-free data structures in C++ and WebSocket frontend.",
                    techStack: "C++, WebSockets, React, Canvas API",
                    status: "In Progress",
                    category: "Web App",
                    githubLink: "https://github.com/alexrivera/crypto-matching",
                    featured: true
                }
            ]);
        }

        const dsaCount = await DsaProblem.countDocuments({ user: user._id });
        if (dsaCount === 0) {
            await DsaProblem.create([
                { user: user._id, title: "Trapping Rain Water", difficulty: "Hard", topic: "Two Pointers", status: "Solved", problemUrl: "https://leetcode.com/problems/trapping-rain-water/", notes: "Used two pointers approach with left_max and right_max bounds in O(n) time and O(1) space." },
                { user: user._id, title: "Longest Palindromic Substring", difficulty: "Medium", topic: "Dynamic Programming", status: "Solved", problemUrl: "https://leetcode.com/problems/longest-palindromic-substring/", notes: "Expand around center technique with O(n^2) runtime." },
                { user: user._id, title: "LRU Cache Design", difficulty: "Medium", topic: "Design / Hash Table", status: "Solved", problemUrl: "https://leetcode.com/problems/lru-cache/", notes: "Doubly linked list paired with hash map for O(1) get and put operations." },
                { user: user._id, title: "Serialize and Deserialize Binary Tree", difficulty: "Hard", topic: "Binary Trees", status: "Solved", problemUrl: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/", notes: "Preorder traversal with delimiter tokens." },
                { user: user._id, title: "Merge k Sorted Lists", difficulty: "Hard", topic: "Heap / Priority Queue", status: "Solved", problemUrl: "https://leetcode.com/problems/merge-k-sorted-lists/", notes: "Min-heap priority queue with O(N log k) complexity." },
                { user: user._id, title: "Two Sum", difficulty: "Easy", topic: "Array", status: "Solved", problemUrl: "https://leetcode.com/problems/two-sum/", notes: "One-pass hash map for O(n) time complexity." }
            ]);
        }

        const jobCount = await Job.countDocuments({ user: user._id });
        if (jobCount === 0) {
            await Job.create([
                { user: user._id, company: "Stripe", role: "Software Engineer, Infrastructure", status: "Interview", salary: "$185,000 - $210,000", location: "San Francisco, CA (Remote)", notes: "Completed System Design round. Final interview scheduled." },
                { user: user._id, company: "Vercel", role: "Full Stack Engineer, Next.js Core", status: "Offer", salary: "$190,000 + Equity", location: "Remote", notes: "Offer received! Reviewing benefits and equity package." },
                { user: user._id, company: "Linear", role: "Frontend Engineer, Performance", status: "Applied", salary: "$175,000", location: "Remote", notes: "Applied via team referral." },
                { user: user._id, company: "OpenAI", role: "Platform Engineer, Compute", status: "Wishlist", salary: "$220,000", location: "San Francisco, CA", notes: "Target company for Q4 recruitment cycle." }
            ]);
        }

        const resumeCount = await Resume.countDocuments({ user: user._id });
        if (resumeCount === 0) {
            await Resume.create({
                user: user._id,
                title: "Full-Stack Software Engineer",
                contact: {
                    fullName: "Alex Rivera",
                    email: "alex.rivera@example.com",
                    phone: "+1 (555) 019-2834",
                    location: "San Francisco, CA",
                    github: "https://github.com/alexrivera",
                    linkedin: "https://linkedin.com/in/alexrivera",
                    portfolio: "https://alexrivera.dev"
                },
                summary: "Performance-driven Software Engineer with 4+ years of experience engineering distributed systems, microservices architectures, and developer tooling in Node.js, TypeScript, Go, and React.",
                skills: ["TypeScript", "Node.js", "Go", "React", "Next.js", "PostgreSQL", "Redis", "Docker", "Kubernetes", "AWS", "GraphQL", "Kafka"],
                experience: [
                    {
                        role: "Senior Software Engineer",
                        company: "Nexus Cloud Systems",
                        location: "San Francisco, CA",
                        startDate: "2024-01",
                        endDate: "Present",
                        current: true,
                        description: "Architected distributed event-driven message pipeline processing 45M+ daily transactions with 99.99% uptime. Optimized Redis caching tier reducing P99 latency by 42%."
                    }
                ],
                education: [
                    {
                        institution: "University of California, Berkeley",
                        degree: "B.S. in Computer Science",
                        field: "Computer Science",
                        startYear: "2020",
                        endYear: "2024"
                    }
                ],
                projects: [
                    {
                        title: "Distributed Cloud Event Mesh",
                        techStack: "Node.js, TypeScript, Redis, Kafka",
                        liveLink: "https://event-mesh.demo.app",
                        githubLink: "https://github.com/alexrivera/event-mesh",
                        description: "High-performance message broker supporting pub/sub semantics, real-time WebSocket streaming, and distributed partition locks."
                    }
                ]
            });
        }

        req.session.user = {
            id: user._id.toString(),
            fullName: user.fullName,
            email: user.email,
            role: user.role,
        };

        res.redirect("/dashboard");
    } catch (error) {
        console.error("Demo Login Error:", error);
        res.redirect("/login");
    }
};

// ======================
// Logout User
// ======================
exports.logoutUser = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Logout Error:", err);
            return res.redirect("/dashboard");
        }
        res.clearCookie("connect.sid");
        res.redirect("/login");
    });
};