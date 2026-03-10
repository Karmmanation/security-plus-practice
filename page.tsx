"use client";

import { useEffect, useMemo, useState } from "react";

type Domain = {
  id: string;
  name: string;
  weight: number;
  color: string;
};

type Difficulty = "Easy" | "Medium" | "Hard";
type Mode = "Practice Quiz" | "Timed Exam" | "Domain Drill";

type Question = {
  id: number;
  domain: string;
  difficulty: Difficulty;
  question: string;
  choices: string[];
  correct: number;
  explanation: string;
  objective: string;
};

type Flashcard = {
  id: number;
  domain: string;
  question: string;
  answer: string;
  tip: string;
};

type PBQ = {
  id: number;
  domain: string;
  title: string;
  scenario: string;
  tasks: string[];
  guidance: string[];
  explanation: string;
};

type HistoryItem = {
  id: string;
  date: string;
  mode: Mode;
  percent: number;
  total: number;
  score: number;
  domains: string[];
};

type SessionAnswer = {
  questionId: number;
  selected: number | null;
  isCorrect: boolean;
};

type DomainStat = {
  correct: number;
  missed: number;
};

const domains: Domain[] = [
  { id: "1.0", name: "General Security Concepts", weight: 12, color: "bg-sky-500" },
  { id: "2.0", name: "Threats, Vulnerabilities, and Mitigations", weight: 22, color: "bg-rose-500" },
  { id: "3.0", name: "Security Architecture", weight: 18, color: "bg-violet-500" },
  { id: "4.0", name: "Security Operations", weight: 28, color: "bg-emerald-500" },
  { id: "5.0", name: "Security Program Management and Oversight", weight: 20, color: "bg-amber-500" },
];

const examInfo = {
  examCode: "SY0-701",
  maxQuestions: 90,
  timeMinutes: 90,
  passingMindset: "Build speed, accuracy, and recognition patterns across all five domains.",
};

const flashcards: Flashcard[] = [
  { id: 1, domain: "1.0", question: "What does the CIA triad stand for?", answer: "Confidentiality, Integrity, and Availability.", tip: "Secret, accurate, accessible." },
  { id: 2, domain: "1.0", question: "What is non-repudiation?", answer: "Proof that someone performed an action and cannot reasonably deny it later.", tip: "Digital signatures help with this." },
  { id: 3, domain: "2.0", question: "What is phishing?", answer: "A social engineering attack that tricks users into revealing information or taking unsafe actions.", tip: "Smishing = SMS, vishing = voice." },
  { id: 4, domain: "2.0", question: "What is a zero-day vulnerability?", answer: "A flaw exploited before a patch is available.", tip: "Zero days to prepare." },
  { id: 5, domain: "3.0", question: "What is segmentation?", answer: "Separating networks into smaller zones to reduce lateral movement.", tip: "Contain the blast radius." },
  { id: 6, domain: "3.0", question: "What does air-gapped mean?", answer: "Physically isolated from other networks.", tip: "No direct network path." },
  { id: 7, domain: "4.0", question: "What is MFA?", answer: "Using two or more factor types to verify identity.", tip: "Know, have, are, or somewhere you are." },
  { id: 8, domain: "4.0", question: "What is a SIEM used for?", answer: "Collecting, correlating, and analyzing logs and alerts.", tip: "Think visibility and investigation." },
  { id: 9, domain: "5.0", question: "What is risk transfer?", answer: "Shifting some financial impact of risk to another party, such as through insurance.", tip: "Move the burden, not the risk itself." },
  { id: 10, domain: "5.0", question: "What is a gap analysis?", answer: "Comparing the current state to a desired future state.", tip: "Find what is missing." },
  { id: 11, domain: "4.0", question: "What is containment in incident response?", answer: "Stopping the spread and limiting damage during an incident.", tip: "Contain first, clean later." },
  { id: 12, domain: "5.0", question: "What does AUP stand for?", answer: "Acceptable Use Policy.", tip: "What users can and cannot do." },
];

const pbqs: PBQ[] = [
  {
    id: 1,
    domain: "2.0",
    title: "Suspicious Payroll Email",
    scenario:
      "A user reports an urgent email claiming their payroll account will be locked unless they log in immediately. The sender domain is misspelled and the message contains a shortened URL.",
    tasks: [
      "Identify the likely attack category.",
      "Choose the best immediate response.",
      "Choose one preventive control for the future.",
    ],
    guidance: [
      "Phishing / social engineering",
      "Quarantine the message and tell the user not to click anything",
      "Security awareness training or improved email filtering",
    ],
    explanation:
      "This PBQ trains you to recognize social engineering indicators, respond quickly, and connect the event to practical mitigation.",
  },
  {
    id: 2,
    domain: "3.0",
    title: "Guest Wi-Fi Isolation",
    scenario:
      "A company wants guest Wi-Fi users isolated from finance systems and security cameras while employees still access business applications.",
    tasks: [
      "Select the best architecture concept.",
      "Name a control that enforces the separation.",
      "State the main security benefit.",
    ],
    guidance: [
      "Network segmentation / VLANs",
      "Firewall rules or ACLs",
      "Reduced lateral movement and better isolation",
    ],
    explanation:
      "This PBQ focuses on applying architecture concepts instead of memorizing definitions alone.",
  },
  {
    id: 3,
    domain: "4.0",
    title: "Malware Beaconing Workstation",
    scenario:
      "A workstation is infected with malware and starts beaconing to an external IP. Logs show repeated failed logins followed by a successful one.",
    tasks: [
      "Choose the best immediate action.",
      "Choose one artifact to collect.",
      "Choose the next phase after containment.",
    ],
    guidance: [
      "Isolate the workstation",
      "Relevant logs or a memory capture",
      "Eradication and recovery",
    ],
    explanation:
      "This PBQ reinforces the correct order of incident response and evidence collection.",
  },
  {
    id: 4,
    domain: "5.0",
    title: "Vendor Contract Review",
    scenario:
      "A company is outsourcing a critical cloud service and wants to reduce uncertainty around uptime, notification timing, and recovery expectations.",
    tasks: [
      "Choose the best document to define uptime commitments.",
      "Choose one governance activity to compare vendor promises to company needs.",
      "Choose one residual risk treatment if availability remains uncertain.",
    ],
    guidance: [
      "SLA",
      "Gap analysis or risk assessment",
      "Risk transfer or acceptance depending on business decision",
    ],
    explanation:
      "This PBQ ties together contracts, governance, and business decision-making.",
  },
];

