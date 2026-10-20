export type Service = {
  slug: string;
  title: string;
  shortTitle: string;
  summary: string;
  problem: string;
  outcome: string;
  deliverables: string[];
  process: string[];
  channels: string[];
  faqs: { question: string; answer: string }[];
};

export const services: Service[] = [
  {
    slug: "web-design-development",
    title: "Web design & development",
    shortTitle: "Web",
    summary:
      "A clear, considered digital home that helps the right people understand your offer and take the next step.",
    problem:
      "A slow, unclear, or dated website can make a strong business harder to trust and harder to choose.",
    outcome:
      "A useful, accessible website shaped around your customers, your content, and the actions that matter to your business.",
    deliverables: [
      "Discovery and content architecture",
      "Responsive UX and visual design",
      "Accessible, tested implementation",
      "Technical SEO foundations",
      "Launch support and handover",
    ],
    process: [
      "Understand your customers, offer, and current site.",
      "Map the content and design the important journeys.",
      "Build, review, and test across devices and assistive technology.",
      "Launch with a clear handover and improvement plan.",
    ],
    channels: ["Next.js", "React", "TypeScript", "Contentful-ready content"],
    faqs: [
      {
        question: "How long does a website project take?",
        answer:
          "Timing depends on scope, content readiness, and review cycles. We agree milestones and a realistic schedule after discovery.",
      },
      {
        question: "Can you work with our existing content platform?",
        answer:
          "Usually. We assess the current platform first and recommend keeping it when it remains a good fit.",
      },
    ],
  },
  {
    slug: "custom-software",
    title: "Custom software development",
    shortTitle: "Software",
    summary:
      "Purpose-built digital products and internal tools for needs off-the-shelf software cannot meet.",
    problem:
      "Disconnected tools and manual work can slow teams down and make important processes difficult to improve.",
    outcome:
      "A maintainable application that fits your workflows, integrates with your systems, and can evolve with your business.",
    deliverables: [
      "Technical discovery and solution design",
      "Application architecture and prototypes",
      "Web application implementation",
      "Integrations and quality assurance",
      "Documentation and support planning",
    ],
    process: [
      "Define the user need and constraints.",
      "Validate a small, useful first release.",
      "Build in reviewable increments with quality checks.",
      "Ship with documentation and a roadmap for what comes next.",
    ],
    channels: ["TypeScript", "React", "Node.js", "API integrations"],
    faqs: [
      {
        question: "Do you take over existing applications?",
        answer:
          "We can review an existing product and its risks before agreeing whether a handover or improvement project is a good fit.",
      },
      {
        question: "Do you offer ongoing support?",
        answer:
          "Support options are scoped to the product, hosting setup, and response needs rather than assumed as part of every build.",
      },
    ],
  },
  {
    slug: "brand-identity",
    title: "Branding & visual identity",
    shortTitle: "Brand",
    summary:
      "A flexible identity system that makes your value easier to recognize and your communications easier to keep consistent.",
    problem:
      "An inconsistent or undifferentiated brand makes it harder for customers to recognize what is distinctive about your business.",
    outcome:
      "A practical identity and set of guidelines your team can use confidently across the moments that matter.",
    deliverables: [
      "Brand discovery and positioning workshop",
      "Identity direction and logo suite",
      "Typography and color system",
      "Digital and print applications",
      "Guidelines and asset handover",
    ],
    process: [
      "Listen to your team and understand the market.",
      "Explore positioning and visual directions.",
      "Refine the chosen direction into a usable identity.",
      "Deliver applications, guidelines, and working files.",
    ],
    channels: [
      "Brand strategy",
      "Visual identity",
      "Art direction",
      "Guidelines",
    ],
    faqs: [
      {
        question: "Can you refresh an existing identity?",
        answer:
          "Yes. We first identify which existing elements have recognition or value before deciding what should change.",
      },
      {
        question: "Will our team be able to use the identity?",
        answer:
          "The handover includes practical guidelines and correctly prepared assets for your agreed use cases.",
      },
    ],
  },
  {
    slug: "ui-ux-design",
    title: "UI/UX design",
    shortTitle: "Product design",
    summary:
      "Research-led product experiences that make complex tasks feel clear and usable.",
    problem:
      "When people struggle to understand an interface, they may abandon a task or rely on support instead.",
    outcome:
      "A tested interaction model and interface that helps people complete the tasks they came to do.",
    deliverables: [
      "User and product discovery",
      "Journey maps and information architecture",
      "Wireframes and interactive prototypes",
      "Visual interface and component system",
      "Usability review and developer handoff",
    ],
    process: [
      "Align on users, goals, and evidence.",
      "Map tasks and explore interaction options.",
      "Prototype and test key journeys.",
      "Refine the interface and support implementation.",
    ],
    channels: ["Figma", "Design systems", "Usability testing", "Prototyping"],
    faqs: [
      {
        question: "Do you test designs with users?",
        answer:
          "Testing is recommended for high-impact journeys and is planned around access to representative users and project scope.",
      },
      {
        question: "Can you collaborate with our developers?",
        answer:
          "Yes. We define handoff expectations early and work with your team through implementation reviews.",
      },
    ],
  },
  {
    slug: "search-engine-optimization",
    title: "Search engine optimization",
    shortTitle: "SEO",
    summary:
      "A sound technical and content foundation that helps the right people discover your business through search.",
    problem:
      "Search performance is difficult to improve when technical barriers, unclear pages, or unhelpful content go unaddressed.",
    outcome:
      "A prioritized, evidence-led search program that improves discoverability over time without promising rankings.",
    deliverables: [
      "Technical and content audit",
      "Keyword and search-intent research",
      "Information architecture recommendations",
      "On-page and technical improvements",
      "Measurement and ongoing priorities",
    ],
    process: [
      "Review site health, analytics, and search context.",
      "Prioritize issues and opportunities by impact and effort.",
      "Implement agreed technical and content improvements.",
      "Measure changes and adjust the roadmap.",
    ],
    channels: [
      "Google Search Console",
      "Technical SEO",
      "Content",
      "Analytics",
    ],
    faqs: [
      {
        question: "Can you guarantee first-page rankings?",
        answer:
          "No. Search results depend on many changing factors outside any agency’s control. We focus on sound work and transparent measurement.",
      },
      {
        question: "When should we expect to see results?",
        answer:
          "The timing varies by site, competition, and the changes involved. We set realistic checkpoints rather than promise a fixed outcome.",
      },
    ],
  },
  {
    slug: "google-ads",
    title: "Google Ads & paid search",
    shortTitle: "Paid search",
    summary:
      "Intent-focused paid search campaigns built around clear measurement, relevant landing pages, and disciplined testing.",
    problem:
      "Unstructured campaigns can spend budget without making it clear which searches or landing experiences are useful.",
    outcome:
      "A manageable campaign structure and learning loop aligned to your goals and available evidence.",
    deliverables: [
      "Account and tracking review",
      "Search intent and keyword plan",
      "Campaign structure and copy",
      "Landing page recommendations",
      "Regular performance reviews",
    ],
    process: [
      "Confirm goals, economics, and measurement quality.",
      "Build campaigns around relevant search intent.",
      "Review search terms and landing experience.",
      "Share learnings and agree the next tests.",
    ],
    channels: [
      "Google Ads",
      "Search campaigns",
      "Conversion measurement",
      "Landing pages",
    ],
    faqs: [
      {
        question: "Do you guarantee a return on ad spend?",
        answer:
          "No. Results depend on market conditions, offer, budget, and conversion experience. We agree a measurement approach and report honestly.",
      },
      {
        question: "Is the advertising budget included in your fee?",
        answer:
          "Media spend is separate from service fees and is paid to the advertising platform by the account owner.",
      },
    ],
  },
  {
    slug: "paid-social",
    title: "Meta Ads & paid social",
    shortTitle: "Paid social",
    summary:
      "Paid social campaigns that connect audience insight, creative testing, and responsible measurement.",
    problem:
      "Paid social can become a stream of disconnected ads when audience, creative, and landing experience are not considered together.",
    outcome:
      "A testable campaign approach built around the people you need to reach and the evidence your team can trust.",
    deliverables: [
      "Account and pixel review",
      "Audience and campaign strategy",
      "Creative briefs and ad variations",
      "Landing page alignment",
      "Reporting and experiment plan",
    ],
    process: [
      "Check account setup, consent, and conversion events.",
      "Define audiences and creative hypotheses.",
      "Launch controlled tests with clear budgets.",
      "Review signal quality and refine the next round.",
    ],
    channels: ["Meta Ads", "Facebook", "Instagram", "Conversion APIs"],
    faqs: [
      {
        question: "Do we need to provide creative assets?",
        answer:
          "We can work with your existing assets or scope creative production and testing as part of the engagement.",
      },
      {
        question: "Can you promise a specific cost per lead?",
        answer:
          "No. Costs depend on audience, market, offer, and platform changes. We aim to improve performance through transparent testing.",
      },
    ],
  },
  {
    slug: "social-media",
    title: "Social media strategy & management",
    shortTitle: "Social",
    summary:
      "A sustainable social presence shaped by audience needs, brand voice, and the capacity of your team.",
    problem:
      "Posting without a clear role or repeatable workflow can consume time without building a coherent presence.",
    outcome:
      "A practical channel strategy and publishing system your team can maintain and learn from.",
    deliverables: [
      "Channel and audience assessment",
      "Content pillars and tone guidance",
      "Editorial calendar",
      "Publishing and community workflow",
      "Monthly learning review",
    ],
    process: [
      "Clarify business goals and audience expectations.",
      "Choose channels based on fit, not fashion.",
      "Plan, create, and publish with an agreed cadence.",
      "Review engagement quality and improve the approach.",
    ],
    channels: ["Instagram", "LinkedIn", "Facebook", "Editorial planning"],
    faqs: [
      {
        question: "Which platforms should we use?",
        answer:
          "We recommend channels based on audience behavior, content strengths, and your team’s capacity.",
      },
      {
        question: "Can you publish on our behalf?",
        answer:
          "Publishing and community support can be included when roles, approvals, and access are agreed in advance.",
      },
    ],
  },
  {
    slug: "content-strategy",
    title: "Content strategy & creation",
    shortTitle: "Content",
    summary:
      "Useful, well-structured content that answers real questions and supports a clearer customer journey.",
    problem:
      "Unfocused content can leave customers searching for answers and teams unsure what to create next.",
    outcome:
      "A prioritized content system with clear audiences, responsibilities, and measures of usefulness.",
    deliverables: [
      "Content and search audit",
      "Audience and topic research",
      "Editorial strategy and calendar",
      "Copywriting and content production",
      "Governance and measurement guidance",
    ],
    process: [
      "Review what exists and where customers need help.",
      "Prioritize topics by purpose and evidence.",
      "Create and review content against agreed standards.",
      "Maintain, measure, and improve useful content.",
    ],
    channels: [
      "Editorial",
      "Website copy",
      "Search content",
      "Content governance",
    ],
    faqs: [
      {
        question: "Can you write in our brand voice?",
        answer:
          "We develop an agreed voice from your existing materials, stakeholder input, and a short review process.",
      },
      {
        question: "Do you use AI to create content?",
        answer:
          "Tools may support research or editing where appropriate, but accuracy, originality, and human review remain essential.",
      },
    ],
  },
  {
    slug: "ai-automation",
    title: "AI integration & business automation",
    shortTitle: "AI & automation",
    summary:
      "Practical automation that reduces repetitive work while keeping people, privacy, and oversight in the loop.",
    problem:
      "Manual handoffs and repetitive administration take attention away from work that needs human judgment.",
    outcome:
      "A carefully scoped workflow improvement with clear safeguards, measurable effort, and a human fallback.",
    deliverables: [
      "Workflow and risk discovery",
      "Automation opportunity assessment",
      "Prototype and integration design",
      "Testing, permissions, and safeguards",
      "Documentation and team training",
    ],
    process: [
      "Map the real workflow and what should remain human-led.",
      "Assess data sensitivity, failure modes, and feasibility.",
      "Prototype a narrow, reversible improvement.",
      "Test with users and document monitoring and ownership.",
    ],
    channels: [
      "API integrations",
      "Workflow automation",
      "LLM evaluation",
      "Human review",
    ],
    faqs: [
      {
        question: "Will AI make our process fully automatic?",
        answer:
          "We avoid full automation where mistakes carry meaningful risk. Human review and a safe fallback are designed into suitable workflows.",
      },
      {
        question: "Will our data be used to train a model?",
        answer:
          "Data handling depends on the chosen provider and configuration. We review retention and training terms before recommending an integration.",
      },
    ],
  },
  {
    slug: "conversion-optimization",
    title: "Conversion rate optimization",
    shortTitle: "Optimization",
    summary:
      "Evidence-led improvements to the journeys that help visitors make a confident next move.",
    problem:
      "Teams often have conversion questions but lack the research or measurement to distinguish symptoms from causes.",
    outcome:
      "A prioritized improvement program combining qualitative insight, analytics, and careful experiments.",
    deliverables: [
      "Measurement and journey review",
      "User research and heuristic assessment",
      "Opportunity and test backlog",
      "Experiment design and implementation",
      "Learning-focused reporting",
    ],
    process: [
      "Validate analytics and agree the outcome to improve.",
      "Investigate friction through research and behavior data.",
      "Prioritize changes and define a testable hypothesis.",
      "Review results in context and document what was learned.",
    ],
    channels: [
      "Analytics",
      "Usability research",
      "A/B testing",
      "Landing pages",
    ],
    faqs: [
      {
        question: "Can every idea be A/B tested?",
        answer:
          "No. Traffic, risk, and implementation cost matter. Sometimes usability research or a clear design improvement is more appropriate.",
      },
      {
        question: "Do you guarantee a conversion uplift?",
        answer:
          "No. We make informed improvements and report evidence without presenting uncertain outcomes as guaranteed.",
      },
    ],
  },
  {
    slug: "digital-strategy",
    title: "Digital strategy & growth consulting",
    shortTitle: "Strategy",
    summary:
      "A practical direction for your digital investment, with priorities your team can act on.",
    problem:
      "Scattered initiatives and competing recommendations make it difficult to decide what to do next.",
    outcome:
      "A shared, evidence-informed roadmap that connects customer needs, business priorities, and delivery capacity.",
    deliverables: [
      "Stakeholder and customer discovery",
      "Digital maturity and opportunity review",
      "Prioritized roadmap and investment options",
      "Measurement framework",
      "Decision workshop and next-step plan",
    ],
    process: [
      "Listen to teams and understand current constraints.",
      "Review customer evidence, systems, and opportunities.",
      "Agree a prioritized direction with explicit trade-offs.",
      "Support planning or delivery where useful.",
    ],
    channels: ["Digital roadmap", "Research", "Measurement", "Workshops"],
    faqs: [
      {
        question: "Will you recommend a full redesign?",
        answer:
          "Only if evidence supports it. Recommendations may include smaller content, workflow, or measurement improvements.",
      },
      {
        question: "Can you help us implement the roadmap?",
        answer:
          "We can scope delivery support after priorities and internal ownership are clear.",
      },
    ],
  },
];

