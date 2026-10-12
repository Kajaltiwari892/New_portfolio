import { useEffect, useLayoutEffect, useRef, useState, type FormEvent } from "react";
import { ArrowRight, Check, Copy, Pause, Play, Plus, RotateCcw, Shuffle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Task = { id: string; text: string; status: number };
const initialTasks: Task[] = [
  { id: "idea", text: "Sketch the first idea", status: 0 },
  { id: "layout", text: "Build a clear layout", status: 1 },
  { id: "details", text: "Make the details count", status: 2 },
];
function readStorage<T>(key: string, fallback: T): T {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; } catch { return fallback; }
}
function writeStorage(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* The demo still works without persistence. */ }
}

export function TaskboardDemo() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const stored = readStorage<unknown>("portfolio-taskboard-v1", initialTasks);
    return Array.isArray(stored) ? stored.filter((task): task is Task => task && typeof task.id === "string" && typeof task.text === "string" && [0,1,2].includes(task.status)).slice(0,40) : initialTasks;
  });
  const [text, setText] = useState("");
  const [notice, setNotice] = useState("");
  const input = useRef<HTMLInputElement | null>(null);
  const taskActions = useRef(new Map<string, HTMLButtonElement>());
  const pendingFocus = useRef<string | null>(null);
  const registerAction = (key: string, button: HTMLButtonElement | null) => {
    if (button) taskActions.current.set(key, button);
    else taskActions.current.delete(key);
  };
  useLayoutEffect(() => {
    if (pendingFocus.current === null) return;
    const target = taskActions.current.get(pendingFocus.current) ?? input.current;
    pendingFocus.current = null;
    target?.focus();
  }, [tasks]);
  useEffect(() => writeStorage("portfolio-taskboard-v1", tasks), [tasks]);
  const addTask = (event: FormEvent) => {
    event.preventDefault();
    if (!text.trim()) return;
    if (tasks.length >= 40) { setNotice("This demo has room for 40 tasks. Remove one to add another."); return; }
    pendingFocus.current = "input";
    setTasks(current => [...current, { id: crypto.randomUUID(), text: text.trim(), status: 0 }]);
    setText(""); setNotice("Task added to To do.");
  };
  const move = (id: string) => {
    pendingFocus.current = id + ":move";
    setTasks(current => current.map(task => task.id === id ? { ...task, status: (task.status + 1) % 3 } : task));
  };
  const remove = (task: Task) => {
    const column = tasks.filter(item => item.status === task.status);
    const index = column.findIndex(item => item.id === task.id);
    const neighbor = column[index + 1] ?? column[index - 1];
    pendingFocus.current = neighbor ? neighbor.id + ":delete" : "input";
    setTasks(current => current.filter(item => item.id !== task.id));
    setNotice("Task removed.");
  };
  return <div className="task-demo">
    <div className="demo-intro"><div><span className="demo-kicker">YOUR SMALL, CLEAR WORKSPACE</span><h3>One thing at a time.</h3></div><Button variant="outline" size="sm" onClick={() => { setTasks(initialTasks); setNotice("Demo board reset."); }}><RotateCcw size={14}/> Reset board</Button></div>
    <form onSubmit={addTask} className="task-form"><label className="sr-only" htmlFor="new-task">New task</label><input ref={input} id="new-task" placeholder="What needs doing?" value={text} maxLength={100} onChange={event => setText(event.target.value)}/><Button type="submit" disabled={!text.trim()}><Plus size={16}/> Add task</Button></form>
    <div className="task-columns">{["To do", "In progress", "Done"].map((label, index) => <div className={"task-column column-" + index} key={label}><h4><span/>{label}<small>{tasks.filter(task => task.status === index).length}</small></h4><div className="task-list">{tasks.filter(task => task.status === index).map(task => <article key={task.id} className="task-item"><p>{task.text}</p><div><button ref={button => registerAction(task.id + ":delete", button)} aria-label={"Delete " + task.text} onClick={() => remove(task)}><Trash2 size={13}/></button><button ref={button => registerAction(task.id + ":move", button)} className="advance-task" onClick={() => { move(task.id); setNotice("Task moved to " + ["In progress","Done","To do"][index] + "."); }} aria-label={"Move " + task.text + " to " + ["In progress","Done","To do"][index]}>{index === 2 ? <RotateCcw size={13}/> : <ArrowRight size={13}/>}</button></div></article>)}{!tasks.some(task => task.status === index) && <p className="empty-column">A little breathing room.</p>}</div></div>)}</div>
    <div className="demo-bottom"><span>Tasks stay in this browser.</span><span role="status" aria-live="polite">{notice}</span></div>
  </div>;
}

