// User Guide content for LaunchPadAI.
// Use {{appName}} as a placeholder — replaced at render time.

export const userGuideTopics = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: 'Sparkles',
    content: `# Welcome to {{appName}}

{{appName}} is your AI-powered undergraduate internship and early-career guidance system. A panel of specialized advisors gives you diverse perspectives on search strategy, resumes, interviews, application cadence, and networking.

## Your first steps
1. **Start a new chat** using the pencil icon next to the search bar
2. **Type a question** about internships, resumes, interviews, or your weekly apply plan
3. **Read multiple advisor responses** — each mentor brings a different lens
4. **Reply to a specific advisor** to go deeper on their angle

## Need help?
Return to this guide anytime via the **?** icon in the header.`,
  },
  {
    id: 'advisors',
    title: 'Your Advisors',
    icon: 'Rocket',
    content: `# Your Advisors

{{appName}} includes {{advisorCount}} specialized career personas, each focused on a different part of landing internships and early roles.

## Available advisors
{{advisorList}}

## Seeing who's available
Click the **advisors** dropdown in the top right of the chat to see the full panel.`,
  },
  {
    id: 'conversations',
    title: 'Conversations & Replies',
    icon: 'MessageCircle',
    content: `# Conversations & Replies

## Asking a question
Type into the chat box at the bottom. All advisors respond with their unique perspective.

## Replying to a specific advisor
Click an advisor's response to **reply directly to them** and continue one-on-one.

## Tips
- Include context (year in school, major, target industry, location, hours/week)
- Paste a job description or resume section for sharper advice
- Different advisors may prioritize differently — use that to balance volume, quality, and prep`,
  },
  {
    id: 'documents',
    title: 'Uploading Documents',
    icon: 'Paperclip',
    content: `# Uploading Documents

Attach **PDFs, Word documents, and text files** so advisors can reference your materials.

## How it works
1. Click the paperclip icon in the chat input
2. Select your file
3. Wait for processing
4. Ask a question — advisors use **RAG** to pull relevant sections

## Good uploads
- Current resume and cover letter drafts
- Job descriptions you are targeting
- Application tracking spreadsheets (exported as PDF)`,
  },
  {
    id: 'sessions',
    title: 'Sessions & History',
    icon: 'MessagesSquare',
    content: `# Sessions & History

Every conversation is saved as a session. Use the sidebar search to find past chats, switch sessions, or start a new chat with the pencil icon.`,
  },
  {
    id: 'canvas',
    title: 'Career Canvas',
    icon: 'BarChart3',
    content: `# {{appName}} Canvas

The Canvas is a **structured workspace** for your search. Insights from chats can inform widgets such as:

- Weekly application plan
- Target companies & roles
- Resume revision checklist
- Interview prep pipeline
- Networking outreach tracker
- Offer comparison notes

Open Canvas from the sidebar. Layout and widgets auto-save in your browser.`,
  },
  {
    id: 'tips',
    title: 'Tips & Shortcuts',
    icon: 'Sparkles',
    content: `# Tips & Shortcuts

## Useful workflows
- **Search plan:** Internship Search Strategist + Application Scheduler
- **Materials polish:** Resume Optimizer + Internship Search Strategist
- **LinkedIn & About Me:** Add your narrative in profile onboarding, then ask Resume Optimizer or Career Path Mentor for rewrite vs polish options (internship or full-time framing)
- **Interview week:** Interview Coach + Career Path Mentor
- **Stuck after rejections:** Ask multiple advisors to compare targeting, resume, and networking
- **Citeable research:** Upload files from \`docs/career_knowledge/\` (employers, recruiting, networking) so advisors can ground answers in NACE and university sources

## Theme
Switch light/dark mode from the toggle in the header.`,
  },
];