export const industries = [
  {
    slug: "professional-services",
    title: "Professional services",
    description:
      "Make expertise easier to understand, evaluate, and engage with across the digital customer journey.",
  },
  {
    slug: "technology",
    title: "Technology",
    description:
      "Translate complex products into clearer experiences, stronger onboarding, and practical product foundations.",
  },
  {
    slug: "health-and-wellbeing",
    title: "Health & wellbeing",
    description:
      "Create considered, accessible experiences for people making important decisions about their wellbeing.",
  },
  {
    slug: "education",
    title: "Education",
    description:
      "Help learners and institutions find information, understand options, and complete essential tasks.",
  },
  {
    slug: "commerce",
    title: "Commerce",
    description:
      "Improve product discovery and buying journeys while keeping customer needs at the center.",
  },
  {
    slug: "nonprofits",
    title: "Nonprofits",
    description:
      "Make your mission, programs, and ways to participate easier to discover and act on.",
  },
];

export type CaseStudy = {
  slug: string;
  name: string;
  label: string;
  industry: string;
  discipline: string;
  summary: string;
  challenge: string;
  strategy: string;
  execution: string;
  deliverables: string[];
  services: string[];
  accent: string;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "northstar-financial-demo",
    name: "Northstar Financial",
    label: "Demonstration concept · not a client",
    industry: "Professional services",
    discipline: "Digital experience",
    summary:
      "A concept for making a complex advisory offer feel more approachable and easier to navigate.",
    challenge:
      "The hypothetical brief called for clearer service explanations and a more considered route from first visit to conversation.",
    strategy:
      "We organized the experience around common customer questions, made the offer easier to compare, and kept next steps visible without pressure.",
    execution:
      "The concept pairs an editorial identity with modular service pages, plain-language copy, and an accessible inquiry journey.",
    deliverables: [
      "Experience concept",
      "Page architecture",
      "Visual direction",
      "Inquiry flow",
    ],
    services: [
      "Web design & development",
      "Branding & visual identity",
      "UI/UX design",
    ],
    accent: "sage",
  },
  {
    slug: "fieldnotes-commerce-demo",
    name: "Fieldnotes Supply",
    label: "Demonstration concept · not a client",
    industry: "Commerce",
    discipline: "Commerce concept",
    summary:
      "A fictional storefront concept focused on product clarity, useful editorial, and a calmer path to purchase.",
    challenge:
      "The concept explores how a small specialist retailer might connect product information and buying guidance.",
    strategy:
      "We treated product education as part of the shopping journey and prioritized comparison, material details, and practical answers.",
    execution:
      "A structured collection layout and product page concept bring together concise descriptions, editorial context, and clear actions.",
    deliverables: [
      "Storefront concept",
      "Product page design",
      "Content hierarchy",
      "Mobile journey",
    ],
    services: [
      "Web design & development",
      "Content strategy & creation",
      "Conversion rate optimization",
    ],
    accent: "ochre",
  },
  {
    slug: "common-ground-learning-demo",
    name: "Common Ground Learning",
    label: "Demonstration concept · not a client",
    industry: "Education",
    discipline: "Product experience",
    summary:
      "A learning platform concept that helps prospective learners understand courses and choose a starting point.",
    challenge:
      "The hypothetical platform needed to present varied learning paths without overwhelming first-time visitors.",
    strategy:
      "We grouped courses by learner goals, clarified expected commitment, and designed a straightforward path into a sample lesson.",
    execution:
      "The concept includes a course discovery flow, accessible information patterns, and a lightweight learning dashboard.",
    deliverables: [
      "Course discovery",
      "Product prototype",
      "Design system",
      "Accessibility review",
    ],
    services: [
      "UI/UX design",
      "Custom software development",
      "Digital strategy & growth consulting",
    ],
    accent: "blue",
  },
];

