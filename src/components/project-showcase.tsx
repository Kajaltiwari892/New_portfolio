import { useState, type CSSProperties } from "react";
import { ArrowRight, ArrowUpRight, BookOpen, Check, ChevronRight, Code2, FileText, MessageCircle, RotateCcw, Sparkles } from "lucide-react";
import { FocusCards } from "@/components/ui/focus-cards";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export const projects = [
  { id: "abhyaas", name: "Abhyaas", category: "AI · LEARNING", type: "ai", tagline: "A little practice. A clearer path.", description: "A study space for CDS aspirants, bringing practice papers, an AI doubt solver, and progress tracking together.", stack: ["Next.js", "FastAPI", "PostgreSQL", "Gemini · RAG"], code: "https://github.com/Kajaltiwari892/Abhyaas", live: "https://abhyaas-two.vercel.app", detail: "I brought the learning flow together—from finding a topic to practising it and revisiting mistakes. The doubt solver retrieves study passages with Qdrant and keeps official previous-year questions separate from generated practice.", skills: "React, TypeScript, Tailwind CSS, Python, FastAPI, SQLAlchemy, PostgreSQL, Qdrant, Gemini, Three.js, Motion" },
  { id: "resumeiq", name: "ResumeIQ", category: "AI · CAREER TOOLS", type: "ai", tagline: "Your experience, better expressed.", description: "An AI resume workspace for useful feedback, stronger bullet points, job-description matching, and interview preparation.", stack: ["Next.js", "Express", "MongoDB", "Gemini"], code: "https://github.com/Kajaltiwari892/New-Resume-Ai", live: "https://new-resume-ai.vercel.app", detail: "I worked across the full stack: resume uploads and parsing, line-level feedback, job keyword matching, authentication, and PDF export. The goal is to turn a broad resume review into specific edits someone can actually make.", skills: "React, TypeScript, Tailwind CSS, Node.js, Express, MongoDB, JWT authentication, Gemini, PDFKit, Motion" },
  { id: "aissist", name: "AIssist", category: "AI · INTERVIEW PRACTICE", type: "ai", tagline: "A little less “what do I say?”", description: "Mock interviews with role-based AI questions, spoken answers, and feedback to help you prepare for the real conversation.", stack: ["Next.js", "Gemini", "Clerk", "Drizzle ORM"], code: "https://github.com/Kajaltiwari892/Alssist", live: null, detail: "A practice loop for upcoming developers: choose a role and experience level, work through questions, record a response, and review feedback. Clerk handles sign-in, with interview data stored through Drizzle and Neon PostgreSQL.", skills: "Next.js, TypeScript, Tailwind CSS, Gemini, Clerk, Drizzle ORM, Neon PostgreSQL, speech-to-text" },
  { id: "fizzi", name: "Fizzi", category: "WEB · 3D & MOTION", type: "web", tagline: "A product story with a little fizz.", description: "A playful soda showcase with 3D cans, scroll-led animation, and colorful product storytelling.", stack: ["Next.js", "React Three Fiber", "GSAP", "Prismic"], code: "https://github.com/Kajaltiwari892/Fizzi", live: "https://fizzi-demo.vercel.app", detail: "An exploration of 3D on the web, connecting product scenes with scroll-driven transitions. React Three Fiber renders the cans, GSAP coordinates movement, and Prismic provides the page content.", skills: "Next.js, React Three Fiber, Three.js, GSAP, Prismic" },
] as const;

function AbhyaasPreview() {
  const [done, setDone] = useState([false, false, false]);
  const count = done.filter(Boolean).length;
  return <div className="project-playground study-playground">
    <div className="preview-window-bar"><span><BookOpen size={14} /> abhyaas / daily practice</span><span>01</span></div>
    <div className="study-preview-content"><div><span className="mini-eyebrow">ONE STEP AT A TIME</span><h3>You’ve got this.</h3><p>A little progress is still progress.</p><div className="study-progress" aria-label={`${count} of 3 sample tasks complete`}><span style={{ width: `${count / 3 * 100}%` }} /></div><span className="preview-progress-count" role="status">{count} / 3 steps complete</span></div>
      <div className="study-checklist">{["Revise a concept", "Practise questions", "Review a mistake"].map((text, index) => <button key={text} aria-pressed={done[index]} onClick={() => setDone(current => current.map((value, i) => i === index ? !value : value))}><span>{done[index] && <Check size={12} />}</span>{text}</button>)}</div>
    </div>
    <span className="preview-instruction">Try checking off a step <ArrowUpRight size={12} /></span>
  </div>;
}

function ResumePreview() {
  const [rewritten, setRewritten] = useState(false);
  return <div className="project-playground resume-playground">
    <div className="preview-window-bar"><span><FileText size={14} /> resumeiq / a stronger first impression</span><Sparkles size={15} /></div>
    <div className="resume-example"><span className="mini-eyebrow">{rewritten ? "CLEARER & MORE SPECIFIC" : "A LINE WITH POTENTIAL"}</span><p aria-live="polite">{rewritten ? "Built a React dashboard that brings tasks, deadlines, and progress into one workspace." : "Worked on a dashboard using React."}</p><span className="resume-annotation">{rewritten ? "Action + what you built + why it matters." : "What did you build? Why was it useful?"}</span></div>
    <button className="preview-action" aria-pressed={rewritten} onClick={() => setRewritten(current => !current)}>{rewritten ? <RotateCcw size={13} /> : <Sparkles size={13} />}{rewritten ? "See the original" : "Try a stronger rewrite"}<ArrowRight size={13} /></button>
  </div>;
}