const acronyms: [string, string][] = [
  ["AAA", "Authentication, Authorization, and Accounting"],
  ["ACL", "Access Control List"],
  ["AUP", "Acceptable Use Policy"],
  ["BIA", "Business Impact Analysis"],
  ["CIA", "Confidentiality, Integrity, Availability"],
  ["CVE", "Common Vulnerabilities and Exposures"],
  ["CVSS", "Common Vulnerability Scoring System"],
  ["DDoS", "Distributed Denial of Service"],
  ["DLP", "Data Loss Prevention"],
  ["EDR", "Endpoint Detection and Response"],
  ["IAM", "Identity and Access Management"],
  ["IDS", "Intrusion Detection System"],
  ["IPS", "Intrusion Prevention System"],
  ["IR", "Incident Response"],
  ["MFA", "Multifactor Authentication"],
  ["NAC", "Network Access Control"],
  ["RBAC", "Role-Based Access Control"],
  ["RPO", "Recovery Point Objective"],
  ["RTO", "Recovery Time Objective"],
  ["SAML", "Security Assertion Markup Language"],
  ["SASE", "Secure Access Service Edge"],
  ["SD-WAN", "Software-Defined Wide Area Network"],
  ["SIEM", "Security Information and Event Management"],
  ["SLA", "Service-Level Agreement"],
  ["SOAR", "Security Orchestration, Automation, and Response"],
  ["SSO", "Single Sign-On"],
  ["VPN", "Virtual Private Network"],
  ["WAF", "Web Application Firewall"],
  ["XDR", "Extended Detection and Response"],
  ["ZTNA", "Zero Trust Network Access"],
];

const objectiveMap: Record<string, string[]> = {
  "1.0": [
    "CIA triad",
    "authentication vs authorization",
    "non-repudiation",
    "control categories",
    "risk basics",
    "security principles",
  ],
  "2.0": [
    "phishing and social engineering",
    "malware types",
    "application attacks",
    "network attacks",
    "vulnerability concepts",
    "mitigation strategies",
  ],
  "3.0": [
    "secure network design",
    "segmentation",
    "cloud and virtualization",
    "resilience concepts",
    "secure protocols",
    "architecture decisions",
  ],
  "4.0": [
    "identity and access management",
    "logging and monitoring",
    "incident response",
    "backups and recovery",
    "security tools",
    "hardening and operational tasks",
  ],
  "5.0": [
    "policies and governance",
    "third-party risk",
    "business continuity",
    "legal and compliance",
    "training and awareness",
    "risk treatment and documentation",
  ],
};

