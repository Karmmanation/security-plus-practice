import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import {
  Shield,
  Brain,
  Target,
  RotateCcw,
  Search,
  CheckCircle2,
  XCircle,
  BookOpen,
  Trophy,
  Clock3,
  Sun,
  Moon,
  FileQuestion,
  BarChart3,
} from "lucide-react";

const examInfo = {
  examCode: "SY0-701",
  maxQuestions: 90,
  timeMinutes: 90,
  domains: [
    { id: "1.0", name: "General Security Concepts", weight: 12 },
    { id: "2.0", name: "Threats, Vulnerabilities, and Mitigations", weight: 22 },
    { id: "3.0", name: "Security Architecture", weight: 18 },
    { id: "4.0", name: "Security Operations", weight: 28 },
    { id: "5.0", name: "Security Program Management and Oversight", weight: 20 },
  ],
};

const flashcards = [
  { id: 1, domain: "1.0", question: "What does the CIA triad stand for?", answer: "Confidentiality, Integrity, and Availability.", tip: "Think: keep data secret, accurate, and accessible." },
  { id: 2, domain: "1.0", question: "What is the purpose of non-repudiation?", answer: "It provides proof that someone performed an action so they cannot reasonably deny it later.", tip: "Digital signatures are a common non-repudiation tool." },
  { id: 3, domain: "2.0", question: "What is phishing?", answer: "A social engineering attack that tries to trick users into revealing information or taking unsafe actions, usually through messages or email.", tip: "Smishing is SMS phishing. Vishing is voice phishing." },
  { id: 4, domain: "2.0", question: "What is the difference between a worm and a virus?", answer: "A worm self-replicates and spreads on its own, while a virus usually needs a host file or user action to spread.", tip: "Worm = works by itself." },
  { id: 5, domain: "3.0", question: "What is the purpose of a VPN?", answer: "A VPN creates a secure encrypted connection over an untrusted network.", tip: "Commonly used for secure remote access." },
  { id: 6, domain: "3.0", question: "What does air-gapped mean?", answer: "A system or network is physically isolated from other networks, especially the internet.", tip: "No direct network path." },
  { id: 7, domain: "4.0", question: "What is MFA?", answer: "Multifactor authentication uses two or more different factor types to verify identity.", tip: "Something you know, have, are, or somewhere you are." },
  { id: 8, domain: "4.0", question: "What is a SIEM used for?", answer: "A SIEM collects, aggregates, and analyzes logs and alerts to support monitoring and incident response.", tip: "Security Information and Event Management." },
  { id: 9, domain: "5.0", question: "What is risk transfer?", answer: "Shifting some of the financial impact of risk to another party, such as through insurance or contracts.", tip: "You do not remove the risk, you move the burden." },
  { id: 10, domain: "5.0", question: "What is an SLA?", answer: "A service-level agreement defines expected service performance and responsibilities between parties.", tip: "Think vendor commitments and uptime targets." },
  { id: 11, domain: "2.0", question: "What is a zero-day vulnerability?", answer: "A flaw that is exploited before a patch or fix is available from the vendor.", tip: "Zero days to prepare." },
  { id: 12, domain: "4.0", question: "What is least privilege?", answer: "Giving a user or system only the minimum access needed to perform its task.", tip: "Less access means less potential damage." },
];

