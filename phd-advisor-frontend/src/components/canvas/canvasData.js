// Demo data for an undergrad running a semester internship search.

export const DEMO_PROJECT = {
  title: "Spring Internship Search — Leeds Undergrad",
  meta: "Junior · business analytics · summer start",
};

export const INSIGHTS = [
  {
    id: 'i-progress',
    title: 'Search progress',
    icon: 'graph',
    category: 'progress',
    confidence: 82,
    summary: 'Week 4 of a structured internship search. Applications are moving, but interview conversion and alumni outreach are the main gaps before midterms.',
    bullets: [
      'Pipeline: <strong>18 applied</strong> · 4 recruiter screens · 1 onsite pending',
      'Cadence: <strong>~4 quality apps/week</strong> — below the 6–8 target for this course load',
      '<strong>Risk:</strong> resume still too generic for analytics postings',
    ],
    pinned: true,
    sources: 18,
    updatedMinutesAgo: 5,
    quotes: [
      '"Prioritize 6 tailored apps over 15 spray-and-pray." — Application Scheduler',
      '"Add one quantified analytics bullet before the next batch." — Resume Optimizer',
    ],
  },
  {
    id: 'i-method',
    title: 'Materials & messaging',
    icon: 'flask',
    category: 'theory',
    confidence: 71,
    summary: 'Resume is ATS-readable but light on metrics. Cover notes and LinkedIn About are unfinished. Interview stories need STAR structure.',
    bullets: [
      'Resume: <strong>2 quantified bullets</strong> · target 5+ with tools + outcomes',
      'Channels: Handshake + LinkedIn · company portals underused',
      'Interview bank: <strong>3 STAR stories</strong> drafted · need leadership + conflict',
    ],
    sources: 14,
    updatedMinutesAgo: 14,
    quotes: [
      '"Paste the JD and we will mirror keywords without inventing skills." — Resume Optimizer',
      '"Build five STAR stories you can reuse across screens." — Interview Coach',
    ],
  },
  {
    id: 'i-lit',
    title: 'Search knowledge',
    icon: 'book',
    category: 'literature',
    confidence: 76,
    summary: 'Solid grasp of Handshake filters and basic LinkedIn search. Weaker on alumni outreach and how to prioritize rolling vs. deadline-driven postings.',
    bullets: [
      '<strong>Coverage:</strong> Handshake filters, Easy Apply hygiene, career-fair follow-ups',
      '<strong>Gap:</strong> warm <strong>alumni outreach</strong> scripts and tracking',
      '<strong>Gap:</strong> no clear <strong>offer-comparison</strong> checklist yet',
    ],
    sources: 32,
    updatedMinutesAgo: 28,
    quotes: [
      '"One personalized alumni note beats ten cold applies." — Career Path Mentor',
      '"Tag every posting: deadline, rolling, or career-fair source." — Internship Search Strategist',
    ],
  },
  {
    id: 'i-questions',
    title: 'Open career questions',
    icon: 'sparkles',
    category: 'theory',
    confidence: 63,
    summary: 'Three live threads. Q1 (target industries) gates the next search week. Q2–Q3 affect resume and interview prep.',
    bullets: [
      '<strong>Q1:</strong> Analytics internships only, or also marketing ops / strategy?',
      '<strong>Q2:</strong> Keep one master resume or maintain two tailored versions?',
      '<strong>Q3:</strong> How many hours/week is realistic through midterms?',
    ],
    sources: 9,
    updatedMinutesAgo: 41,
    quotes: [
      '"Pick a primary lane for 2 weeks, then expand." — Internship Search Strategist',
      '"Protect Tuesday/Thursday 90-minute apply blocks." — Application Scheduler',
    ],
  },
  {
    id: 'i-next',
    title: 'Next steps',
    icon: 'arrow',
    category: 'action',
    confidence: 85,
    summary: 'Near-term actions for this week’s apply blocks and interview prep. Two items have slipped a week.',
    bullets: [
      'Rewrite <strong>3 resume bullets</strong> with tools + measurable outcomes',
      'Submit <strong>6 tailored applications</strong> (Handshake + 2 company sites)',
      'Draft <strong>2 alumni outreach</strong> messages and send one today',
      'Practice <strong>5 behavioral questions</strong> aloud before Friday',
    ],
    sources: 7,
    updatedMinutesAgo: 9,
    quotes: [
      '"Ship the resume rewrite before opening more tabs." — Resume Optimizer',
      '"Schedule interview practice like a class you cannot skip." — Interview Coach',
    ],
  },
  {
    id: 'i-blockers',
    title: 'Blockers & risks',
    icon: 'alert',
    category: 'risk',
    confidence: 74,
    summary: 'One materials blocker (thin metrics) and one process blocker (inconsistent cadence). Cadence is the higher risk to offers this term.',
    bullets: [
      '<strong>Materials:</strong> generic bullets reduce callback rate on analytics roles',
      '<strong>Process:</strong> missed apply blocks during exam weeks with no catch-up plan',
    ],
    sources: 6,
    updatedMinutesAgo: 20,
    quotes: [
      '"Without a weekly system, even a strong resume underperforms." — Application Scheduler',
      '"Do not invent metrics — recover real ones from projects and classwork." — Resume Optimizer',
    ],
  },
];

