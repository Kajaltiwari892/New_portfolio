import { useEffect, useRef, useState, type MouseEvent } from "react";
import { ArrowRight, ArrowUpRight, Check, Copy, MousePointer2, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TaskboardDemo, FocusDemo, PaletteDemo } from "@/components/project-demos";
import { caseStudies } from "@/portfolio-content";

type Study = typeof caseStudies[number];
const nav = [["Work","work"],["About","about"],["Approach","approach"],["Notes","notes"]];
const palette = ["#f0e3e0","#dec6d7","#c1bfdc","#8e94bb","#535879"];

export function Mark({className=""}:{className?:string}) { return <svg className={className} viewBox="0 0 40 40" fill="none" aria-hidden="true"><path d="M20 5v30M5 20h30M9.4 9.4l21.2 21.2M9.4 30.6 30.6 9.4" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/></svg>; }
function SectionHeading({label,title,description,index}:{label:string;title:string;description?:string;index:string}) { return <div className="section-heading"><div><p className="eyebrow"><span/>{label}</p><h2>{title}</h2>{description&&<p className="section-description">{description}</p>}</div><span className="section-number">{index}</span></div>; }

function BoardPreview() { return <div className="preview-board" aria-hidden="true"><div className="mini-browser"><span/><span/><span/><small>Taskboard / My workspace</small></div><div className="mini-board-heading"><strong>A clear head starts here.</strong><span>+ New task</span></div><div className="mini-columns">{["To do","In progress","Done"].map((title,i)=><div key={title}><span className="mini-column-title"><i/>{title}</span>{Array.from({length:i===0?3:2},(_,j)=><div key={j} className="mini-task"><i className={"mini-label label-"+((i+j)%3)}/><span className="mini-task-line"/><span className="mini-task-line short"/><div><b/>{i===2?<Check size={9}/>:<span>···</span>}</div></div>)}</div>)}</div><div className="board-cursor"><MousePointer2 size={21} fill="#6e62be"/><span>make progress</span></div></div>; }
function FocusPreview() { return <div className="preview-focus" aria-hidden="true"><div className="focus-top"><span><span/> a moment of focus</span><span>···</span></div><div className="preview-clock"><span>TIME FOR ONE THING</span><strong>25<span>:</span>00</strong><small>Less noise. More headspace.</small></div><div className="preview-focus-controls"><span>▶ Start a session</span><i>↻</i></div><div className="focus-bottom"><span>find your rhythm.</span><svg viewBox="0 0 110 20"><path d="M2 12Q10 0 20 12T40 12T60 12T80 12T100 12" fill="none" stroke="currentColor"/></svg></div></div>; }
function PalettePreview() { return <div className="preview-palette" aria-hidden="true"><div className="palette-mini-top"><Palette size={14}/><span>palette / play</span><span>↗</span></div><h4>A different kind<br/>of <em>feeling.</em></h4><div className="mini-swatches">{palette.map((color,i)=><div key={color} style={{background:color,transform:`translateY(${[10,0,15,5,20][i]}px) rotate(${[-5,-2,2,4,7][i]}deg)`}}><span>{color}</span></div>)}</div></div>; }

// A dialog may have several entry points; Radix otherwise restores its last trigger.
function useDialogOpenerFocus() {
  const opener = useRef<HTMLButtonElement | null>(null);
  return {
    capture: (event: MouseEvent<HTMLButtonElement>) => { opener.current = event.currentTarget; },
    restore: (event: Event) => {
      if (opener.current?.isConnected) {
        event.preventDefault();
        opener.current.focus({ preventScroll: true });
      }
    },
  };
}