export type Article = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  published: string;
  readingTime: string;
  sections: { heading: string; paragraphs: string[] }[];
};

export const articles: Article[] = [
  {
    slug: "a-better-brief-starts-with-the-problem",
    title: "A better brief starts with the problem",
    summary:
      "Before choosing a platform or redesign, make the customer problem and the evidence behind it clear.",
    category: "Strategy",
    published: "2026-08-18",
    readingTime: "4 min read",
    sections: [
      {
        heading: "Describe the moment that is not working",
        paragraphs: [
          "A project brief often begins with a proposed solution: a new website, a campaign, or a tool. Those ideas may be right, but they are more useful when they are connected to a specific moment in a customer or team journey.",
          "Start with what someone is trying to do, what gets in the way, and what evidence suggests that the difficulty matters. This keeps the discussion grounded in a real need.",
        ],
      },
      {
        heading: "Separate evidence from assumptions",
        paragraphs: [
          "Analytics can show where people leave, but rarely explains why. Support conversations, interviews, usability sessions, and content reviews help add context. Label what is known, what is inferred, and what still needs checking.",
          "A good brief makes uncertainty visible rather than hiding it behind a confident recommendation.",
        ],
      },
      {
        heading: "Agree what progress would look like",
        paragraphs: [
          "Choose a small number of signals that are relevant to the problem. These might include task completion, fewer avoidable support requests, or clearer understanding in research. The right measure depends on the work; it should not be invented in advance to make a project sound successful.",
        ],
      },
    ],
  },
  {
    slug: "technical-seo-is-a-team-sport",
    title: "Technical SEO is a team sport",
    summary:
      "Search foundations depend on decisions across content, design, engineering, and measurement, not a checklist in isolation.",
    category: "Search",
    published: "2026-07-22",
    readingTime: "5 min read",
    sections: [
      {
        heading: "Start with access and evidence",
        paragraphs: [
          "Search Console, analytics, crawl data, and a review of important customer journeys each reveal a different part of the picture. Confirm that measurement is configured before using it to make decisions.",
          "Prioritize problems by user impact, business relevance, and effort. A technically correct change is not automatically the most useful next step.",
        ],
      },
      {
        heading: "Connect the disciplines",
        paragraphs: [
          "Information architecture affects how people and crawlers find useful content. Engineering choices affect rendering and performance. Editorial choices affect whether a page answers a real question. Treating these as separate concerns makes it easier to miss the actual issue.",
        ],
      },
      {
        heading: "Report what changed, not what was promised",
        paragraphs: [
          "Search outcomes depend on competition, search systems, and factors no team controls. Report work completed and observable changes with context. Avoid turning an estimate into a guarantee.",
        ],
      },
    ],
  },
  {
    slug: "automation-with-a-human-fallback",
    title: "Design automation with a human fallback",
    summary:
      "A useful automation plan considers the exception, the owner, and the recovery path before the workflow goes live.",
    category: "Technology",
    published: "2026-06-30",
    readingTime: "4 min read",
    sections: [
      {
        heading: "Map the real workflow first",
        paragraphs: [
          "Automating a poorly understood process can make the same confusion happen faster. Talk to the people doing the work and map handoffs, exceptions, and sensitive decisions before selecting a tool.",
        ],
      },
      {
        heading: "Make failure legible",
        paragraphs: [
          "Every automated step needs an owner, a way to spot errors, and a path back to a safe manual process. Give people enough information to understand what happened without exposing unnecessary personal data.",
        ],
      },
      {
        heading: "Keep the scope reversible",
        paragraphs: [
          "Begin with a narrow, low-risk workflow and review it with the people affected. Keep permissions limited and define how data is stored, retained, and removed before adding a new service.",
        ],
      },
    ],
  },
];