export const WIDGET_CATALOG = [
  { type: 'bibliography', name: 'Saved Postings', desc: 'Track JDs, links, and notes for roles you care about', icon: 'book', cat: 'research', defaultSize: 'M', enhanced: true },
  { type: 'reading-queue', name: 'Research Queue', desc: 'Companies, alumni, and articles to review before applying', icon: 'list', cat: 'research', defaultSize: 'S', enhanced: true },
  { type: 'notes', name: 'Note Inbox', desc: 'Markdown notes with full-text search', icon: 'notes', cat: 'research', defaultSize: 'S', enhanced: true },
  { type: 'concept-map', name: 'Target Map', desc: 'Map industries, roles, and companies', icon: 'network', cat: 'research', defaultSize: 'M', stub: true },
  { type: 'highlights', name: 'Story Bank', desc: 'STAR stories and quotes ready for interviews', icon: 'cite', cat: 'research', defaultSize: 'M', enhanced: true },
  { type: 'paper-tldr', name: 'JD TL;DR', desc: 'Paste a JD → must-haves / keywords / fit gaps', icon: 'microscope', cat: 'research', defaultSize: 'M', stub: true },

  { type: 'writing', name: 'Writing Tracker', desc: 'Resume/cover drafts with a writing heatmap', icon: 'pencil', cat: 'writing', defaultSize: 'M', enhanced: true },
  { type: 'outline', name: 'Outline Builder', desc: 'Structure cover letters and interview answers', icon: 'list', cat: 'writing', defaultSize: 'M', enhanced: true },
  { type: 'latex', name: 'Scratchpad', desc: 'Freeform drafting pad with live preview', icon: 'flask', cat: 'writing', defaultSize: 'M', enhanced: true },
  { type: 'draft-locker', name: 'Draft Locker', desc: 'Versioned resume and cover-letter drafts', icon: 'shield', cat: 'writing', defaultSize: 'S', stub: true },

  { type: 'kanban', name: 'Application Board', desc: 'Wishlist → Applied → Interview → Offer', icon: 'kanban', cat: 'project', defaultSize: 'L', enhanced: true },
  { type: 'deadlines', name: 'Deadlines', desc: 'App deadlines plus .ics calendar export', icon: 'calendar', cat: 'project', defaultSize: 'S', enhanced: true },
  { type: 'pomodoro', name: 'Pomodoro', desc: 'Focused apply / prep blocks with breaks', icon: 'timer', cat: 'project', defaultSize: 'S', enhanced: true },
  { type: 'gantt', name: 'Semester Timeline', desc: 'Search → apply → interview → offer season', icon: 'flag', cat: 'project', defaultSize: 'L', stub: true },
  { type: 'meeting-log', name: 'Networking Log', desc: 'Alumni/recruiters, last contact, next action', icon: 'message', cat: 'project', defaultSize: 'M' },
  { type: 'goals', name: 'Goals / OKRs', desc: 'Weekly apply and interview goals', icon: 'bullseye', cat: 'project', defaultSize: 'M' },
  { type: 'calendar', name: 'Calendar', desc: 'Month grid with deadlines and apply days', icon: 'calendar', cat: 'project', defaultSize: 'M', enhanced: true },
  { type: 'activity', name: 'Activity Feed', desc: 'Chronological log of edits across widgets', icon: 'graph', cat: 'project', defaultSize: 'M', enhanced: true },
  { type: 'documenter', name: 'Daily Documenter', desc: 'Date-stamped search journal', icon: 'pencil', cat: 'project', defaultSize: 'M', enhanced: true },
  { type: 'phd-journey', name: 'Search Roadmap', desc: 'Milestones from profile → offer decision', icon: 'flag', cat: 'project', defaultSize: 'M', enhanced: true },
  { type: 'phd-resources', name: 'Career Resources', desc: 'Handshake, LinkedIn, campus career services, prep tools', icon: 'star', cat: 'research', defaultSize: 'M', enhanced: true },

  { type: 'mood', name: 'Mood / Burnout Check-in', desc: 'Daily slider during heavy apply weeks', icon: 'smile', cat: 'wellness', defaultSize: 'S', stub: true },
  { type: 'sleep', name: 'Energy Check', desc: 'Spot burnout before interview week', icon: 'heart', cat: 'wellness', defaultSize: 'S', stub: true },
  { type: 'habits', name: 'Habit Tracker', desc: 'Daily apply, outreach, and practice habits', icon: 'flame', cat: 'wellness', defaultSize: 'S' },
  { type: 'focus', name: 'Focus Playlist', desc: 'Ambient sounds for apply blocks', icon: 'music', cat: 'wellness', defaultSize: 'S', stub: true },

  { type: 'cfp', name: 'Career Fair Tracker', desc: 'Fairs, employers, follow-ups', icon: 'send', cat: 'career', defaultSize: 'M', stub: true },
  { type: 'grants', name: 'Scholarship / Stipend Tracker', desc: 'Optional funding deadlines', icon: 'award', cat: 'career', defaultSize: 'S', stub: true },
  { type: 'crm', name: 'Networking CRM', desc: 'Contacts, last touch, next ask', icon: 'network', cat: 'career', defaultSize: 'M', stub: true },
  { type: 'cv', name: 'Resume Versions', desc: 'Track tailored resume variants', icon: 'user', cat: 'career', defaultSize: 'S', stub: true },

  { type: 'datasets', name: 'Company Shortlist', desc: 'Target employers by industry/location', icon: 'database', cat: 'data', defaultSize: 'M', stub: true },
  { type: 'methods', name: 'Interview Cheat Sheet', desc: 'Question types and answer frameworks', icon: 'flask', cat: 'data', defaultSize: 'M', stub: true },

  { type: 'budget', name: 'Budget Tracker', desc: 'Interview travel / attire spend', icon: 'wallet', cat: 'practical', defaultSize: 'S' },
  { type: 'discounts', name: 'Student Discounts', desc: 'Software & services with edu pricing', icon: 'star', cat: 'practical', defaultSize: 'S', stub: true },

  { type: 'reviewer-2', name: 'Reviewer 2 Simulator', desc: 'Paste a plan → harsh, honest critique', icon: 'gavel', cat: 'critic', defaultSize: 'M', critic: true },
  { type: 'devils-advocate', name: 'Devil\'s Advocate', desc: 'Strongest counter-arguments to your plan', icon: 'scale', cat: 'critic', defaultSize: 'M', critic: true },
  { type: 'scope-realism', name: 'Scope Realism Check', desc: 'Feasibility given hours/week and deadlines', icon: 'bullseye', cat: 'critic', defaultSize: 'M', critic: true },
  { type: 'assumption', name: 'Assumption Excavator', desc: 'Names hidden assumptions in your search plan', icon: 'brain', cat: 'critic', defaultSize: 'M', critic: true, stub: true },
  { type: 'whats-missing', name: '"What\'s Missing"', desc: 'Gap analysis on resume, outreach, or pipeline', icon: 'alert', cat: 'critic', defaultSize: 'S', critic: true, stub: true },
  { type: 'calibrator', name: 'Confidence Calibrator', desc: 'Challenges every "this always works" claim', icon: 'scale', cat: 'critic', defaultSize: 'S', critic: true, stub: true },
];

