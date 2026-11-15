// Blog posts. A post body is a list of blocks:
//   "plain text"              a paragraph
//   { h: "Heading" }          a section heading (also builds the contents list)
//   { ul: ["a", "b"] }        a bullet list      { ol: ["a", "b"] }  a numbered list
//   { tip: "text" }           a highlighted tip   { code: "text" }    a code sample
// Add a new post by copying one and giving it a new slug. Newest first on the site is sorted by date.
export const AUTHOR = { name: "MAF Tech Academy Team", role: "Instructors and admissions" };
export const POST_CATEGORIES = ["Office", "Career", "Data", "Web", "Design", "Learning"];

const raw = [
  {
    slug: "excel-skills-every-office-needs",
    title: "5 Excel skills every office needs",
    excerpt: "Sorting, filters, formulas, lookups and pivot tables, explained for beginners.",
    category: "Office", date: "2026-11-01", cover: "/blog/office.svg", course: "computer-basics-office",
    body: [
      "Almost every office job uses Excel. You do not need to know everything in it. Five skills cover most of the daily work, and you can learn all of them in a few weeks.",
      { h: "1. Sorting and filtering" },
      "Sorting puts your data in order, for example the biggest sales first. Filtering hides every row except the ones you want to see, such as one customer or one month. Together they turn a messy list into something you can read.",
      { tip: "Click any cell in your data and press Ctrl + T to turn it into a table. Sorting and filtering buttons appear automatically." },
      { h: "2. Basic formulas" },
      "Formulas let the sheet do the arithmetic. Learn these four first:",
      { ul: ["SUM adds a range of numbers", "AVERAGE finds the average", "COUNT counts how many numbers there are", "IF gives one answer or another, for example Pass or Fail"] },
      { h: "3. Looking things up" },
      "Lookup formulas find a value in one list and bring it into another. VLOOKUP works in every version of Excel. XLOOKUP is newer, simpler and available in Excel 2021 and Microsoft 365. If you can look up a price from a product code, you can save hours of copying by hand.",
      { h: "4. Pivot tables" },
      "A pivot table summarises thousands of rows into a small report in a few clicks, for example total sales for each month or each branch. It is the single skill that impresses managers the most.",
      { h: "5. Charts" },
      "A chart turns numbers into a picture your boss understands in five seconds. Start with a column chart for comparing things and a line chart for changes over time.",
      { h: "How to practise" },
      "Use real data. Track your own monthly expenses for a month, then sort them, total them by category and chart them. Our Computer Basics + Office course covers all five skills in four weeks.",
    ],
  },
  {
    slug: "get-first-freelance-client",
    title: "How to get your first freelance client",
    excerpt: "Build a small portfolio, price your work and send your first proposal.",
    category: "Career", date: "2026-11-03", cover: "/blog/career.svg", course: "web-development",
    body: [
      "Your first client is the hardest to get. Most people wait until they feel ready, but a small portfolio is enough to start.",
      { h: "Make two or three sample projects" },
      "A designer can redesign a local shop's logo. A web developer can build a one-page website for a friend's business. Choose real businesses around you, finish the work properly and put it online where anyone can see it.",
      { h: "Tell people what you do" },
      "Post your work on WhatsApp status and Instagram. Message small businesses that have no website or a weak online presence. Offer one clear service at one clear price, for example a one-page website for a fixed amount, instead of saying you can do anything.",
      { h: "Send a short proposal" },
      { ul: ["What you will do", "How long it will take", "What it costs", "What you need from the client"] },
      { tip: "Ask for half of the payment before you start. It protects your time and shows you are serious." },
      { h: "After the job" },
      "Ask the client for a short review and permission to show the work. A real review from a real customer is worth more than any certificate when you pitch the next client.",
    ],
  },
  {
    slug: "data-analyst-or-web-developer",
    title: "Data analyst or web developer: which first?",
    excerpt: "What each path involves, what you learn, and how to choose.",
    category: "Career", date: "2026-11-05", cover: "/blog/career.svg", course: "data-analytics",
    body: [
      "Both skills are in demand, and both can lead to an office job or freelance work. The right first choice depends on how you like to work.",
      { h: "Choose data analytics if you" },
      { ul: ["Enjoy numbers, patterns and finding answers", "Like working with spreadsheets and reports", "Want a role in finance, sales, logistics or research"] },
      "You learn Excel, SQL and Power BI. Companies in almost every industry collect data and need people who can explain what it means.",
      { h: "Choose web development if you" },
      { ul: ["Like building things you can see and share", "Enjoy solving puzzles step by step", "Want to freelance, build for local businesses or join a software team"] },
      "You learn HTML, CSS and JavaScript, and you can start earning by building simple websites long before you finish learning everything.",
      { h: "If you are still unsure" },
      "Start with Computer Basics + Office, which every other path builds on, then pick one. Many students learn both over time. Message us on WhatsApp and we will help you choose.",
    ],
  },
  {
    slug: "study-online-and-finish-the-course",
    title: "How to study online and actually finish the course",
    excerpt: "Seven habits that help online students stay on track from the first class to the certificate.",
    category: "Learning", date: "2026-11-09", cover: "/blog/learning.svg", course: null,
    body: [
      "Online classes give you freedom, and that is exactly why many people stop halfway. These habits help you finish.",
      { h: "1. Fix your class times" },
      "Treat each class like a meeting you cannot cancel. Put the days and times in your phone calendar with an alarm.",
      { h: "2. Choose one place to study" },
      "A table, a charged laptop and a phone on silent. Doing this every time tells your brain it is time to focus.",
      { h: "3. Practise straight after class" },
      "Within a few hours, repeat what the teacher showed you without looking at the notes. What you practise stays; what you only watch fades quickly.",
      { h: "4. Take short notes in your own words" },
      "Write the steps, not the whole lesson. When you get stuck later, your own notes are the fastest help.",
      { h: "5. Ask when you are stuck" },
      "Stuck for more than fifteen minutes? Ask your instructor. Everyone gets stuck, and the students who ask finish.",
      { h: "6. Track your progress" },
      "Mark each lesson as done in your student portal and watch the bar fill. Small wins keep you going.",
      { h: "7. Finish small, then finish big" },
      "Aim to complete one small piece every day, even if it is only twenty minutes. Fifteen minutes every day beats a long session once a week.",
      { tip: "Tell one friend or family member your finish date. People who say their goal out loud are far more likely to reach it." },
    ],
  },
  {
    slug: "what-is-sql",
    title: "What is SQL, and why do analysts use it?",
    excerpt: "A plain-English introduction to the language used to ask questions of databases.",
    category: "Data", date: "2026-10-29", cover: "/blog/data.svg", course: "data-analytics",
    body: [
      "SQL (pronounced \"ess-cue-ell\" or \"sequel\") stands for Structured Query Language. It is the standard way to ask questions of a database, such as: how many orders did we get last month, and which customers bought the most?",
      { h: "Why not just use Excel?" },
      "Excel is great for thousands of rows. Real businesses keep millions of rows in databases, often spread over several tables. SQL lets you pull exactly what you need from all of it in seconds.",
      { h: "Your first query" },
      "This asks for the names and cities of customers who live in Port Harcourt:",
      { code: "SELECT name, city\nFROM customers\nWHERE city = 'Port Harcourt'\nORDER BY name;" },
      { h: "The words you will use most" },
      { ul: ["SELECT chooses which columns to show", "FROM says which table to read", "WHERE keeps only the rows that match", "ORDER BY sorts the results", "GROUP BY makes totals for each group, such as sales per branch", "JOIN combines two tables, for example orders and customers"] },
      { h: "Is SQL hard to learn?" },
      "No. It reads like simple English, and a beginner can write useful queries after a few practice sessions. The skill that takes longer is knowing which question to ask, and that comes from practising on real data. That is why our Data Analytics course teaches SQL with real data sets.",
    ],
  },
  {
    slug: "html-css-javascript-explained",
    title: "HTML, CSS and JavaScript explained in plain English",
    excerpt: "The three languages behind every website, and what each one does.",
    category: "Web", date: "2026-10-24", cover: "/blog/web.svg", course: "web-development",
    body: [
      "Every website you have ever used is built from three languages. Think of a house.",
      { h: "HTML is the structure" },
      "HTML says what is on the page: headings, paragraphs, pictures, links and buttons. It is the walls and rooms of the house.",
      { code: "<h1>Welcome to my shop</h1>\n<p>We sell fresh bread every morning.</p>\n<button>Order now</button>" },
      { h: "CSS is the style" },
      "CSS controls how everything looks: colours, fonts, spacing and layout, including how the page rearranges itself on a phone. It is the paint and furniture.",
      { code: "h1 {\n  color: darkgreen;\n  font-size: 40px;\n}" },
      { h: "JavaScript is the behaviour" },
      "JavaScript makes the page respond: a menu that opens, a form that checks your answers, a counter that updates. It is the electricity and the doors that open.",
      { h: "Where to start" },
      "Learn them in this order: HTML first, then CSS, then JavaScript. Build a small page after each one so you are always making something. WordPress can then help you build client websites faster once you understand the basics.",
    ],
  },
  {
    slug: "keyboard-shortcuts-that-save-time",
    title: "12 keyboard shortcuts that save you an hour a day",
    excerpt: "Small tricks for Windows, Word, Excel and your browser that make you faster at everything.",
    category: "Office", date: "2026-10-19", cover: "/blog/office.svg", course: "computer-basics-office",
    body: [
      "Moving your hand from the keyboard to the mouse and back wastes more time than you think. These shortcuts work in Windows and in most programs.",
      { h: "Everyday editing" },
      { ul: ["Ctrl + C copies and Ctrl + V pastes", "Ctrl + X cuts", "Ctrl + Z undoes your last action and Ctrl + Y brings it back", "Ctrl + A selects everything", "Ctrl + S saves. Press it often"] },
      { h: "Finding and printing" },
      { ul: ["Ctrl + F finds a word on a page or in a document", "Ctrl + P opens the print window"] },
      { h: "Moving around Windows" },
      { ul: ["Alt + Tab switches between open programs", "Windows key + D shows the desktop", "Windows key + L locks your computer when you step away", "Windows key + Shift + S takes a screenshot of part of the screen"] },
      { h: "In your browser" },
      { ul: ["Ctrl + T opens a new tab", "Ctrl + Shift + T reopens the tab you just closed by mistake"] },
      { tip: "Pick three shortcuts and use them for a week before you learn more. Habits stick when you add them slowly." },
    ],
  },
  {
    slug: "five-design-rules-for-better-posters",
    title: "5 design rules that make any poster look better",
    excerpt: "You do not need talent. You need a few simple rules that every professional designer follows.",
    category: "Design", date: "2026-10-27", cover: "/blog/design.svg", course: "graphic-design",
    body: [
      "Good design is not magic. A handful of rules fix most of the posters and flyers you see around town.",
      { h: "1. Make one thing the star" },
      "Decide the most important message and make it the biggest. If everything is big, nothing stands out. This is called visual hierarchy.",
      { h: "2. Keep strong contrast" },
      "Dark text on a light background, or light text on a dark one. If people have to squint, they will walk past. Never put yellow text on white.",
      { h: "3. Use two fonts at most" },
      "One font for headings and one for the rest is plenty. Too many fonts make a design look messy and amateur.",
      { h: "4. Line things up and give them space" },
      "Align text and pictures along clear edges. Leave empty space around them. Empty space is not wasted, it lets the design breathe and makes the message easier to read.",
      { h: "5. Limit your colours" },
      "Pick two or three colours and use them everywhere. A logo colour plus one accent colour looks professional straight away.",
      { tip: "Squint at your design from across the room. If you can still see the main message and the main picture, the hierarchy is working." },
    ],
  },
];

const words = (b) => b.reduce((n, x) => n + (typeof x === "string" ? x : x.h || x.tip || x.code || [].concat(x.ul || x.ol || []).join(" ")).split(/\s+/).length, 0);

export const posts = raw
  .map((p) => ({ ...p, minutes: Math.max(2, Math.round(words(p.body) / 200)) }))
  .sort((a, b) => (a.date < b.date ? 1 : -1));
export const getPost = (slug) => posts.find((p) => p.slug === slug);
export const slugify = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
export const longDate = (d) => new Date(d + "T12:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
export const related = (post, n = 3) => {
  const same = posts.filter((p) => p.slug !== post.slug && p.category === post.category);
  const rest = posts.filter((p) => p.slug !== post.slug && p.category !== post.category);
  return [...same, ...rest].slice(0, n);
};