const baseQuestionTemplates: Record<string, Array<Omit<Question, "id">>> = {
  "1.0": [
    {
      domain: "1.0",
      difficulty: "Easy",
      objective: "CIA triad",
      question: "Which option is part of the CIA triad?",
      choices: ["Non-repudiation", "Availability", "Accounting", "Gap analysis"],
      correct: 1,
      explanation: "Availability is one of the three CIA triad principles along with confidentiality and integrity.",
    },
    {
      domain: "1.0",
      difficulty: "Easy",
      objective: "authentication vs authorization",
      question: "Which process verifies a user's identity before access is granted?",
      choices: ["Authorization", "Authentication", "Accounting", "Replication"],
      correct: 1,
      explanation: "Authentication confirms a user is who they claim to be.",
    },
    {
      domain: "1.0",
      difficulty: "Medium",
      objective: "control categories",
      question: "Which control type is primarily meant to discover events after they happen?",
      choices: ["Preventive", "Detective", "Directive", "Compensating"],
      correct: 1,
      explanation: "Detective controls identify incidents or suspicious activity.",
    },
    {
      domain: "1.0",
      difficulty: "Medium",
      objective: "non-repudiation",
      question: "Which technology most directly supports non-repudiation?",
      choices: ["Digital signatures", "Load balancing", "Tokenization", "NAT"],
      correct: 0,
      explanation: "Digital signatures provide proof of origin and help prevent denial of actions.",
    },
    {
      domain: "1.0",
      difficulty: "Hard",
      objective: "risk basics",
      question: "A company decides not to launch a risky service at all. Which risk response best fits?",
      choices: ["Accept", "Avoid", "Transfer", "Mitigate"],
      correct: 1,
      explanation: "Avoidance means eliminating the activity that creates the risk.",
    },
  ],
  "2.0": [
    {
      domain: "2.0",
      difficulty: "Easy",
      objective: "phishing and social engineering",
      question: "A text message pretending to be from a bank asks a user to click a login link. What type of attack is this?",
      choices: ["Vishing", "Smishing", "Tailgating", "Watering hole"],
      correct: 1,
      explanation: "Smishing is phishing through text messages.",
    },
    {
      domain: "2.0",
      difficulty: "Medium",
      objective: "network attacks",
      question: "Which attack attempts to overwhelm a target with traffic from many sources?",
      choices: ["DDoS", "Privilege escalation", "Replay", "Directory traversal"],
      correct: 0,
      explanation: "A DDoS attack floods a target using distributed sources.",
    },
    {
      domain: "2.0",
      difficulty: "Medium",
      objective: "application attacks",
      question: "Which vulnerability occurs when unsanitized input changes a backend database query?",
      choices: ["SQL injection", "Typosquatting", "Pharming", "Shoulder surfing"],
      correct: 0,
      explanation: "SQL injection abuses poor input validation to manipulate database queries.",
    },
    {
      domain: "2.0",
      difficulty: "Hard",
      objective: "malware types",
      question: "Which malware type self-replicates across networks without attaching to a host file?",
      choices: ["Virus", "Worm", "Trojan", "Rootkit"],
      correct: 1,
      explanation: "A worm spreads on its own without requiring a host file.",
    },
    {
      domain: "2.0",
      difficulty: "Hard",
      objective: "vulnerability concepts",
      question: "What best describes a zero-day vulnerability?",
      choices: ["An issue already fully patched", "A flaw exploited before a patch is available", "A bug in physical hardware only", "An expired certificate"],
      correct: 1,
      explanation: "Zero-day vulnerabilities are exploited before defenders have a fix available.",
    },
  ],
  "3.0": [
    {
      domain: "3.0",
      difficulty: "Easy",
      objective: "secure protocols",
      question: "Which technology is commonly used to securely connect remote users to a corporate network?",
      choices: ["VPN", "RAID", "NAT", "VLAN"],
      correct: 0,
      explanation: "VPNs encrypt traffic between remote users and internal resources.",
    },
    {
      domain: "3.0",
      difficulty: "Medium",
      objective: "secure network design",
      question: "Which device is specifically designed to inspect and filter malicious HTTP traffic for web apps?",
      choices: ["Jump server", "Load balancer", "Web application firewall", "Proxy PAC file"],
      correct: 2,
      explanation: "A WAF protects web applications from malicious web requests.",
    },
    {
      domain: "3.0",
      difficulty: "Medium",
      objective: "segmentation",
      question: "Which design principle reduces lateral movement by splitting a network into smaller zones?",
      choices: ["Segmentation", "Oversubscription", "Hashing", "Compression"],
      correct: 0,
      explanation: "Segmentation limits how far an attacker can move within a network.",
    },
    {
      domain: "3.0",
      difficulty: "Hard",
      objective: "architecture decisions",
      question: "Which concept best describes physically isolating a system from external networks?",
      choices: ["High availability", "Containerization", "Air gapping", "Load shedding"],
      correct: 2,
      explanation: "Air gapping means a system is physically isolated from other networks.",
    },
    {
      domain: "3.0",
      difficulty: "Hard",
      objective: "resilience concepts",
      question: "Which design goal focuses on keeping services available even when a component fails?",
      choices: ["Redundancy", "Tokenization", "Obfuscation", "Salting"],
      correct: 0,
      explanation: "Redundancy reduces single points of failure and supports availability.",
    },
  ],
  "4.0": [
    {
      domain: "4.0",
      difficulty: "Easy",
      objective: "security tools",
      question: "Which tool centralizes logs and helps security teams investigate alerts?",
      choices: ["SIEM", "UPS", "CSR", "NDA"],
      correct: 0,
      explanation: "A SIEM aggregates logs, correlates events, and supports security monitoring.",
    },
    {
      domain: "4.0",
      difficulty: "Easy",
      objective: "identity and access management",
      question: "Which access model grants rights based on job role?",
      choices: ["RBAC", "DAC", "MAC", "PAM"],
      correct: 0,
      explanation: "RBAC assigns permissions according to defined roles.",
    },
    {
      domain: "4.0",
      difficulty: "Medium",
      objective: "incident response",
      question: "What is the main goal of incident containment?",
      choices: ["Restore backups", "Stop the spread and limit damage", "Create a press release", "Attribute the attacker immediately"],
      correct: 1,
      explanation: "Containment focuses on preventing further harm.",
    },
    {
      domain: "4.0",
      difficulty: "Medium",
      objective: "backups and recovery",
      question: "Which backup type stores changes since the last backup job, often reducing time and storage use?",
      choices: ["Incremental", "Full", "Snapshot", "Replica-only"],
      correct: 0,
      explanation: "Incremental backups store changes since the last backup task.",
    },
    {
      domain: "4.0",
      difficulty: "Hard",
      objective: "logging and monitoring",
      question: "Which capability lets analysts search across endpoint, network, and identity telemetry from a single detection platform?",
      choices: ["XDR", "RAID", "NTP", "QoS"],
      correct: 0,
      explanation: "XDR extends visibility and correlation across multiple telemetry sources.",
    },
  ],
  "5.0": [
    {
      domain: "5.0",
      difficulty: "Easy",
      objective: "policies and governance",
      question: "Which policy tells employees what they can and cannot do with company systems?",
      choices: ["AUP", "SLA", "BIA", "MOU"],
      correct: 0,
      explanation: "An acceptable use policy defines permitted and prohibited behaviors.",
    },
    {
      domain: "5.0",
      difficulty: "Medium",
      objective: "third-party risk",
      question: "Which document defines measurable vendor performance expectations such as uptime or response time?",
      choices: ["NDA", "CSR", "SLA", "AUP"],
      correct: 2,
      explanation: "An SLA documents expected service performance and responsibilities.",
    },
    {
      domain: "5.0",
      difficulty: "Medium",
      objective: "business continuity",
      question: "Which process compares an organization's current security posture to a desired future state?",
      choices: ["Hashing", "Gap analysis", "Tokenization", "Penetration testing"],
      correct: 1,
      explanation: "Gap analysis identifies differences between the current and desired states.",
    },
    {
      domain: "5.0",
      difficulty: "Hard",
      objective: "risk treatment and documentation",
      question: "Which risk treatment shifts some financial impact of a risk to another party?",
      choices: ["Transfer", "Avoid", "Accept", "Ignore"],
      correct: 0,
      explanation: "Risk transfer commonly happens through insurance or contractual agreements.",
    },
    {
      domain: "5.0",
      difficulty: "Hard",
      objective: "training and awareness",
      question: "Which activity most directly helps reduce successful phishing attempts by end users?",
      choices: ["Awareness training", "BGP tuning", "Disk defragmentation", "Heat mapping racks"],
      correct: 0,
      explanation: "Awareness training improves recognition and reporting of suspicious messages.",
    },
  ],
};