export const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'research', label: 'Research' },
  { id: 'writing', label: 'Writing' },
  { id: 'project', label: 'Pipeline' },
  { id: 'wellness', label: 'Wellness' },
  { id: 'career', label: 'Career' },
  { id: 'data', label: 'Prep' },
  { id: 'practical', label: 'Practical' },
  { id: 'critic', label: 'Anti-yes-man', critic: true },
];

export const DEFAULT_LAYOUT = [];

const presetIds = (types) => types.map((t, i) => ({ id: `pre-${t.type}-${i}`, ...t }));
export const WORKSPACE_PRESETS = [
  {
    id: 'day1-soc',
    name: 'Search Starter',
    desc: 'Get oriented: resources, notes, deadlines, application board, pomodoro.',
    icon: 'sparkles',
    layout: presetIds([
      { type: 'phd-resources', size: 'M' },
      { type: 'notes', size: 'M' },
      { type: 'deadlines', size: 'S' },
      { type: 'pomodoro', size: 'S' },
      { type: 'kanban', size: 'L' },
    ]),
  },
  {
    id: 'writing-sprint',
    name: 'Resume Sprint',
    desc: 'Polish materials: writing pad, outline, story bank, task board.',
    icon: 'pencil',
    layout: presetIds([
      { type: 'writing', size: 'M' },
      { type: 'outline', size: 'M' },
      { type: 'pomodoro', size: 'S' },
      { type: 'highlights', size: 'M' },
      { type: 'notes', size: 'M' },
    ]),
  },
  {
    id: 'audit-prep',
    name: 'Interview Week',
    desc: 'Prep hard: story bank, networking log, deadlines, application board.',
    icon: 'book',
    layout: presetIds([
      { type: 'highlights', size: 'M' },
      { type: 'meeting-log', size: 'M' },
      { type: 'notes', size: 'M' },
      { type: 'deadlines', size: 'S' },
      { type: 'kanban', size: 'M' },
    ]),
  },
  {
    id: 'incident-mode',
    name: 'Offer Pressure-Test',
    desc: 'Pressure-test your plan with challenge widgets before you accept.',
    icon: 'gavel',
    layout: presetIds([
      { type: 'writing', size: 'M' },
      { type: 'outline', size: 'M' },
      { type: 'reviewer-2', size: 'M', critic: true },
      { type: 'devils-advocate', size: 'M', critic: true },
      { type: 'scope-realism', size: 'M', critic: true },
      { type: 'deadlines', size: 'S' },
    ]),
  },
];

