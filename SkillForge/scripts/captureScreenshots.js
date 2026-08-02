const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const Project = require('../models/Project');
const DsaProblem = require('../models/DsaProblem');
const LearningItem = require('../models/LearningItem');
const Internship = require('../models/Internship');
const Job = require('../models/Job');
const Certificate = require('../models/Certificate');
const Resume = require('../models/Resume');

const screenshotsDir = path.join(__dirname, '../docs/screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

async function captureAll() {
  console.log('Connecting to database...');
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Database connected.');

  const bcrypt = require('bcrypt');
  // Find or create test user for rich screenshots
  let user = await User.findOne({ email: 'demo@skillforge.dev' });
  if (!user) {
    user = await User.create({
      fullName: 'Alex Rivera',
      email: 'demo@skillforge.dev',
      password: bcrypt.hashSync('password123', 10),
      role: 'student',
      username: 'alexrivera',
      bio: 'Full-Stack Software Engineer specializing in distributed systems, Node.js, React, and AI agents.',
      skills: ['TypeScript', 'Node.js', 'Go', 'React', 'Next.js', 'PostgreSQL', 'Redis', 'Docker', 'Kubernetes', 'AWS'],
      portfolioTheme: 'Dark',
      socialLinks: {
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com'
      }
    });
  }

  // Populate sample projects if empty
  const projectCount = await Project.countDocuments({ user: user._id });
  if (projectCount < 3) {
    await Project.deleteMany({ user: user._id });
    await Project.create([
      {
        user: user._id,
        title: 'Distributed Cloud Event Mesh',
        description: 'High-throughput asynchronous message broker supporting pub/sub semantics, Redis caching, and WebSocket streams.',
        techStack: 'Node.js, TypeScript, Redis, Docker, Kafka',
        status: 'Completed',
        category: 'DevOps/Tools',
        githubLink: 'https://github.com/alexrivera/event-mesh',
        liveLink: 'https://event-mesh.demo.app',
        featured: true
      },
      {
        user: user._id,
        title: 'AI Neural Code Reviewer',
        description: 'Automated GitHub pull request reviewer leveraging LLMs for security analysis, AST linting, and automated test suggestions.',
        techStack: 'Python, FastAPI, OpenAI API, React, Tailwind',
        status: 'Completed',
        category: 'AI/ML',
        githubLink: 'https://github.com/alexrivera/ai-reviewer',
        liveLink: 'https://neural-reviewer.dev',
        featured: true
      },
      {
        user: user._id,
        title: 'Real-Time Financial Orderbook',
        description: 'Matching engine processing 100k limit/market orders per second with lock-free data structures in C++ and WebSocket frontend.',
        techStack: 'C++, WebSockets, React, Canvas API',
        status: 'In Progress',
        category: 'Web App',
        githubLink: 'https://github.com/alexrivera/crypto-matching',
        liveLink: '',
        featured: true
      }
    ]);
  }

  // Populate DSA problems
  const dsaCount = await DsaProblem.countDocuments({ user: user._id });
  if (dsaCount < 5) {
    await DsaProblem.deleteMany({ user: user._id });
    await DsaProblem.create([
      { user: user._id, title: 'Trapping Rain Water', difficulty: 'Hard', topic: 'Two Pointers', status: 'Solved', problemUrl: 'https://leetcode.com/problems/trapping-rain-water/', notes: 'Used two pointers approach with left_max and right_max bounds in O(n) time and O(1) space.' },
      { user: user._id, title: 'Longest Palindromic Substring', difficulty: 'Medium', topic: 'Dynamic Programming', status: 'Solved', problemUrl: 'https://leetcode.com/problems/longest-palindromic-substring/', notes: 'Expand around center technique with O(n^2) runtime.' },
      { user: user._id, title: 'LRU Cache Design', difficulty: 'Medium', topic: 'Design / Hash Table', status: 'Solved', problemUrl: 'https://leetcode.com/problems/lru-cache/', notes: 'Doubly linked list paired with hash map for O(1) get and put operations.' },
      { user: user._id, title: 'Serialize and Deserialize Binary Tree', difficulty: 'Hard', topic: 'Binary Trees', status: 'Solved', problemUrl: 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/', notes: 'Preorder traversal with delimiter tokens.' },
      { user: user._id, title: 'Merge k Sorted Lists', difficulty: 'Hard', topic: 'Heap / Priority Queue', status: 'Solved', problemUrl: 'https://leetcode.com/problems/merge-k-sorted-lists/', notes: 'Min-heap priority queue with O(N log k) complexity.' },
      { user: user._id, title: 'Two Sum', difficulty: 'Easy', topic: 'Array', status: 'Solved', problemUrl: 'https://leetcode.com/problems/two-sum/', notes: 'One-pass hash map for O(n) time complexity.' }
    ]);
  }

  // Populate Jobs
  const jobCount = await Job.countDocuments({ user: user._id });
  if (jobCount < 4) {
    await Job.deleteMany({ user: user._id });
    await Job.create([
      { user: user._id, company: 'Stripe', role: 'Software Engineer, Infrastructure', status: 'Interview', salary: '$185,000 - $210,000', location: 'San Francisco, CA (Remote)', notes: 'Completed System Design round. Final interview scheduled.' },
      { user: user._id, company: 'Vercel', role: 'Full Stack Engineer, Next.js Core', status: 'Offer', salary: '$190,000 + Equity', location: 'Remote', notes: 'Offer received! Reviewing benefits and equity package.' },
      { user: user._id, company: 'Linear', role: 'Frontend Engineer, Performance', status: 'Applied', salary: '$175,000', location: 'Remote', notes: 'Applied via team referral.' },
      { user: user._id, company: 'OpenAI', role: 'Platform Engineer, Compute', status: 'Wishlist', salary: '$220,000', location: 'San Francisco, CA', notes: 'Target company for Q4 recruitment cycle.' }
    ]);
  }

  // Populate Certificates
  const certCount = await Certificate.countDocuments({ user: user._id });
  if (certCount < 2) {
    await Certificate.deleteMany({ user: user._id });
    await Certificate.create([
      { user: user._id, title: 'AWS Certified Solutions Architect – Associate', issuer: 'Amazon Web Services', issueDate: new Date('2025-11-15'), credentialUrl: 'https://aws.amazon.com/verification' },
      { user: user._id, title: 'Deep Learning Specialization', issuer: 'DeepLearning.AI / Coursera', issueDate: new Date('2025-08-20'), credentialUrl: 'https://coursera.org/verify' }
    ]);
  }

  // Populate Resume
  const resumeCount = await Resume.countDocuments({ user: user._id });
  if (resumeCount === 0) {
    await Resume.create({
      user: user._id,
      title: 'Full-Stack Software Engineer',
      contact: {
        fullName: 'Alex Rivera',
        email: 'alex.rivera@example.com',
        phone: '+1 (555) 019-2834',
        location: 'San Francisco, CA',
        github: 'https://github.com/alexrivera',
        linkedin: 'https://linkedin.com/in/alexrivera',
        portfolio: 'https://alexrivera.dev'
      },
      summary: 'Performance-driven Software Engineer with 4+ years of experience engineering distributed systems, microservices architectures, and developer tooling in Node.js, TypeScript, Go, and React.',
      skills: ['TypeScript', 'Node.js', 'Go', 'React', 'Next.js', 'PostgreSQL', 'Redis', 'Docker', 'Kubernetes', 'AWS', 'GraphQL', 'Kafka'],
      experience: [
        {
          role: 'Senior Software Engineer',
          company: 'Nexus Cloud Systems',
          location: 'San Francisco, CA',
          startDate: '2024-01',
          endDate: 'Present',
          current: true,
          description: 'Architected distributed event-driven message pipeline processing 45M+ daily transactions with 99.99% uptime. Optimized Redis caching tier reducing P99 latency by 42%.'
        }
      ],
      education: [
        {
          institution: 'University of California, Berkeley',
          degree: 'B.S. in Computer Science',
          field: 'Computer Science',
          startYear: '2020',
          endYear: '2024'
        }
      ],
      projects: [
        {
          title: 'Distributed Cloud Event Mesh',
          techStack: 'Node.js, TypeScript, Redis, Kafka',
          liveLink: 'https://event-mesh.demo.app',
          githubLink: 'https://github.com/alexrivera/event-mesh',
          description: 'High-performance message broker supporting pub/sub semantics, real-time WebSocket streaming, and distributed partition locks.'
        }
      ]
    });
  }

  console.log('Sample data populated successfully.');

  console.log('Launching Puppeteer browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  // 1. Landing Page
  console.log('Capturing Landing Page...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: path.join(screenshotsDir, '01_landing_hero.png'), fullPage: false });

  // 2. Login
  console.log('Authenticating demo user...');
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });
  await page.type('input[name="email"]', 'demo@skillforge.dev');
  await page.type('input[name="password"]', 'password123');
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle2' }),
    page.click('button[type="submit"]')
  ]);

  // 3. Dashboard Overview
  console.log('Capturing Dashboard Overview...');
  await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(screenshotsDir, '02_dashboard_overview.png'), fullPage: false });

  // 4. Engineering Analytics
  console.log('Capturing Engineering Analytics...');
  await page.goto('http://localhost:3000/analytics', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(screenshotsDir, '03_engineering_analytics.png'), fullPage: false });

  // 5. AI Career Coach
  console.log('Capturing AI Career Coach...');
  await page.goto('http://localhost:3000/ai/coach', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(screenshotsDir, '04_ai_career_coach.png'), fullPage: false });

  // 6. AI Mock Interview
  console.log('Capturing AI Voice Mock Interview...');
  await page.goto('http://localhost:3000/ai/mock-interview', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(screenshotsDir, '05_ai_mock_interview.png'), fullPage: false });

  // 7. ATS Resume Builder
  console.log('Capturing ATS Resume Builder...');
  await page.goto('http://localhost:3000/resume', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(screenshotsDir, '06_ats_resume_builder.png'), fullPage: false });

  // 8. Job Tracker Kanban
  console.log('Capturing Job Tracker Kanban...');
  await page.goto('http://localhost:3000/jobs', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(screenshotsDir, '07_job_tracker_kanban.png'), fullPage: false });

  // 9. DSA Problem Tracker
  console.log('Capturing DSA Problem Tracker...');
  await page.goto('http://localhost:3000/dsa', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(screenshotsDir, '08_dsa_problem_tracker.png'), fullPage: false });

  // 10. Public Portfolio
  console.log('Capturing Public Developer Portfolio...');
  await page.goto('http://localhost:3000/u/alexrivera', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(screenshotsDir, '09_public_portfolio.png'), fullPage: false });

  await browser.close();
  await mongoose.disconnect();
  console.log('All authentic screenshots captured successfully in docs/screenshots/!');
}

captureAll().catch(err => {
  console.error('Error capturing screenshots:', err);
  process.exit(1);
});