const questionBank = [
  { id: 1, domain: "1.0", difficulty: "Easy", question: "Which option is part of the CIA triad?", choices: ["Non-repudiation", "Availability", "Accounting", "Gap analysis"], correct: 1, explanation: "Availability is one of the three CIA triad principles: confidentiality, integrity, and availability." },
  { id: 2, domain: "1.0", difficulty: "Easy", question: "Which control type is designed to discover events after they happen?", choices: ["Preventive", "Detective", "Corrective", "Directive"], correct: 1, explanation: "Detective controls help identify incidents or suspicious activity after or during occurrence." },
  { id: 3, domain: "2.0", difficulty: "Medium", question: "A text message pretending to be from a bank asks a user to click a login link. What type of attack is this?", choices: ["Vishing", "Smishing", "Watering hole", "Tailgating"], correct: 1, explanation: "Smishing is phishing conducted through SMS or text messages." },
  { id: 4, domain: "2.0", difficulty: "Medium", question: "Which attack attempts to overwhelm a system with traffic from many sources?", choices: ["DDoS", "Privilege escalation", "Replay", "Directory traversal"], correct: 0, explanation: "A distributed denial-of-service attack uses many systems to flood a target and degrade service." },
  { id: 5, domain: "3.0", difficulty: "Medium", question: "Which device is specifically designed to inspect and filter malicious HTTP traffic for web apps?", choices: ["Load balancer", "Jump server", "Web application firewall", "Proxy PAC file"], correct: 2, explanation: "A WAF focuses on protecting web applications and filtering malicious web requests." },
  { id: 6, domain: "3.0", difficulty: "Hard", question: "Which concept best describes physically isolating a system from external networks?", choices: ["Microsegmentation", "Air gapping", "Containerization", "High availability"], correct: 1, explanation: "Air gapping means physical isolation from other networks." },
  { id: 7, domain: "4.0", difficulty: "Easy", question: "Which tool centralizes logs and helps security teams investigate alerts?", choices: ["SIEM", "UPS", "CSR", "NDA"], correct: 0, explanation: "A SIEM aggregates logs, correlates events, and supports detection and response." },
  { id: 8, domain: "4.0", difficulty: "Medium", question: "Which access model grants rights based on job role?", choices: ["RBAC", "MAC", "DAC", "PAM"], correct: 0, explanation: "Role-based access control assigns permissions based on roles." },
  { id: 9, domain: "5.0", difficulty: "Hard", question: "Which risk strategy means an organization chooses not to engage in an activity that creates the risk?", choices: ["Transfer", "Mitigate", "Avoid", "Accept"], correct: 2, explanation: "Avoidance means eliminating the activity or condition that introduces the risk." },
  { id: 10, domain: "5.0", difficulty: "Medium", question: "Which document defines vendor performance expectations such as uptime or response time?", choices: ["NDA", "SLA", "CSR", "AUP"], correct: 1, explanation: "An SLA sets measurable service expectations between parties." },
  { id: 11, domain: "1.0", difficulty: "Medium", question: "Which concept confirms a user is who they claim to be?", choices: ["Accounting", "Authorization", "Authentication", "Availability"], correct: 2, explanation: "Authentication verifies identity before access is granted." },
  { id: 12, domain: "2.0", difficulty: "Hard", question: "Which vulnerability occurs when an application fails to validate user input and attackers insert malicious commands?", choices: ["SQL injection", "Credential stuffing", "Typosquatting", "Dumpster diving"], correct: 0, explanation: "SQL injection abuses unsanitized input to manipulate database queries." },
  { id: 13, domain: "3.0", difficulty: "Easy", question: "Which technology is commonly used to securely connect remote users to a corporate network?", choices: ["VPN", "NAT", "VLAN", "RAID"], correct: 0, explanation: "VPNs encrypt traffic between remote users and internal resources." },
  { id: 14, domain: "3.0", difficulty: "Medium", question: "Which principle divides a network into smaller isolated zones to reduce lateral movement?", choices: ["Segmentation", "Oversubscription", "Load shedding", "Tokenization"], correct: 0, explanation: "Segmentation limits how far an attacker can move through a network." },
  { id: 15, domain: "4.0", difficulty: "Hard", question: "Which backup approach typically stores only data changed since the last full backup?", choices: ["Snapshot", "Differential", "Incremental", "Replication"], correct: 2, explanation: "Incremental backups store changes since the last backup job, often reducing storage and backup time." },
  { id: 16, domain: "4.0", difficulty: "Medium", question: "What is the main goal of incident containment?", choices: ["Identify the attacker", "Restore backups", "Stop the spread and limit damage", "Create a press release"], correct: 2, explanation: "Containment focuses on reducing impact and preventing further compromise." },
  { id: 17, domain: "5.0", difficulty: "Easy", question: "Which policy tells employees what they can and cannot do with company systems?", choices: ["AUP", "MOU", "SLA", "BIA"], correct: 0, explanation: "An acceptable use policy defines permitted and prohibited actions for organizational resources." },
  { id: 18, domain: "5.0", difficulty: "Medium", question: "Which process compares an organization’s current security posture to a desired future state?", choices: ["Penetration testing", "Gap analysis", "Load balancing", "Hashing"], correct: 1, explanation: "Gap analysis identifies differences between the current state and the target state." },
];