type TimerState = { duration: number; remaining: number; endAt: number | null };
function storedTimer(): TimerState {
  const fallback = { duration: 25, remaining: 1500, endAt: null };
  const saved = readStorage<TimerState>("portfolio-focus-v1", fallback);
  return saved && [5,15,25,50].includes(saved.duration) && Number.isFinite(saved.remaining) && saved.remaining >= 0 && (saved.endAt === null || Number.isFinite(saved.endAt)) ? saved : fallback;
}
export function FocusDemo() {
  const [timer, setTimer] = useState<TimerState>(storedTimer);
  const [now, setNow] = useState(Date.now);
  const running = timer.endAt !== null;
  const remaining = timer.endAt ? Math.max(0, Math.ceil((timer.endAt - now) / 1000)) : timer.remaining;
  const finished = remaining === 0;
  useEffect(() => writeStorage("portfolio-focus-v1", timer), [timer]);
  useEffect(() => {
    if (!timer.endAt) return;
    const tick = () => {
      const nextNow = Date.now(); setNow(nextNow);
      if (nextNow >= timer.endAt!) setTimer(current => ({ ...current, remaining:0, endAt:null }));
    };
    tick();
    const interval = window.setInterval(tick, 250);
    return () => clearInterval(interval);
  }, [timer.endAt]);
  const choose = (duration: number) => { setNow(Date.now()); setTimer({duration,remaining:duration*60,endAt:null}); };
  const toggle = () => {
    const timestamp = Date.now(); setNow(timestamp);
    setTimer(current => current.endAt
      ? {...current, remaining:Math.max(0, Math.ceil((current.endAt-timestamp)/1000)),endAt:null}
      : {...current,remaining:current.remaining || current.duration*60,endAt:timestamp+(current.remaining || current.duration*60)*1000});
  };
  const angle = (1 - remaining / (timer.duration * 60)) * 360;
  return <div className="focus-demo">
    <span className="demo-kicker">LESS NOISE. MORE FOCUS.</span><h3>Make space for one thing.</h3>
    <div className="duration-picker" role="group" aria-label="Session duration">{[5,15,25,50].map(duration => <button aria-pressed={duration === timer.duration} key={duration} onClick={() => choose(duration)}>{duration} min</button>)}</div>
    <div className="timer-ring" style={{background:`conic-gradient(#62765b ${angle}deg,#dce2d6 0deg)`}}><div><span className="timer-label">{finished ? "NICE WORK" : running ? "IN THE FLOW" : "YOUR FOCUS SESSION"}</span><strong role="timer" aria-label={Math.floor(remaining/60)+" minutes "+remaining%60+" seconds"}>{String(Math.floor(remaining / 60)).padStart(2,"0")}<span>:</span>{String(remaining%60).padStart(2,"0")}</strong><p>{finished ? "Take a breath. You earned it." : "Just you and the next step."}</p></div></div>
    <div className="timer-actions"><Button onClick={toggle}>{running ? <Pause size={16}/> : <Play size={16}/>} {running ? "Pause" : finished ? "Start again" : "Start focus"}</Button><Button aria-label="Reset timer" variant="outline" size="icon" onClick={() => choose(timer.duration)}><RotateCcw size={16}/></Button></div>
    <p className="demo-hint" role="status">{running ? "Your session continues when you close this preview." : finished ? "Session complete." : "Choose a length, settle in, and begin."}</p>
  </div>;
}

const paletteSets = [
  ["#E9E5DA","#B7C4B1","#62765B","#D89278","#343B36"],
  ["#F3EAF5","#C9B9DC","#8C75AA","#E8BBBC","#45415C"],
  ["#F4EDDB","#E7BE63","#C57254","#6685A0","#303C4B"],
  ["#E5EFEF","#AFD0CA","#568D8B","#D6A99A","#364849"],
  ["#F7F0E8","#E9C5B5","#C67778","#8C91AF","#393C50"],
];
export function PaletteDemo() {
  const [palette, setPalette] = useState(0);
  const [copied, setCopied] = useState("");
  const timeout = useRef<number | undefined>(undefined);
  useEffect(() => () => clearTimeout(timeout.current), []);
  const copy = async (color: string) => {
    clearTimeout(timeout.current);
    try { await navigator.clipboard.writeText(color); setCopied(color); }
    catch { setCopied("Copy is unavailable. Select the printed hex value."); }
    timeout.current = window.setTimeout(() => setCopied(""),2500);
  };
  return <div className="palette-demo"><div className="demo-intro"><div><span className="demo-kicker">FIND A DIFFERENT MOOD</span><h3>A small color playground.</h3></div><Button variant="outline" size="sm" onClick={() => { setPalette(current => (current + 1) % paletteSets.length); setCopied(""); }}><Shuffle size={15}/> New palette</Button></div><div className="palette-swatches">{paletteSets[palette].map(color => <button key={color} onClick={() => copy(color)} aria-label={"Copy " + color} style={{background:color}}><span>{copied === color ? <Check size={16}/> : <Copy size={15}/>}</span><code>{color}</code></button>)}</div><div className="palette-preview" style={{background:paletteSets[palette][0],color:paletteSets[palette][4]}}><span>THE PALETTE, IN CONTEXT</span><h4>A change of color.<br/>A different feeling.</h4><span className="palette-sample-button" style={{background:paletteSets[palette][2],color:"#fff"}}>A fresh perspective <ArrowRight size={14}/></span><div className="palette-preview-shape" style={{background:paletteSets[palette][3]}}/></div><div className="demo-bottom"><span>Click a swatch to copy its hex code.</span><span role="status" aria-live="polite">{copied.startsWith("#") ? copied+" copied" : copied}</span></div></div>;
}