function makeVariantQuestion(base: Omit<Question, "id">, variant: number): Omit<Question, "id"> {
  const swaps: Record<string, Array<{ stem: string; explanation: string }>> = {
    "1.0": [
      {
        stem: `${base.question} In a security review, which answer would still be correct?`,
        explanation: `${base.explanation} This remains true even when the scenario is framed as a review or audit question.`,
      },
      {
        stem: `A security analyst is studying ${base.objective}. ${base.question}`,
        explanation: `${base.explanation} The same principle applies regardless of who is asking the question.`,
      },
    ],
    "2.0": [
      {
        stem: `During a threat assessment, ${base.question}`,
        explanation: `${base.explanation} Attack identification often starts with recognizing the attack pattern in the scenario.`,
      },
      {
        stem: `A user reports suspicious behavior. ${base.question}`,
        explanation: `${base.explanation} User reports often contain enough indicators to classify the threat type.`,
      },
    ],
    "3.0": [
      {
        stem: `While designing a secure environment, ${base.question}`,
        explanation: `${base.explanation} Architecture questions usually focus on the best design choice for isolation, protection, or resilience.`,
      },
      {
        stem: `An architect must choose a control. ${base.question}`,
        explanation: `${base.explanation} The best answer is the control or concept that directly meets the requirement.`,
      },
    ],
    "4.0": [
      {
        stem: `A SOC analyst is reviewing operations. ${base.question}`,
        explanation: `${base.explanation} Operations questions often test the best tool, process, or phase in response.`,
      },
      {
        stem: `In a monitoring workflow, ${base.question}`,
        explanation: `${base.explanation} The same reasoning applies when the question is framed around monitoring or incident handling.`,
      },
    ],
    "5.0": [
      {
        stem: `During a governance meeting, ${base.question}`,
        explanation: `${base.explanation} Governance questions often connect business requirements with the right document or process.`,
      },
      {
        stem: `A security manager is reviewing policy and risk. ${base.question}`,
        explanation: `${base.explanation} Security managers often choose the most appropriate policy, agreement, or treatment option.`,
      },
    ],
  };

  const variants = swaps[base.domain] || [];
  const selected = variants[variant % Math.max(variants.length, 1)];
  if (!selected) return base;
  return { ...base, question: selected.stem, explanation: selected.explanation };
}

function buildQuestionBank(): Question[] {
  const all: Question[] = [];
  let id = 1;
  Object.values(baseQuestionTemplates).forEach((templates) => {
    templates.forEach((template) => {
      for (let i = 0; i < 22; i += 1) {
        all.push({ id, ...makeVariantQuestion(template, i) });
        id += 1;
      }
    });
  });
  return all;
}

const questionBank = buildQuestionBank();

function domainName(domainId: string): string {
  return domains.find((d) => d.id === domainId)?.name ?? domainId;
}

