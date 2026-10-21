import { useState, type ReactNode } from "react";
import { ArrowUpRight, ArrowRight, Code2, Box, Expand } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import "@/project-showcase.css";

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

const presentation = {
  abhyaas: { label: "Featured flagship", note: "AI & learning", intro: "A clearer path from practice to preparation.", body: "Built for CDS aspirants. Previous-year papers, an AI doubt solver, and progress tracking come together in one focused study space." },
  resumeiq: { label: "AI productivity", note: "Career tools", intro: "An AI resume workspace for sharper feedback, stronger bullet points, and a better job match." },
  aissist: { label: "AI & voice", note: "Interview practice", intro: "Role-based mock interviews with spoken answers and useful feedback for the real conversation." },
  fizzi: { label: "Creative web & 3D", note: "Motion study", intro: "A playful 3D product showcase with a little fizz.", body: "An exploration of product storytelling through interactive 3D cans, colorful scenes, and scroll-led GSAP transitions, with content powered by Prismic." },
};

function PreviewWindow({ title, sample = true, children }: { title: string; sample?: boolean; children: ReactNode }) {
  return <div className="work-preview-window">
    <div className="work-browser-bar"><span className="work-browser-dots" aria-hidden="true"><i /><i /><i /></span><span className="work-browser-title">{title}</span>{sample ? <span className="work-preview-label">Sample preview</span> : <ArrowUpRight size={13} aria-hidden="true" />}</div>
    {children}
  </div>;
}

function LearningPreview() {
  return <Dialog>
    <div className="work-dashboard-stage">
      <PreviewWindow title="abhyaas-two.vercel.app" sample={false}>
        <DialogTrigger asChild><button className="work-dashboard-image" aria-label="Enlarge Abhyaas dashboard screenshot"><img src="/assets/projects/abhyaas-dashboard.png" alt="Abhyaas study dashboard in forest green, with a daily study mission, a learning companion, a focus timer, and progress tracking" width={2844} height={1522} loading="lazy" decoding="async" /><span className="work-image-expand"><Expand size={15} />View screenshot</span></button></DialogTrigger>
      </PreviewWindow>
      <div className="work-preview-caption"><span><i />Inside the study workspace</span><span>Practice. Learn. Repeat.</span></div>
    </div>
    <DialogContent className="work-screenshot-dialog"><DialogHeader><DialogTitle>Inside Abhyaas</DialogTitle><DialogDescription>The daily study workspace, from a focused plan to progress over time.</DialogDescription></DialogHeader><div className="work-screenshot-scroll" tabIndex={0} role="region" aria-label="Abhyaas dashboard screenshot. Scroll horizontally to explore the full image."><img src="/assets/projects/abhyaas-dashboard.png" alt="Full Abhyaas dashboard showing a study plan, learning companion, focus timer, and daily progress" width={2844} height={1522} /></div><p className="work-screenshot-hint">Scroll the image to explore the dashboard.</p></DialogContent>
  </Dialog>;
}

function AppScreenshot({ project }: { project: "resumeiq" | "aissist" }) {
  const isResume = project === "resumeiq";
  const name = isResume ? "ResumeIQ" : "AIssist";
  const src = `/assets/projects/${isResume ? "resumeiq.jpg" : "aissist-preview.jpg"}`;
  const dimensions = isResume ? { width: 1200, height: 800 } : { width: 1280, height: 720 };
  const alt = isResume ? "ResumeIQ website with its purple AI resume workspace introduction" : "AIssist interview preparation screen with a sample frontend developer role, tech stack, and camera setup";
  const caption = isResume ? "Your resume, reimagined by AI" : "Local preview · sample interview";
  return <Dialog>
    <div className="work-app-stage">
      <PreviewWindow title={isResume ? "new-resume-ai.vercel.app" : "AIssist / interview preparation"} sample={false}>
        <DialogTrigger asChild><button type="button" className="work-app-image" aria-label={`Enlarge ${name} screenshot`}><img src={src} alt={alt} {...dimensions} loading="lazy" decoding="async" /><span className="work-image-expand"><Expand size={15} />View screenshot</span></button></DialogTrigger>
      </PreviewWindow>
      <p className="work-app-caption">{caption}</p>
    </div>
    <DialogContent className={`work-screenshot-dialog work-app-dialog work-app-dialog-${project}`}><DialogHeader><DialogTitle>Inside {name}</DialogTitle><DialogDescription>{isResume ? "The ResumeIQ website and its AI-powered resume workspace." : "The original AIssist interface, rendered locally with sample interview details."}</DialogDescription></DialogHeader><div className="work-screenshot-scroll" tabIndex={0} role="region" aria-label={`${name} screenshot. Scroll horizontally to explore the full image.`}><img src={src} alt={alt} {...dimensions} /></div><p className="work-screenshot-hint">Scroll the image for a closer look.</p></DialogContent>
  </Dialog>;
}

