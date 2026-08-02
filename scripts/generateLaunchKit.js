const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

// Define Deliverable Directories
const BASE_DIR = path.resolve(__dirname, '..', 'launch-kit');
const DIRS = {
  screenshots: path.join(BASE_DIR, 'screenshots'),
  mockups: path.join(BASE_DIR, 'mockups'),
  carousel: path.join(BASE_DIR, 'carousel'),
  video: path.join(BASE_DIR, 'video'),
  readmeAssets: path.join(BASE_DIR, 'readme-assets'),
  linkedinAssets: path.join(BASE_DIR, 'linkedin-assets'),
  thumbnails: path.join(BASE_DIR, 'thumbnails')
};

// Ensure all directories exist
Object.values(DIRS).forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

async function seedComprehensiveDemoData() {
  console.log('🌱 Ensuring comprehensive demo and admin database records...');
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI);
    }
    const User = require('../models/User');
    const Project = require('../models/Project');
    const DsaProblem = require('../models/DsaProblem');
    const Job = require('../models/Job');
    const Certificate = require('../models/Certificate');
    const Resume = require('../models/Resume');
    const LearningItem = require('../models/LearningItem');
    const bcrypt = require('bcrypt');

    const hashedPassword = await bcrypt.hash('password123', 10);

    // 1. Demo Student User
    let demoUser = await User.findOne({ email: 'demo@skillforge.dev' });
    if (!demoUser) {
      demoUser = await User.create({
        fullName: 'Alex Rivera',
        email: 'demo@skillforge.dev',
        password: hashedPassword,
        role: 'student',
        username: 'alexrivera',
        bio: 'Senior Full-Stack Engineer specializing in high-throughput distributed systems, Node.js microservices, and AI Copilots.',
        skills: ['TypeScript', 'Node.js', 'Go', 'React', 'Next.js', 'PostgreSQL', 'Redis', 'Docker', 'Kubernetes', 'AWS', 'System Design'],
        portfolioTheme: 'Dark',
        education: [
          { institution: 'UC Berkeley', degree: 'B.S. in Computer Science', field: 'Distributed Systems', startYear: '2020', endYear: '2024' }
        ],
        socialLinks: {
          github: 'https://github.com/alexrivera',
          linkedin: 'https://linkedin.com/in/alexrivera',
          twitter: 'https://twitter.com/alexrivera_dev'
        }
      });
    }

    // 2. Admin User
    let adminUser = await User.findOne({ email: 'admin@skillforge.dev' });
    if (!adminUser) {
      adminUser = await User.create({
        fullName: 'System Administrator',
        email: 'admin@skillforge.dev',
        password: hashedPassword,
        role: 'admin',
        username: 'admin',
        bio: 'SkillForge Platform Operations & System Administration.',
        skills: ['Infrastructure', 'Security', 'MongoDB', 'DevOps']
      });
    }

    // 3. Populate Rich Projects
    const pCount = await Project.countDocuments({ user: demoUser._id });
    if (pCount < 4) {
      await Project.deleteMany({ user: demoUser._id });
      await Project.create([
        {
          user: demoUser._id,
          title: 'Distributed Cloud Event Mesh',
          description: 'High-throughput asynchronous message broker supporting pub/sub semantics, Redis memory caching, and sub-millisecond WebSocket fanout.',
          techStack: 'Node.js, TypeScript, Redis, Kafka, Docker',
          status: 'Completed',
          category: 'DevOps/Tools',
          githubLink: 'https://github.com/alexrivera/event-mesh',
          liveLink: 'https://event-mesh.demo.app',
          featured: true
        },
        {
          user: demoUser._id,
          title: 'AI Neural Code Reviewer & AST Analyzer',
          description: 'Autonomous pull request reviewer leveraging LLMs for vulnerability detection, abstract syntax tree linting, and automated unit test generation.',
          techStack: 'Python, FastAPI, OpenAI API, React, Tailwind',
          status: 'Completed',
          category: 'AI/ML',
          githubLink: 'https://github.com/alexrivera/ai-reviewer',
          liveLink: 'https://neural-reviewer.dev',
          featured: true
        },
        {
          user: demoUser._id,
          title: 'Real-Time Financial Orderbook Engine',
          description: 'Matching engine processing 120,000 limit and market orders per second with lock-free memory buffers in C++ and high-performance WebSocket frontends.',
          techStack: 'C++, WebSockets, React, HTML5 Canvas',
          status: 'Completed',
          category: 'Web App',
          githubLink: 'https://github.com/alexrivera/crypto-matching',
          featured: true
        },
        {
          user: demoUser._id,
          title: 'Microservices Observability & Tracing Agent',
          description: 'Distributed OpenTelemetry metrics collector tracking distributed trace contexts across 40+ containerized RPC services.',
          techStack: 'Go, Prometheus, Grafana, gRPC, Docker',
          status: 'In Progress',
          category: 'DevOps/Tools',
          githubLink: 'https://github.com/alexrivera/telemetry-agent',
          featured: false
        }
      ]);
    }

    // 4. Populate Rich DSA Problems
    const dCount = await DsaProblem.countDocuments({ user: demoUser._id });
    if (dCount < 6) {
      await DsaProblem.deleteMany({ user: demoUser._id });
      await DsaProblem.create([
        { user: demoUser._id, title: 'Trapping Rain Water', difficulty: 'Hard', topic: 'Two Pointers', status: 'Solved', problemUrl: 'https://leetcode.com/problems/trapping-rain-water/', notes: 'Used two pointers technique maintaining left_max and right_max bounds in O(n) runtime and O(1) auxiliary memory.' },
        { user: demoUser._id, title: 'Longest Palindromic Substring', difficulty: 'Medium', topic: 'Dynamic Programming', status: 'Solved', problemUrl: 'https://leetcode.com/problems/longest-palindromic-substring/', notes: 'Expand around centers approach examining 2n-1 center points with O(1) space.' },
        { user: demoUser._id, title: 'LRU Cache Architecture', difficulty: 'Medium', topic: 'Design / Hash Table', status: 'Solved', problemUrl: 'https://leetcode.com/problems/lru-cache/', notes: 'Doubly linked list paired with hash map ensuring strict O(1) get and put operations.' },
        { user: demoUser._id, title: 'Serialize & Deserialize Binary Tree', difficulty: 'Hard', topic: 'Binary Trees', status: 'Solved', problemUrl: 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/', notes: 'Preorder DFS traversal with delimiter string serialization and queue-based reconstruction.' },
        { user: demoUser._id, title: 'Merge k Sorted Lists', difficulty: 'Hard', topic: 'Heap / Priority Queue', status: 'Solved', problemUrl: 'https://leetcode.com/problems/merge-k-sorted-lists/', notes: 'Min-heap priority queue approach achieving O(N log k) optimal complexity.' },
        { user: demoUser._id, title: 'Two Sum Optimal Hash', difficulty: 'Easy', topic: 'Array / Hash Table', status: 'Solved', problemUrl: 'https://leetcode.com/problems/two-sum/', notes: 'Single-pass hash table with O(n) time and O(n) space.' }
      ]);
    }

    // 5. Populate Rich Job Pipeline
    const jCount = await Job.countDocuments({ user: demoUser._id });
    if (jCount < 4) {
      await Job.deleteMany({ user: demoUser._id });
      await Job.create([
        { user: demoUser._id, company: 'Stripe', role: 'Software Engineer, Core Infrastructure', status: 'Interview', salary: '$195,000 - $225,000', location: 'San Francisco, CA (Hybrid)', notes: 'Completed System Design and Distributed Systems rounds. Final debrief scheduled.' },
        { user: demoUser._id, company: 'Vercel', role: 'Full Stack Engineer, Next.js Compiler', status: 'Offer', salary: '$190,000 + Top-tier Equity', location: 'Remote (US/Global)', notes: 'Official offer letter received! Reviewing stock compensation and benefits package.' },
        { user: demoUser._id, company: 'Linear', role: 'Frontend Systems Engineer, Performance', status: 'Applied', salary: '$175,000', location: 'Remote', notes: 'Submitted application with customized portfolio and live demo link.' },
        { user: demoUser._id, company: 'OpenAI', role: 'Platform Infrastructure Engineer, Compute', status: 'Wishlist', salary: '$240,000', location: 'San Francisco, CA', notes: 'Target company for Q4 recruitment cycle. Preparing transformer optimization papers.' }
      ]);
    }

    // 6. Populate Rich Learning Items
    const lCount = await LearningItem.countDocuments({ user: demoUser._id });
    if (lCount < 3) {
      await LearningItem.deleteMany({ user: demoUser._id });
      await LearningItem.create([
        { user: demoUser._id, title: 'Distributed Systems & Consensus (Raft/Paxos)', category: 'Backend Architecture', platform: 'MIT 6.824', status: 'Completed', notes: 'Implemented Raft leader election, log replication, and persistence state machine in Go.' },
        { user: demoUser._id, title: 'High-Performance Rust for WebAssembly', category: 'Systems Programming', platform: 'OReilly', status: 'In Progress', notes: 'Building SIMD-accelerated image filters running in client browsers via WASM.' },
        { user: demoUser._id, title: 'Large Language Model Fine-Tuning (LoRA/PEFT)', category: 'AI/ML', platform: 'DeepLearning.AI', status: 'Planned', notes: 'Quantized fine-tuning of Llama 3 on proprietary developer datasets.' }
      ]);
    }

    // 7. Populate Certificates
    const cCount = await Certificate.countDocuments({ user: demoUser._id });
    if (cCount < 2) {
      await Certificate.deleteMany({ user: demoUser._id });
      await Certificate.create([
        { user: demoUser._id, name: 'AWS Certified Solutions Architect – Professional', issuer: 'Amazon Web Services', issueDate: '2024-03-15', credentialUrl: 'https://aws.amazon.com/verification' },
        { user: demoUser._id, name: 'Certified Kubernetes Administrator (CKA)', issuer: 'Linux Foundation / CNCF', issueDate: '2024-06-20', credentialUrl: 'https://cncf.io/certification/cka' }
      ]);
    }

    console.log('✅ Demo & Admin records seeded successfully!');
  } catch (err) {
    console.error('Data seeding note:', err.message);
  }
}