export const faqs = [
  {
    question: "What kinds of organizations do you work with?",
    answer:
      "We work with teams looking to improve a digital experience, launch a product, or make their marketing more coherent. The right fit depends on the problem and available capacity, not a fixed company size.",
  },
  {
    question: "Can you work with our in-house team?",
    answer:
      "Yes. We can collaborate with internal marketing, design, engineering, and leadership teams, with responsibilities and review points agreed at the start.",
  },
  {
    question: "How do you scope a project?",
    answer:
      "We begin with the outcome, constraints, and evidence available. We then propose a clear scope, milestones, responsibilities, and any assumptions that could affect delivery.",
  },
  {
    question: "Do you guarantee commercial results?",
    answer:
      "No. We do not guarantee rankings, revenue, leads, or advertising returns. We agree meaningful measures, do careful work, and report findings honestly.",
  },
  {
    question: "Can you support a project after launch?",
    answer:
      "Where ongoing support is useful, we define a separate arrangement that fits the platform, team, and response expectations.",
  },
];

export const processSteps = [
  {
    number: "01",
    title: "Listen",
    text: "We learn about your customers, ambitions, constraints, and what has already been tried.",
  },
  {
    number: "02",
    title: "Find the focus",
    text: "We turn the brief into a shared problem, a clear scope, and a sensible measure of progress.",
  },
  {
    number: "03",
    title: "Make and test",
    text: "We work in visible increments, invite useful feedback, and test the details that matter.",
  },
  {
    number: "04",
    title: "Learn and improve",
    text: "We hand over clearly, review what changed, and help your team decide what should happen next.",
  },
];

export const teamDisciplines = [
  {
    number: "01",
    name: "Sabir",
    role: "Strategy & design",
    portrait: "/Sabir.png",
    linkedin: null as string | null,
    bio: "Shapes the brief, the story, and the decisions that keep the work useful from the first question to the final handoff.",
    expertise: ["Customer journeys", "Brand clarity", "Actionable positioning"],
    accent: "sage",
  },
  {
    number: "02",
    name: "Suleman",
    role: "Product & experience",
    portrait: "/Suleman.png",
    linkedin: null as string | null,
    bio: "Turns complexity into clear systems, making the important work easier to navigate, trust, and maintain.",
    expertise: [
      "UX systems",
      "Research synthesis",
      "Digital experience strategy",
    ],
    accent: "rose",
  },
  {
    number: "03",
    name: "Ali",
    role: "Technology & growth",
    portrait: "/ali.jpeg",
    linkedin: null as string | null,
    bio: "Connects product intent with sound implementation, thoughtful performance, and the practical realities of ongoing delivery.",
    expertise: ["Web foundations", "Integrations", "Product improvement"],
    accent: "blue",
  },
];