const pbqs = [
  {
    id: 1,
    domain: "2.0",
    title: "Email Attack Triage",
    scenario: "A user reports a suspicious email that says their payroll account will be locked unless they log in immediately. The sender domain is misspelled and the message contains a shortened URL.",
    steps: [
      "Classify the attack type.",
      "Choose the best immediate action for the analyst.",
      "Choose one preventive control that would help reduce this type of attack in the future.",
    ],
    answers: ["Phishing / social engineering", "Quarantine the message and warn the user not to click", "Security awareness training or email filtering"],
    explanation: "This PBQ checks whether you can recognize social engineering indicators, respond quickly, and tie the event to a practical mitigation."
  },
  {
    id: 2,
    domain: "3.0",
    title: "Network Segmentation Design",
    scenario: "A company wants to separate guest Wi‑Fi users from finance servers and security cameras while still allowing employees to reach business apps.",
    steps: [
      "Select the best architecture concept.",
      "Identify one device or control to enforce the separation.",
      "State the main security benefit gained from this design.",
    ],
    answers: ["Network segmentation / VLANs", "Firewall or ACLs", "Reduced lateral movement and better isolation"],
    explanation: "This PBQ focuses on applying architecture concepts rather than just recalling a definition."
  },
  {
    id: 3,
    domain: "4.0",
    title: "Incident Response Order",
    scenario: "A workstation is infected with malware and starts beaconing to an external IP. Security logs show repeated failed logins followed by a successful login.",
    steps: [
      "Choose the best immediate response step.",
      "Choose one artifact to collect.",
      "Choose the next phase after containment.",
    ],
    answers: ["Isolate the workstation", "Relevant logs or a memory capture", "Eradication and recovery"],
    explanation: "This PBQ helps you practice incident response sequence and evidence collection."
  },
];

const acronyms = [
  ["CIA", "Confidentiality, Integrity, Availability"],
  ["AAA", "Authentication, Authorization, and Accounting"],
  ["MFA", "Multifactor Authentication"],
  ["SIEM", "Security Information and Event Management"],
  ["RBAC", "Role-based Access Control"],
  ["SAML", "Security Assertions Markup Language"],
  ["OAuth", "Open Authorization"],
  ["VPN", "Virtual Private Network"],
  ["DLP", "Data Loss Prevention"],
  ["DDoS", "Distributed Denial of Service"],
  ["CVSS", "Common Vulnerability Scoring System"],
  ["CVE", "Common Vulnerability Enumeration"],
  ["AUP", "Acceptable Use Policy"],
  ["BIA", "Business Impact Analysis"],
  ["WAF", "Web Application Firewall"],
  ["ACL", "Access Control List"],
];

function shuffleArray(items) {
  const clone = [...items];
  for (let i = clone.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }
  return clone;
}

function DomainBadge({ domain, lightMode }) {
  const info = examInfo.domains.find((d) => d.id === domain);
  return (
    <Badge className={lightMode ? "bg-sky-100 text-sky-900 hover:bg-sky-100" : "bg-cyan-400/15 text-cyan-200 hover:bg-cyan-400/15"}>
      {info?.id} {info?.name}
    </Badge>
  );
}

