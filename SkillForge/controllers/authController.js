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