export function ProjectCard({study,index}:{study:Study;index:number}) {
  const [open,setOpen]=useState(false);
  const projectFocus = useDialogOpenerFocus();
  return <Dialog open={open} onOpenChange={setOpen}><article className={"project-card project-"+study.id}>
    <DialogTrigger asChild><button onClick={projectFocus.capture} className="project-image" aria-label={"Explore "+study.title}>{study.id==="board"?<BoardPreview/>:study.id==="focus"?<FocusPreview/>:<PalettePreview/>}<span className="project-open"><ArrowUpRight size={19}/></span></button></DialogTrigger>
    <div className="project-copy"><div className="project-overline"><span>0{index+1} / {study.id==="palette"?"DESIGN TOOL":"PRODUCTIVITY"}</span><Badge variant="outline">Interactive study</Badge></div><DialogTrigger asChild><button onClick={projectFocus.capture} className="project-title"><h3>{study.title}</h3><ArrowUpRight size={19}/></button></DialogTrigger><p>{study.summary}</p><div className="project-stack">{study.stack.map(item=><span key={item}>{item}</span>)}</div><DialogTrigger asChild><Button onClick={projectFocus.capture} variant="ghost" className="study-link">Explore the study <ArrowRight size={15}/></Button></DialogTrigger></div>
  </article><DialogContent className="study-dialog" onCloseAutoFocus={projectFocus.restore}><DialogHeader><div className="eyebrow"><span/>INTERACTIVE STUDY</div><DialogTitle>{study.title}</DialogTitle><DialogDescription>{study.summary}</DialogDescription></DialogHeader><Tabs defaultValue="demo" className="study-tabs"><TabsList><TabsTrigger value="demo">Try it out</TabsTrigger><TabsTrigger value="story">The thinking behind it</TabsTrigger></TabsList><TabsContent value="demo">{open&&(study.id==="board"?<TaskboardDemo/>:study.id==="focus"?<FocusDemo/>:<PaletteDemo/>)}</TabsContent><TabsContent value="story"><div className="case-study-copy">{[["The challenge",study.challenge],["The approach",study.approach],["The result",study.outcome]].map(([title,body])=><section key={title}><h3>{title}</h3><p>{body}</p></section>)}<div className="case-stack">{study.stack.map(item=><Badge variant="secondary" key={item}>{item}</Badge>)}</div></div></TabsContent></Tabs></DialogContent></Dialog>;
}

export function BriefDialog() {
  const [brief,setBrief]=useState(()=>{try{return localStorage.getItem("portfolio-project-brief")||"";}catch{return"";}});
  const [status,setStatus]=useState("");
  const timer=useRef<number|undefined>(undefined);
  useEffect(()=>()=>clearTimeout(timer.current),[]);
  const update=(value:string)=>{setBrief(value);setStatus("");try{localStorage.setItem("portfolio-project-brief",value);}catch{}};
  const copy=async()=>{clearTimeout(timer.current);try{await navigator.clipboard.writeText(brief);setStatus("Copied. Your brief is ready to share.");}catch{setStatus("Select the text and copy it with your keyboard.");}timer.current=window.setTimeout(()=>setStatus(""),4000);};
  return <Dialog><DialogTrigger asChild><Button className="contact-button">Start with an idea <ArrowUpRight size={17}/></Button></DialogTrigger><DialogContent className="brief-dialog"><DialogHeader><DialogTitle>Tell me what you have in mind.</DialogTitle><DialogDescription>A useful brief starts with the problem, the people, and the result you want.</DialogDescription></DialogHeader><div className="brief-prompts"><span>Who is it for?</span><span>What should it help them do?</span><span>What matters most?</span></div><label htmlFor="project-brief">Your project idea</label><textarea id="project-brief" value={brief} maxLength={5000} onChange={e=>update(e.target.value)} placeholder="I’m thinking about a website or tool that…"/><p className="local-note">This is a private draft in this browser. It does not send a message.</p><div className="brief-actions"><Button onClick={copy} disabled={!brief.trim()}><Copy size={15}/> Copy your brief</Button><span role="status">{status}</span></div></DialogContent></Dialog>;
}

