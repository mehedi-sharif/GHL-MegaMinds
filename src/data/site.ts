// All page copy lives here — edit text, prices and links in one place.

// Contact page form. If webhookUrl is set, the site's own form posts to that
// GHL Inbound Webhook (Automation → Workflows → trigger "Inbound Webhook").
// Otherwise the embedded GHL form below is used; with neither, a booking CTA.
export const contactForm = {
  webhookUrl: '',
  id: 'Fognmtp89XFcCAgplgVJ',
  name: 'Discovery Call - White Label Partnership',
  host: 'https://links.ghlmegaminds.com',
  height: 472,
};

// GoHighLevel booking calendar embedded on /contact.
export const bookingCalendar = {
  id: 'b40dt1YgHIrDlJDWZd1D',
  iframeId: 'b40dt1YgHIrDlJDWZd1D_1790652759354',
  host: 'https://links.ghlmegaminds.com',
};

export const BOOKING_URL =
  'https://api.leadconnectorhq.com/widget/booking/b40dt1YgHIrDlJDWZd1D';

export const nav = [
  { label: 'Services', href: '/#offers' },
  { label: 'How we work', href: '/#how-it-works' },
  { label: 'Projects', href: '/#projects' },
  { label: 'Team', href: '/#team' },
  { label: 'Contact', href: '/contact' },
];

export const heroStats = [
  { value: '10+ yrs', label: 'building software for global businesses' },
  { value: '< 48 hrs', label: 'from client sign-up to a fully integrated account' },
  { value: '7-day', label: '100% money-back guarantee' },
];

export const setupChecklist = [
  { label: 'Sub-account & intake setup', tag: 'Done', done: true },
  { label: 'Staff permissions', tag: 'Done', done: true },
  { label: 'Stripe, QBO, GMB integrations', tag: 'Done', done: true },
  { label: 'Snapshot & custom fields', tag: 'Done', done: true },
  { label: 'Domain setup & SSL', tag: 'Done', done: true },
  { label: 'A2P 10DLC compliance', tag: 'In review', done: false },
  { label: '1-on-1 white-label walkthrough', tag: 'Scheduled', done: false },
];

export const stack = [
  'GoHighLevel', 'Stripe', 'QuickBooks Online', 'Google Business Profile',
  'Slack', 'Microsoft Teams', 'n8n', 'Telegram',
];

export const problems = [
  {
    n: '01', flag: 'Hand-holding', title: 'Hire offshore inexperienced VAs',
    body: 'Low cost, but requires constant hand-holding, lacks real engineering experience, and breaks down when native GoHighLevel features hit a limit.',
  },
  {
    n: '02', flag: 'High overhead', title: 'Hire expensive full-time employees',
    body: 'High overhead, long recruiting cycles, and expensive salaries that eat into your profit margins while slowing down your agency agility.',
  },
  {
    n: '03', flag: 'Ticket queue', title: 'Hire massive white-label agencies',
    body: "They juggle hundreds of clients, so you're just another ticket number in their queue. You get canned replies, slow turnaround, and low-priority treatment.",
  },
];

export const advantages = [
  'Certified HighLevel admins backed by 10+ years of software engineering',
  'Advanced workflows, webhooks, and APIs built without hand-holding',
  'Flat monthly pricing: no salaries, payroll taxes, or recruiting',
  'Capped client intake, so you get direct partner access',
  "Delivered under your agency's brand; clients never see us",
  '7-day, 100% money-back guarantee',
];

export const solutions = [
  {
    n: '01', title: 'Certified admins & engineers, zero babysitting',
    body: 'Inexperienced VAs struggle with complex workflows and native limits. Our certified team brings 10+ years of engineering to build advanced logic, webhooks, and APIs autonomously.',
  },
  {
    n: '02', title: 'Fraction of the cost, zero overhead',
    body: 'Full-time hires bring hefty salaries, recruiting delays, and payroll taxes. You get an entire engineering squad on a predictable flat monthly retainer.',
  },
  {
    n: '03', title: 'Boutique attention & VIP priority',
    body: 'Large white-label agencies bury you in ticket queues. We strictly cap client intake so your agency gets dedicated support, fast turnarounds, and direct partner access.',
  },
];

export const team = [
  {
    name: 'Mehedi Sharif', role: 'Founder & Software Engineer', years: '13+', certified: true,
    photo: '/images/team/mehedi-sharif.jpg',
    alt: 'Mehedi Sharif - Certified GoHighLevel Admin & Founder at GHL Megaminds',
  },
  {
    name: 'Farhad Hossen', role: 'Marketing Engineer', years: '6+', certified: true,
    photo: '/images/team/farhad-hossen.jpg',
    alt: 'Farhad Hossen - Certified GoHighLevel Admin & Marketing Engineer at GHL Megaminds',
  },
  {
    name: 'Somrat Sorkar', role: 'Senior Software Engineer', years: '9+', certified: false,
    photo: '/images/team/somrat-sorkar.jpg',
    alt: 'Somrat Sorkar - Senior Software Engineer at GHL Megaminds',
  },
];