export default function SecurityPlusPracticeSite() {
  const [lightMode, setLightMode] = useState(false);
  const [flashIndex, setFlashIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState(questionBank.slice(0, 10));
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [showReview, setShowReview] = useState(false);
  const [search, setSearch] = useState("");
  const [domainFilter, setDomainFilter] = useState("all");
  const [examMode, setExamMode] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20 * 60);
  const [history, setHistory] = useState([]);

  const currentFlash = flashcards[flashIndex];
  const currentQuestion = quizQuestions[quizIndex];

  const filteredAcronyms = useMemo(() => {
    return acronyms.filter(([short, long]) => `${short} ${long}`.toLowerCase().includes(search.toLowerCase()));
  }, [search]);

  const filteredQuestions = useMemo(() => {
    return questionBank.filter((q) => (domainFilter === "all" ? true : q.domain === domainFilter));
  }, [domainFilter]);

  const score = answers.filter((a) => a.isCorrect).length;
  const progress = quizStarted ? ((quizIndex + (showReview ? 1 : 0)) / quizQuestions.length) * 100 : 0;
  const accuracy = history.length ? Math.round((history.reduce((sum, item) => sum + item.percent, 0) / history.length)) : 0;

  useEffect(() => {
    if (!quizStarted || !examMode) return;
    if (timeLeft <= 0) {
      finishQuiz();
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [quizStarted, examMode, timeLeft]);

  const startQuiz = (timed = false) => {
    const size = timed ? 15 : 10;
    setQuizQuestions(shuffleArray(questionBank).slice(0, size));
    setQuizStarted(true);
    setQuizIndex(0);
    setSelected(null);
    setAnswers([]);
    setShowReview(false);
    setExamMode(timed);
    setTimeLeft(timed ? 25 * 60 : 20 * 60);
  };

  const finishQuiz = () => {
    const percent = quizQuestions.length ? Math.round((answers.filter((a) => a.isCorrect).length / quizQuestions.length) * 100) : 0;
    const entry = {
      date: new Date().toLocaleDateString(),
      mode: examMode ? "Timed exam" : "Practice quiz",
      percent,
      total: quizQuestions.length,
      score: answers.filter((a) => a.isCorrect).length,
    };
    setHistory((prev) => [entry, ...prev].slice(0, 6));
    setShowReview(true);
    setQuizStarted(false);
  };

  const submitAnswer = () => {
    if (selected === null || !currentQuestion) return;
    const isCorrect = selected === currentQuestion.correct;
    const nextAnswers = [...answers, { questionId: currentQuestion.id, selected, isCorrect }];
    setAnswers(nextAnswers);

    if (quizIndex === quizQuestions.length - 1) {
      const percent = quizQuestions.length ? Math.round((nextAnswers.filter((a) => a.isCorrect).length / quizQuestions.length) * 100) : 0;
      const entry = {
        date: new Date().toLocaleDateString(),
        mode: examMode ? "Timed exam" : "Practice quiz",
        percent,
        total: quizQuestions.length,
        score: nextAnswers.filter((a) => a.isCorrect).length,
      };
      setHistory((prev) => [entry, ...prev].slice(0, 6));
      setShowReview(true);
      setQuizStarted(false);
    } else {
      setAnswers(nextAnswers);
      setQuizIndex((prev) => prev + 1);
      setSelected(null);
    }
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setQuizIndex(0);
    setSelected(null);
    setAnswers([]);
    setShowReview(false);
    setExamMode(false);
    setTimeLeft(20 * 60);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const theme = lightMode
    ? {
        page: "min-h-screen bg-slate-100 text-slate-900",
        panel: "border-slate-200 bg-white shadow-sm",
        panelSoft: "border-slate-200 bg-slate-50",
        muted: "text-slate-600",
        strong: "text-slate-950",
        tab: "bg-slate-200",
        activeChoice: "border-sky-500 bg-sky-50 text-slate-900",
        choice: "border-slate-300 bg-white hover:bg-slate-50 text-slate-900",
        hero: "from-sky-100 via-white to-cyan-50",
      }
    : {
        page: "min-h-screen bg-slate-950 text-slate-100",
        panel: "border-slate-700 bg-slate-900 shadow-xl",
        panelSoft: "border-slate-700 bg-slate-800/90",
        muted: "text-slate-300",
        strong: "text-white",
        tab: "bg-slate-800",
        activeChoice: "border-cyan-400 bg-cyan-500/15 text-white",
        choice: "border-slate-600 bg-slate-900 hover:bg-slate-800 text-slate-100",
        hero: "from-slate-900 via-slate-900 to-cyan-950/60",
      };

  return (
    <div className={theme.page}>
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 grid gap-6 lg:grid-cols-[1.3fr_.7fr]">
          <Card className={`rounded-3xl border bg-gradient-to-br ${theme.hero} ${theme.panel}`}>
            <CardContent className="p-8">
              <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className={`rounded-2xl p-3 ${lightMode ? "bg-sky-100" : "bg-cyan-500/15"}`}>
                    <Shield className={`h-7 w-7 ${lightMode ? "text-sky-800" : "text-cyan-300"}`} />
                  </div>
                  <div>
                    <h1 className={`text-3xl font-bold tracking-tight md:text-4xl ${theme.strong}`}>Security+ Practice Hub</h1>
                    <p className={`mt-1 max-w-2xl ${theme.muted}`}>A clearer, more complete website to help you study for the CompTIA Security+ exam with quizzes, flashcards, PBQs, tracking, and timed practice.</p>
                  </div>
                </div>
                <div className={`flex items-center gap-3 rounded-2xl border px-4 py-2 ${theme.panelSoft}`}>
                  <Sun className="h-4 w-4" />
                  <Switch checked={lightMode} onCheckedChange={setLightMode} />
                  <Moon className="h-4 w-4" />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <div className={`rounded-2xl border p-4 ${theme.panelSoft}`}>
                  <div className={`mb-2 flex items-center gap-2 text-sm ${theme.muted}`}><Target className="h-4 w-4" /> Exam code</div>
                  <div className="text-2xl font-semibold">{examInfo.examCode}</div>
                </div>
                <div className={`rounded-2xl border p-4 ${theme.panelSoft}`}>
                  <div className={`mb-2 flex items-center gap-2 text-sm ${theme.muted}`}><Brain className="h-4 w-4" /> Practice questions</div>
                  <div className="text-2xl font-semibold">{questionBank.length}</div>
                </div>
                <div className={`rounded-2xl border p-4 ${theme.panelSoft}`}>
                  <div className={`mb-2 flex items-center gap-2 text-sm ${theme.muted}`}><Clock3 className="h-4 w-4" /> Timed mode</div>
                  <div className="text-2xl font-semibold">25 min</div>
                </div>
                <div className={`rounded-2xl border p-4 ${theme.panelSoft}`}>
                  <div className={`mb-2 flex items-center gap-2 text-sm ${theme.muted}`}><BarChart3 className="h-4 w-4" /> Avg. score</div>
                  <div className="text-2xl font-semibold">{history.length ? `${accuracy}%` : "--"}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={`rounded-3xl border ${theme.panel}`}>
            <CardHeader>
              <CardTitle>Domain weighting</CardTitle>
              <CardDescription className={theme.muted}>Focus more time on the heaviest exam areas.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {examInfo.domains.map((domain) => (
                <div key={domain.id}>
                  <div className={`mb-2 flex items-center justify-between text-sm ${theme.muted}`}>
                    <span className="pr-3 font-medium">{domain.id} {domain.name}</span>
                    <span className="font-semibold">{domain.weight}%</span>
                  </div>
                  <Progress value={domain.weight} className="h-3" />
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        <div className="mb-6 grid gap-6 lg:grid-cols-[1fr_.45fr]">
          <Tabs defaultValue="quiz" className="space-y-6">
            <TabsList className={`grid h-auto w-full grid-cols-2 gap-2 rounded-2xl p-2 md:grid-cols-5 ${theme.tab}`}>
              <TabsTrigger value="quiz" className="rounded-xl">Practice Quiz</TabsTrigger>
              <TabsTrigger value="exam" className="rounded-xl">Timed Exam</TabsTrigger>
              <TabsTrigger value="flashcards" className="rounded-xl">Flashcards</TabsTrigger>
              <TabsTrigger value="pbq" className="rounded-xl">PBQ Practice</TabsTrigger>
              <TabsTrigger value="acronyms" className="rounded-xl">Acronyms</TabsTrigger>
            </TabsList>

            <TabsContent value="quiz">
              <Card className={`rounded-3xl border ${theme.panel}`}>
                <CardHeader>
                  <CardTitle>Practice quiz</CardTitle>
                  <CardDescription className={theme.muted}>Randomized questions with explanations after every quiz.</CardDescription>
                </CardHeader>
                <CardContent>
                  {!quizStarted && !showReview && (
                    <div className="space-y-4">
                      <p className={theme.muted}>Use this mode to build confidence without time pressure.</p>
                      <Button onClick={() => startQuiz(false)} className="rounded-2xl">Start practice quiz</Button>
                    </div>
                  )}

                  {quizStarted && !examMode && currentQuestion && (
                    <div className="space-y-6">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <DomainBadge domain={currentQuestion.domain} lightMode={lightMode} />
                        <Badge variant="outline">{currentQuestion.difficulty}</Badge>
                      </div>
                      <Progress value={progress} className="h-3" />
                      <div>
                        <p className={`mb-1 text-sm ${theme.muted}`}>Question {quizIndex + 1} of {quizQuestions.length}</p>
                        <h3 className="text-xl font-semibold">{currentQuestion.question}</h3>
                      </div>
                      <div className="grid gap-3">
                        {currentQuestion.choices.map((choice, index) => (
                          <button
                            key={index}
                            onClick={() => setSelected(index)}
                            className={`rounded-2xl border p-4 text-left transition ${selected === index ? theme.activeChoice : theme.choice}`}
                          >
                            <span className="font-semibold">{String.fromCharCode(65 + index)}.</span> {choice}
                          </button>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <Button onClick={submitAnswer} className="rounded-2xl">Submit answer</Button>
                        <Button variant="outline" onClick={resetQuiz} className="rounded-2xl">
                          <RotateCcw className="mr-2 h-4 w-4" /> Reset
                        </Button>
                      </div>
                    </div>
                  )}

                  {showReview && !examMode && (
                    <ReviewBlock
                      quizQuestions={quizQuestions}
                      answers={answers}
                      score={score}
                      total={quizQuestions.length}
                      onRestart={() => startQuiz(false)}
                      lightMode={lightMode}
                      theme={theme}
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="exam">
              <Card className={`rounded-3xl border ${theme.panel}`}>
                <CardHeader>
                  <CardTitle>Timed exam mode</CardTitle>
                  <CardDescription className={theme.muted}>A longer mixed quiz with a countdown timer to simulate pressure.</CardDescription>
                </CardHeader>
                <CardContent>
                  {!quizStarted && !showReview && (
                    <div className="space-y-4">
                      <p className={theme.muted}>This mode gives you 15 random questions and 25 minutes.</p>
                      <Button onClick={() => startQuiz(true)} className="rounded-2xl">Start timed exam</Button>
                    </div>
                  )}

                  {quizStarted && examMode && currentQuestion && (
                    <div className="space-y-6">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <DomainBadge domain={currentQuestion.domain} lightMode={lightMode} />
                        <div className={`rounded-2xl border px-4 py-2 font-semibold ${theme.panelSoft}`}>Time left: {formatTime(timeLeft)}</div>
                      </div>
                      <Progress value={progress} className="h-3" />
                      <div>
                        <p className={`mb-1 text-sm ${theme.muted}`}>Question {quizIndex + 1} of {quizQuestions.length}</p>
                        <h3 className="text-xl font-semibold">{currentQuestion.question}</h3>
                      </div>
                      <div className="grid gap-3">
                        {currentQuestion.choices.map((choice, index) => (
                          <button
                            key={index}
                            onClick={() => setSelected(index)}
                            className={`rounded-2xl border p-4 text-left transition ${selected === index ? theme.activeChoice : theme.choice}`}
                          >
                            <span className="font-semibold">{String.fromCharCode(65 + index)}.</span> {choice}
                          </button>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <Button onClick={submitAnswer} className="rounded-2xl">Submit answer</Button>
                        <Button variant="outline" onClick={resetQuiz} className="rounded-2xl">End session</Button>
                      </div>
                    </div>
                  )}

                  {showReview && examMode && (
                    <ReviewBlock
                      quizQuestions={quizQuestions}
                      answers={answers}
                      score={score}
                      total={quizQuestions.length}
                      onRestart={() => startQuiz(true)}
                      lightMode={lightMode}
                      theme={theme}
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="flashcards">
              <Card className={`rounded-3xl border ${theme.panel}`}>
                <CardHeader>
                  <CardTitle>Flashcards</CardTitle>
                  <CardDescription className={theme.muted}>Flip through core exam ideas and quick memory tips.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <DomainBadge domain={currentFlash.domain} lightMode={lightMode} />
                  <motion.div key={`${currentFlash.id}-${showAnswer}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`rounded-3xl border p-8 ${theme.panelSoft}`}>
                    <p className={`mb-3 text-sm uppercase tracking-wide ${theme.muted}`}>{showAnswer ? "Answer" : "Question"}</p>
                    <h3 className="text-2xl font-semibold leading-relaxed">{showAnswer ? currentFlash.answer : currentFlash.question}</h3>
                    {showAnswer && <p className={`mt-4 ${theme.muted}`}>Tip: {currentFlash.tip}</p>}
                  </motion.div>
                  <div className="flex flex-wrap gap-3">
                    <Button onClick={() => setShowAnswer((prev) => !prev)} className="rounded-2xl">{showAnswer ? "Hide answer" : "Show answer"}</Button>
                    <Button variant="outline" className="rounded-2xl" onClick={() => { setFlashIndex((prev) => (prev === 0 ? flashcards.length - 1 : prev - 1)); setShowAnswer(false); }}>Previous</Button>
                    <Button variant="outline" className="rounded-2xl" onClick={() => { setFlashIndex((prev) => (prev === flashcards.length - 1 ? 0 : prev + 1)); setShowAnswer(false); }}>Next</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pbq">
              <Card className={`rounded-3xl border ${theme.panel}`}>
                <CardHeader>
                  <CardTitle>PBQ-style practice</CardTitle>
                  <CardDescription className={theme.muted}>Performance-based prompts that make you think through security tasks step by step.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {pbqs.map((pbq) => (
                    <div key={pbq.id} className={`rounded-2xl border p-5 ${theme.panelSoft}`}>
                      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                        <h3 className="text-lg font-semibold">{pbq.title}</h3>
                        <DomainBadge domain={pbq.domain} lightMode={lightMode} />
                      </div>
                      <p className={`mb-4 ${theme.muted}`}>{pbq.scenario}</p>
                      <div className="mb-4 space-y-2">
                        {pbq.steps.map((step, index) => (
                          <div key={index} className="flex gap-3">
                            <div className={`mt-0.5 rounded-full px-2 py-0.5 text-xs font-bold ${lightMode ? "bg-slate-200 text-slate-800" : "bg-slate-700 text-slate-100"}`}>{index + 1}</div>
                            <p>{step}</p>
                          </div>
                        ))}
                      </div>
                      <Accordion type="single" collapsible>
                        <AccordionItem value={`pbq-${pbq.id}`}>
                          <AccordionTrigger>Show suggested answers</AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-2">
                              {pbq.answers.map((answer, index) => (
                                <p key={index}><span className="font-semibold">Step {index + 1}:</span> {answer}</p>
                              ))}
                              <p className={`pt-2 ${theme.muted}`}>{pbq.explanation}</p>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="acronyms">
              <div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
                <Card className={`rounded-3xl border ${theme.panel}`}>
                  <CardHeader>
                    <CardTitle>Study filters</CardTitle>
                    <CardDescription className={theme.muted}>Search acronyms and browse the question bank by domain.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="relative">
                      <Search className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${theme.muted}`} />
                      <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search acronym or meaning" className="rounded-2xl pl-10" />
                    </div>
                    <div className="space-y-2">
                      <Label>Question bank filter</Label>
                      <Select value={domainFilter} onValueChange={setDomainFilter}>
                        <SelectTrigger className="rounded-2xl">
                          <SelectValue placeholder="Choose a domain" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All domains</SelectItem>
                          {examInfo.domains.map((d) => <SelectItem key={d.id} value={d.id}>{d.id} {d.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card className={`rounded-3xl border ${theme.panel}`}>
                  <CardHeader>
                    <CardTitle>Acronyms + answer explanations</CardTitle>
                    <CardDescription className={theme.muted}>Use this section to memorize terms and review concepts by domain.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      {filteredAcronyms.map(([short, long]) => (
                        <div key={short} className={`rounded-2xl border p-4 ${theme.panelSoft}`}>
                          <div className="mb-2 flex items-center gap-2 font-semibold"><BookOpen className="h-4 w-4" /> {short}</div>
                          <p className={theme.muted}>{long}</p>
                        </div>
                      ))}
                    </div>

                    <Accordion type="single" collapsible className="w-full">
                      {filteredQuestions.map((q) => (
                        <AccordionItem key={q.id} value={`item-${q.id}`}>
                          <AccordionTrigger className="text-left">{q.question}</AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-3">
                              <div className="flex flex-wrap gap-2">
                                <DomainBadge domain={q.domain} lightMode={lightMode} />
                                <Badge variant="outline">{q.difficulty}</Badge>
                              </div>
                              <ul className={`space-y-2 ${theme.muted}`}>
                                {q.choices.map((choice, index) => <li key={index}><span className="font-semibold">{String.fromCharCode(65 + index)}.</span> {choice}</li>)}
                              </ul>
                              <p><span className="font-semibold">Correct answer:</span> {q.choices[q.correct]}</p>
                              <p className={theme.muted}>{q.explanation}</p>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          <div className="space-y-6">
            <Card className={`rounded-3xl border ${theme.panel}`}>
              <CardHeader>
                <CardTitle>Score tracking</CardTitle>
                <CardDescription className={theme.muted}>See how your recent sessions are going.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {history.length === 0 ? (
                  <p className={theme.muted}>No sessions yet. Finish a quiz to track your scores here.</p>
                ) : (
                  history.map((item, index) => (
                    <div key={index} className={`rounded-2xl border p-4 ${theme.panelSoft}`}>
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold">{item.mode}</p>
                          <p className={`text-sm ${theme.muted}`}>{item.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">{item.percent}%</p>
                          <p className={`text-sm ${theme.muted}`}>{item.score}/{item.total}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card className={`rounded-3xl border ${theme.panel}`}>
              <CardHeader>
                <CardTitle>Quick study plan</CardTitle>
                <CardDescription className={theme.muted}>A simple routine for daily practice.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className={`rounded-2xl border p-4 ${theme.panelSoft}`}>
                  <p className="font-semibold">1. Warm up</p>
                  <p className={theme.muted}>Review 5 flashcards and 5 acronyms.</p>
                </div>
                <div className={`rounded-2xl border p-4 ${theme.panelSoft}`}>
                  <p className="font-semibold">2. Drill weak areas</p>
                  <p className={theme.muted}>Use the domain filter to focus on missed topics.</p>
                </div>
                <div className={`rounded-2xl border p-4 ${theme.panelSoft}`}>
                  <p className="font-semibold">3. Simulate the exam</p>
                  <p className={theme.muted}>Run timed mode and review every explanation after.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReviewBlock({ quizQuestions, answers, score, total, onRestart, lightMode, theme }) {
  return (
    <div className="space-y-6">
      <div className={`rounded-3xl border p-6 ${theme.panelSoft}`}>
        <div className="mb-2 flex items-center gap-2 text-xl font-semibold"><Trophy className="h-5 w-5" /> Session complete</div>
        <p className={theme.muted}>You scored <span className="font-semibold text-inherit">{score}/{total}</span>.</p>
      </div>

      <div className="space-y-4">
        {quizQuestions.map((q, idx) => {
          const result = answers[idx];
          return (
            <div key={q.id} className={`rounded-2xl border p-5 ${theme.panelSoft}`}>
              <div className="mb-2 flex items-center justify-between gap-3">
                <DomainBadge domain={q.domain} lightMode={lightMode} />
                {result?.isCorrect ? (
                  <span className="flex items-center gap-2 text-sm font-medium"><CheckCircle2 className="h-4 w-4" /> Correct</span>
                ) : (
                  <span className="flex items-center gap-2 text-sm font-medium"><XCircle className="h-4 w-4" /> Review</span>
                )}
              </div>
              <h4 className="font-semibold">{q.question}</h4>
              <p className={`mt-2 text-sm ${theme.muted}`}>Your answer: {typeof result?.selected === "number" ? q.choices[result.selected] : "No answer selected"}</p>
              <p className="mt-2 text-sm"><span className="font-semibold">Correct answer:</span> {q.choices[q.correct]}</p>
              <p className={`mt-2 text-sm ${theme.muted}`}>{q.explanation}</p>
            </div>
          );
        })}
      </div>
      <Button onClick={onRestart} className="rounded-2xl">Try another session</Button>
    </div>
  );
}