function ProjectVisual({ project }: { project: Project }) {
  if (project.id === "abhyaas") return <LearningPreview />;
  if (project.id === "resumeiq" || project.id === "aissist") return <AppScreenshot project={project.id} />;
  return <PreviewWindow title="fizzi-demo.vercel.app" sample={false}><div className="work-fizzi-preview"><img src="/assets/projects/fizzi.jpg" alt="Fizzi website with floating cherry and lime soda cans on a bright yellow background" width={1200} height={800} loading="lazy" decoding="async" /><span><Box size={13} />React Three Fiber · 3D scene</span></div></PreviewWindow>;
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const copy = presentation[project.id];
  return <Dialog><article className={`work-card work-card-${project.id}`} aria-labelledby={`${project.id}-title`}>
    <div className="work-card-copy"><div className="work-card-meta"><span><b className="work-project-index">0{index + 1}</b>{copy.label}</span><span>{copy.note}</span></div><h3 id={`${project.id}-title`}>{project.name}</h3><p className="work-card-intro">{copy.intro}</p>{"body" in copy && <p className="work-card-description">{copy.body}</p>}</div>
    <div className="work-card-preview"><ProjectVisual project={project} /></div>
    <div className="work-card-footer"><ul className="work-tech-list" aria-label={`${project.name} technologies`}>{project.stack.map(tool => <li key={tool}>{tool}</li>)}</ul><div className="work-card-actions">
      {project.live ? <a className="work-primary-action" href={project.live} target="_blank" rel="noreferrer" aria-label={`Visit ${project.name} website (opens in a new tab)`}>Visit website <ArrowUpRight size={15} /></a> : <DialogTrigger asChild><button className="work-primary-action">View project <ArrowUpRight size={15} /></button></DialogTrigger>}
      {project.live ? <DialogTrigger asChild><button className="work-secondary-action">{project.id === "abhyaas" ? "Project details" : "Details"}<ArrowRight size={14} /></button></DialogTrigger> : <a className="work-secondary-action" href={project.code} target="_blank" rel="noreferrer" aria-label="AIssist on GitHub (opens in a new tab)">GitHub <Code2 size={14} /></a>}
    </div></div>
  </article><ProjectDetails project={project} /></Dialog>;
}

const filters = [{ id: "all", label: "All projects", count: true }, { id: "ai", label: "AI & Full-Stack" }, { id: "web", label: "Web & Motion" }];
export function ProjectShowcase() {
  const [filter, setFilter] = useState("all");
  const visible = projects.filter(project => filter === "all" || project.type === filter);
  return <div className="work-gallery">
    <header className="work-gallery-header"><div><p className="work-gallery-eyebrow"><span />Selected works / development & experiments</p><h2 id="work-heading" tabIndex={-1}>Platforms built with editorial rigor & intent.</h2></div><div className="work-filters" role="group" aria-label="Filter projects">{filters.map(item => <button key={item.id} type="button" aria-pressed={filter === item.id} aria-controls="selected-projects" onClick={() => setFilter(item.id)}>{item.label}{item.count && <span> ({projects.length})</span>}</button>)}</div></header>
    <p className="sr-only" role="status">Showing {visible.length} {visible.length === 1 ? "project" : "projects"}.</p>
    <div id="selected-projects" className="work-gallery-grid">{visible.map(project => <ProjectCard key={project.id} project={project} index={projects.indexOf(project)} />)}</div>
  </div>;
}
