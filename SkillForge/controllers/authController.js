const User = require("../models/User");
const bcrypt = require("bcrypt");

// ======================
// Show Login Page
// ======================
exports.loginPage = (req, res) => {
    res.render("auth/login");
};

// ======================
// Show Register Page
// ======================
exports.registerPage = (req, res) => {
    res.render("auth/register");
};

// ======================
// Register User
// ======================
exports.registerUser = async (req, res) => {
    try {
        const { fullName, email, password, confirmPassword } = req.body;

        if (!fullName || !email || !password || !confirmPassword) {
            return res.send("All fields are required.");
        }

        if (password !== confirmPassword) {
            return res.send("Passwords do not match.");
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.send("Email already exists.");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        res.redirect("/login");

    } catch (error) {
        console.log(error);
        res.send("Registration Failed");
    }
};

// ======================
// Login User
// ======================
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.send("Please fill all fields.");
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.send("User not found.");
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.send("Incorrect password.");
        }

        req.session.user = {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
        };

        res.redirect("/dashboard");

    } catch (error) {
        console.log(error);
        res.send("Login Failed");
    }
};

// ======================
// Logout User
// ======================
exports.logoutUser = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.send("Logout Failed");
        }

        res.redirect("/login");
    });
};