const courseData = {
  title: "Interactive Computer Science Course",
  subtitle: "Beginner → Advanced | Practical Skills + Keyboard Shortcuts | Self-Paced Learning",
  modules: [
{
      id: 1,
      title: "Computer Fundamentals",
      short: "Meaning, history, types & basic parts",
      objectives: ["Define a computer and explain its importance", "Describe the history and generations of computers", "Identify different types of computers and their uses", "Follow computer laboratory rules", "Distinguish between hardware, software and input devices"],
      topics: [
        { title: "Meaning, Definition, Importance, Characteristics & Limitations", content: "<p>A <strong>computer</strong> is an electronic device that accepts data (input), processes it according to instructions, and produces meaningful information (output). It is one of the most important tools in modern life, used in education, business, healthcare, entertainment and communication. Understanding how a computer works helps you use it effectively and troubleshoot basic problems.</p><p><strong>Key Characteristics:</strong> Speed, Accuracy, Diligence, Storage capacity, Versatility.</p><p><strong>Limitations:</strong> Cannot think on its own, depends on human instructions, affected by power failure or viruses.</p>" },
        { title: "History and Generations of Computers", content: "<ul><li><strong>1st Generation:</strong> Vacuum tubes</li><li><strong>2nd Generation:</strong> Transistors</li><li><strong>3rd Generation:</strong> Integrated Circuits</li><li><strong>4th Generation:</strong> Microprocessors</li><li><strong>5th Generation:</strong> AI & modern computing</li></ul>" },
        { title: "Types of Computers and Their Uses", content: "<ul><li><strong>Desktop</strong> – Office & home</li><li><strong>Laptop</strong> – Portable work</li><li><strong>Tablet</strong> – Reading & light tasks</li><li><strong>Server</strong> – Network data</li><li><strong>Supercomputer</strong> – Scientific research</li></ul>" },
        { title: "Computer Laboratory Rules & Safety", content: "<ul><li>Keep the lab clean</li><li>No food or drink near computers</li><li>Handle equipment carefully</li><li>Report damage immediately</li><li>Log out and shut down properly</li></ul>" },
        { title: "Hardware, Software & Input Devices", content: "<p><strong>Hardware</strong> = physical parts. <strong>Software</strong> = programs. <strong>Input Devices</strong> = Keyboard, Mouse, Scanner, Microphone, Webcam, Touchscreen.</p>" }
      ],
      practice: ["List five input devices and one function of each.", "Write three laboratory rules.", "Classify: Windows 11, Mouse, Word, Printer, Chrome as Hardware or Software."],
      quiz: [
        { q: "Which is NOT a characteristic of a computer?", options: ["Speed", "Accuracy", "Emotions", "Storage capacity"], answer: 2 },
        { q: "First generation computers used:", options: ["Transistors", "Microprocessors", "Vacuum tubes", "ICs"], answer: 2 },
        { q: "A computer for complex scientific calculations is a:", options: ["Laptop", "Supercomputer", "Tablet", "Desktop"], answer: 1 },
        { q: "Which is an input device?", options: ["Monitor", "Printer", "Keyboard", "Speaker"], answer: 2 },
        { q: "Software that manages hardware is called:", options: ["Application software", "System software", "Utility", "Driver"], answer: 1 },
        { q: "Which generation introduced microprocessors?", options: ["1st", "2nd", "3rd", "4th"], answer: 3 },
        { q: "A tablet is best described as a:", options: ["Supercomputer", "Portable touch-screen computer", "Server", "Mainframe"], answer: 1 },
        { q: "Which is an example of system software?", options: ["Microsoft Word", "Google Chrome", "Windows operating system", "Photoshop"], answer: 2 }
      ]
    },
{
      id: 2,
      title: "Hardware, Keyboard & Basic Operations",
      short: "Devices, power controls, mouse & shortcuts",
      objectives: ["Identify output and storage devices", "Connect components safely", "Start up, shut down and lock a computer", "Use mouse and keyboard correctly", "Apply common keyboard shortcuts"],
      topics: [
        { title: "Output Devices, Storage Devices & System Unit", content: "<p><strong>Output:</strong> Monitor, Printer, Speakers. <strong>Storage:</strong> HDD, SSD, Flash Drive, Memory Card, Optical Disc.</p>" },
        { title: "Connecting Peripherals", content: "<p>Match correct ports (HDMI/VGA, USB). Modern USB can be hot-plugged.</p>" },
        { title: "Powering On, Restarting, Signing Out, Locking & Shutting Down", content: "<ul><li>Power On – Power button</li><li>Sign Out – End session</li><li>Lock – Windows + L</li><li>Restart / Shut Down from Start menu</li></ul>" },
        { title: "Mouse Skills & Typing Posture", content: "<p>Click, Double-click, Right-click, Drag, Scroll. Sit upright, feet flat, wrists straight.</p>" },
        { title: "Essential Keyboard Shortcuts", content: "<ul><li>Ctrl+C Copy • Ctrl+V Paste • Ctrl+X Cut • Ctrl+Z Undo</li><li>Ctrl+S Save • Ctrl+A Select All • Ctrl+P Print</li><li>Alt+Tab Switch windows • Windows+L Lock</li></ul>" }
      ],
      practice: ["Practise Copy, Paste, Undo, Save without looking.", "Identify three storage devices.", "Demonstrate shut down and lock."],
      quiz: [
        { q: "Fastest storage device?", options: ["HDD", "SSD", "Optical Disc", "Floppy"], answer: 1 },
        { q: "Shortcut to lock Windows?", options: ["Ctrl+L", "Alt+L", "Windows+L", "Shift+L"], answer: 2 },
        { q: "Which is an output device?", options: ["Keyboard", "Scanner", "Monitor", "Mouse"], answer: 2 },
        { q: "Ctrl+Z is used to:", options: ["Copy", "Paste", "Undo", "Save"], answer: 2 },
        { q: "To end session but leave PC on:", options: ["Shut down", "Restart", "Sign out", "Hibernate"], answer: 2 },
        { q: "Which port is commonly used for modern monitors?", options: ["VGA only", "HDMI", "Parallel", "PS/2"], answer: 1 },
        { q: "What does SSD stand for?", options: ["Super Speed Drive", "Solid State Drive", "System Storage Disk", "Secondary Storage Device"], answer: 1 },
        { q: "Which action should you take before unplugging a USB drive?", options: ["Just pull it", "Safely eject it", "Restart the PC", "Close the browser only"], answer: 1 }
      ]
    },
{
      id: 3,
      title: "Windows and File Management",
      short: "OS, desktop, files, folders & USB safety",
      objectives: ["Explain the role of an OS", "Navigate desktop and taskbar", "Create, save, copy and delete files/folders", "Use File Explorer and Recycle Bin", "Safely eject USB drives"],
      topics: [
        { title: "Operating Systems & Windows", content: "<p>An OS manages hardware and software. Windows is the most common desktop OS. The operating system acts as a bridge between you and the computer hardware. Without it, application programs cannot run. Popular examples include Windows, macOS, Linux, Android and iOS.</p>" },
        { title: "Desktop, Icons, Start Menu & Taskbar", content: "<p>Desktop is the main screen. Icons represent programs/files. Start Menu launches apps. Taskbar shows running programs.</p>" },
        { title: "Creating, Naming & Saving Files/Folders", content: "<p>Use meaningful names. Organise with folders. Common extensions: .docx, .xlsx, .pptx, .pdf, .jpg.</p>" },
        { title: "Copying, Moving, Deleting & Recycle Bin", content: "<p>Ctrl+C Copy, Ctrl+X Cut, Delete sends to Recycle Bin.</p>" },
        { title: "Removable Storage Safety", content: "<p>Always use “Safely Remove Hardware” or Eject before unplugging USB drives.</p>" }
      ],
      practice: ["Create folder “My Computer Course” with subfolders.", "Create, copy and move a text file.", "Delete and restore a test file."],
      quiz: [
        { q: "Software that manages hardware is:", options: ["Application", "Operating System", "Utility", "Browser"], answer: 1 },
        { q: "Action that sends file to Recycle Bin:", options: ["Copy", "Cut", "Delete", "Rename"], answer: 2 },
        { q: "Before removing USB you should:", options: ["Pull it out", "Restart", "Safely Remove / Eject", "Shut down"], answer: 2 },
        { q: "Ctrl+X is used to:", options: ["Copy", "Paste", "Cut", "Undo"], answer: 2 },
        { q: "Bar at bottom of Windows screen:", options: ["Menu bar", "Taskbar", "Title bar", "Status bar"], answer: 1 },
        { q: "What does OS stand for?", options: ["Open Software", "Operating System", "Online Service", "Output System"], answer: 1 },
        { q: "Where do deleted files go by default?", options: ["Desktop", "Downloads", "Recycle Bin", "Documents"], answer: 2 },
        { q: "Which key combination is commonly used to copy?", options: ["Ctrl + V", "Ctrl + C", "Ctrl + X", "Ctrl + Z"], answer: 1 }
      ]
    },
{
      id: 4,
      title: "Microsoft Word & Document Production",
      short: "Create, format, tables, headers & PDF",
      objectives: ["Create and edit Word documents", "Apply text and paragraph formatting", "Set up pages, headers and footers", "Insert tables and pictures", "Proofread and export as PDF"],
      topics: [
        { title: "Word Processing Basics", content: "<p>Create, Save (Ctrl+S), Open, Type and edit text.</p>" },
        { title: "Text & Paragraph Formatting", content: "<p>Font, size, colour, Bold, Italic, Underline. Alignment, line spacing, bullets and numbering.</p>" },
        { title: "Page Setup, Headers & Footers", content: "<p>Margins, orientation, paper size. Headers at top, footers at bottom.</p>" },
        { title: "Tables, Pictures & Symbols", content: "<p>Insert → Table, Pictures, Shapes.</p>" },
        { title: "Proofreading & Exporting to PDF", content: "<p>Use Spelling & Grammar (Review tab). Export as PDF.</p>" }
      ],
      practice: ["Type a formal letter of at least 150 words.", "Format with fonts, alignment and header.", "Insert table + picture and export as PDF."],
      quiz: [
        { q: "Shortcut to save:", options: ["Ctrl+P", "Ctrl+S", "Ctrl+O", "Ctrl+N"], answer: 1 },
        { q: "To centre text use:", options: ["Bold", "Align Centre", "Justify", "Indent"], answer: 1 },
        { q: "Headers appear:", options: ["First page only", "Every page by default", "Only when printing", "Only in PDF"], answer: 1 },
        { q: "Best format for view-only sharing:", options: [".docx", ".txt", ".pdf", ".rtf"], answer: 2 },
        { q: "Spelling checker is under which tab?", options: ["Home", "Insert", "Review", "Design"], answer: 2 },
        { q: "Which tab contains the Spelling & Grammar tool?", options: ["Home", "Insert", "Review", "Design"], answer: 2 },
        { q: "What does PDF stand for?", options: ["Personal Document File", "Portable Document Format", "Print Document File", "Public Data Format"], answer: 1 },
        { q: "To make text bold you can press:", options: ["Ctrl + I", "Ctrl + B", "Ctrl + U", "Ctrl + S"], answer: 1 }
      ]
    },
{
      id: 5,
      title: "Excel, PowerPoint & Digital Productivity",
      short: "Spreadsheets, formulas, charts & slides",
      objectives: ["Navigate Excel and enter data", "Write formulas and use functions", "Sort, filter and create charts", "Create PowerPoint slides", "Design and deliver a presentation"],
      topics: [
        { title: "Excel Basics", content: "<p>Workbooks contain Worksheets made of rows, columns and cells.</p>" },
        { title: "Formulas & Functions", content: "<p>All formulas start with =. SUM, AVERAGE, MIN, MAX, COUNT, IF. Formulas allow Excel to calculate results automatically. When data changes, the results update instantly. Absolute references ($A$1) stay fixed when you copy a formula, while relative references adjust automatically.</p>" },
        { title: "Sorting, Filtering & Charts", content: "<p>Sort and filter data. Create Column, Pie, Line or Bar charts.</p>" },
        { title: "Creating PowerPoint Slides", content: "<p>One main idea per slide, large fonts, relevant images, limited text.</p>" },
        { title: "Delivering a Presentation", content: "<p>Add transitions. Face the audience, speak clearly.</p>" }
      ],
      practice: ["Create a class score sheet with SUM and AVERAGE.", "Create a column chart of averages.", "Design a 5-slide presentation on Safe Internet Use."],
      quiz: [
        { q: "Excel formulas begin with:", options: ["+", "=", "@", "#"], answer: 1 },
        { q: "Function that adds a range:", options: ["AVERAGE", "COUNT", "SUM", "MAX"], answer: 2 },
        { q: "To stop a reference changing when copied:", options: ["Relative", "Absolute", "Mixed only", "Nothing"], answer: 1 },
        { q: "Good PowerPoint slide has:", options: ["Lots of text", "One main idea + limited text", "Many fonts", "No images"], answer: 1 },
        { q: "Best chart for parts of a whole:", options: ["Line", "Pie", "Scatter", "Area"], answer: 1 },
        { q: "In Excel, the intersection of a row and column is called a:", options: ["Table", "Cell", "Sheet", "Book"], answer: 1 },
        { q: "Which chart is best for showing trends over time?", options: ["Pie chart", "Line chart", "Doughnut chart", "Radar chart"], answer: 1 },
        { q: "A PowerPoint presentation is made of:", options: ["Sheets", "Slides", "Cells", "Pages only"], answer: 1 }
      ]
    },
{
      id: 6,
      title: "Internet, Email & Online Skills",
      short: "Web, browsing, email, cloud & netiquette",
      objectives: ["Explain internet, WWW and intranet", "Search the web effectively", "Manage email accounts", "Use cloud storage", "Practise good netiquette"],
      topics: [
        { title: "Internet, Intranet & WWW", content: "<p><strong>Internet</strong> = global network. <strong>WWW</strong> = interlinked web pages. <strong>Intranet</strong> = private network.</p>" },
        { title: "Browsers & Effective Searching", content: "<p>URL is a web address. Use specific keywords and evaluate sources.</p>" },
        { title: "Email Skills", content: "<p>Professional address, clear subject, proper greeting/closing.</p>" },
        { title: "Cloud Storage", content: "<p>Google Drive, OneDrive, Dropbox. Check sharing permissions.</p>" },
        { title: "Netiquette & Social Media", content: "<p>Be respectful online. Think before you post. Protect privacy.</p>" }
      ],
      practice: ["Send a formal email with attachment.", "Share a Drive/OneDrive file with view-only permission.", "Write five netiquette rules."],
      quiz: [
        { q: "Global network of computers is the:", options: ["Intranet", "WWW", "Internet", "Browser"], answer: 2 },
        { q: "https://www.example.com is a:", options: ["Search engine", "URL", "Browser", "Domain only"], answer: 1 },
        { q: "To reply to only one person use:", options: ["Reply All", "Forward", "Reply", "CC"], answer: 2 },
        { q: "Cloud storage example:", options: ["Word", "Google Drive", "Notepad", "Paint"], answer: 1 },
        { q: "Good netiquette includes:", options: ["Angry posts", "Sharing private photos", "Being respectful", "ALL CAPS"], answer: 2 },
        { q: "What does URL stand for?", options: ["Universal Resource Locator", "Uniform Resource Locator", "Unique Reference Link", "User Resource List"], answer: 1 },
        { q: "Which protocol is more secure for websites?", options: ["HTTP", "HTTPS", "FTP", "SMTP"], answer: 1 },
        { q: "Cloud storage allows you to:", options: ["Only print files", "Access files from any internet-connected device", "Delete the operating system", "Speed up the CPU"], answer: 1 }
      ]
    },
{
      id: 7,
      title: "Programming, Networking & Emerging Tech",
      short: "Algorithms, coding basics, networks & AI",
      objectives: ["Apply computational thinking", "Write algorithms and flowcharts", "Understand basic programming concepts", "Describe networks and devices", "Discuss AI and digital careers"],
      topics: [
        { title: "Computational Thinking & Algorithms", content: "<p>Decomposition, pattern recognition, abstraction, algorithms. Pseudocode and flowcharts.</p>" },
        { title: "Programming Concepts", content: "<p>Variables, data types, operators, input/output, if/else decisions, loops.</p>" },
        { title: "Databases", content: "<p>Tables, fields, records, primary keys.</p>" },
        { title: "Computer Networks", content: "<p>PAN, LAN, MAN, WAN. Devices: Modem, Router, Switch, Access Point.</p>" },
        { title: "AI, Robotics & Careers", content: "<p>AI performs tasks requiring human intelligence. Careers: Web Dev, Cybersecurity, Data Analyst, etc.</p>" }
      ],
      practice: ["Write pseudocode + flowchart for average of 3 scores.", "List four digital careers that interest you.", "Complete a small final project."],
      quiz: [
        { q: "Breaking a problem into smaller parts:", options: ["Pattern recognition", "Abstraction", "Decomposition", "Algorithm"], answer: 2 },
        { q: "Flowchart decision symbol:", options: ["Oval", "Rectangle", "Diamond", "Parallelogram"], answer: 2 },
        { q: "A variable is used to:", options: ["Style pages", "Store data", "Connect internet", "Print"], answer: 1 },
        { q: "School network type:", options: ["WAN", "MAN", "LAN", "PAN"], answer: 2 },
        { q: "Emerging technology example:", options: ["Typewriters", "Artificial Intelligence", "Floppy disks", "Dial-up only"], answer: 1 },
        { q: "Pseudocode is:", options: ["Actual programming language", "Plain language description of an algorithm", "A type of virus", "Hardware component"], answer: 1 },
        { q: "Which network covers a city?", options: ["PAN", "LAN", "MAN", "WAN"], answer: 2 },
        { q: "AI stands for:", options: ["Automatic Internet", "Artificial Intelligence", "Advanced Input", "Application Interface"], answer: 1 }
      ]
    },
{
      id: 8,
      title: "Essential Windows Keyboard Shortcuts",
      short: "Daily productivity shortcuts",
      objectives: ["Use Windows key shortcuts fluently", "Navigate windows quickly", "Master text editing shortcuts", "Apply File Explorer shortcuts", "Combine shortcuts for speed"],
      topics: [
        { title: "Windows Key Shortcuts", content: "<ul><li><code>Win + E</code> – File Explorer</li><li><code>Win + D</code> – Show Desktop</li><li><code>Win + L</code> – Lock PC</li><li><code>Win + I</code> – Settings</li><li><code>Win + S</code> – Search</li><li><code>Win + Tab</code> – Task View</li><li><code>Win + V</code> – Clipboard history</li></ul>" },
        { title: "Window Management", content: "<ul><li><code>Alt + Tab</code> – Switch apps</li><li><code>Win + Left/Right</code> – Snap window</li><li><code>Win + Up/Down</code> – Maximise / Minimise</li><li><code>Alt + F4</code> – Close window</li><li><code>Ctrl + Shift + Esc</code> – Task Manager</li></ul>" },
        { title: "Text Editing", content: "<ul><li><code>Ctrl + C / V / X / Z / Y</code></li><li><code>Ctrl + A</code> Select All</li><li><code>Ctrl + B/I/U</code> Bold/Italic/Underline</li><li><code>Ctrl + Backspace</code> Delete previous word</li></ul>" },
        { title: "File Explorer", content: "<ul><li><code>Ctrl + N</code> New window</li><li><code>Ctrl + Shift + N</code> New folder</li><li><code>F2</code> Rename</li><li><code>Alt + Up</code> Go up one folder</li></ul>" },
        { title: "Browser Shortcuts", content: "<ul><li><code>Ctrl + T</code> New tab</li><li><code>Ctrl + W</code> Close tab</li><li><code>Ctrl + Shift + T</code> Reopen closed tab</li><li><code>Ctrl + L</code> Address bar</li><li><code>Ctrl + D</code> Bookmark</li></ul>" }
      ],
      practice: ["Practise 10 Windows key shortcuts until muscle memory.", "Snap two windows side by side using only keyboard.", "Create and rename a folder using only shortcuts."],
      quiz: [
        { q: "Shortcut to open File Explorer:", options: ["Win + F", "Win + E", "Win + D", "Win + S"], answer: 1 },
        { q: "Show desktop quickly:", options: ["Win + E", "Win + D", "Alt + Tab", "Win + L"], answer: 1 },
        { q: "Open Task Manager:", options: ["Ctrl + Alt + Del only", "Ctrl + Shift + Esc", "Win + T", "Alt + F4"], answer: 1 },
        { q: "Reopen last closed browser tab:", options: ["Ctrl + T", "Ctrl + Shift + T", "Ctrl + W", "Ctrl + N"], answer: 1 },
        { q: "Clipboard history shortcut:", options: ["Win + C", "Win + V", "Ctrl + V", "Win + H"], answer: 1 }
      ]
    },
{
      id: 9,
      title: "File Explorer Power Tips",
      short: "Advanced navigation and file management",
      objectives: ["Use the navigation pane effectively", "Apply quick access and pinned folders", "Search inside File Explorer", "Use View options and Preview pane", "Perform bulk file operations"],
      topics: [
        { title: "Navigation Pane & Quick Access", content: "<p>Pin frequent folders to Quick Access. Drag folders to pin them.</p>" },
        { title: "Address Bar & Search", content: "<p>Click address bar or press Ctrl+L. Use the search box to find files.</p>" },
        { title: "View Options & Layouts", content: "<p>Details, List, Tiles views. Sort by Name, Date, Size. Enable Preview pane (Alt+P).</p>" },
        { title: "Selecting & Bulk Operations", content: "<p>Ctrl+Click for multiple, Shift+Click for range, Ctrl+A for all.</p>" },
        { title: "Hidden Files & Extensions", content: "<p>View → Show → Hidden items. Always show file extensions.</p>" }
      ],
      practice: ["Pin your course folder to Quick Access.", "Search for all .pdf files.", "Enable file extensions and Preview pane."],
      quiz: [
        { q: "To pin a folder to Quick Access:", options: ["Copy it", "Drag it to Quick Access", "Rename it", "Delete it"], answer: 1 },
        { q: "Preview pane shortcut:", options: ["Alt + P", "Ctrl + P", "Win + P", "Alt + V"], answer: 0 },
        { q: "Select a range of files:", options: ["Ctrl + Click", "Shift + Click", "Alt + Click", "Double-click"], answer: 1 },
        { q: "Why show file extensions?", options: ["Looks nicer", "Recognise file types safely", "Faster computer", "Required by Windows"], answer: 1 },
        { q: "Search box finds:", options: ["Only folders", "Files by name/type/content", "Only images", "Internet results"], answer: 1 }
      ]
    },
{
      id: 10,
      title: "Windows Search & Finding Anything Fast",
      short: "Search like a pro",
      objectives: ["Use Windows Search effectively", "Search by file type and date", "Find settings and apps quickly", "Use search filters", "Improve search indexing"],
      topics: [
        { title: "Opening Search", content: "<p>Press <code>Win + S</code>. Type app names, settings, or file names.</p>" },
        { title: "Search Filters", content: "<p>Filter by Documents, Folders, Apps, Settings, Photos. Use date filters.</p>" },
        { title: "Finding Settings", content: "<p>Type the setting name (e.g. “display”, “wifi”) directly in Search.</p>" },
        { title: "File Content Search", content: "<p>Windows can search inside documents when indexing is on.</p>" },
        { title: "Search Tips", content: "<p>Use quotes for exact phrases. Type file extensions (.pdf, .docx).</p>" }
      ],
      practice: ["Find Display settings using only Search.", "Search for Word documents modified this week.", "Locate Calculator via Search and pin it."],
      quiz: [
        { q: "Quickest way to open Windows Search:", options: ["Win + E", "Win + S", "Ctrl + F", "Alt + S"], answer: 1 },
        { q: "To find a setting:", options: ["Open Control Panel only", "Type its name in Search", "Restart computer", "Use Run dialog only"], answer: 1 },
        { q: "Search can filter by:", options: ["Only name", "Type, date, kind", "Colour only", "Size only"], answer: 1 },
        { q: "Quotes in search are used for:", options: ["Faster results", "Exact phrases", "Images only", "Deleting files"], answer: 1 },
        { q: "Indexing helps Windows:", options: ["Run faster games", "Find files faster", "Save battery", "Update software"], answer: 1 }
      ]
    },
{
      id: 11,
      title: "Task Manager – Monitoring & Ending Programs",
      short: "Control running apps and performance",
      objectives: ["Open Task Manager quickly", "End unresponsive programs", "Read CPU, Memory and Disk usage", "Manage startup programs", "Identify resource hogs"],
      topics: [
        { title: "Opening Task Manager", content: "<p>Best shortcut: <code>Ctrl + Shift + Esc</code>.</p>" },
        { title: "Processes Tab", content: "<p>See running apps. Right-click → End task for frozen programs.</p>" },
        { title: "Performance Tab", content: "<p>Live graphs for CPU, Memory, Disk, Network, GPU.</p>" },
        { title: "Startup Apps", content: "<p>Disable programs that start automatically and slow boot time.</p>" },
        { title: "When to Use It", content: "<p>Frozen app, slow computer, checking resource usage.</p>" }
      ],
      practice: ["Open Task Manager with the keyboard shortcut.", "Identify the process using the most memory.", "Review and disable 1–2 unnecessary startup apps."],
      quiz: [
        { q: "Fastest Task Manager shortcut:", options: ["Ctrl + Alt + Del", "Ctrl + Shift + Esc", "Win + T", "Alt + F4"], answer: 1 },
        { q: "To close a frozen program:", options: ["Restart only", "End task in Task Manager", "Unplug PC", "Wait forever"], answer: 1 },
        { q: "Startup apps affect:", options: ["Only battery", "Boot time and performance", "Wallpaper", "File names"], answer: 1 },
        { q: "Performance tab shows:", options: ["Only CPU", "CPU, Memory, Disk, Network", "Only internet speed", "Installed programs"], answer: 1 },
        { q: "High disk usage can make PC:", options: ["Faster", "Very slow", "Change colour", "Lose files"], answer: 1 }
      ]
    },
{
      id: 12,
      title: "Multiple Desktops & Window Snapping",
      short: "Organise your workspace like a pro",
      objectives: ["Create and switch virtual desktops", "Snap windows into layouts", "Use Task View effectively", "Move windows between desktops", "Boost multitasking productivity"],
      topics: [
        { title: "Virtual Desktops", content: "<p><code>Win + Tab</code> opens Task View. Click “New desktop”.</p>" },
        { title: "Switching Desktops", content: "<p><code>Win + Ctrl + Left/Right</code> switches desktops. <code>Win + Ctrl + D</code> creates new one.</p>" },
        { title: "Snap Layouts", content: "<p>Hover over Maximise or press <code>Win + Z</code> (Windows 11).</p>" },
        { title: "Classic Snapping", content: "<p><code>Win + Left/Right Arrow</code> snaps to side. <code>Win + Up</code> maximises.</p>" },
        { title: "Productivity Workflow", content: "<p>One desktop for research, another for documents, another for communication.</p>" }
      ],
      practice: ["Create two virtual desktops and move apps between them.", "Snap two windows side by side.", "Practise Win + Ctrl + Left/Right switching."],
      quiz: [
        { q: "Open Task View:", options: ["Win + E", "Win + Tab", "Alt + Tab", "Win + D"], answer: 1 },
        { q: "Create new virtual desktop:", options: ["Win + D", "Win + Ctrl + D", "Win + N", "Ctrl + N"], answer: 1 },
        { q: "Snap window to left half:", options: ["Win + Left Arrow", "Win + Up", "Alt + Left", "Ctrl + Left"], answer: 0 },
        { q: "Virtual desktops help you:", options: ["Download faster", "Organise different tasks", "Save battery only", "Change theme"], answer: 1 },
        { q: "Win + Z in Windows 11 opens:", options: ["Settings", "Snap layouts", "File Explorer", "Search"], answer: 1 }
      ]
    },
{
      id: 13,
      title: "Clipboard History & Copy-Paste Tricks",
      short: "Never lose copied items again",
      objectives: ["Enable and use Clipboard history", "Pin important clipped items", "Paste as plain text", "Use multiple copied items", "Clear clipboard when needed"],
      topics: [
        { title: "Enabling Clipboard History", content: "<p>Press <code>Win + V</code>. Turn on Clipboard history if prompted.</p>" },
        { title: "Using Clipboard History", content: "<p>Copy several things, then press Win + V and click the one you want.</p>" },
        { title: "Paste Special & Plain Text", content: "<p>Ctrl+Shift+V in many apps pastes without formatting.</p>" },
        { title: "Cloud Clipboard", content: "<p>Sign in with Microsoft account to sync clipboard across devices.</p>" },
        { title: "Clearing Clipboard", content: "<p>Open Win + V → Clear all. Useful after copying passwords.</p>" }
      ],
      practice: ["Turn on Clipboard history.", "Copy 5 different items then paste them using Win + V.", "Practise pasting as plain text."],
      quiz: [
        { q: "Clipboard history shortcut:", options: ["Win + C", "Win + V", "Ctrl + V", "Win + H"], answer: 1 },
        { q: "Clipboard history lets you:", options: ["Copy only once", "Access multiple copied items", "Delete files", "Change fonts"], answer: 1 },
        { q: "To paste without formatting often use:", options: ["Ctrl + V", "Ctrl + Shift + V", "Ctrl + C", "Alt + V"], answer: 1 },
        { q: "Pinning an item in clipboard:", options: ["Deletes it", "Keeps it available longer", "Prints it", "Shares it"], answer: 1 },
        { q: "Clear clipboard for privacy when:", options: ["After copying passwords", "Every hour", "Never", "Only on shutdown"], answer: 0 }
      ]
    },
{
      id: 14,
      title: "Screenshots & Screen Recording",
      short: "Capture anything on your screen",
      objectives: ["Take full and partial screenshots", "Use Snipping Tool", "Record the screen", "Edit and save captures", "Share screenshots easily"],
      topics: [
        { title: "Quick Screenshots", content: "<ul><li><code>PrtScn</code> – Full screen to clipboard</li><li><code>Win + PrtScn</code> – Full screen saved to folder</li><li><code>Alt + PrtScn</code> – Active window only</li></ul>" },
        { title: "Snipping Tool", content: "<p><code>Win + Shift + S</code> opens snipping bar. Choose Rectangular, Freeform, Window or Full-screen.</p>" },
        { title: "Screen Recording", content: "<p>Win + G opens Xbox Game Bar. Use Win + Alt + R to start/stop recording.</p>" },
        { title: "Editing Captures", content: "<p>Crop, highlight, annotate, then save as PNG or JPG.</p>" },
        { title: "Best Practices", content: "<p>Use rectangular snip for most cases. Annotate before sharing.</p>" }
      ],
      practice: ["Take a rectangular snip using Win + Shift + S.", "Record a short 20-second video of your screen.", "Annotate a screenshot and save it."],
      quiz: [
        { q: "Best shortcut for quick snip:", options: ["PrtScn", "Win + Shift + S", "Win + S", "Alt + S"], answer: 1 },
        { q: "Win + PrtScn does what?", options: ["Opens Paint", "Saves full screenshot to folder", "Copies only", "Records video"], answer: 1 },
        { q: "Screen recording tool built into Windows:", options: ["Paint", "Xbox Game Bar", "Notepad", "Word"], answer: 1 },
        { q: "Record start/stop shortcut:", options: ["Win + R", "Win + Alt + R", "Ctrl + R", "Alt + R"], answer: 1 },
        { q: "Recommended format for screenshots:", options: ["TXT", "PNG or JPG", "EXE", "MP3"], answer: 1 }
      ]
    },
{
      id: 15,
      title: "Bluetooth Devices Setup",
      short: "Connect phones, speakers, headphones",
      objectives: ["Turn Bluetooth on/off", "Pair common devices", "Troubleshoot connection issues", "Manage paired devices", "Use Bluetooth file transfer basics"],
      topics: [
        { title: "Turning Bluetooth On", content: "<p>Quick Settings (Win + A) or Settings → Bluetooth & devices.</p>" },
        { title: "Pairing a Device", content: "<p>Put device in pairing mode. On PC click Add device → Bluetooth.</p>" },
        { title: "Common Devices", content: "<p>Headphones, speakers, mouse, keyboard, smartphone.</p>" },
        { title: "Troubleshooting", content: "<p>Forget device and re-pair. Restart Bluetooth. Move closer.</p>" },
        { title: "Managing Devices", content: "<p>Settings → Bluetooth & devices shows all paired devices.</p>" }
      ],
      practice: ["Turn Bluetooth on and view available devices.", "Pair a phone or headphones if available.", "Remove a device and re-pair it."],
      quiz: [
        { q: "Quick Settings shortcut:", options: ["Win + A", "Win + S", "Win + E", "Win + I"], answer: 0 },
        { q: "First step to pair:", options: ["Restart PC", "Put device in pairing mode", "Delete all devices", "Turn off Wi-Fi"], answer: 1 },
        { q: "Bluetooth range is typically:", options: ["Several kilometres", "About 10 metres", "Unlimited", "Only 10 cm"], answer: 1 },
        { q: "If connection fails try:", options: ["Buying new PC", "Forget and re-pair", "Changing wallpaper", "Closing Word"], answer: 1 },
        { q: "Paired devices are managed in:", options: ["Paint", "Bluetooth & devices settings", "Recycle Bin", "Taskbar only"], answer: 1 }
      ]
    },
{
      id: 16,
      title: "USB & External Drives Best Practices",
      short: "Use removable storage safely",
      objectives: ["Safely eject drives", "Transfer files efficiently", "Scan for viruses", "Format drives when needed", "Organise external storage"],
      topics: [
        { title: "Safe Ejection", content: "<p>Always click “Safely Remove Hardware” or right-click → Eject before unplugging.</p>" },
        { title: "Transferring Files", content: "<p>Copy-paste or drag-and-drop. Use USB 3.0 ports (usually blue) for speed.</p>" },
        { title: "Virus Scanning", content: "<p>Right-click the drive → Scan with Windows Security before opening unknown files.</p>" },
        { title: "Formatting", content: "<p>Right-click drive → Format. NTFS for Windows-only, exFAT for cross-platform.</p>" },
        { title: "Organisation Tips", content: "<p>Create clear folders. Keep a backup of important contents.</p>" }
      ],
      practice: ["Practise safely ejecting a USB drive.", "Copy a folder to USB and verify the files.", "Scan a USB drive with Windows Security."],
      quiz: [
        { q: "Before unplugging USB always:", options: ["Just pull it", "Safely Eject / Remove", "Restart PC", "Close browser"], answer: 1 },
        { q: "USB 3.0 ports are often:", options: ["Black", "Blue", "Red", "Green"], answer: 1 },
        { q: "Formatting a drive:", options: ["Speeds internet", "Erases all data", "Installs Windows", "Creates documents"], answer: 1 },
        { q: "Best practice for unknown USB:", options: ["Open everything", "Scan for viruses first", "Delete Windows", "Ignore it"], answer: 1 },
        { q: "exFAT is useful because:", options: ["Only for photos", "Works across Windows and Mac", "Faster than SSD", "Needs internet"], answer: 1 }
      ]
    },
{
      id: 17,
      title: "Desktop Shortcuts & Organisation",
      short: "Clean and efficient desktop",
      objectives: ["Create desktop shortcuts", "Organise icons", "Use desktop folders", "Apply auto-arrange and align", "Maintain a productive desktop"],
      topics: [
        { title: "Creating Shortcuts", content: "<p>Right-click app/file → Create shortcut. Or drag with right mouse button.</p>" },
        { title: "Pinning vs Shortcuts", content: "<p>Pin to Taskbar or Start for frequent apps. Desktop shortcuts for files/folders.</p>" },
        { title: "Organising Icons", content: "<p>Right-click Desktop → View → Auto arrange / Align to grid.</p>" },
        { title: "Desktop Folders", content: "<p>Create folders (School, Personal, Projects) to reduce clutter.</p>" },
        { title: "Clean Desktop Habits", content: "<p>Only keep currently needed items. A clean desktop reduces stress.</p>" }
      ],
      practice: ["Create desktop shortcuts for 3 frequently used apps/folders.", "Organise icons into 2–3 folders.", "Enable Align icons to grid."],
      quiz: [
        { q: "To create a shortcut:", options: ["Delete the file", "Right-click → Create shortcut", "Format the drive", "Change wallpaper"], answer: 1 },
        { q: "Pinning an app to Taskbar:", options: ["Deletes it", "Keeps it easily accessible", "Hides it", "Prints it"], answer: 1 },
        { q: "Auto arrange icons helps:", options: ["Speed up internet", "Keep desktop tidy", "Install software", "Change password"], answer: 1 },
        { q: "Best way to reduce desktop clutter:", options: ["More icons", "Use folders", "Bigger icons", "Turn off PC"], answer: 1 },
        { q: "Desktop shortcuts point to:", options: ["Nothing", "The original file or app", "The Recycle Bin only", "Internet only"], answer: 1 }
      ]
    },
{
      id: 18,
      title: "Windows Settings Deep Dive",
      short: "Master the Settings app",
      objectives: ["Navigate Settings categories", "Change display and sound", "Manage accounts and privacy", "Update Windows", "Use search inside Settings"],
      topics: [
        { title: "Opening Settings", content: "<p><code>Win + I</code> is the fastest way.</p>" },
        { title: "System Category", content: "<p>Display, Sound, Notifications, Power & battery, Storage.</p>" },
        { title: "Devices & Network", content: "<p>Bluetooth, Printers, Mouse, Network & internet.</p>" },
        { title: "Accounts & Privacy", content: "<p>Sign-in options, Family safety, Privacy permissions for apps.</p>" },
        { title: "Update & Security", content: "<p>Windows Update, Windows Security, Backup, Recovery.</p>" }
      ],
      practice: ["Open Settings with Win + I.", "Change display scaling or night light.", "Check for Windows updates."],
      quiz: [
        { q: "Fastest way to open Settings:", options: ["Win + E", "Win + I", "Win + S", "Ctrl + I"], answer: 1 },
        { q: "Display resolution is found under:", options: ["Accounts", "System → Display", "Devices", "Privacy"], answer: 1 },
        { q: "Windows Update is important for:", options: ["Changing wallpaper", "Security and new features", "Deleting files", "Making icons bigger only"], answer: 1 },
        { q: "Privacy settings control:", options: ["Only desktop colour", "App access to camera, mic, location", "File names", "Keyboard layout only"], answer: 1 },
        { q: "You can search inside Settings:", options: ["No", "Yes, using the search box", "Only offline", "Only for printers"], answer: 1 }
      ]
    },
{
      id: 19,
      title: "User Accounts & Sign-in Options",
      short: "Manage who uses the computer",
      objectives: ["Understand account types", "Add and remove users", "Change passwords and PIN", "Use Windows Hello options", "Switch between users"],
      topics: [
        { title: "Account Types", content: "<p><strong>Administrator</strong> – full control. <strong>Standard user</strong> – safer for daily use.</p>" },
        { title: "Adding Users", content: "<p>Settings → Accounts → Family & other users → Add account.</p>" },
        { title: "Passwords, PIN & Windows Hello", content: "<p>Sign-in options: password, PIN, fingerprint or face.</p>" },
        { title: "Switching Users", content: "<p>Start → profile picture → Switch user. Or lock (Win + L) and choose another account.</p>" },
        { title: "Best Practices", content: "<p>Use Standard account daily. Keep Administrator for installations. Never share passwords.</p>" }
      ],
      practice: ["View your current account type.", "Explore Sign-in options and set a PIN if possible.", "Practise locking the PC (Win + L)."],
      quiz: [
        { q: "Safer account type for daily use:", options: ["Administrator", "Standard user", "Guest only", "No account"], answer: 1 },
        { q: "PIN is set under:", options: ["Display settings", "Sign-in options", "Paint", "File Explorer"], answer: 1 },
        { q: "Win + L does what?", options: ["Opens Settings", "Locks the computer", "Opens browser", "Creates folder"], answer: 1 },
        { q: "Microsoft account advantage:", options: ["No password needed", "Sync settings across devices", "Faster typing", "More icons"], answer: 1 },
        { q: "Fast User Switching allows:", options: ["Deleting accounts", "Switching without closing apps", "Formatting drive", "Changing theme only"], answer: 1 }
      ]
    },
{
      id: 20,
      title: "Basic Computer Troubleshooting",
      short: "Fix common problems yourself",
      objectives: ["Apply restart and power fixes", "Solve no-internet issues", "Deal with frozen programs", "Respond to slow performance", "Know when to ask for help"],
      topics: [
        { title: "First Rule: Restart", content: "<p>Many problems are fixed by a proper restart. Save work first.</p>" },
        { title: "No Internet", content: "<p>Check Wi-Fi / Airplane mode. Run Network troubleshooter. Forget and rejoin network.</p>" },
        { title: "Frozen Program or Screen", content: "<p>Ctrl + Shift + Esc → End task. Hold power button 5–10 seconds if whole screen frozen.</p>" },
        { title: "Slow Computer", content: "<p>Check Task Manager. Disable startup apps. Free disk space. Scan for malware.</p>" },
        { title: "When to Get Help", content: "<p>Hardware failures, repeated Blue Screens, strange noises, overheating.</p>" }
      ],
      practice: ["Run the Network troubleshooter.", "Check Task Manager for high resource usage.", "Free up some disk space."],
      quiz: [
        { q: "First thing to try for many problems:", options: ["Buy new PC", "Restart", "Delete Windows", "Change wallpaper"], answer: 1 },
        { q: "Frozen program: best tool is:", options: ["Paint", "Task Manager", "Notepad", "Calculator"], answer: 1 },
        { q: "No internet – check first:", options: ["Font size", "Airplane mode / Wi-Fi", "Desktop icons", "Recycle Bin"], answer: 1 },
        { q: "Slow PC may be helped by:", options: ["More desktop icons", "Disabling startup apps", "Using ALL CAPS", "Closing only one tab"], answer: 1 },
        { q: "Force shutdown is done by:", options: ["Closing lid", "Holding power button", "Pressing Esc", "Opening Settings"], answer: 1 }
      ]
    },
{
      id: 21,
      title: "Freeing Disk Space & Cleanup",
      short: "Keep your computer fast and tidy",
      objectives: ["Check storage usage", "Use Disk Cleanup / Storage Sense", "Uninstall unused programs", "Empty Recycle Bin and Downloads", "Move files to external/cloud storage"],
      topics: [
        { title: "Checking Storage", content: "<p>Settings → System → Storage. See what is using space.</p>" },
        { title: "Storage Sense & Disk Cleanup", content: "<p>Turn on Storage Sense to auto-clean temporary files.</p>" },
        { title: "Uninstalling Programs", content: "<p>Settings → Apps → Installed apps. Uninstall programs you no longer use.</p>" },
        { title: "Downloads & Recycle Bin", content: "<p>Regularly clear Downloads folder. Empty Recycle Bin.</p>" },
        { title: "External & Cloud Storage", content: "<p>Move large media files to external drive or cloud.</p>" }
      ],
      practice: ["Check your storage usage breakdown.", "Empty Recycle Bin and clear old Downloads.", "Uninstall one program you no longer need."],
      quiz: [
        { q: "Storage usage is found in:", options: ["Paint", "Settings → System → Storage", "Taskbar only", "Browser"], answer: 1 },
        { q: "Storage Sense helps by:", options: ["Downloading more files", "Auto-cleaning temporary files", "Changing theme", "Installing apps"], answer: 1 },
        { q: "Large space users are often:", options: ["Notepad files", "Games and media", "Desktop shortcuts", "Keyboard settings"], answer: 1 },
        { q: "Emptying Recycle Bin:", options: ["Deletes files permanently", "Moves them to Desktop", "Uploads to cloud", "Prints them"], answer: 0 },
        { q: "To free space you can also:", options: ["Add more icons", "Move files to external/cloud", "Use bigger fonts", "Turn off Wi-Fi"], answer: 1 }
      ]
    },
{
      id: 22,
      title: "Installing & Uninstalling Programs",
      short: "Add and remove software safely",
      objectives: ["Download software safely", "Install programs correctly", "Uninstall cleanly", "Avoid unwanted software", "Use Microsoft Store apps"],
      topics: [
        { title: "Safe Downloading", content: "<p>Prefer official websites or Microsoft Store. Avoid cracked software.</p>" },
        { title: "Installation Steps", content: "<p>Run installer → accept licence → choose location → finish. Decline extra offered software.</p>" },
        { title: "Microsoft Store", content: "<p>Safer source. Automatic updates. Good for beginners.</p>" },
        { title: "Uninstalling", content: "<p>Settings → Apps → Installed apps → Uninstall.</p>" },
        { title: "Leftover Files", content: "<p>Most uninstallers clean well. Be careful with manual deletion.</p>" }
      ],
      practice: ["Install a free useful app from Microsoft Store.", "Uninstall a program you no longer need.", "Identify the publisher of a downloaded installer."],
      quiz: [
        { q: "Safest place to get apps:", options: ["Random websites", "Official site or Microsoft Store", "Email attachments", "Pop-up ads"], answer: 1 },
        { q: "During install watch out for:", options: ["Licence agreement only", "Unwanted extra software offers", "Font choices", "Wallpaper"], answer: 1 },
        { q: "Uninstall via:", options: ["Deleting desktop icon only", "Settings → Apps", "Emptying Recycle Bin", "Restarting"], answer: 1 },
        { q: "Microsoft Store apps update:", options: ["Never", "Automatically", "Only manually", "Once a year"], answer: 1 },
        { q: "Cracked/pirated software is risky because:", options: ["It is free", "Often contains malware", "It is colourful", "It needs internet"], answer: 1 }
      ]
    },
{
      id: 23,
      title: "Browser Mastery – Chrome & Edge",
      short: "Tabs, shortcuts, extensions & profiles",
      objectives: ["Master tab and window shortcuts", "Use profiles for different contexts", "Install useful extensions", "Manage bookmarks and history", "Stay safe while browsing"],
      topics: [
        { title: "Essential Browser Shortcuts", content: "<ul><li>Ctrl+T new tab • Ctrl+W close tab • Ctrl+Shift+T reopen</li><li>Ctrl+Tab next tab • Ctrl+L address bar • Ctrl+D bookmark</li><li>Ctrl+H history • Ctrl+J downloads • Ctrl+Shift+N private</li></ul>" },
        { title: "Profiles", content: "<p>Create separate profiles for School, Personal, Work.</p>" },
        { title: "Extensions", content: "<p>Add useful ones carefully. Remove extensions you do not use.</p>" },
        { title: "Bookmarks & History", content: "<p>Organise bookmarks in folders. Use history (Ctrl+H).</p>" },
        { title: "Safe Browsing Habits", content: "<p>Look for HTTPS. Avoid suspicious downloads. Use private mode when needed.</p>" }
      ],
      practice: ["Master Ctrl+T, Ctrl+W, Ctrl+Shift+T, Ctrl+Tab.", "Create a bookmark folder for course resources.", "Check installed extensions and remove unused ones."],
      quiz: [
        { q: "New tab shortcut:", options: ["Ctrl + N", "Ctrl + T", "Ctrl + W", "Ctrl + L"], answer: 1 },
        { q: "Reopen closed tab:", options: ["Ctrl + T", "Ctrl + Shift + T", "Ctrl + Z", "Alt + T"], answer: 1 },
        { q: "Browser profiles help you:", options: ["Download faster", "Separate school and personal data", "Change desktop wallpaper", "Install Windows"], answer: 1 },
        { q: "HTTPS means:", options: ["Faster site", "More secure connection", "Free downloads", "No images"], answer: 1 },
        { q: "Private/Incognito mode:", options: ["Makes you invisible online completely", "Does not save history/cookies locally", "Speeds up downloads", "Disables Wi-Fi"], answer: 1 }
      ]
    },
{
      id: 24,
      title: "Phone ↔ Computer File Transfer",
      short: "Move photos and files easily",
      objectives: ["Transfer via USB cable", "Use cloud services", "Apply Bluetooth or Nearby Share", "Use official phone apps", "Choose the best method for the situation"],
      topics: [
        { title: "USB Cable Transfer", content: "<p>Connect phone, allow file transfer (MTP). Phone appears in File Explorer. Safely eject.</p>" },
        { title: "Cloud Method", content: "<p>Upload from phone to Drive/OneDrive/iCloud, then download on computer.</p>" },
        { title: "Wireless Options", content: "<p>Nearby Share, Quick Share, AirDrop, Bluetooth.</p>" },
        { title: "Manufacturer Apps", content: "<p>Phone Link (Microsoft), Smart Switch, etc.</p>" },
        { title: "Choosing the Method", content: "<p>Large files → USB or cloud. Quick one-file → Nearby Share.</p>" }
      ],
      practice: ["Transfer a photo from phone to computer.", "Set up Phone Link if available.", "Upload a file from phone to Drive/OneDrive and open on PC."],
      quiz: [
        { q: "When using USB, set phone mode to:", options: ["Charging only always", "File transfer / MTP", "Airplane mode", "Do Not Disturb"], answer: 1 },
        { q: "Cloud transfer advantage:", options: ["Needs cable", "Works without cable", "Only for music", "Deletes originals always"], answer: 1 },
        { q: "Bluetooth is usually:", options: ["Fastest method", "Convenient but slower for large files", "Impossible", "Only for calls"], answer: 1 },
        { q: "Phone Link helps with:", options: ["Only calling", "Photos, messages, notifications on PC", "Formatting drives", "Changing BIOS"], answer: 1 },
        { q: "After USB transfer always:", options: ["Pull cable immediately", "Safely eject / disconnect", "Restart phone only", "Delete the phone files"], answer: 1 }
      ]
    },
{
      id: 25,
      title: "Password Managers & Strong Passwords",
      short: "Secure your accounts properly",
      objectives: ["Create strong unique passwords", "Understand why password managers help", "Set up a password manager", "Enable multi-factor authentication", "Recover accounts safely"],
      topics: [
        { title: "Strong Password Rules", content: "<p>Long (12+), unique, mix of letters, numbers and symbols. Avoid personal info.</p>" },
        { title: "Why Password Managers", content: "<p>They generate and store strong unique passwords. You only remember one master password.</p>" },
        { title: "Setting One Up", content: "<p>Choose a reputable manager, create strong master password, install browser extension.</p>" },
        { title: "Multi-Factor Authentication (MFA)", content: "<p>Even if password leaks, MFA blocks most attacks. Enable on email and important accounts.</p>" },
        { title: "Recovery & Hygiene", content: "<p>Store recovery codes safely. Never reuse passwords. Change after breaches.</p>" }
      ],
      practice: ["Create a strong unique password (do not use a real one).", "Explore the built-in browser password manager.", "Enable MFA on at least one important account."],
      quiz: [
        { q: "Best password length practice:", options: ["4 characters", "12 or more characters", "Only numbers", "Same as username"], answer: 1 },
        { q: "Password managers help you:", options: ["Use the same password everywhere", "Use unique strong passwords easily", "Avoid MFA", "Share passwords publicly"], answer: 1 },
        { q: "MFA stands for:", options: ["Multi-Factor Authentication", "Multiple File Access", "Main Folder Archive", "Modern Font Application"], answer: 0 },
        { q: "Master password should be:", options: ["Easy and short", "Very strong and memorable to you", "Written on a sticky note", "Shared with friends"], answer: 1 },
        { q: "After a data breach you should:", options: ["Ignore it", "Change the affected password and enable MFA", "Post the password online", "Delete your email"], answer: 1 }
      ]
    },
{
      id: 26,
      title: "Digital Organisation & Backup Habits",
      short: "Stay organised and never lose work",
      objectives: ["Design a clear folder system", "Use consistent file naming", "Apply the 3-2-1 backup rule", "Schedule regular backups", "Maintain long-term digital hygiene"],
      topics: [
        { title: "Folder Structure", content: "<p>Documents → School → Year → Subject → Assignments / Notes / Projects.</p>" },
        { title: "File Naming Conventions", content: "<p>Use meaningful names: 2026-11-14_History_Essay_v2.docx.</p>" },
        { title: "The 3-2-1 Backup Rule", content: "<p>3 copies, on 2 different media types, with 1 copy off-site.</p>" },
        { title: "What to Back Up", content: "<p>School work, personal documents, photos, project files.</p>" },
        { title: "Weekly/Monthly Habits", content: "<p>Weekly: clear Downloads and desktop. Monthly: check backup is working.</p>" }
      ],
      practice: ["Design and create your personal folder structure.", "Rename 5 old files using a clear naming system.", "Set up at least one regular backup method."],
      quiz: [
        { q: "3-2-1 rule means:", options: ["3 passwords", "3 copies, 2 media types, 1 off-site", "3 monitors", "3 browsers"], answer: 1 },
        { q: "Good file name example:", options: ["Document1.docx", "2026-11-14_Math_Assignment.docx", "asdfg.docx", "finalfinal.docx"], answer: 1 },
        { q: "You should prioritise backing up:", options: ["Installed programs", "Your documents and photos", "Desktop wallpaper", "Recycle Bin"], answer: 1 },
        { q: "Clearing Downloads regularly:", options: ["Is unnecessary", "Frees space and reduces clutter", "Deletes Windows", "Slows the PC"], answer: 1 },
        { q: "Off-site backup protects against:", options: ["Only viruses", "Theft, fire, or local drive failure", "Slow typing", "Low battery"], answer: 1 }
      ]
    },
{
      id: 27,
      title: "Complete Keyboard Shortcuts Mastery (50+)",
      short: "50+ essential shortcuts for speed and productivity",
      objectives: [
        "Master 50+ essential Windows, text, File Explorer and browser shortcuts",
        "Navigate the computer almost entirely with the keyboard",
        "Speed up common daily tasks dramatically",
        "Build muscle memory through structured practice",
        "Combine shortcuts into efficient workflows"
      ],
      topics: [
        {
          title: "Windows System & Navigation Shortcuts (15)",
          content: "<ul><li><code>Win</code> – Open Start menu</li><li><code>Win + E</code> – Open File Explorer</li><li><code>Win + D</code> – Show / Hide Desktop</li><li><code>Win + L</code> – Lock computer</li><li><code>Win + I</code> – Open Settings</li><li><code>Win + A</code> – Open Quick Settings</li><li><code>Win + S</code> – Open Search</li><li><code>Win + Tab</code> – Task View</li><li><code>Win + Ctrl + D</code> – New virtual desktop</li><li><code>Win + Ctrl + Left/Right</code> – Switch virtual desktops</li><li><code>Win + V</code> – Clipboard history</li><li><code>Win + Shift + S</code> – Snipping Tool</li><li><code>Win + PrtScn</code> – Full screenshot to folder</li><li><code>Win + P</code> – Projection modes</li><li><code>Win + X</code> – Quick Link menu</li></ul>"
        },
        {
          title: "Window Management Shortcuts (12)",
          content: "<ul><li><code>Alt + Tab</code> – Switch between open apps</li><li><code>Alt + F4</code> – Close current window</li><li><code>Win + Left Arrow</code> – Snap to left half</li><li><code>Win + Right Arrow</code> – Snap to right half</li><li><code>Win + Up Arrow</code> – Maximise</li><li><code>Win + Down Arrow</code> – Minimise / Restore</li><li><code>Win + Home</code> – Minimise all except active</li><li><code>Win + M</code> – Minimise all windows</li><li><code>Win + Shift + M</code> – Restore minimised windows</li><li><code>Ctrl + Shift + Esc</code> – Task Manager</li><li><code>Win + Number (1-9)</code> – Open pinned taskbar app</li><li><code>Win + Z</code> – Snap Layouts (Windows 11)</li></ul>"
        },
        {
          title: "Text Editing & Selection Shortcuts (14)",
          content: "<ul><li><code>Ctrl + C</code> – Copy</li><li><code>Ctrl + V</code> – Paste</li><li><code>Ctrl + X</code> – Cut</li><li><code>Ctrl + Z</code> – Undo</li><li><code>Ctrl + Y</code> – Redo</li><li><code>Ctrl + A</code> – Select All</li><li><code>Ctrl + B</code> – Bold</li><li><code>Ctrl + I</code> – Italic</li><li><code>Ctrl + U</code> – Underline</li><li><code>Ctrl + Backspace</code> – Delete previous word</li><li><code>Ctrl + Delete</code> – Delete next word</li><li><code>Ctrl + Left/Right Arrow</code> – Move by word</li><li><code>Shift + Arrow keys</code> – Select text</li><li><code>Ctrl + Shift + Arrow</code> – Select by word</li></ul>"
        },
        {
          title: "File Explorer Shortcuts (10)",
          content: "<ul><li><code>Ctrl + N</code> – New File Explorer window</li><li><code>Ctrl + W</code> – Close current window</li><li><code>Ctrl + Shift + N</code> – Create new folder</li><li><code>F2</code> – Rename</li><li><code>F5</code> – Refresh</li><li><code>Alt + Up Arrow</code> – Go up one folder</li><li><code>Alt + Left/Right</code> – Back / Forward</li><li><code>Ctrl + Shift + E</code> – Expand navigation pane</li><li><code>Alt + P</code> – Preview pane</li><li><code>Ctrl + F</code> or <code>F3</code> – Focus search box</li></ul>"
        },
        {
          title: "Browser Shortcuts – Chrome & Edge (12)",
          content: "<ul><li><code>Ctrl + T</code> – New tab</li><li><code>Ctrl + W</code> – Close tab</li><li><code>Ctrl + Shift + T</code> – Reopen last closed tab</li><li><code>Ctrl + Tab</code> – Next tab</li><li><code>Ctrl + Shift + Tab</code> – Previous tab</li><li><code>Ctrl + 1 to 8</code> – Jump to tab number</li><li><code>Ctrl + 9</code> – Jump to last tab</li><li><code>Ctrl + L</code> – Focus address bar</li><li><code>Ctrl + D</code> – Bookmark page</li><li><code>Ctrl + H</code> – History</li><li><code>Ctrl + J</code> – Downloads</li><li><code>Ctrl + Shift + N</code> – New Incognito / InPrivate window</li></ul>"
        }
      ],
      practice: [
        "Practise the 15 Windows system shortcuts until you can do them without thinking.",
        "Snap two windows side-by-side and switch between virtual desktops using only the keyboard.",
        "In File Explorer: create a new folder, rename it, and navigate using only shortcuts.",
        "In your browser: open 5 tabs, close one, reopen it, and jump between tabs using keyboard only.",
        "Create a personal cheat-sheet of your 20 most-used shortcuts and keep it near your desk for one week."
      ],
      quiz: [
        { q: "Which shortcut opens File Explorer?", options: ["Win + F", "Win + E", "Win + D", "Win + S"], answer: 1 },
        { q: "How do you open Clipboard history?", options: ["Win + C", "Win + V", "Ctrl + V", "Win + H"], answer: 1 },
        { q: "Best shortcut to open Task Manager instantly?", options: ["Ctrl + Alt + Del", "Ctrl + Shift + Esc", "Win + T", "Alt + F4"], answer: 1 },
        { q: "Which combination creates a new virtual desktop?", options: ["Win + D", "Win + Ctrl + D", "Win + Tab", "Ctrl + N"], answer: 1 },
        { q: "In a browser, which shortcut reopens the last closed tab?", options: ["Ctrl + T", "Ctrl + Shift + T", "Ctrl + W", "Ctrl + Z"], answer: 1 }
      ]
    }
  ],
  finalTest: {
    title: "Final Course Test",
    description: "This comprehensive test covers questions from all modules in the course. Score 70% or higher to unlock your Certificate of Completion.",
    passPercent: 70,
    questions: [
      { q: "A computer is best defined as:", options: ["A mechanical calculator only", "An electronic device that processes data into information", "Only a gaming machine", "A type of printer"], answer: 1, module: 1 },
      { q: "Which generation of computers introduced microprocessors?", options: ["1st", "2nd", "3rd", "4th"], answer: 3, module: 1 },
      { q: "Which storage device is generally the fastest?", options: ["HDD", "SSD", "Optical Disc", "Floppy Disk"], answer: 1, module: 2 },
      { q: "The shortcut to lock a Windows computer is:", options: ["Ctrl + L", "Alt + L", "Windows + L", "Shift + L"], answer: 2, module: 2 },
      { q: "The software that manages computer hardware is called:", options: ["Application software", "Operating System", "Utility", "Browser"], answer: 1, module: 3 },
      { q: "Before removing a USB flash drive you should:", options: ["Just pull it out", "Restart the computer", "Use Safely Remove / Eject", "Shut down only"], answer: 2, module: 3 },
      { q: "Which shortcut saves a document?", options: ["Ctrl + P", "Ctrl + S", "Ctrl + O", "Ctrl + N"], answer: 1, module: 4 },
      { q: "The best file format when you want others to view but not easily edit a document is:", options: [".docx", ".txt", ".pdf", ".rtf"], answer: 2, module: 4 },
      { q: "Every Excel formula must begin with:", options: ["+", "=", "@", "#"], answer: 1, module: 5 },
      { q: "Which chart is best for showing parts of a whole?", options: ["Line chart", "Pie chart", "Scatter chart", "Area chart"], answer: 1, module: 5 },
      { q: "The global network of connected computers is called the:", options: ["Intranet", "World Wide Web", "Internet", "Browser"], answer: 2, module: 6 },
      { q: "https://www.example.com is an example of a:", options: ["Search engine", "URL", "Browser", "Domain only"], answer: 1, module: 6 },
      { q: "Breaking a large problem into smaller parts is called:", options: ["Pattern recognition", "Abstraction", "Decomposition", "Algorithm"], answer: 2, module: 7 },
      { q: "A network that covers a small area such as a school is called a:", options: ["WAN", "MAN", "LAN", "PAN"], answer: 2, module: 7 },
      { q: "Which shortcut opens File Explorer?", options: ["Win + F", "Win + E", "Win + D", "Win + S"], answer: 1, module: 8 },
      { q: "Clipboard history is opened with:", options: ["Win + C", "Win + V", "Ctrl + V", "Win + H"], answer: 1, module: 8 },
      { q: "To pin a folder for quick access you can:", options: ["Copy it", "Drag it to Quick Access", "Rename it", "Delete it"], answer: 1, module: 9 },
      { q: "The quickest way to open Windows Search is:", options: ["Win + E", "Win + S", "Ctrl + F", "Alt + S"], answer: 1, module: 10 },
      { q: "The fastest way to open Task Manager is:", options: ["Ctrl + Alt + Del", "Ctrl + Shift + Esc", "Win + T", "Alt + F4"], answer: 1, module: 11 },
      { q: "To create a new virtual desktop press:", options: ["Win + D", "Win + Ctrl + D", "Win + N", "Ctrl + N"], answer: 1, module: 12 },
      { q: "The best shortcut for a quick screen snip is:", options: ["PrtScn", "Win + Shift + S", "Win + S", "Alt + S"], answer: 1, module: 14 },
      { q: "Before unplugging a USB drive you should always:", options: ["Just pull it", "Safely Eject / Remove", "Restart the PC", "Close the browser"], answer: 1, module: 16 },
      { q: "The safest place to download applications is:", options: ["Random websites", "Official site or Microsoft Store", "Email attachments", "Pop-up ads"], answer: 1, module: 22 },
      { q: "A strong password should be:", options: ["Short and simple", "Long, unique and mixed characters", "Your name and birthday", "The same for every account"], answer: 1, module: 25 },
      { q: "The 3-2-1 backup rule means:", options: ["3 passwords", "3 copies, 2 media types, 1 off-site", "3 monitors", "3 browsers"], answer: 1, module: 26 }
    ]
  }
};