function shuffleArray<T>(items: T[]): T[] {
  const clone = [...items];
  for (let i = clone.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }
  return clone;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function getWeightedQuestions(count: number, domainFilter: string | null = null): Question[] {
  const pool = domainFilter ? questionBank.filter((q) => q.domain === domainFilter) : questionBank;
  if (domainFilter) return shuffleArray(pool).slice(0, count);

  const selected: Question[] = [];
  domains.forEach((domain) => {
    const target = Math.max(1, Math.round((domain.weight / 100) * count));
    selected.push(...shuffleArray(pool.filter((q) => q.domain === domain.id)).slice(0, target));
  });
  return shuffleArray(selected).slice(0, count);
}

function scorePercent(score: number, total: number): number {
  return total === 0 ? 0 : Math.round((score / total) * 100);
}

export default function Page() {
  const [darkMode, setDarkMode] = useState(true);
  const [tab, setTab] = useState<"dashboard" | "quiz" | "exam" | "domain" | "flashcards" | "pbq" | "acronyms">("dashboard");
  const [domainFilter, setDomainFilter] = useState<string>("all");
  const [questionCount, setQuestionCount] = useState<number>(25);
  const [examLength, setExamLength] = useState<number>(90);

  const [sessionQuestions, setSessionQuestions] = useState<Question[]>([]);
  const [sessionMode, setSessionMode] = useState<Mode>("Practice Quiz");
  const [sessionIndex, setSessionIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [sessionAnswers, setSessionAnswers] = useState<SessionAnswer[]>([]);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [domainStats, setDomainStats] = useState<Record<string, DomainStat>>({});
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [flashIndex, setFlashIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [search, setSearch] = useState("");
  const [showOnlyBookmarked, setShowOnlyBookmarked] = useState(false);

  const currentQuestion = sessionQuestions[sessionIndex];
  const currentFlashcard = flashcards[flashIndex];

  useEffect(() => {
    const storedTheme = localStorage.getItem("secplus-theme");
    const storedHistory = localStorage.getItem("secplus-history");
    const storedStats = localStorage.getItem("secplus-domain-stats");
    const storedBookmarks = localStorage.getItem("secplus-bookmarks");

    if (storedTheme) setDarkMode(storedTheme === "dark");
    if (storedHistory) setHistory(JSON.parse(storedHistory));
    if (storedStats) setDomainStats(JSON.parse(storedStats));
    if (storedBookmarks) setBookmarks(JSON.parse(storedBookmarks));
  }, []);

  useEffect(() => {
    localStorage.setItem("secplus-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("secplus-history", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem("secplus-domain-stats", JSON.stringify(domainStats));
  }, [domainStats]);

  useEffect(() => {
    localStorage.setItem("secplus-bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    if (sessionComplete || timeLeft <= 0 || sessionMode === "Domain Drill" || sessionQuestions.length === 0) return;
    if (sessionMode !== "Timed Exam") return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          finishSession();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [sessionMode, timeLeft, sessionComplete, sessionQuestions.length]);

  const filteredAcronyms = useMemo(() => {
    const q = search.toLowerCase();
    return acronyms.filter(([short, long]) => `${short} ${long}`.toLowerCase().includes(q));
  }, [search]);

  const bookmarkedQuestions = useMemo(() => questionBank.filter((q) => bookmarks.includes(q.id)), [bookmarks]);

  const averageScore = useMemo(() => {
    if (history.length === 0) return 0;
    return Math.round(history.reduce((sum, item) => sum + item.percent, 0) / history.length);
  }, [history]);

  const strongestDomain = useMemo(() => {
    const rows = domains
      .map((domain) => {
        const stat = domainStats[domain.id] || { correct: 0, missed: 0 };
        const total = stat.correct + stat.missed;
        const accuracy = total ? stat.correct / total : 0;
        return { domain: domain.id, accuracy, total };
      })
      .filter((row) => row.total > 0)
      .sort((a, b) => b.accuracy - a.accuracy);
    return rows[0]?.domain ?? null;
  }, [domainStats]);

  const weakestDomain = useMemo(() => {
    const rows = domains
      .map((domain) => {
        const stat = domainStats[domain.id] || { correct: 0, missed: 0 };
        const total = stat.correct + stat.missed;
        const accuracy = total ? stat.correct / total : 0;
        return { domain: domain.id, accuracy, total };
      })
      .filter((row) => row.total > 0)
      .sort((a, b) => a.accuracy - b.accuracy);
    return rows[0]?.domain ?? null;
  }, [domainStats]);

  const dashboardQuestionTotal = questionBank.length;

  function startPractice() {
    const questions = getWeightedQuestions(questionCount);
    setSessionQuestions(questions);
    setSessionMode("Practice Quiz");
    setSessionIndex(0);
    setSelected(null);
    setSubmitted(false);
    setSessionAnswers([]);
    setSessionComplete(false);
    setTimeLeft(0);
    setTab("quiz");
  }

  function startTimedExam() {
    const questions = getWeightedQuestions(examLength);
    setSessionQuestions(questions);
    setSessionMode("Timed Exam");
    setSessionIndex(0);
    setSelected(null);
    setSubmitted(false);
    setSessionAnswers([]);
    setSessionComplete(false);
    setTimeLeft(examLength * 60);
    setTab("exam");
  }

  function startDomainDrill(domainId: string) {
    const questions = getWeightedQuestions(30, domainId);
    setSessionQuestions(questions);
    setSessionMode("Domain Drill");
    setSessionIndex(0);
    setSelected(null);
    setSubmitted(false);
    setSessionAnswers([]);
    setSessionComplete(false);
    setTimeLeft(0);
    setDomainFilter(domainId);
    setTab("domain");
  }

  function updateDomainStat(domainId: string, isCorrect: boolean) {
    setDomainStats((prev) => {
      const current = prev[domainId] || { correct: 0, missed: 0 };
      return {
        ...prev,
        [domainId]: {
          correct: current.correct + (isCorrect ? 1 : 0),
          missed: current.missed + (isCorrect ? 0 : 1),
        },
      };
    });
  }

  function submitAnswer() {
    if (selected === null || !currentQuestion) return;
    const isCorrect = selected === currentQuestion.correct;
    updateDomainStat(currentQuestion.domain, isCorrect);
    setSessionAnswers((prev) => [
      ...prev,
      { questionId: currentQuestion.id, selected, isCorrect },
    ]);
    setSubmitted(true);
  }

  function nextQuestion() {
    if (sessionIndex < sessionQuestions.length - 1) {
      setSessionIndex((prev) => prev + 1);
      setSelected(null);
      setSubmitted(false);
      return;
    }
    finishSession();
  }

  function finishSession() {
    if (sessionComplete) return;
    const score = sessionAnswers.filter((a) => a.isCorrect).length + (submitted && selected === currentQuestion?.correct && !sessionAnswers.some((a) => a.questionId === currentQuestion?.id) ? 1 : 0);
    const domainsUsed = Array.from(new Set(sessionQuestions.map((q) => q.domain)));
    const item: HistoryItem = {
      id: `${Date.now()}`,
      date: new Date().toLocaleDateString(),
      mode: sessionMode,
      percent: scorePercent(score, sessionQuestions.length),
      total: sessionQuestions.length,
      score,
      domains: domainsUsed,
    };
    setHistory((prev) => [item, ...prev].slice(0, 15));
    setSessionComplete(true);
    setTimeLeft(0);
  }

  function restartCurrentSession() {
    if (sessionMode === "Practice Quiz") startPractice();
    if (sessionMode === "Timed Exam") startTimedExam();
    if (sessionMode === "Domain Drill") startDomainDrill(domainFilter === "all" ? domains[0].id : domainFilter);
  }

  function toggleBookmark(questionId: number) {
    setBookmarks((prev) => (prev.includes(questionId) ? prev.filter((id) => id !== questionId) : [...prev, questionId]));
  }

  const sessionScore = sessionAnswers.filter((a) => a.isCorrect).length;
  const progressPercent = sessionQuestions.length ? Math.round(((sessionIndex + 1) / sessionQuestions.length) * 100) : 0;

  const pageBg = darkMode ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-950";
  const cardBg = darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-300";
  const softBg = darkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-300";
  const muted = darkMode ? "text-slate-300" : "text-slate-700";
  const tabsIdle = darkMode ? "bg-slate-800 text-white" : "bg-slate-200 text-slate-900";
  const optionBg = darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-300";
  const selectedBg = darkMode ? "bg-cyan-500/10 border-cyan-400" : "bg-cyan-50 border-cyan-600";
  const progressBg = darkMode ? "bg-slate-800" : "bg-slate-300";

  const currentAnswers = showOnlyBookmarked ? bookmarkedQuestions : questionBank.slice(0, 100);

  return (
    <main className={`min-h-screen ${pageBg}`}>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <section className={`mb-8 rounded-3xl border p-6 shadow-xl ${cardBg}`}>
          <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Security+ Ace Trainer</h1>
              <p className={`mt-2 max-w-3xl ${muted}`}>
                Built to help you crush the Security+ exam with a full dashboard, 500+ practice questions, timed simulations, PBQs, flashcards, acronym review, domain drills, bookmarks, and progress tracking.
              </p>
              <p className={`mt-2 text-sm ${muted}`}>{examInfo.passingMindset}</p>
            </div>
            <button
              onClick={() => setDarkMode((prev) => !prev)}
              className={`rounded-xl px-4 py-2 font-semibold ${darkMode ? "bg-cyan-500 text-slate-950" : "bg-slate-900 text-white"}`}
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-5">
            <div className={`rounded-2xl border p-4 ${softBg}`}>
              <div className={`text-sm ${muted}`}>Exam Code</div>
              <div className="mt-1 text-2xl font-semibold">{examInfo.examCode}</div>
            </div>
            <div className={`rounded-2xl border p-4 ${softBg}`}>
              <div className={`text-sm ${muted}`}>Question Bank</div>
              <div className="mt-1 text-2xl font-semibold">{dashboardQuestionTotal}+</div>
            </div>
            <div className={`rounded-2xl border p-4 ${softBg}`}>
              <div className={`text-sm ${muted}`}>Timed Exam</div>
              <div className="mt-1 text-2xl font-semibold">{examInfo.timeMinutes} min</div>
            </div>
            <div className={`rounded-2xl border p-4 ${softBg}`}>
              <div className={`text-sm ${muted}`}>Average Score</div>
              <div className="mt-1 text-2xl font-semibold">{history.length ? `${averageScore}%` : "--"}</div>
            </div>
            <div className={`rounded-2xl border p-4 ${softBg}`}>
              <div className={`text-sm ${muted}`}>Bookmarks</div>
              <div className="mt-1 text-2xl font-semibold">{bookmarks.length}</div>
            </div>
          </div>
        </section>

        <div className="mb-6 flex flex-wrap gap-3">
          {[
            ["dashboard", "Dashboard"],
            ["quiz", "Practice Quiz"],
            ["exam", "Timed Exam"],
            ["domain", "Domain Drill"],
            ["flashcards", "Flashcards"],
            ["pbq", "PBQ Practice"],
            ["acronyms", "Acronyms"],
          ].map(([value, label]) => (
            <button
              key={value}
              onClick={() => setTab(value as typeof tab)}
              className={`rounded-xl px-4 py-2 font-medium ${tab === value ? "bg-cyan-500 text-slate-950" : tabsIdle}`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          <div className="space-y-8">
            {tab === "dashboard" && (
              <>
                <section className={`rounded-3xl border p-6 ${cardBg}`}>
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h2 className="text-3xl font-semibold">Launch Your Study Session</h2>
                      <p className={`mt-2 ${muted}`}>Choose a mode based on whether you want reps, speed, or focused remediation.</p>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className={`rounded-2xl border p-5 ${softBg}`}>
                      <h3 className="text-xl font-semibold">Practice Quiz</h3>
                      <p className={`mt-2 text-sm ${muted}`}>Weighted quiz from the full bank with explanations after each question.</p>
                      <div className="mt-4 flex items-center gap-2">
                        <label className="text-sm">Questions</label>
                        <select
                          value={questionCount}
                          onChange={(e) => setQuestionCount(Number(e.target.value))}
                          className={`rounded-lg border px-2 py-1 ${softBg}`}
                        >
                          {[10, 25, 50, 75].map((count) => (
                            <option key={count} value={count}>{count}</option>
                          ))}
                        </select>
                      </div>
                      <button onClick={startPractice} className="mt-4 rounded-xl bg-cyan-500 px-4 py-2 font-semibold text-slate-950">Start Practice Quiz</button>
                    </div>

                    <div className={`rounded-2xl border p-5 ${softBg}`}>
                      <h3 className="text-xl font-semibold">Timed Exam</h3>
                      <p className={`mt-2 text-sm ${muted}`}>Simulate real test pressure with a countdown and weighted questions.</p>
                      <div className="mt-4 flex items-center gap-2">
                        <label className="text-sm">Exam Questions</label>
                        <select
                          value={examLength}
                          onChange={(e) => setExamLength(Number(e.target.value))}
                          className={`rounded-lg border px-2 py-1 ${softBg}`}
                        >
                          {[25, 50, 75, 90].map((count) => (
                            <option key={count} value={count}>{count}</option>
                          ))}
                        </select>
                      </div>
                      <button onClick={startTimedExam} className="mt-4 rounded-xl bg-cyan-500 px-4 py-2 font-semibold text-slate-950">Start Timed Exam</button>
                    </div>

                    <div className={`rounded-2xl border p-5 ${softBg}`}>
                      <h3 className="text-xl font-semibold">Domain Drill</h3>
                      <p className={`mt-2 text-sm ${muted}`}>Hammer your weakest area with a focused domain-only session.</p>
                      <div className="mt-4 flex items-center gap-2">
                        <label className="text-sm">Domain</label>
                        <select
                          value={domainFilter}
                          onChange={(e) => setDomainFilter(e.target.value)}
                          className={`rounded-lg border px-2 py-1 ${softBg}`}
                        >
                          {domains.map((domain) => (
                            <option key={domain.id} value={domain.id}>{domain.id} {domain.name}</option>
                          ))}
                        </select>
                      </div>
                      <button onClick={() => startDomainDrill(domainFilter === "all" ? domains[0].id : domainFilter)} className="mt-4 rounded-xl bg-cyan-500 px-4 py-2 font-semibold text-slate-950">Start Domain Drill</button>
                    </div>
                  </div>
                </section>

                <section className={`rounded-3xl border p-6 ${cardBg}`}>
                  <h2 className="mb-5 text-3xl font-semibold">Domain Performance</h2>
                  <div className="space-y-4">
                    {domains.map((domain) => {
                      const stat = domainStats[domain.id] || { correct: 0, missed: 0 };
                      const total = stat.correct + stat.missed;
                      const accuracy = total ? Math.round((stat.correct / total) * 100) : 0;
                      return (
                        <div key={domain.id}>
                          <div className="mb-2 flex items-center justify-between text-sm">
                            <span>{domain.id} {domain.name}</span>
                            <span>{total ? `${accuracy}% accuracy` : "No data yet"}</span>
                          </div>
                          <div className={`h-3 overflow-hidden rounded-full ${progressBg}`}>
                            <div className={`h-full ${domain.color}`} style={{ width: `${accuracy}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>

                <section className={`rounded-3xl border p-6 ${cardBg}`}>
                  <h2 className="mb-5 text-3xl font-semibold">Study Roadmap to Ace the Exam</h2>
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {[
                      ["1. Memorize", "Review 10 flashcards and 10 acronyms daily until recall is automatic."],
                      ["2. Drill", "Run weighted practice quizzes and read every explanation, including the ones you got right."],
                      ["3. Fix Weaknesses", "Use domain drills on the areas where your accuracy is lowest."],
                      ["4. Simulate", "Take full timed exams until your score is consistently strong under pressure."],
                    ].map(([title, text]) => (
                      <div key={title} className={`rounded-2xl border p-4 ${softBg}`}>
                        <div className="font-semibold">{title}</div>
                        <p className={`mt-2 text-sm ${muted}`}>{text}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}

            {(tab === "quiz" || tab === "exam" || tab === "domain") && sessionQuestions.length > 0 && currentQuestion && (
              <section className={`rounded-3xl border p-6 ${cardBg}`}>
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-sm text-cyan-300">{sessionMode}</div>
                    <div className={`text-sm ${muted}`}>{currentQuestion.domain} {domainName(currentQuestion.domain)}</div>
                    <div className={`text-sm ${muted}`}>Question {sessionIndex + 1} of {sessionQuestions.length}</div>
                    <div className={`text-sm ${muted}`}>Objective: {currentQuestion.objective}</div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className={`rounded-full px-3 py-1 text-sm ${softBg}`}>{currentQuestion.difficulty}</span>
                    {sessionMode === "Timed Exam" && (
                      <span className="rounded-full bg-cyan-500 px-3 py-1 text-sm font-semibold text-slate-950">{formatTime(timeLeft)}</span>
                    )}
                  </div>
                </div>

                <div className={`mb-6 h-3 overflow-hidden rounded-full ${progressBg}`}>
                  <div className="h-full bg-cyan-500" style={{ width: `${progressPercent}%` }} />
                </div>

                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                  <h2 className="text-3xl font-semibold">{currentQuestion.question}</h2>
                  <button onClick={() => toggleBookmark(currentQuestion.id)} className={`rounded-xl px-3 py-2 text-sm font-semibold ${bookmarks.includes(currentQuestion.id) ? "bg-amber-400 text-slate-950" : tabsIdle}`}>
                    {bookmarks.includes(currentQuestion.id) ? "Bookmarked" : "Bookmark"}
                  </button>
                </div>

                <div className="space-y-3">
                  {currentQuestion.choices.map((choice, index) => (
                    <button
                      key={index}
                      onClick={() => !submitted && setSelected(index)}
                      className={`block w-full rounded-2xl border p-4 text-left ${selected === index ? selectedBg : optionBg}`}
                    >
                      <span className="font-semibold">{String.fromCharCode(65 + index)}.</span> {choice}
                    </button>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  {!submitted ? (
                    <button onClick={submitAnswer} className="rounded-xl bg-cyan-500 px-4 py-2 font-semibold text-slate-950">Submit Answer</button>
                  ) : (
                    <button onClick={nextQuestion} className="rounded-xl bg-cyan-500 px-4 py-2 font-semibold text-slate-950">{sessionIndex === sessionQuestions.length - 1 ? "Finish Session" : "Next Question"}</button>
                  )}
                  <button onClick={restartCurrentSession} className={`rounded-xl px-4 py-2 font-semibold ${tabsIdle}`}>Restart</button>
                </div>

                {submitted && (
                  <div className={`mt-6 rounded-2xl border p-4 ${softBg}`}>
                    <div className="font-semibold">{selected === currentQuestion.correct ? "Correct" : "Review"}</div>
                    <p className={`mt-2 ${muted}`}>Correct answer: {currentQuestion.choices[currentQuestion.correct]}</p>
                    <p className={`mt-2 ${muted}`}>{currentQuestion.explanation}</p>
                  </div>
                )}

                {sessionComplete && (
                  <div className={`mt-6 rounded-2xl border p-4 ${softBg}`}>
                    <div className="text-xl font-bold">Score: {history[0]?.score} / {history[0]?.total}</div>
                    <p className={`mt-2 ${muted}`}>Percent: {history[0]?.percent}%</p>
                  </div>
                )}
              </section>
            )}

            {(tab === "quiz" || tab === "exam" || tab === "domain") && sessionQuestions.length === 0 && (
              <section className={`rounded-3xl border p-6 ${cardBg}`}>
                <h2 className="text-3xl font-semibold">No session running</h2>
                <p className={`mt-2 ${muted}`}>Start a study session from the dashboard to begin practicing.</p>
                <button onClick={() => setTab("dashboard")} className="mt-4 rounded-xl bg-cyan-500 px-4 py-2 font-semibold text-slate-950">Go to Dashboard</button>
              </section>
            )}

            {tab === "flashcards" && (
              <section className={`rounded-3xl border p-6 ${cardBg}`}>
                <div className="mb-3 text-sm text-cyan-300">{currentFlashcard.domain} {domainName(currentFlashcard.domain)}</div>
                <div className={`rounded-3xl border p-8 ${softBg}`}>
                  <div className={`mb-2 text-sm uppercase tracking-wide ${muted}`}>{showAnswer ? "Answer" : "Question"}</div>
                  <div className="text-2xl font-semibold">{showAnswer ? currentFlashcard.answer : currentFlashcard.question}</div>
                  {showAnswer && <p className={`mt-4 ${muted}`}>Tip: {currentFlashcard.tip}</p>}
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button onClick={() => setShowAnswer((prev) => !prev)} className="rounded-xl bg-cyan-500 px-4 py-2 font-semibold text-slate-950">{showAnswer ? "Hide Answer" : "Show Answer"}</button>
                  <button onClick={() => { setFlashIndex((prev) => (prev === 0 ? flashcards.length - 1 : prev - 1)); setShowAnswer(false); }} className={`rounded-xl px-4 py-2 ${tabsIdle}`}>Previous</button>
                  <button onClick={() => { setFlashIndex((prev) => (prev === flashcards.length - 1 ? 0 : prev + 1)); setShowAnswer(false); }} className={`rounded-xl px-4 py-2 ${tabsIdle}`}>Next</button>
                </div>
              </section>
            )}

            {tab === "pbq" && (
              <section className={`rounded-3xl border p-6 ${cardBg}`}>
                <h2 className="mb-6 text-3xl font-semibold">PBQ Practice</h2>
                <div className="space-y-5">
                  {pbqs.map((pbq) => (
                    <div key={pbq.id} className={`rounded-2xl border p-5 ${softBg}`}>
                      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                        <h3 className="text-xl font-semibold">{pbq.title}</h3>
                        <span className="rounded-full bg-cyan-500 px-3 py-1 text-sm font-semibold text-slate-950">{pbq.domain}</span>
                      </div>
                      <p className={muted}>{pbq.scenario}</p>
                      <div className="mt-4 space-y-2">
                        {pbq.tasks.map((task, index) => (
                          <div key={index} className="flex gap-3">
                            <div className="mt-0.5 rounded-full bg-cyan-500 px-2 py-0.5 text-xs font-bold text-slate-950">{index + 1}</div>
                            <p>{task}</p>
                          </div>
                        ))}
                      </div>
                      <details className="mt-4">
                        <summary className="cursor-pointer font-semibold text-cyan-300">Show Coaching Answers</summary>
                        <div className="mt-3 space-y-2">
                          {pbq.guidance.map((answer, index) => (
                            <p key={index}><span className="font-semibold">Step {index + 1}:</span> {answer}</p>
                          ))}
                          <p className={muted}>{pbq.explanation}</p>
                        </div>
                      </details>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {tab === "acronyms" && (
              <section className={`rounded-3xl border p-6 ${cardBg}`}>
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-3xl font-semibold">Acronym Review</h2>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={showOnlyBookmarked} onChange={(e) => setShowOnlyBookmarked(e.target.checked)} />
                    Show bookmarked question list in sidebar
                  </label>
                </div>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search acronym or meaning"
                  className={`mb-6 w-full rounded-2xl border px-4 py-3 outline-none ${softBg}`}
                />
                <div className="grid gap-4 md:grid-cols-2">
                  {filteredAcronyms.map(([short, long]) => (
                    <div key={short} className={`rounded-2xl border p-4 ${softBg}`}>
                      <div className="text-lg font-semibold">{short}</div>
                      <div className={`mt-2 ${muted}`}>{long}</div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section className={`rounded-3xl border p-6 ${cardBg}`}>
              <h3 className="mb-4 text-2xl font-semibold">Domain Weighting</h3>
              <div className="space-y-4">
                {domains.map((domain) => (
                  <div key={domain.id}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span>{domain.id} {domain.name}</span>
                      <span>{domain.weight}%</span>
                    </div>
                    <div className={`h-3 overflow-hidden rounded-full ${progressBg}`}>
                      <div className={`h-full ${domain.color}`} style={{ width: `${domain.weight}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className={`rounded-3xl border p-6 ${cardBg}`}>
              <h3 className="mb-4 text-xl font-semibold">Performance Snapshot</h3>
              <div className="space-y-3 text-sm">
                <div className={`rounded-2xl border p-4 ${softBg}`}>
                  <div className="font-semibold">Average Score</div>
                  <p className={muted}>{history.length ? `${averageScore}% across ${history.length} sessions` : "No completed sessions yet."}</p>
                </div>
                <div className={`rounded-2xl border p-4 ${softBg}`}>
                  <div className="font-semibold">Strongest Domain</div>
                  <p className={muted}>{strongestDomain ? `${strongestDomain} ${domainName(strongestDomain)}` : "Not enough data yet."}</p>
                </div>
                <div className={`rounded-2xl border p-4 ${softBg}`}>
                  <div className="font-semibold">Weakest Domain</div>
                  <p className={muted}>{weakestDomain ? `${weakestDomain} ${domainName(weakestDomain)}` : "Not enough data yet."}</p>
                </div>
              </div>
            </section>

            <section className={`rounded-3xl border p-6 ${cardBg}`}>
              <h3 className="mb-4 text-xl font-semibold">Recent Scores</h3>
              {history.length === 0 ? (
                <p className={muted}>Finish a quiz or exam to track your results here.</p>
              ) : (
                <div className="space-y-3">
                  {history.map((item) => (
                    <div key={item.id} className={`rounded-2xl border p-4 ${softBg}`}>
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="font-semibold">{item.mode}</div>
                          <div className={`text-sm ${muted}`}>{item.date}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{item.percent}%</div>
                          <div className={`text-sm ${muted}`}>{item.score}/{item.total}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className={`rounded-3xl border p-6 ${cardBg}`}>
              <h3 className="mb-4 text-xl font-semibold">Weak Domain Targets</h3>
              <div className="space-y-3">
                {domains.map((domain) => {
                  const stat = domainStats[domain.id] || { correct: 0, missed: 0 };
                  return (
                    <div key={domain.id} className={`rounded-2xl border p-4 ${softBg}`}>
                      <div className="font-semibold">{domain.id} {domain.name}</div>
                      <p className={`mt-1 text-sm ${muted}`}>Correct: {stat.correct} · Missed: {stat.missed}</p>
                      <button onClick={() => startDomainDrill(domain.id)} className="mt-3 rounded-xl bg-cyan-500 px-3 py-2 text-sm font-semibold text-slate-950">Drill This Domain</button>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className={`rounded-3xl border p-6 ${cardBg}`}>
              <h3 className="mb-4 text-xl font-semibold">Bookmarks</h3>
              {bookmarkedQuestions.length === 0 ? (
                <p className={muted}>Bookmark tricky questions while you practice and review them here later.</p>
              ) : (
                <div className="space-y-3 max-h-[520px] overflow-auto pr-1">
                  {bookmarkedQuestions.map((q) => (
                    <div key={q.id} className={`rounded-2xl border p-4 ${softBg}`}>
                      <div className="text-sm text-cyan-300">{q.domain} {domainName(q.domain)}</div>
                      <div className="mt-2 font-semibold">{q.question}</div>
                      <div className={`mt-2 text-sm ${muted}`}>Answer: {q.choices[q.correct]}</div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className={`rounded-3xl border p-6 ${cardBg}`}>
              <h3 className="mb-4 text-xl font-semibold">Exam-Day Strategy</h3>
              <div className="space-y-3 text-sm">
                {[
                  "Answer easier questions first and keep momentum high.",
                  "Use bookmarks for traps, acronyms, and scenario-based items that slow you down.",
                  "Read the last sentence of long scenarios first to know what is being asked.",
                  "Review explanations after every session until the reasoning feels obvious.",
                ].map((tip) => (
                  <div key={tip} className={`rounded-2xl border p-4 ${softBg}`}>{tip}</div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