const interviewQuestions = [
  { question: "Tell me about something you built that you’re proud of.", hint: "Start with the problem. Explain your part, then what you learned." },
  { question: "How would you make a slow React page feel faster?", hint: "Measure first. Look at rendering, network requests, and what the user sees first." },
  { question: "What do you do when you get stuck on a difficult bug?", hint: "Walk through one real example: reproduce, isolate, test, and verify." },
];
function InterviewPreview() {
  const [question, setQuestion] = useState(0);
  const [hint, setHint] = useState(false);
  return <div className="project-playground interview-playground">
    <div className="preview-window-bar"><span><MessageCircle size={14} /> aissist / a practice conversation</span><span>0{question + 1} / 03</span></div>
    <div className="interview-question" aria-live="polite"><span className="mini-eyebrow">TAKE A BREATH. YOU’RE PRACTISING.</span><p>{interviewQuestions[question].question}</p><span className="interview-hint">{hint ? interviewQuestions[question].hint : "A small prompt to get the words flowing."}</span></div>
    <div className="interview-controls"><button aria-pressed={hint} onClick={() => setHint(value => !value)}>{hint ? "Hide hint" : "A little hint"}<Sparkles size={12} /></button><button onClick={() => { setQuestion(value => (value + 1) % interviewQuestions.length); setHint(false); }}>Next question <ChevronRight size={14} /></button></div>
  </div>;
}

const flavors = [{ name: "Lime", color: "#acbc71", ink: "#35452c", label: "A fresh little twist." }, { name: "Peach", color: "#dfa487", ink: "#704c37", label: "A softer kind of sparkle." }, { name: "Berry", color: "#b1a1bd", ink: "#51415e", label: "Something a little unexpected." }];
function FizziPreview() {
  const [flavor, setFlavor] = useState(0);
  return <div className="project-playground fizzi-playground" style={{ "--can-color": flavors[flavor].color, "--can-ink": flavors[flavor].ink } as CSSProperties}>
    <div className="fizzi-preview-copy"><span className="mini-eyebrow">A SIP OF SOMETHING PLAYFUL</span><h3>Good things.<br />Great fizz.</h3><p role="status">{flavors[flavor].label}</p><div className="flavor-options" role="group" aria-label="Preview a Fizzi flavor">{flavors.map((item, index) => <button key={item.name} onClick={() => setFlavor(index)} aria-pressed={flavor === index} style={{ "--swatch": item.color } as CSSProperties}><i />{item.name}</button>)}</div></div>
    <div className="fizzi-can-scene" aria-hidden="true"><i className="fizz-bubble bubble-one" /><i className="fizz-bubble bubble-two" /><i className="fizz-bubble bubble-three" /><div className="fizzi-mini-can"><span className="can-rim" /><strong>F.</strong><span>{flavors[flavor].name}<br />a little more fizz.</span></div></div>
  </div>;
}

function ShowcaseCard({ project, index }: { project: typeof projects[number]; index: number }) {
  return <article className={"showcase-card showcase-" + project.id}>
    <div className="showcase-topline"><span>0{index + 1} / {project.category}</span><span>Interactive preview <span className="preview-dot" /></span></div>
    <div className="showcase-art">{project.id === "abhyaas" ? <AbhyaasPreview /> : project.id === "resumeiq" ? <ResumePreview /> : project.id === "aissist" ? <InterviewPreview /> : <FizziPreview />}</div>
    <div className="showcase-copy"><div className="showcase-title"><h2>{project.name}</h2><Dialog><DialogTrigger asChild><button className="project-detail-button" aria-label={`About ${project.name}`}><ArrowUpRight size={22} /></button></DialogTrigger><DialogContent className="project-detail-dialog"><DialogHeader><span className="mini-eyebrow">{project.category}</span><DialogTitle>{project.name}</DialogTitle><DialogDescription>{project.tagline}</DialogDescription></DialogHeader><p>{project.detail}</p><div className="project-detail-skills"><h3>What I worked with</h3><p>{project.skills}</p></div><div className="project-detail-links">{project.live && <Button asChild><a href={project.live} target="_blank" rel="noreferrer">Visit project <ArrowUpRight size={15} /></a></Button>}<Button asChild variant="outline"><a href={project.code} target="_blank" rel="noreferrer">Explore code <Code2 size={15} /></a></Button></div></DialogContent></Dialog></div><p>{project.description}</p><div className="showcase-stack">{project.stack.map(tool => <span key={tool}>{tool}</span>)}</div><div className="showcase-links">{project.live && <a href={project.live} target="_blank" rel="noreferrer">Visit project <ArrowUpRight size={14} /></a>}<a href={project.code} target="_blank" rel="noreferrer">Explore code <Code2 size={14} /></a></div></div>
  </article>;
}

export function ProjectShowcase() {
  const [filter, setFilter] = useState("all");
  const visible = projects.filter(project => filter === "all" || project.type === filter);
  return <>
    <div className="showcase-toolbar"><Tabs value={filter} onValueChange={setFilter}><TabsList aria-label="Filter projects"><TabsTrigger value="all">All projects <span>04</span></TabsTrigger><TabsTrigger value="ai">AI & full-stack</TabsTrigger><TabsTrigger value="web">Web & motion</TabsTrigger></TabsList></Tabs><p>A few things to click, switch, and explore.</p></div>
    <FocusCards className="project-focus-grid" cards={visible.map(project => ({ id: project.id, content: <ShowcaseCard project={project} index={projects.indexOf(project)} /> }))} />
    <p className="showcase-footnote">The little interactions are sample previews. Follow “Visit project” to try the full app.</p>
  </>;
}
