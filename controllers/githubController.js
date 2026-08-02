const User = require("../models/User");

// GitHub's public REST API allows unauthenticated requests (60/hour per IP).
// Optionally, a GITHUB_TOKEN in .env raises that to 5000/hour — used if present.
const githubHeaders = () => {
    const headers = { "User-Agent": "SkillForge-X-App" };
    if (process.env.GITHUB_TOKEN) {
        headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }
    return headers;
};

exports.githubPage = async (req, res) => {
    try {
        const user = await User.findById(req.session.user.id);
        res.render("github/index", { profileUser: user, githubData: null, error: null });
    } catch (error) {
        console.log(error);
        res.send("Unable to load GitHub integration.");
    }
};

exports.fetchGithubStats = async (req, res) => {
    try {
        const { username } = req.body;
        const user = await User.findById(req.session.user.id);

        if (!username || !username.trim()) {
            return res.render("github/index", { profileUser: user, githubData: null, error: "Enter a GitHub username." });
        }

        const cleanUsername = username.trim().replace(/^@/, "");

        const profileRes = await fetch(`https://api.github.com/users/${cleanUsername}`, { headers: githubHeaders() });

        if (profileRes.status === 404) {
            return res.render("github/index", { profileUser: user, githubData: null, error: `No GitHub user found for "${cleanUsername}".` });
        }

        if (profileRes.status === 403) {
            return res.render("github/index", { profileUser: user, githubData: null, error: "GitHub API rate limit reached. Try again in a bit, or add a GITHUB_TOKEN to your .env to raise the limit." });
        }

        if (!profileRes.ok) {
            return res.render("github/index", { profileUser: user, githubData: null, error: "GitHub API request failed. Try again shortly." });
        }

        const profile = await profileRes.json();

        const reposRes = await fetch(
            `https://api.github.com/users/${cleanUsername}/repos?per_page=100&sort=updated`,
            { headers: githubHeaders() }
        );
        const repos = reposRes.ok ? await reposRes.json() : [];

        // Aggregate language usage across repos (by repo count, not byte-weighted —
        // that would need a second API call per repo, which risks the rate limit)
        const languageCounts = {};
        repos.forEach((repo) => {
            if (repo.language) {
                languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
            }
        });

        const topRepos = [...repos]
            .sort((a, b) => b.stargazers_count - a.stargazers_count)
            .slice(0, 6);

        const totalStars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);

        const githubData = {
            username: cleanUsername,
            avatar: profile.avatar_url,
            name: profile.name,
            bio: profile.bio,
            publicRepos: profile.public_repos,
            followers: profile.followers,
            following: profile.following,
            profileUrl: profile.html_url,
            languageCounts,
            topRepos,
            totalStars,
        };

        // Save the username so it's pre-filled next time
        user.socialLinks.github = profile.html_url;
        await user.save();

        res.render("github/index", { profileUser: user, githubData, error: null });

    } catch (error) {
        console.log(error);
        const user = await User.findById(req.session.user.id);
        res.render("github/index", { profileUser: user, githubData: null, error: "Something went wrong fetching GitHub data. Check your connection and try again." });
    }
};