export const EMPTY_STATE = {
  bibliography: { format: 'APA', entries: [] },
  kanban: {
    cols: [
      { id: 'todo', label: 'Wishlist' },
      { id: 'doing', label: 'Applied' },
      { id: 'stuck', label: 'Interview' },
      { id: 'done', label: 'Offer / Closed' },
    ],
    cards: [],
  },
  pomodoro: { focus: 25, brk: 5, sessionsToday: 0 },
  writing: {
    chapters: [{ id: 'c-default', name: 'Resume draft', target: 500, draft: '' }],
    activeChapterId: 'c-default',
    dailyTotals: {},
    target: 500,
  },
  deadlines: [],
  budget: { cap: 1000, items: [] },
  notes: { items: [] },
  habits: { items: [] },
  goals: { items: [] },
  'meeting-log': { items: [] },
  'reading-queue': [],
  'reviewer-2': { lastDraft: '', lastReview: null },
  'devils-advocate': { claim: '', counters: [] },
  'scope-realism': {
    target: '',
    score: 0,
    label: 'Set a target',
    factors: [],
    notes: '',
  },
  outline: { items: [], expanded: {} },
  highlights: { items: [] },
  latex: { source: '', displayMode: true },
  calendar: { viewMonth: new Date().toISOString().slice(0, 7) },
  activity: {},
  documenter: { entries: [], lastSummary: null },
  'phd-journey': {
    statuses: {},
    notes: {},
  },
  'phd-resources': {
    customLinks: [],
  },
};