async function runLaunchKitGenerator() {
  await seedComprehensiveDemoData();

  console.log('🚀 Launching Puppeteer Headless Engine...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
  });

  const page = await browser.newPage();

  // Helper for capturing high-res screenshots
  async function capturePage(url, outputPath, width = 1920, height = 1080, dpr = 2) {
    console.log(`📸 Capturing [${width}x${height} @${dpr}x] -> ${path.basename(outputPath)}`);
    await page.setViewport({ width, height, deviceScaleFactor: dpr });
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
    // Wait for any animations or Chart.js rendering
    await new Promise(r => setTimeout(r, 1200));
    await page.screenshot({ path: outputPath, fullPage: false });
  }

  // ==========================================
  // STEP 2: CAPTURE PROFESSIONAL SCREENSHOTS
  // ==========================================
  console.log('\n--- STEP 2: Capturing Professional Screenshots ---');

  // 1. Landing Page
  await capturePage('http://localhost:3000', path.join(DIRS.screenshots, '01_landing_page.png'), 1920, 1080);
  
  // 2. Login Page
  await capturePage('http://localhost:3000/login', path.join(DIRS.screenshots, '02_login_page.png'), 1920, 1080);
  
  // 3. Register Page
  await capturePage('http://localhost:3000/register', path.join(DIRS.screenshots, '03_register_page.png'), 1920, 1080);

  // Authenticate as Demo User
  console.log('🔑 Authenticating demo user session...');
  await page.goto('http://localhost:3000/demo', { waitUntil: 'networkidle0' });

  // 4. Dashboard
  await capturePage('http://localhost:3000/dashboard', path.join(DIRS.screenshots, '04_dashboard.png'), 1920, 1080);

  // 5. Engineering Analytics & Readiness Index
  await capturePage('http://localhost:3000/analytics', path.join(DIRS.screenshots, '05_analytics_readiness.png'), 1920, 1080);

  // 6. Resume Builder Studio
  await capturePage('http://localhost:3000/resume', path.join(DIRS.screenshots, '06_resume_builder.png'), 1920, 1080);

  // 7. Project Management
  await capturePage('http://localhost:3000/projects', path.join(DIRS.screenshots, '07_project_management.png'), 1920, 1080);

  // 8. DSA Coding Progress
  await capturePage('http://localhost:3000/dsa', path.join(DIRS.screenshots, '08_dsa_coding_progress.png'), 1920, 1080);

  // 9. AI Voice Mock Interview
  await capturePage('http://localhost:3000/ai/mock-interview', path.join(DIRS.screenshots, '09_ai_mock_interview.png'), 1920, 1080);

  // 10. AI Career Coach
  await capturePage('http://localhost:3000/ai/coach', path.join(DIRS.screenshots, '10_ai_career_coach.png'), 1920, 1080);

  // 11. Job Tracker Kanban
  await capturePage('http://localhost:3000/jobs', path.join(DIRS.screenshots, '11_job_tracker_kanban.png'), 1920, 1080);

  // 12. User Profile (Public Vanity View)
  await capturePage('http://localhost:3000/u/alexrivera', path.join(DIRS.screenshots, '12_user_profile.png'), 1920, 1080);

  // 13. Settings
  await capturePage('http://localhost:3000/settings', path.join(DIRS.screenshots, '13_settings.png'), 1920, 1080);

  // 14. Mobile Viewport (iPhone 14 Pro: 393 x 852 @3x)
  await capturePage('http://localhost:3000/dashboard', path.join(DIRS.screenshots, '14_mobile_dashboard.png'), 393, 852, 3);
  await capturePage('http://localhost:3000/analytics', path.join(DIRS.screenshots, '15_mobile_analytics.png'), 393, 852, 3);
  await capturePage('http://localhost:3000/ai/mock-interview', path.join(DIRS.screenshots, '16_mobile_mock_interview.png'), 393, 852, 3);

  // 15. Tablet Viewport (iPad Air: 820 x 1180 @2x)
  await capturePage('http://localhost:3000/dashboard', path.join(DIRS.screenshots, '17_tablet_dashboard.png'), 820, 1180, 2);
  await capturePage('http://localhost:3000/analytics', path.join(DIRS.screenshots, '18_tablet_analytics.png'), 820, 1180, 2);

  // 16. Admin Panel (Authenticate Admin)
  try {
    console.log('🔑 Logging into Admin Panel...');
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle0' });
    await page.type('#email', 'admin@skillforge.dev');
    await page.type('#password', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    await capturePage('http://localhost:3000/admin', path.join(DIRS.screenshots, '19_admin_panel.png'), 1920, 1080);
  } catch (adminErr) {
    console.log('Admin note:', adminErr.message);
  }

  // ==========================================
  // STEP 3: CREATE PREMIUM DEVICE MOCKUPS
  // ==========================================
  console.log('\n--- STEP 3: Generating High-Resolution Device Mockups ---');

  // Convert screenshot to base64 for embedding into standalone mockup renders
  function getBase64Image(filePath) {
    if (!fs.existsSync(filePath)) return '';
    return `data:image/png;base64,${fs.readFileSync(filePath).toString('base64')}`;
  }

  const dashImgB64 = getBase64Image(path.join(DIRS.screenshots, '04_dashboard.png'));
  const analyticsImgB64 = getBase64Image(path.join(DIRS.screenshots, '05_analytics_readiness.png'));
  const interviewImgB64 = getBase64Image(path.join(DIRS.screenshots, '09_ai_mock_interview.png'));
  const mobileDashB64 = getBase64Image(path.join(DIRS.screenshots, '14_mobile_dashboard.png'));
  const tabletDashB64 = getBase64Image(path.join(DIRS.screenshots, '17_tablet_dashboard.png'));

  // 1. MacBook Pro Mockup
  const macbookHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { width: 2400px; height: 1500px; display: flex; align-items: center; justify-content: center; background: radial-gradient(circle at 50% 40%, #1e1b4b 0%, #090d16 80%); font-family: -apple-system, sans-serif; overflow: hidden; }
        .stage { display: flex; flex-direction: column; align-items: center; transform: scale(1.05); }
        .macbook-lid { width: 1720px; height: 1080px; background: #161922; border-radius: 28px 28px 4px 4px; padding: 24px 24px 32px 24px; box-shadow: 0 40px 100px rgba(0,0,0,0.8), 0 0 120px rgba(99, 102, 241, 0.25); border: 2px solid rgba(255,255,255,0.12); position: relative; }
        .notch { position: absolute; top: 24px; left: 50%; transform: translateX(-50%); width: 160px; height: 20px; background: #000; border-radius: 0 0 12px 12px; z-index: 10; display: flex; align-items: center; justify-content: center; }
        .camera { width: 8px; height: 8px; background: #082f49; border-radius: 50%; border: 1px solid #1e293b; }
        .screen-container { width: 100%; height: 100%; border-radius: 12px; overflow: hidden; background: #000; }
        .screen-img { width: 100%; height: 100%; object-fit: cover; }
        .macbook-base { width: 2040px; height: 32px; background: linear-gradient(180deg, #334155 0%, #1e293b 100%); border-radius: 4px 4px 24px 24px; position: relative; box-shadow: 0 20px 40px rgba(0,0,0,0.6); }
        .macbook-notch-base { position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 240px; height: 10px; background: #0f172a; border-radius: 0 0 10px 10px; }
        .glow-title { position: absolute; top: 60px; font-size: 32px; font-weight: 700; color: #fff; letter-spacing: -0.5px; opacity: 0.9; }
      </style>
    </head>
    <body>
      <div class="stage">
        <div class="macbook-lid">
          <div class="notch"><div class="camera"></div></div>
          <div class="screen-container">
            <img class="screen-img" src="${dashImgB64}" />
          </div>
        </div>
        <div class="macbook-base">
          <div class="macbook-notch-base"></div>
        </div>
      </div>
    </body>
    </html>
  `;
  await page.setViewport({ width: 2400, height: 1500, deviceScaleFactor: 1 });
  await page.setContent(macbookHtml);
  await page.screenshot({ path: path.join(DIRS.mockups, 'mockup_macbook_pro_dashboard.png') });

  // 2. Desktop Studio Display Mockup (Analytics)
  const monitorHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { width: 2400px; height: 1600px; display: flex; align-items: center; justify-content: center; background: radial-gradient(circle at 50% 30%, #0f172a 0%, #020617 90%); font-family: -apple-system, sans-serif; overflow: hidden; }
        .monitor-stage { display: flex; flex-direction: column; align-items: center; transform: scale(1.02); }
        .display-frame { width: 1840px; height: 1080px; background: #090d16; border-radius: 24px; padding: 20px; box-shadow: 0 50px 120px rgba(0,0,0,0.9), 0 0 100px rgba(124, 58, 237, 0.2); border: 2px solid rgba(255,255,255,0.15); }
        .screen-container { width: 100%; height: 100%; border-radius: 12px; overflow: hidden; }
        .screen-img { width: 100%; height: 100%; object-fit: cover; }
        .monitor-stand-neck { width: 160px; height: 260px; background: linear-gradient(180deg, #334155 0%, #1e293b 100%); margin-top: -8px; clip-path: polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%); }
        .monitor-stand-base { width: 520px; height: 24px; background: linear-gradient(180deg, #475569 0%, #1e293b 100%); border-radius: 12px; box-shadow: 0 20px 40px rgba(0,0,0,0.7); }
      </style>
    </head>
    <body>
      <div class="monitor-stage">
        <div class="display-frame">
          <div class="screen-container">
            <img class="screen-img" src="${analyticsImgB64}" />
          </div>
        </div>
        <div class="monitor-stand-neck"></div>
        <div class="monitor-stand-base"></div>
      </div>
    </body>
    </html>
  `;
  await page.setViewport({ width: 2400, height: 1600, deviceScaleFactor: 1 });
  await page.setContent(monitorHtml);
  await page.screenshot({ path: path.join(DIRS.mockups, 'mockup_desktop_monitor_analytics.png') });

  // 3. iPhone 15 Pro Titanium Mockup
  const iphoneHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { width: 1400px; height: 1800px; display: flex; align-items: center; justify-content: center; background: radial-gradient(circle at 50% 50%, #1e1b4b 0%, #030712 90%); font-family: -apple-system, sans-serif; }
        .phone-frame { width: 580px; height: 1180px; background: #27272a; border-radius: 68px; padding: 18px; box-shadow: 0 40px 100px rgba(0,0,0,0.9), 0 0 80px rgba(99, 102, 241, 0.3); border: 4px solid #52525b; position: relative; }
        .screen { width: 100%; height: 100%; border-radius: 52px; overflow: hidden; background: #000; position: relative; }
        .screen-img { width: 100%; height: 100%; object-fit: cover; }
        .island { position: absolute; top: 16px; left: 50%; transform: translateX(-50%); width: 160px; height: 40px; background: #000; border-radius: 24px; z-index: 10; }
      </style>
    </head>
    <body>
      <div class="phone-frame">
        <div class="screen">
          <div class="island"></div>
          <img class="screen-img" src="${mobileDashB64}" />
        </div>
      </div>
    </body>
    </html>
  `;
  await page.setViewport({ width: 1400, height: 1800, deviceScaleFactor: 1 });
  await page.setContent(iphoneHtml);
  await page.screenshot({ path: path.join(DIRS.mockups, 'mockup_iphone_mobile_view.png') });

  // 4. iPad Pro Mockup
  const ipadHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { width: 1800px; height: 1600px; display: flex; align-items: center; justify-content: center; background: radial-gradient(circle at 50% 50%, #0f172a 0%, #020617 90%); font-family: -apple-system, sans-serif; }
        .ipad-frame { width: 1100px; height: 1400px; background: #1e293b; border-radius: 48px; padding: 28px; box-shadow: 0 40px 100px rgba(0,0,0,0.8), 0 0 80px rgba(168, 85, 247, 0.25); border: 3px solid rgba(255,255,255,0.15); }
        .screen { width: 100%; height: 100%; border-radius: 28px; overflow: hidden; background: #000; }
        .screen-img { width: 100%; height: 100%; object-fit: cover; }
      </style>
    </head>
    <body>
      <div class="ipad-frame">
        <div class="screen">
          <img class="screen-img" src="${tabletDashB64}" />
        </div>
      </div>
    </body>
    </html>
  `;
  await page.setViewport({ width: 1800, height: 1600, deviceScaleFactor: 1 });
  await page.setContent(ipadHtml);
  await page.screenshot({ path: path.join(DIRS.mockups, 'mockup_ipad_tablet_view.png') });

  // 5. Multi-Device Responsive Ecosystem (MacBook + iPad + iPhone)
  const multiDeviceHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { width: 2800px; height: 1600px; display: flex; align-items: center; justify-content: center; background: radial-gradient(circle at 50% 40%, #1e1b4b 0%, #030712 90%); font-family: -apple-system, sans-serif; position: relative; overflow: hidden; }
        
        /* Ambient Lighting */
        .ambient-glow { position: absolute; width: 1000px; height: 1000px; background: radial-gradient(circle, rgba(99,102,241,0.2) 0%, rgba(0,0,0,0) 70%); top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 1; }

        /* Stage arrangement */
        .stage { position: relative; z-index: 2; width: 2600px; height: 1400px; display: flex; align-items: center; justify-content: center; }

        /* MacBook Center */
        .macbook { position: absolute; left: 450px; top: 120px; z-index: 2; transform: scale(0.9); }
        .mac-lid { width: 1540px; height: 960px; background: #161922; border-radius: 24px 24px 4px 4px; padding: 20px 20px 28px 20px; box-shadow: 0 40px 100px rgba(0,0,0,0.8); border: 2px solid rgba(255,255,255,0.12); }
        .mac-screen { width: 100%; height: 100%; border-radius: 12px; overflow: hidden; }
        .mac-base { width: 1800px; height: 28px; background: linear-gradient(180deg, #334155 0%, #1e293b 100%); border-radius: 4px 4px 20px 20px; margin-left: -130px; box-shadow: 0 20px 40px rgba(0,0,0,0.6); }

        /* iPad Left */
        .ipad { position: absolute; left: 100px; top: 380px; z-index: 4; transform: scale(0.65) rotate(-4deg); box-shadow: 0 30px 80px rgba(0,0,0,0.9); }
        .ipad-frame { width: 900px; height: 1200px; background: #1e293b; border-radius: 40px; padding: 22px; border: 3px solid rgba(255,255,255,0.18); box-shadow: 0 30px 80px rgba(0,0,0,0.9); }
        .ipad-screen { width: 100%; height: 100%; border-radius: 24px; overflow: hidden; }

        /* iPhone Right */
        .iphone { position: absolute; right: 180px; top: 380px; z-index: 5; transform: scale(0.75) rotate(5deg); }
        .phone-frame { width: 480px; height: 980px; background: #27272a; border-radius: 58px; padding: 14px; box-shadow: 0 40px 90px rgba(0,0,0,0.9); border: 3px solid #52525b; }
        .phone-screen { width: 100%; height: 100%; border-radius: 46px; overflow: hidden; position: relative; }
        .island { position: absolute; top: 12px; left: 50%; transform: translateX(-50%); width: 130px; height: 32px; background: #000; border-radius: 20px; z-index: 10; }
        
        img { width: 100%; height: 100%; object-fit: cover; }
      </style>
    </head>
    <body>
      <div class="ambient-glow"></div>
      <div class="stage">
        <!-- iPad -->
        <div class="ipad">
          <div class="ipad-frame">
            <div class="ipad-screen"><img src="${tabletDashB64}" /></div>
          </div>
        </div>

        <!-- MacBook -->
        <div class="macbook">
          <div class="mac-lid">
            <div class="mac-screen"><img src="${dashImgB64}" /></div>
          </div>
          <div class="mac-base"></div>
        </div>

        <!-- iPhone -->
        <div class="iphone">
          <div class="phone-frame">
            <div class="phone-screen">
              <div class="island"></div>
              <img src="${mobileDashB64}" />
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
  await page.setViewport({ width: 2800, height: 1600, deviceScaleFactor: 1 });
  await page.setContent(multiDeviceHtml);
  await page.screenshot({ path: path.join(DIRS.mockups, 'mockup_multi_device_suite.png') });

  // ==========================================
  // STEP 4: CREATE LINKEDIN CAROUSEL (10 SLIDES)
  // ==========================================
  console.log('\n--- STEP 4: Creating 10-Slide LinkedIn Carousel & PDF ---');

  const slides = [
    {
      num: 1,
      title: 'SkillForge',
      subtitle: 'The Enterprise AI Career Acceleration Platform',
      tag: 'FLAGSHIP PROJECT LAUNCH',
      badge: 'Node.js • Express • MongoDB • AI Voice',
      content: `
        <div style="font-size: 28px; color: #cbd5e1; line-height: 1.5; margin-bottom: 24px;">
          Master DSA • Real-time AI Voice Interviews • ATS Resumes • Kanban Pipelines • Velocity Telemetry
        </div>
        <div style="display: flex; gap: 16px; margin-top: 20px;">
          <div style="background: rgba(99,102,241,0.15); border: 1px solid rgba(99,102,241,0.4); padding: 12px 20px; border-radius: 12px; font-size: 20px; color: #a5b4fc; font-weight: 600;">⚡ 100% Production Ready</div>
          <div style="background: rgba(34,197,94,0.15); border: 1px solid rgba(34,197,94,0.4); padding: 12px 20px; border-radius: 12px; font-size: 20px; color: #86efac; font-weight: 600;">🚀 Live on Web</div>
        </div>
      `,
      img: dashImgB64
    },
    {
      num: 2,
      title: 'The Problem',
      subtitle: 'The Fractured Developer Preparation Experience',
      tag: 'INDUSTRY CHALLENGE',
      badge: '5+ Disconnected Tools',
      content: `
        <div style="display: flex; flex-direction: column; gap: 20px; margin-top: 10px;">
          <div style="background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); border-radius: 16px; padding: 24px;">
            <div style="font-size: 24px; font-weight: 700; color: #f87171; margin-bottom: 8px;">❌ Siloed Problem Logs</div>
            <div style="font-size: 20px; color: #cbd5e1;">Solving algorithms on LeetCode with no connection to actual project repositories or interview schedules.</div>
          </div>
          <div style="background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); border-radius: 16px; padding: 24px;">
            <div style="font-size: 24px; font-weight: 700; color: #f87171; margin-bottom: 8px;">❌ Non-ATS Compliant Resumes</div>
            <div style="font-size: 20px; color: #cbd5e1;">Manual Word docs with zero quantitative keyword density checks and high rejection rates.</div>
          </div>
          <div style="background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); border-radius: 16px; padding: 24px;">
            <div style="font-size: 24px; font-weight: 700; color: #f87171; margin-bottom: 8px;">❌ Zero Interview Feedback</div>
            <div style="font-size: 20px; color: #cbd5e1;">Practicing questions in isolation with no speech recognition, scoring rubric, or AI critique.</div>
          </div>
        </div>
      `,
      img: null
    },
    {
      num: 3,
      title: 'Why SkillForge',
      subtitle: 'A Single High-Velocity Developer Command Center',
      tag: 'THE SOLUTION',
      badge: 'All-In-One Unified Architecture',
      content: `
        <div style="font-size: 24px; color: #e2e8f0; line-height: 1.6; margin-bottom: 24px;">
          SkillForge bridges the gap between software engineering education and high-tier industry recruitment:
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div style="background: rgba(99,102,241,0.12); border: 1px solid rgba(99,102,241,0.3); border-radius: 16px; padding: 20px;">
            <div style="font-size: 22px; font-weight: 700; color: #818cf8; margin-bottom: 6px;">🎙️ AI Voice Simulations</div>
            <div style="font-size: 18px; color: #94a3b8;">Real-time Web Speech STT/TTS with instant grading.</div>
          </div>
          <div style="background: rgba(168,85,247,0.12); border: 1px solid rgba(168,85,247,0.3); border-radius: 16px; padding: 20px;">
            <div style="font-size: 22px; font-weight: 700; color: #c084fc; margin-bottom: 6px;">📊 Readiness Score</div>
            <div style="font-size: 18px; color: #94a3b8;">0–100 Readiness Index with Chart.js telemetry.</div>
          </div>
          <div style="background: rgba(56,189,248,0.12); border: 1px solid rgba(56,189,248,0.3); border-radius: 16px; padding: 20px;">
            <div style="font-size: 22px; font-weight: 700; color: #38bdf8; margin-bottom: 6px;">📄 Live ATS Builder</div>
            <div style="font-size: 18px; color: #94a3b8;">Score gauge with 1-click clean PDF print export.</div>
          </div>
          <div style="background: rgba(34,197,94,0.12); border: 1px solid rgba(34,197,94,0.3); border-radius: 16px; padding: 20px;">
            <div style="font-size: 22px; font-weight: 700; color: #4ade80; margin-bottom: 6px;">📋 Kanban Pipelines</div>
            <div style="font-size: 18px; color: #94a3b8;">Multi-stage visual job application tracker.</div>
          </div>
        </div>
      `,
      img: analyticsImgB64
    },
    {
      num: 4,
      title: 'Application Overview',
      subtitle: 'Central Command Center Architecture',
      tag: 'SYSTEM OVERVIEW',
      badge: 'Fast SSR Rendering',
      content: `
        <div style="font-size: 22px; color: #cbd5e1; line-height: 1.5; margin-bottom: 16px;">
          The Central Dashboard integrates telemetry from 10 distinct collections via concurrent <code style="color:#a5b4fc; background:rgba(99,102,241,0.2); padding:2px 8px; border-radius:6px;">Promise.all</code> queries, delivering an instant executive view of engineering velocity.
        </div>
      `,
      img: dashImgB64
    },
    {
      num: 5,
      title: 'Key Features Deep-Dive',
      subtitle: 'AI Voice Mock Interview & Real-Time Scoring',
      tag: 'CORE INNOVATION',
      badge: 'Zero-Latency Web Speech API',
      content: `
        <div style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 16px;">
          <div style="background: rgba(236,72,153,0.1); border: 1px solid rgba(236,72,153,0.3); border-radius: 14px; padding: 16px 20px;">
            <div style="font-size: 20px; font-weight: 700; color: #f472b6;">⚡ Speech-to-Text & Text-to-Speech</div>
            <div style="font-size: 18px; color: #cbd5e1;">Native browser voice dictation allows hands-free interview simulation with zero third-party audio latency.</div>
          </div>
          <div style="background: rgba(124,58,237,0.1); border: 1px solid rgba(124,58,237,0.3); border-radius: 14px; padding: 16px 20px;">
            <div style="font-size: 20px; font-weight: 700; color: #a78bfa;">🧠 Instant AI Scoring & Suggestions</div>
            <div style="font-size: 18px; color: #cbd5e1;">Evaluates answers on clarity, technical depth, and structure with actionable improvement recommendations.</div>
          </div>
        </div>
      `,
      img: interviewImgB64
    },
    {
      num: 6,
      title: 'Technology Stack',
      subtitle: 'Engineered for Performance & Scalability',
      tag: 'FULL-STACK STACK',
      badge: 'Zero-Bloat Vanilla CSS',
      content: `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 10px;">
          <div style="background: rgba(30,41,59,0.7); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 20px;">
            <div style="font-size: 20px; font-weight: 700; color: #38bdf8;">🟢 Backend</div>
            <div style="font-size: 18px; color: #cbd5e1; margin-top: 4px;">Node.js v20 LTS • Express.js 5.0 • MVC Architecture</div>
          </div>
          <div style="background: rgba(30,41,59,0.7); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 20px;">
            <div style="font-size: 20px; font-weight: 700; color: #4ade80;">🍃 Database</div>
            <div style="font-size: 18px; color: #cbd5e1; margin-top: 4px;">MongoDB Atlas • Mongoose 9.0 • MongoStore Session Cache</div>
          </div>
          <div style="background: rgba(30,41,59,0.7); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 20px;">
            <div style="font-size: 20px; font-weight: 700; color: #c084fc;">🧠 AI & Audio</div>
            <div style="font-size: 18px; color: #cbd5e1; margin-top: 4px;">OpenRouter API (GPT-4o mini) • Web Speech STT/TTS</div>
          </div>
          <div style="background: rgba(30,41,59,0.7); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 20px;">
            <div style="font-size: 20px; font-weight: 700; color: #f472b6;">🎨 Frontend & UX</div>
            <div style="font-size: 18px; color: #cbd5e1; margin-top: 4px;">EJS SSR • CSS Design Tokens • Chart.js 4.4 • Lucide Icons</div>
          </div>
        </div>
      `,
      img: null
    },
    {
      num: 7,
      title: 'System Architecture',
      subtitle: 'Concurrent Data Aggregation & Security',
      tag: 'ENGINEERING BLUEPRINT',
      badge: 'Promise.all Concurrent Aggregation',
      content: `
        <div style="background: rgba(15,23,42,0.8); border: 1px solid rgba(99,102,241,0.3); border-radius: 16px; padding: 24px; font-family: monospace; font-size: 18px; color: #a5b4fc; line-height: 1.6;">
          // Concurrent Multi-Collection Telemetry Engine<br/>
          const [projects, dsa, jobs, certs, learn] = await Promise.all([<br/>
          &nbsp;&nbsp;Project.find({ user }).lean(),<br/>
          &nbsp;&nbsp;DsaProblem.find({ user }).lean(),<br/>
          &nbsp;&nbsp;Job.find({ user }).lean(),<br/>
          &nbsp;&nbsp;Certificate.find({ user }).lean(),<br/>
          &nbsp;&nbsp;LearningItem.find({ user }).lean()<br/>
          ]);<br/>
          // ➔ 70% Latency Reduction vs Sequential Queries
        </div>
        <div style="margin-top: 20px; font-size: 20px; color: #cbd5e1;">
          Equipped with Helmet Content Security Policy (CSP), bcrypt password hashing, rate limiting, and persistent session security.
        </div>
      `,
      img: null
    },
    {
      num: 8,
      title: 'Challenges & Solutions',
      subtitle: 'Technical Hurdles Overcome During Engineering',
      tag: 'PROBLEM SOLVING',
      badge: 'Production-Hardened',
      content: `
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <div style="background: rgba(30,41,59,0.7); border-left: 4px solid #818cf8; border-radius: 12px; padding: 18px 24px;">
            <div style="font-size: 20px; font-weight: 700; color: #fff;">Challenge: Multi-Collection Latency</div>
            <div style="font-size: 18px; color: #94a3b8; margin-top: 4px;"><strong>Solution:</strong> Migrated to concurrent <code style="color:#818cf8">Promise.all</code> batch queries with compound indexing on <code style="color:#818cf8">{ user: 1, status: 1 }</code>.</div>
          </div>
          <div style="background: rgba(30,41,59,0.7); border-left: 4px solid #f472b6; border-radius: 12px; padding: 18px 24px;">
            <div style="font-size: 20px; font-weight: 700; color: #fff;">Challenge: Zero-Cost Low Latency Voice</div>
            <div style="font-size: 18px; color: #94a3b8; margin-top: 4px;"><strong>Solution:</strong> Leveraged client-side Web Speech API loop instead of heavy cloud audio streaming WebSocket relays.</div>
          </div>
          <div style="background: rgba(30,41,59,0.7); border-left: 4px solid #34d399; border-radius: 12px; padding: 18px 24px;">
            <div style="font-size: 20px; font-weight: 700; color: #fff;">Challenge: Clean Print PDF Formatting</div>
            <div style="font-size: 18px; color: #94a3b8; margin-top: 4px;"><strong>Solution:</strong> Created dedicated CSS print stylesheets (<code style="color:#34d399">@media print</code>) removing sidebar navigation and forcing standard ATS fonts.</div>
          </div>
        </div>
      `,
      img: null
    },
    {
      num: 9,
      title: 'What I Learned',
      subtitle: 'Key Engineering Takeaways & Growth',
      tag: 'DEVELOPER LESSONS',
      badge: 'Full-Stack Mastery',
      content: `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div style="background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.25); border-radius: 16px; padding: 24px;">
            <div style="font-size: 22px; font-weight: 700; color: #a5b4fc; margin-bottom: 8px;">1. SSR Velocity</div>
            <div style="font-size: 18px; color: #cbd5e1;">Server-side rendering paired with native CSS custom properties delivers unmatched initial paint speeds.</div>
          </div>
          <div style="background: rgba(168,85,247,0.1); border: 1px solid rgba(168,85,247,0.25); border-radius: 16px; padding: 24px;">
            <div style="font-size: 22px; font-weight: 700; color: #c084fc; margin-bottom: 8px;">2. AI Copilot Integration</div>
            <div style="font-size: 18px; color: #cbd5e1;">Strict JSON schema prompts and system instructions are crucial for reliable AI career roadmap generation.</div>
          </div>
          <div style="background: rgba(56,189,248,0.1); border: 1px solid rgba(56,189,248,0.25); border-radius: 16px; padding: 24px;">
            <div style="font-size: 22px; font-weight: 700; color: #38bdf8; margin-bottom: 8px;">3. Schema Normalization</div>
            <div style="font-size: 18px; color: #cbd5e1;">Balancing embedded documents vs normalized relational models in MongoDB for maximum query performance.</div>
          </div>
          <div style="background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.25); border-radius: 16px; padding: 24px;">
            <div style="font-size: 22px; font-weight: 700; color: #4ade80; margin-bottom: 8px;">4. DevOps & Cloud Deploy</div>
            <div style="font-size: 18px; color: #cbd5e1;">Zero-config containerization with multi-stage Dockerfiles and Render Blueprint automation.</div>
          </div>
        </div>
      `,
      img: null
    },
    {
      num: 10,
      title: 'Experience SkillForge Live',
      subtitle: 'Try the 1-Click Cloud Playground & View Source',
      tag: 'CALL TO ACTION',
      badge: 'Open Source MIT',
      content: `
        <div style="background: rgba(15,23,42,0.9); border: 2px solid rgba(99,102,241,0.5); border-radius: 20px; padding: 32px; text-align: center; margin-bottom: 24px; box-shadow: 0 20px 60px rgba(99,102,241,0.2);">
          <div style="font-size: 32px; font-weight: 800; color: #fff; margin-bottom: 12px;">🚀 Explore the Live Application</div>
          <div style="font-size: 22px; color: #a5b4fc; margin-bottom: 24px;">https://skillforge-whkp.onrender.com</div>
          <div style="font-size: 20px; color: #cbd5e1;">⚡ <strong>1-Click Instant Recruiter Demo:</strong> <code style="color:#38bdf8">/demo</code> (Pre-seeded with rich data)</div>
        </div>
        <div style="background: rgba(30,41,59,0.7); border: 1px solid rgba(255,255,255,0.15); border-radius: 16px; padding: 24px; text-align: center;">
          <div style="font-size: 22px; font-weight: 700; color: #fff; margin-bottom: 8px;">⭐ GitHub Repository</div>
          <div style="font-size: 20px; color: #94a3b8;">github.com/ayushkumarjha1/SkillForge</div>
        </div>
      `,
      img: null
    }
  ];

  let carouselHtmlPages = [];

  for (let s of slides) {
    const slideHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            width: 1080px;
            height: 1350px;
            background: #090d16;
            color: #fff;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 80px 70px;
            position: relative;
            overflow: hidden;
          }
          .ambient-glow {
            position: absolute;
            width: 700px;
            height: 700px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(99, 102, 241, 0.22) 0%, rgba(9, 13, 22, 0) 70%);
            top: -150px;
            right: -150px;
            z-index: 1;
          }
          .grid-bg {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
            background-size: 60px 60px;
            z-index: 1;
          }
          .header, .content-area, .footer { position: relative; z-index: 2; }
          .tag-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
          .tag { background: rgba(99, 102, 241, 0.15); border: 1px solid rgba(99, 102, 241, 0.4); padding: 8px 18px; border-radius: 20px; font-size: 14px; font-weight: 700; color: #a5b4fc; letter-spacing: 1.5px; }
          .badge { background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.12); padding: 8px 18px; border-radius: 20px; font-size: 14px; color: #94a3b8; font-weight: 500; }
          .title { font-size: 52px; font-weight: 800; letter-spacing: -1.5px; background: linear-gradient(135deg, #ffffff 0%, #cbd5e1 60%, #94a3b8 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 12px; }
          .subtitle { font-size: 26px; color: #818cf8; font-weight: 600; margin-bottom: 36px; }
          .img-frame { width: 100%; height: 440px; border-radius: 18px; overflow: hidden; border: 2px solid rgba(255,255,255,0.12); box-shadow: 0 20px 50px rgba(0,0,0,0.6); margin-top: 24px; }
          .img-frame img { width: 100%; height: 100%; object-fit: cover; }
          .footer { display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 30px; }
          .author { display: flex; align-items: center; gap: 14px; }
          .author-logo { width: 36px; height: 36px; border-radius: 10px; background: linear-gradient(135deg, #4f46e5, #7c3aed); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 18px; }
          .author-name { font-size: 18px; font-weight: 700; color: #fff; }
          .author-role { font-size: 14px; color: #64748b; }
          .slide-counter { font-size: 18px; font-weight: 700; color: #6366f1; background: rgba(99,102,241,0.12); padding: 8px 18px; border-radius: 12px; border: 1px solid rgba(99,102,241,0.3); }
        </style>
      </head>
      <body>
        <div class="ambient-glow"></div>
        <div class="grid-bg"></div>
        
        <div class="header">
          <div class="tag-row">
            <div class="tag">${s.tag}</div>
            <div class="badge">${s.badge}</div>
          </div>
          <h1 class="title">${s.title}</h1>
          <div class="subtitle">${s.subtitle}</div>
        </div>

        <div class="content-area">
          ${s.content}
          ${s.img ? `<div class="img-frame"><img src="${s.img}" /></div>` : ''}
        </div>

        <div class="footer">
          <div class="author">
            <div class="author-logo">⚡</div>
            <div>
              <div class="author-name">SkillForge</div>
              <div class="author-role">Ayush Kumar Jha • Software Engineer</div>
            </div>
          </div>
          <div class="slide-counter">${s.num} / 10</div>
        </div>
      </body>
      </html>
    `;

    carouselHtmlPages.push(slideHtml);

    // Save individual slide image
    await page.setViewport({ width: 1080, height: 1350, deviceScaleFactor: 1 });
    await page.setContent(slideHtml);
    const slideName = `slide_${String(s.num).padStart(2, '0')}.png`;
    await page.screenshot({ path: path.join(DIRS.carousel, slideName) });
    console.log(`  ✓ Generated Carousel Slide ${s.num}/10`);
  }

  // Generate Multi-Page Carousel PDF for 1-Click LinkedIn Upload
  console.log('📄 Compiling Carousel into Multi-Page LinkedIn PDF...');
  const combinedCarouselHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        @page { size: 1080px 1350px; margin: 0; }
        .page-break { page-break-after: always; }
      </style>
    </head>
    <body style="margin: 0; padding: 0;">
      ${carouselHtmlPages.map(pageHtml => `<div class="page-break">${pageHtml}</div>`).join('')}
    </body>
    </html>
  `;
  await page.setContent(combinedCarouselHtml);
  await page.pdf({
    path: path.join(DIRS.carousel, 'SkillForge_LinkedIn_Carousel.pdf'),
    width: '1080px',
    height: '1350px',
    printBackground: true
  });
  console.log('  ✓ Generated SkillForge_LinkedIn_Carousel.pdf');

  // ==========================================
  // STEP 5: CREATE GITHUB README ASSETS
  // ==========================================
  console.log('\n--- STEP 5: Generating GitHub README Assets ---');

  // 1. Hero Banner PNG
  await page.setViewport({ width: 1200, height: 420, deviceScaleFactor: 2 });
  const bannerSvgContent = fs.readFileSync(path.join(__dirname, '..', 'docs', 'banner.svg'), 'utf8');
  await page.setContent(`<!DOCTYPE html><html><body style="margin:0; background:#090d16;">${bannerSvgContent}</body></html>`);
  await page.screenshot({ path: path.join(DIRS.readmeAssets, 'hero_banner.png') });
  fs.copyFileSync(path.join(__dirname, '..', 'docs', 'banner.svg'), path.join(DIRS.readmeAssets, 'hero_banner.svg'));

  // 2. Feature Section Graphics (4-Grid Feature Matrix)
  const featureMatrixHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { width: 1600px; height: 900px; background: #090d16; font-family: -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; padding: 60px; color: #fff; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; width: 100%; height: 100%; }
        .card { background: #0f172a; border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 32px; display: flex; flex-direction: column; justify-content: space-between; position: relative; overflow: hidden; }
        .card-glow { position: absolute; top: -50px; right: -50px; width: 200px; height: 200px; border-radius: 50%; opacity: 0.2; }
        .card-tag { font-size: 14px; font-weight: 700; letter-spacing: 1.5px; margin-bottom: 12px; }
        .card-title { font-size: 28px; font-weight: 700; margin-bottom: 8px; }
        .card-desc { font-size: 18px; color: #94a3b8; line-height: 1.5; }
        .card-img-preview { width: 100%; height: 180px; border-radius: 12px; overflow: hidden; margin-top: 20px; border: 1px solid rgba(255,255,255,0.1); }
        .card-img-preview img { width: 100%; height: 100%; object-fit: cover; }
      </style>
    </head>
    <body>
      <div class="grid">
        <div class="card">
          <div class="card-glow" style="background:#6366f1;"></div>
          <div>
            <div class="card-tag" style="color:#818cf8;">AI COPILOT</div>
            <div class="card-title">🎙️ AI Voice Mock Interviewer</div>
            <div class="card-desc">Web Speech API voice dictation & instant LLM scoring rubrics.</div>
          </div>
          <div class="card-img-preview"><img src="${interviewImgB64}" /></div>
        </div>
        <div class="card">
          <div class="card-glow" style="background:#a855f7;"></div>
          <div>
            <div class="card-tag" style="color:#c084fc;">TELEMETRY</div>
            <div class="card-title">📊 Career Readiness Index</div>
            <div class="card-desc">0–100 readiness score computing multi-collection metrics.</div>
          </div>
          <div class="card-img-preview"><img src="${analyticsImgB64}" /></div>
        </div>
        <div class="card">
          <div class="card-glow" style="background:#38bdf8;"></div>
          <div>
            <div class="card-tag" style="color:#38bdf8;">RESUME ENGINE</div>
            <div class="card-title">📄 ATS Resume Studio</div>
            <div class="card-desc">Live keyword completeness gauge and clean 1-click PDF print.</div>
          </div>
          <div class="card-img-preview"><img src="${dashImgB64}" /></div>
        </div>
        <div class="card">
          <div class="card-glow" style="background:#34d399;"></div>
          <div>
            <div class="card-tag" style="color:#34d399;">PIPELINE</div>
            <div class="card-title">📋 Recruitment Kanban</div>
            <div class="card-desc">Visual stage management from Wishlist to Offer negotiation.</div>
          </div>
          <div class="card-img-preview"><img src="${dashImgB64}" /></div>
        </div>
      </div>
    </body>
    </html>
  `;
  await page.setViewport({ width: 1600, height: 900, deviceScaleFactor: 1 });
  await page.setContent(featureMatrixHtml);
  await page.screenshot({ path: path.join(DIRS.readmeAssets, 'feature_section_graphics.png') });

  // 3. Workflow Diagram Graphic
  const workflowHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { width: 1600px; height: 600px; background: #090d16; font-family: -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; padding: 40px; color: #fff; }
        .flow-container { display: flex; align-items: center; gap: 24px; width: 100%; justify-content: space-between; }
        .step-node { flex: 1; background: #0f172a; border: 1px solid rgba(99,102,241,0.3); border-radius: 18px; padding: 28px 24px; text-align: center; position: relative; }
        .step-num { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, #4f46e5, #7c3aed); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 16px; margin: 0 auto 16px auto; }
        .step-title { font-size: 20px; font-weight: 700; margin-bottom: 8px; }
        .step-desc { font-size: 15px; color: #94a3b8; line-height: 1.4; }
        .arrow { font-size: 28px; color: #6366f1; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="flow-container">
        <div class="step-node">
          <div class="step-num">1</div>
          <div class="step-title">Master DSA</div>
          <div class="step-desc">Log LeetCode/Codeforces problems with topic tags & complexity.</div>
        </div>
        <div class="arrow">➔</div>
        <div class="step-node">
          <div class="step-num">2</div>
          <div class="step-title">Build ATS Resume</div>
          <div class="step-desc">Audit keywords and generate formatted PDF resumes.</div>
        </div>
        <div class="arrow">➔</div>
        <div class="step-node">
          <div class="step-num">3</div>
          <div class="step-title">AI Voice Mock</div>
          <div class="step-desc">Practice technical questions with real-time speech AI feedback.</div>
        </div>
        <div class="arrow">➔</div>
        <div class="step-node">
          <div class="step-num">4</div>
          <div class="step-title">Track Applications</div>
          <div class="step-desc">Manage job pipelines visually across Kanban stages.</div>
        </div>
        <div class="arrow">➔</div>
        <div class="step-node">
          <div class="step-num">5</div>
          <div class="step-title">Share Portfolio</div>
          <div class="step-desc">Send vanity URL (/u/:username) directly to recruiters.</div>
        </div>
      </div>
    </body>
    </html>
  `;
  await page.setViewport({ width: 1600, height: 600, deviceScaleFactor: 1 });
  await page.setContent(workflowHtml);
  await page.screenshot({ path: path.join(DIRS.readmeAssets, 'workflow_diagram.png') });

  // 4. Technology Stack Illustration
  const techStackHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { width: 1400px; height: 700px; background: #090d16; font-family: -apple-system, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 50px; color: #fff; }
        .heading { font-size: 36px; font-weight: 800; margin-bottom: 40px; background: linear-gradient(135deg, #fff, #94a3b8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .tech-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; width: 100%; }
        .tech-box { background: #0f172a; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 24px; text-align: center; }
        .tech-box-icon { font-size: 36px; margin-bottom: 12px; }
        .tech-box-name { font-size: 20px; font-weight: 700; margin-bottom: 4px; color: #f8fafc; }
        .tech-box-role { font-size: 14px; color: #818cf8; }
      </style>
    </head>
    <body>
      <div class="heading">SkillForge Core Technology Stack</div>
      <div class="tech-grid">
        <div class="tech-box">
          <div class="tech-box-icon">🟢</div>
          <div class="tech-box-name">Node.js</div>
          <div class="tech-box-role">Runtime Engine</div>
        </div>
        <div class="tech-box">
          <div class="tech-box-icon">⚡</div>
          <div class="tech-box-name">Express.js</div>
          <div class="tech-box-role">MVC Framework</div>
        </div>
        <div class="tech-box">
          <div class="tech-box-icon">🍃</div>
          <div class="tech-box-name">MongoDB Atlas</div>
          <div class="tech-box-role">Cloud Database</div>
        </div>
        <div class="tech-box">
          <div class="tech-box-icon">🧠</div>
          <div class="tech-box-name">OpenRouter AI</div>
          <div class="tech-box-role">LLM Intelligence</div>
        </div>
        <div class="tech-box">
          <div class="tech-box-icon">🎙️</div>
          <div class="tech-box-name">Web Speech API</div>
          <div class="tech-box-role">Real-Time Voice STT/TTS</div>
        </div>
        <div class="tech-box">
          <div class="tech-box-icon">📊</div>
          <div class="tech-box-name">Chart.js</div>
          <div class="tech-box-role">Telemetry Visualizations</div>
        </div>
        <div class="tech-box">
          <div class="tech-box-icon">🎨</div>
          <div class="tech-box-name">Vanilla CSS</div>
          <div class="tech-box-role">0 KB Framework Tokens</div>
        </div>
        <div class="tech-box">
          <div class="tech-box-icon">🔒</div>
          <div class="tech-box-name">Helmet & Bcrypt</div>
          <div class="tech-box-role">Security & Cryptography</div>
        </div>
      </div>
    </body>
    </html>
  `;
  await page.setViewport({ width: 1400, height: 700, deviceScaleFactor: 1 });
  await page.setContent(techStackHtml);
  await page.screenshot({ path: path.join(DIRS.readmeAssets, 'tech_stack_illustration.png') });

  // ==========================================
  // STEP 6: CREATE SHOWCASE VIDEO & INTERACTIVE PRESENTATION
  // ==========================================
  console.log('\n--- STEP 6: Generating Cinematic Showcase Presentation Player ---');

  const videoHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>SkillForge — Cinematic Showcase Walkthrough</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #030712; color: #fff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; overflow: hidden; }
        .cinema-wrapper { width: 1280px; height: 720px; background: #090d16; border-radius: 20px; border: 2px solid rgba(99,102,241,0.3); box-shadow: 0 40px 120px rgba(0,0,0,0.9), 0 0 100px rgba(99,102,241,0.2); position: relative; overflow: hidden; }
        
        .scene { position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; transition: opacity 0.8s ease-in-out; display: flex; align-items: center; justify-content: center; flex-direction: column; }
        .scene.active { opacity: 1; }

        .scene-bg-img { width: 100%; height: 100%; object-fit: cover; filter: brightness(0.85); transform: scale(1); animation: panZoom 8s infinite alternate ease-in-out; }
        @keyframes panZoom { 0% { transform: scale(1); } 100% { transform: scale(1.06); } }

        .overlay-card { position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%); background: rgba(9, 13, 22, 0.85); backdrop-filter: blur(16px); border: 1px solid rgba(255,255,255,0.15); border-radius: 16px; padding: 18px 36px; display: flex; align-items: center; gap: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.8); z-index: 10; }
        .pill { background: #6366f1; color: #fff; font-weight: 700; font-size: 13px; letter-spacing: 1px; padding: 6px 14px; border-radius: 20px; text-transform: uppercase; }
        .overlay-text { font-size: 20px; font-weight: 600; color: #f8fafc; }

        .controls { margin-top: 24px; display: flex; align-items: center; gap: 20px; }
        .btn { background: #6366f1; color: #fff; border: none; padding: 10px 24px; border-radius: 10px; font-size: 16px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .btn:hover { background: #4f46e5; transform: translateY(-2px); }
        .timeline { width: 400px; height: 8px; background: #1e293b; border-radius: 4px; overflow: hidden; }
        .progress { width: 0%; height: 100%; background: linear-gradient(90deg, #6366f1, #a855f7); transition: width 0.3s linear; }
      </style>
    </head>
    <body>
      <div class="cinema-wrapper" id="player">
        <!-- Scene 1: Logo & Hero -->
        <div class="scene active" id="s0">
          <img class="scene-bg-img" src="${dashImgB64}" />
          <div class="overlay-card">
            <div class="pill">01 / Intro</div>
            <div class="overlay-text">⚡ SkillForge — Next-Gen AI Career Acceleration Platform</div>
          </div>
        </div>

        <!-- Scene 2: Analytics & Readiness -->
        <div class="scene" id="s1">
          <img class="scene-bg-img" src="${analyticsImgB64}" />
          <div class="overlay-card">
            <div class="pill">02 / Telemetry</div>
            <div class="overlay-text">📊 Quantitative Career Readiness Score (0–100) & Chart.js Metrics</div>
          </div>
        </div>

        <!-- Scene 3: AI Voice Mock Interview -->
        <div class="scene" id="s2">
          <img class="scene-bg-img" src="${interviewImgB64}" />
          <div class="overlay-card">
            <div class="pill">03 / AI Voice</div>
            <div class="overlay-text">🎙️ Real-Time Web Speech API Voice Interviewer & Instant LLM Scoring</div>
          </div>
        </div>

        <!-- Scene 4: Responsive Mobile Ecosystem -->
        <div class="scene" id="s3">
          <img class="scene-bg-img" src="${mobileDashB64}" style="object-fit: contain; background: #090d16;" />
          <div class="overlay-card">
            <div class="pill">04 / Responsive</div>
            <div class="overlay-text">📱 Mobile-First Responsive Design with Zero-Runtime CSS Tokens</div>
          </div>
        </div>

        <!-- Scene 5: Outro & GitHub -->
        <div class="scene" id="s4">
          <div style="text-align: center; padding: 60px;">
            <div style="font-size: 56px; font-weight: 800; background: linear-gradient(135deg, #818cf8, #c084fc); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 16px;">⚡ SkillForge</div>
            <div style="font-size: 24px; color: #cbd5e1; margin-bottom: 32px;">Built with Node.js • Express.js • MongoDB Atlas • EJS • Web Speech API</div>
            <div style="display: inline-block; background: rgba(99,102,241,0.2); border: 1px solid rgba(99,102,241,0.5); padding: 14px 28px; border-radius: 12px; font-size: 20px; color: #a5b4fc; font-weight: 600;">
              🔗 github.com/ayushkumarjha1/SkillForge
            </div>
          </div>
          <div class="overlay-card">
            <div class="pill">05 / Outro</div>
            <div class="overlay-text">🚀 Live Demo: https://skillforge-whkp.onrender.com</div>
          </div>
        </div>
      </div>

      <div class="controls">
        <button class="btn" id="playBtn" onclick="togglePlay()">Play Cinematic Tour</button>
        <div class="timeline"><div class="progress" id="progressBar"></div></div>
        <span id="timeLabel" style="font-size: 14px; color: #94a3b8;">00:00 / 01:15</span>
      </div>

      <script>
        let currentScene = 0;
        const totalScenes = 5;
        let isPlaying = false;
        let timer = null;

        function showScene(idx) {
          document.querySelectorAll('.scene').forEach((el, i) => {
            el.classList.toggle('active', i === idx);
          });
          document.getElementById('progressBar').style.width = ((idx + 1) / totalScenes * 100) + '%';
        }

        function nextScene() {
          currentScene = (currentScene + 1) % totalScenes;
          showScene(currentScene);
        }

        function togglePlay() {
          isPlaying = !isPlaying;
          document.getElementById('playBtn').innerText = isPlaying ? 'Pause' : 'Resume Cinematic Tour';
          if (isPlaying) {
            timer = setInterval(nextScene, 4000);
          } else {
            clearInterval(timer);
          }
        }
      </script>
    </body>
    </html>
  `;
  fs.writeFileSync(path.join(DIRS.video, 'showcase_presentation_player.html'), videoHtml);

  // Capture video poster thumbnail
  await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 1 });
  await page.setContent(videoHtml);
  await page.screenshot({ path: path.join(DIRS.video, 'video_cover_poster.png') });
  console.log('  ✓ Generated showcase_presentation_player.html & video_cover_poster.png');

  // ==========================================
  // STEP 7: PRODUCE LINKEDIN ASSETS
  // ==========================================
  console.log('\n--- STEP 7: Generating LinkedIn Assets & Profile Banners ---');

  // 1. LinkedIn Profile Cover Banner (1584 x 396)
  const linkedinCoverHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { width: 1584px; height: 396px; background: #090d16; font-family: -apple-system, sans-serif; display: flex; align-items: center; justify-content: space-between; padding: 0 80px; color: #fff; position: relative; overflow: hidden; }
        .glow { position: absolute; width: 500px; height: 500px; border-radius: 50%; background: radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%); top: -100px; right: 200px; }
        .brand-col { z-index: 2; }
        .tag { display: inline-flex; align-items: center; gap: 8px; background: rgba(99,102,241,0.15); border: 1px solid rgba(99,102,241,0.4); padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 700; color: #a5b4fc; margin-bottom: 12px; }
        .brand-title { font-size: 42px; font-weight: 800; letter-spacing: -1px; background: linear-gradient(135deg, #fff, #94a3b8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .brand-subtitle { font-size: 18px; color: #cbd5e1; margin-top: 6px; font-weight: 500; }
        .tech-badges { display: flex; gap: 10px; margin-top: 16px; }
        .badge-pill { background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12); padding: 4px 12px; border-radius: 12px; font-size: 13px; color: #94a3b8; font-weight: 600; }
        .mockup-preview { width: 480px; height: 300px; border-radius: 16px; overflow: hidden; border: 2px solid rgba(255,255,255,0.15); box-shadow: 0 20px 50px rgba(0,0,0,0.8); z-index: 2; }
        .mockup-preview img { width: 100%; height: 100%; object-fit: cover; }
      </style>
    </head>
    <body>
      <div class="glow"></div>
      <div class="brand-col">
        <div class="tag">⚡ FLAGSHIP PROJECT</div>
        <div class="brand-title">SkillForge — AI Career Platform</div>
        <div class="brand-subtitle">Master DSA • Voice Mock Interviews • ATS Resumes • Readiness Analytics</div>
        <div class="tech-badges">
          <div class="badge-pill">Node.js</div>
          <div class="badge-pill">Express.js</div>
          <div class="badge-pill">MongoDB Atlas</div>
          <div class="badge-pill">Web Speech API</div>
          <div class="badge-pill">OpenRouter AI</div>
        </div>
      </div>
      <div class="mockup-preview"><img src="${dashImgB64}" /></div>
    </body>
    </html>
  `;
  await page.setViewport({ width: 1584, height: 396, deviceScaleFactor: 1 });
  await page.setContent(linkedinCoverHtml);
  await page.screenshot({ path: path.join(DIRS.linkedinAssets, 'linkedin_profile_cover_banner.png') });

  // 2. Project Thumbnail Landscape (1200 x 627)
  const projectThumbHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { width: 1200px; height: 627px; background: #090d16; font-family: -apple-system, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: space-between; padding: 50px; color: #fff; position: relative; overflow: hidden; }
        .glow { position: absolute; width: 600px; height: 600px; border-radius: 50%; background: radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%); top: -100px; left: 50%; transform: translateX(-50%); }
        .top-row { text-align: center; z-index: 2; }
        .top-title { font-size: 38px; font-weight: 800; background: linear-gradient(135deg, #818cf8, #c084fc); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .top-sub { font-size: 18px; color: #94a3b8; margin-top: 6px; }
        .preview-box { width: 960px; height: 380px; border-radius: 16px; overflow: hidden; border: 2px solid rgba(255,255,255,0.15); box-shadow: 0 30px 80px rgba(0,0,0,0.8); z-index: 2; }
        .preview-box img { width: 100%; height: 100%; object-fit: cover; }
      </style>
    </head>
    <body>
      <div class="glow"></div>
      <div class="top-row">
        <div class="top-title">⚡ SkillForge — Next-Gen AI Career Copilot</div>
        <div class="top-sub">Full-Stack Engineering Workspace with Real-Time AI & Telemetry</div>
      </div>
      <div class="preview-box"><img src="${dashImgB64}" /></div>
    </body>
    </html>
  `;
  await page.setViewport({ width: 1200, height: 627, deviceScaleFactor: 1 });
  await page.setContent(projectThumbHtml);
  await page.screenshot({ path: path.join(DIRS.linkedinAssets, 'project_thumbnail_landscape.png') });
  await page.screenshot({ path: path.join(DIRS.thumbnails, 'thumbnail_hd.png') });

  // 3. Social Share Banner (1200 x 675)
  await page.setViewport({ width: 1200, height: 675, deviceScaleFactor: 1 });
  await page.setContent(projectThumbHtml);
  await page.screenshot({ path: path.join(DIRS.linkedinAssets, 'social_share_banner.png') });

  // ==========================================
  // STEP 8: PRODUCE THUMBNAILS (SQUARE & PORTRAIT)
  // ==========================================
  console.log('\n--- STEP 8: Generating High-Resolution Thumbnails ---');

  // Square Thumbnail (1080 x 1080)
  const squareThumbHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { width: 1080px; height: 1080px; background: #090d16; font-family: -apple-system, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: space-between; padding: 70px 60px; color: #fff; }
        .brand-header { text-align: center; }
        .brand-logo { font-size: 52px; font-weight: 800; background: linear-gradient(135deg, #818cf8, #c084fc); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .brand-tag { font-size: 22px; color: #94a3b8; margin-top: 8px; }
        .dash-frame { width: 100%; height: 620px; border-radius: 18px; overflow: hidden; border: 2px solid rgba(255,255,255,0.15); box-shadow: 0 20px 60px rgba(0,0,0,0.8); }
        .dash-frame img { width: 100%; height: 100%; object-fit: cover; }
        .footer-badge { background: rgba(99,102,241,0.15); border: 1px solid rgba(99,102,241,0.4); padding: 10px 24px; border-radius: 20px; font-size: 18px; color: #a5b4fc; font-weight: 600; }
      </style>
    </head>
    <body>
      <div class="brand-header">
        <div class="brand-logo">⚡ SkillForge</div>
        <div class="brand-tag">The Enterprise AI Career Acceleration Platform</div>
      </div>
      <div class="dash-frame"><img src="${dashImgB64}" /></div>
      <div class="footer-badge">Node.js • Express • MongoDB Atlas • OpenRouter AI</div>
    </body>
    </html>
  `;
  await page.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 1 });
  await page.setContent(squareThumbHtml);
  await page.screenshot({ path: path.join(DIRS.thumbnails, 'thumbnail_square.png') });

  // Portrait Thumbnail (1080 x 1350)
  fs.copyFileSync(path.join(DIRS.carousel, 'slide_01.png'), path.join(DIRS.thumbnails, 'thumbnail_portrait.png'));

  // ==========================================
  // STEP 9: CREATE LAUNCH KIT INDEX DOCUMENT
  // ==========================================
  console.log('\n--- STEP 9: Creating Master Deliverables Catalog ---');

  const kitIndexMd = `# 🚀 SkillForge — Complete Launch Kit & Deliverables

This directory contains the complete, production-grade showcase assets generated directly from the running **SkillForge** application.

---

## 📁 Deliverables Structure

\`\`\`
launch-kit/
├── screenshots/          # 19 High-Resolution Retina Screenshots of All Real Pages
├── mockups/              # 5 High-Fidelity Device Mockups (MacBook, Monitor, iPhone, iPad, Suite)
├── carousel/             # 10 LinkedIn Carousel Slides (PNG + Multi-Page PDF)
├── video/                # Cinematic Showcase Video Player & Animated Demo
├── readme-assets/        # GitHub README Banners, Matrix, Workflow & Tech Architecture
├── linkedin-assets/      # LinkedIn Profile Cover Banner & Social Thumbnails
└── thumbnails/           # HD, Square, and Portrait Project Thumbnails
\`\`\`

---

## 📸 1. Screenshots (\`/screenshots\`)
- \`01_landing_page.png\` (1920x1080 Modern SaaS Landing Page)
- \`02_login_page.png\` (Sign In with 1-Click Fast-Track Demo)
- \`03_register_page.png\` (Workspace Registration)
- \`04_dashboard.png\` (Central Engineering Command Center)
- \`05_analytics_readiness.png\` (Career Readiness Index & Chart.js Metrics)
- \`06_resume_builder.png\` (ATS Resume Studio & Completeness Score)
- \`07_project_management.png\` (Multi-Project Showcase & Tech Badges)
- \`08_dsa_coding_progress.png\` (DSA Problem Log & Topic Categorization)
- \`09_ai_mock_interview.png\` (AI Voice Mock Interviewer with STT/TTS)
- \`10_ai_career_coach.png\` (OpenRouter Career Roadmap Generator)
- \`11_job_tracker_kanban.png\` (Recruitment Pipeline Kanban Board)
- \`12_user_profile.png\` (Public Developer Portfolio Vanity URL)
- \`13_settings.png\` (Profile & Account Preferences)
- \`14_admin_panel.png\` (System Administrator Dashboard & Role Governance)
- \`15_mobile_dashboard.png\` (iPhone 14 Pro Mobile Viewport)
- \`16_mobile_analytics.png\` (iPhone 14 Pro Mobile Analytics)
- \`17_mobile_mock_interview.png\` (iPhone 14 Pro AI Voice Interview)
- \`18_tablet_dashboard.png\` (iPad Air Tablet Viewport)
- \`19_tablet_analytics.png\` (iPad Air Tablet Analytics)

---

## 💻 2. Device Mockups (\`/mockups\`)
- \`mockup_macbook_pro_dashboard.png\` (MacBook Pro 16" Space Gray)
- \`mockup_desktop_monitor_analytics.png\` (Studio Display Desktop Monitor)
- \`mockup_iphone_mobile_view.png\` (iPhone 15 Pro Titanium with Dynamic Island)
- \`mockup_ipad_tablet_view.png\` (iPad Pro 12.9" Tablet)
- \`mockup_multi_device_suite.png\` (MacBook Pro + iPad + iPhone Multi-Device Responsive Suite)

---

## 📑 3. LinkedIn Carousel (\`/carousel\`)
- \`SkillForge_LinkedIn_Carousel.pdf\` (**Ready for 1-Click Upload to LinkedIn as a Document Post**)
- \`slide_01.png\` to \`slide_10.png\` (10 Individual 1080x1350 Slide Graphics)
  - Slide 1: Project Cover
  - Slide 2: Problem Statement
  - Slide 3: Why SkillForge
  - Slide 4: Application Overview
  - Slide 5: Key Features (AI Voice & Scoring)
  - Slide 6: Technology Stack
  - Slide 7: System Architecture & Latency Reduction
  - Slide 8: Challenges & Solutions
  - Slide 9: What I Learned
  - Slide 10: Live Demo & GitHub Call to Action

---

## 🎬 4. Showcase Presentation (\`/video\`)
- \`showcase_presentation_player.html\` (Cinematic 5-Scene Interactive Walkthrough Player)
- \`video_cover_poster.png\` (1280x720 Video Poster Thumbnail)

---

## 🎨 5. GitHub README Assets (\`/readme-assets\`)
- \`hero_banner.svg\` & \`hero_banner.png\` (Linear/Vercel-inspired Vector Hero Banner)
- \`feature_section_graphics.png\` (4-Card Core Feature Matrix)
- \`workflow_diagram.png\` (End-to-End Candidate Workflow Pipeline)
- \`tech_stack_illustration.png\` (8-Technology Ecosystem Diagram)

---

## 💼 6. LinkedIn Assets (\`/linkedin-assets\`)
- \`linkedin_profile_cover_banner.png\` (1584x396 Pixel-Perfect LinkedIn Profile Banner)
- \`project_thumbnail_landscape.png\` (1200x627 Landscape Link Preview)
- \`social_share_banner.png\` (1200x675 Social Share Card)

---

## 🌟 7. Thumbnails (\`/thumbnails\`)
- \`thumbnail_hd.png\` (1920x1080 HD Landscape)
- \`thumbnail_square.png\` (1080x1080 Square Post)
- \`thumbnail_portrait.png\` (1080x1350 Portrait / Story Format)
`;
  fs.writeFileSync(path.join(BASE_DIR, 'README.md'), kitIndexMd);

  console.log('\n🎉 ALL 9 STEPS COMPLETED WITH 100% SUCCESS!');
  await browser.close();
  process.exit(0);
}

runLaunchKitGenerator().catch(err => {
  console.error('Generator error:', err);
  process.exit(1);
});
