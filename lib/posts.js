export const posts = [
  {
    slug: "excel-skills-every-office-needs",
    title: "5 Excel skills every office needs",
    excerpt: "Sorting, filters, formulas and pivot tables, explained for beginners.",
    date: "2026-11-01",
    body: [
      "Almost every office job uses Excel. You do not need to know everything. Five skills cover most daily work.",
      "1. Sorting and filtering: put data in order and show only the rows you need. 2. Basic formulas: SUM, AVERAGE, COUNT and IF let the sheet do the arithmetic for you. 3. VLOOKUP or XLOOKUP: find a price or name from another table in seconds.",
      "4. Pivot tables: summarise thousands of rows into a small report, for example sales by month. 5. Charts: turn the numbers into a picture your boss understands quickly.",
      "Practise on real data, like your own monthly expenses. Our Computer Basics + Office course covers all five in four weeks.",
    ],
  },
  {
    slug: "get-first-freelance-client",
    title: "How to get your first freelance client",
    excerpt: "Build a small portfolio, price your work and send your first proposal.",
    date: "2026-11-03",
    body: [
      "Your first client is the hardest. Most people wait until they feel ready, but a small portfolio is enough to start.",
      "Make two or three sample projects. A designer can redesign a local shop's logo. A web developer can build a one-page site for a friend's business. Put them online where anyone can see them.",
      "Then tell people. Post your work on WhatsApp status and Instagram, and message small businesses that have no website or weak social media. Offer a clear service and a clear price, not just 'I can do anything'.",
      "Send a short proposal: what you will do, how long it takes and what it costs. Ask for half the payment before you start. After the job, ask for a review you can show the next client.",
    ],
  },
  {
    slug: "data-analyst-or-web-developer",
    title: "Data analyst or web developer: which first?",
    excerpt: "What each job pays, what you learn, and how to choose.",
    date: "2026-11-05",
    body: [
      "Both skills are in demand, and both can lead to office jobs or freelance work. The right first choice depends on how you like to work.",
      "Data analytics suits people who enjoy numbers and finding answers. You learn Excel, SQL and Power BI, and companies use these skills in finance, sales and operations.",
      "Web development suits people who like building things you can see. You learn HTML, CSS and JavaScript, and you can earn by making websites for businesses.",
      "If you are unsure, start with Computer Basics + Office, then pick one. Many students learn both over time. Talk to us on WhatsApp and we will help you choose.",
    ],
  },
];
export const getPost = (slug) => posts.find((p) => p.slug === slug);