export const offers = [
  {
    kicker: 'Offer 01 · Onboarding', title: 'Client Onboarding & Setup', featured: 'Start here',
    desc: 'Turn new client sign-ups into fully integrated accounts in under 48 hours.',
    price: '$900', regular: '$1,500',
    terms: '50 hours/mo. 2-month minimum. Single setup available at $497/client.',
    features: [
      'Sub-Account & Intake Setup', 'Staff Permissions Configuration', 'Stripe, QBO, GMB Integrations',
      'Snapshot Loading & Custom Fields', 'Domain Setup & SSL', 'A2P 10DLC Compliance',
      'SMTP & Domain Authentication', '1-on-1 White-Label Walkthrough',
    ],
  },
  {
    kicker: 'Offer 02 · Support', title: 'Ongoing Tech Support',
    desc: 'Answer daily client questions and fix broken workflows before clients think about canceling.',
    price: '$600', regular: '$1,000',
    terms: '50 hours/mo support coverage. 2-month minimum commitment.',
    features: [
      'White-Label Help Desk Mgmt', 'Direct Troubleshooting', 'Daily System Monitoring',
      'Workflow Health Audits', 'Trigger & Updates Repair', 'Escalation Management', 'Weekly Performance Reports',
    ],
  },
  {
    kicker: 'Offer 03 · Engineering', title: 'Custom App & Wrapper Dev',
    desc: 'Build private HighLevel marketplace apps, middleware, and custom portals.',
    price: '$1,200', regular: '$2,000',
    terms: '50 hours/mo senior dev bandwidth. Single builds priced on scope.',
    features: [
      'Marketplace & Private Apps', 'White-Label Client Portals', 'Internal Operations Dashboards',
      'Custom Webhooks & Middleware', 'Third-Party API Bridges', 'Legacy System Integrations',
      'Custom JavaScript, CSS, and UI tweaks',
    ],
  },
];

export const testimonial = {
  quote:
    'GHL MegaMinds is the team I always call when I need tech help. We worked together before they started this company. They have years of experience and know how to build complex solutions. I’m so glad they created this team specifically for GoHighLevel. I highly recommend them and wish them great success!',
  name: 'Shariful',
  role: 'Founder & CEO, GHL Video',
  photo: '/images/shariful-islam.jpg',
  alt: 'Shariful - Founder & CEO, GHL Video',
};

export const steps = [
  { n: '01', title: 'Book a scoping call', tag: '30 min', body: "We review your agency's current bottleneck, client volume, and technical requirements." },
  { n: '02', title: 'Plug us in', tag: 'Integration', body: 'We integrate with your Slack, Teams, or ticketing tool under your custom brand identity.' },
  { n: '03', title: 'Hand off & scale', tag: 'Ongoing', body: 'You close clients. We execute onboarding, build custom apps, and manage support behind the scenes.' },
];

export type ProjectPreview =
  | 'middleware' | 'pricing' | 'llms' | 'telegram' | 'payments' | 'astro' | 'portal';

export const projects: {
  type: string; title: string; body: string; preview: ProjectPreview;
  downloads?: number; cta?: { label: string; href: string }; comingSoon?: boolean;
  image?: string; // real screenshot in public/; falls back to the illustration
}[] = [
  {
    type: 'GoHighLevel Custom App', downloads: 196, preview: 'middleware',
    title: 'Integration middleware for GHL & n8n',
    body: 'Connect self-hosted n8n to GoHighLevel in minutes. Packed with 40 pre-built actions and 32 triggers to eliminate manual API calls.',
    cta: { label: 'View on GHL Marketplace', href: 'https://marketplace.gohighlevel.com/integration/69eef1cd71a26a0956e537b8' },
  },
  {
    type: 'Web Application', preview: 'pricing', image: '/images/projects/my-crm-pricing.jpg',
    title: 'My CRM Pricing',
    body: 'Show prospects how many subscriptions your CRM replaces and exactly what they save every month. Interactive comparison tables built for SaaS resellers.',
    cta: { label: 'Live Demo', href: 'https://mycrmpricing.vercel.app/' },
  },
  {
    type: 'GoHighLevel Custom App', downloads: 116, preview: 'llms',
    title: 'llms.txt Generators app for GHL websites',
    body: 'We solved the missing llms.txt gap for HighLevel long before native rollouts. Generates clean markdown files to prepare client sites for AI crawlers.',
    cta: { label: 'View on GHL Marketplace', href: 'https://marketplace.gohighlevel.com/integration/69e86cb705f1a96f1879c857' },
  },
  {
    type: 'GoHighLevel Custom App', downloads: 3, preview: 'telegram',
    title: 'Telegram Bridge',
    body: 'HighLevel does not support Telegram natively yet. Use this app to connect multiple Telegram bots and manage real-time conversations from one place.',
    cta: { label: 'View on GHL Marketplace', href: 'https://marketplace.gohighlevel.com/integration/6a58a65894c6752231c8b84a/' },
  },
  {
    type: 'GoHighLevel Custom App', downloads: 7, preview: 'payments',
    title: 'Local currency payments for Bangladesh',
    body: 'HighLevel defaults to global gateways that do not fit every region. We built this custom integration to let Bangladeshi businesses accept local payments directly in GHL checkouts.',
    cta: { label: 'View on GHL Marketplace', href: 'https://marketplace.gohighlevel.com/integration/6a4364d3054791173e2b5f5a/' },
  },
  {
    type: 'Headless Template', preview: 'astro', image: '/images/projects/astro-ghl-template.jpg',
    title: 'Astro + GoHighLevel Website Template',
    body: 'Native HighLevel sites are slow. We built this template to prove you never have to settle for sluggish pages. Get full design control with Astro while HighLevel powers your backend.',
    cta: { label: 'Live Demo', href: 'https://automark-astro.vercel.app/' },
  },
  {
    type: 'Private Project', preview: 'portal', comingSoon: true,
    title: 'Custom GoHighLevel Agency Ops & Client Portal',
    body: 'You cannot run your whole agency and client delivery inside GHL alone. We are building a single dashboard to connect all your external tools, delivery workflows, and client views in one place.',
  },
];

export const trust = ['30 Minute Discovery Call', '7-Day Money-Back Guarantee', 'No Long-Term Lock-in'];
