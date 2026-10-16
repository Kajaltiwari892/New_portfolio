import { useState } from "react";
import { ArrowUpRight, ArrowRight, Code2, Mic, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export const projects = [
  { id: "abhyaas", name: "Abhyaas", category: "AI · LEARNING", type: "ai", tagline: "A little practice. A clearer path.", description: "A study space for CDS aspirants, bringing practice papers, an AI doubt solver, and progress tracking together.", stack: ["Next.js", "FastAPI", "PostgreSQL", "Gemini · RAG"], code: "https://github.com/Kajaltiwari892/Abhyaas", live: "https://abhyaas-two.vercel.app", detail: "I brought the learning flow together—from finding a topic to practising it and revisiting mistakes. The doubt solver retrieves study passages with Qdrant and keeps official previous-year questions separate from generated practice.", skills: "React, TypeScript, Tailwind CSS, Python, FastAPI, SQLAlchemy, PostgreSQL, Qdrant, Gemini, Three.js, Motion" },
  { id: "resumeiq", name: "ResumeIQ", category: "AI · CAREER TOOLS", type: "ai", tagline: "Your experience, better expressed.", description: "An AI resume workspace for useful feedback, stronger bullet points, job-description matching, and interview preparation.", stack: ["Next.js", "Express", "MongoDB", "Gemini"], code: "https://github.com/Kajaltiwari892/New-Resume-Ai", live: "https://new-resume-ai.vercel.app", detail: "I worked across the full stack: resume uploads and parsing, line-level feedback, job keyword matching, authentication, and PDF export. The goal is to turn a broad resume review into specific edits someone can actually make.", skills: "React, TypeScript, Tailwind CSS, Node.js, Express, MongoDB, JWT authentication, Gemini, PDFKit, Motion" },
  { id: "aissist", name: "AIssist", category: "AI · INTERVIEW PRACTICE", type: "ai", tagline: "A little less “what do I say?”", description: "Mock interviews with role-based AI questions, spoken answers, and feedback to help you prepare for the real conversation.", stack: ["Next.js", "Gemini", "Clerk", "Drizzle ORM"], code: "https://github.com/Kajaltiwari892/Alssist", live: null, detail: "A practice loop for upcoming developers: choose a role and experience level, work through questions, record a response, and review feedback. Clerk handles sign-in, with interview data stored through Drizzle and Neon PostgreSQL.", skills: "Next.js, TypeScript, Tailwind CSS, Gemini, Clerk, Drizzle ORM, Neon PostgreSQL, speech-to-text" },
  { id: "fizzi", name: "Fizzi", category: "WEB · 3D & MOTION", type: "web", tagline: "A product story with a little fizz.", description: "A playful soda showcase with 3D cans, scroll-led animation, and colorful product storytelling.", stack: ["Next.js", "React Three Fiber", "GSAP", "Prismic"], code: "https://github.com/Kajaltiwari892/Fizzi", live: "https://fizzi-demo.vercel.app", detail: "An exploration of 3D on the web, connecting product scenes with scroll-driven transitions. React Three Fiber renders the cans, GSAP coordinates movement, and Prismic provides the page content.", skills: "Next.js, React Three Fiber, Three.js, GSAP, Prismic" },
] as const;

type Project = typeof projects[number];

function ProjectDetails({ project }: { project: Project }) {
  return <DialogContent className="project-detail-dialog"><DialogHeader><span className="mini-eyebrow">{project.category}</span><DialogTitle>{project.name}</DialogTitle><DialogDescription>{project.tagline}</DialogDescription></DialogHeader><p>{project.detail}</p><div className="project-detail-skills"><h3>What I worked with</h3><p>{project.skills}</p></div><div className="project-detail-links">{project.live && <Button asChild><a href={project.live} target="_blank" rel="noreferrer">Visit website <ArrowUpRight size={15} /></a></Button>}<Button asChild variant="outline"><a href={project.code} target="_blank" rel="noreferrer">Explore code <Code2 size={15} /></a></Button></div></DialogContent>;
}

function ProjectVisual({ project }: { project: Project }) {
  return <>
    {project.live ? <div className="website-window"><div className="website-chrome" aria-hidden="true"><span><i /><i /><i /></span><small>{new URL(project.live).hostname}</small><ArrowUpRight size={12} /></div><img src={`/assets/projects/${project.id}.jpg`} alt={`${project.name} website preview`} width={1200} height={800} loading="lazy" decoding="async" /></div> : <div className="interview-cover"><span className="interview-cover-label"><Mic size={16} /> AIssist</span><div className="interview-orbit" aria-hidden="true"><span /><span /><Mic size={43} strokeWidth={1} /></div><strong>Find your voice.<br />Build your confidence.</strong><span className="interview-cover-caption">AI-POWERED INTERVIEW PRACTICE</span></div>}
    <span className="preview-launch">{project.live ? "Visit website" : "Explore project"}<ArrowUpRight size={18} /></span>
  </>;
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return <Dialog><article className={`project-exhibit exhibit-${project.id}`}>
    {project.live ? <a href={project.live} target="_blank" rel="noreferrer" className="exhibit-visual" aria-label={`Visit ${project.name} website (opens in a new tab)`}><ProjectVisual project={project} /></a> : <DialogTrigger asChild><button className="exhibit-visual" aria-label={`About ${project.name}`}><ProjectVisual project={project} /></button></DialogTrigger>}
    <div className="exhibit-info"><div className="exhibit-eyebrow"><span>0{index + 1} / {project.category}</span>{!project.live && <span>CODE AVAILABLE</span>}</div><div className="exhibit-title"><h3>{project.name}</h3><DialogTrigger asChild><button className="exhibit-about">About the project <ArrowRight size={15} /></button></DialogTrigger></div><p>{project.description}</p><div className="exhibit-bottom"><div className="exhibit-stack">{project.stack.map(tool => <span key={tool}>{tool}</span>)}</div><a href={project.code} target="_blank" rel="noreferrer" aria-label={`${project.name} source code on GitHub`}><Code2 size={19} /></a></div></div>
  </article><ProjectDetails project={project} /></Dialog>;
}

export function ProjectShowcase() {
  const [filter, setFilter] = useState("all");
  const visible = projects.filter(project => filter === "all" || project.type === filter);
  return <div className="project-gallery"><div className="exhibit-toolbar"><Tabs value={filter} onValueChange={setFilter}><TabsList aria-label="Filter projects"><TabsTrigger value="all">All projects <span>04</span></TabsTrigger><TabsTrigger value="ai">AI & full-stack</TabsTrigger><TabsTrigger value="web">Web & motion</TabsTrigger></TabsList></Tabs><span><Sparkles size={14} /> Built to be explored.</span></div><div className="exhibit-grid">{visible.map(project => <ProjectCard key={project.id} project={project} index={projects.indexOf(project)} />)}</div></div>;
}
