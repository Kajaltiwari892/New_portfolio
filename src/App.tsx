import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { MotionConfig, motion, useReducedMotion } from "motion/react";
import { ArrowRight, ArrowUpRight, Check, Code2, Copy, Layers3, Lightbulb, Mail, PenTool, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Timeline } from "@/components/aceternity/timeline";
import { PortraitHero } from "@/components/portrait-hero";
import { BeyondBoard } from "@/components/beyond-board";
import { BriefDialog, Mark, ProjectCard } from "@/components/portfolio-pieces";
import { usePortfolioRoute, routeHref, type PortfolioRoute } from "@/lib/portfolio-router";
import { profile, caseStudies, process } from "@/portfolio-content";

const destinations = [
  { id: "work" as const, label: "Work", number: "01", title: "Things I’ve made.", description: "Small tools, thoughtful details. Open a project and give it a go.", link: "Explore the work", icon: Layers3 },
  { id: "about" as const, label: "About", number: "02", title: "A little about me.", description: "The ideas, tools, and approach behind what I make.", link: "Get to know me", icon: PenTool },
  { id: "beyond" as const, label: "Beyond work", number: "03", title: "The curious corner.", description: "Colors, experiments, and a few thoughts worth keeping.", link: "Take a little detour", icon: Sparkles },
  { id: "contact" as const, label: "Contact", number: "04", title: "Start something good.", description: "Have an idea? A good conversation starts with a small thought.", link: "Let’s talk", icon: ArrowUpRight },
];
const navigation = [{ id: "home" as const, label: "Home" }, ...destinations];
const skills = [
  { title: "Make it clear.", summary: "Websites that help people find their way.", description: "I start with the useful bit: what should someone understand or do? Then I give the content an order, make the important action easy to spot, and let the details support it.", tools: ["Visual hierarchy", "Responsive layouts", "Clear writing"], icon: PenTool },
  { title: "Make it work.", summary: "Turn a promising idea into something you can use.", description: "I like moving into the browser early. A working button or a tiny prototype tells you things a static screen can’t. The studies here explore real states, feedback, and everyday interactions.", tools: ["React", "TypeScript", "Tailwind CSS"], icon: Code2 },
  { title: "Make it feel right.", summary: "Small details that make the whole thing feel easier.", description: "A helpful empty state. A clear keyboard path. A transition that explains what changed. Those little moments get the same attention as the first screen.", tools: ["Accessible controls", "Motion", "Careful testing"], icon: Sparkles },
];

function PageIntro({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <div className="page-intro"><p className="eyebrow"><span />{eyebrow}</p><h1 tabIndex={-1} data-page-heading>{title}</h1><p className="page-description">{description}</p></div>;
}

function HomePage() {
  return <section className="home-page" aria-label="Home">
    <PortraitHero />
    <div className="home-directory" id="explore" tabIndex={-1} aria-label="Explore the portfolio">
    <div className="home-directory-heading"><span>PICK A PLACE TO START</span><span>A few doors. Your own pace. <ArrowRight size={13} /></span></div>
    <div className="destination-grid">{destinations.map(item => <a key={item.id} className={"destination-card destination-" + item.id} href={routeHref(item.id)}><div className="destination-top"><span className="destination-icon"><item.icon size={23} /></span><span className="destination-number">{item.number} / {item.label}</span></div><h2>{item.title}</h2><p>{item.description}</p><span className="destination-link">{item.link}<ArrowUpRight size={18} /></span></a>)}</div>
    </div>
  </section>;
}

function WorkPage() {
  const [filter, setFilter] = useState("all");
  const visible = caseStudies.filter(study => filter === "all" || (filter === "design" ? study.id === "palette" : study.id !== "palette"));
  return <section className="content-page work-page" aria-label="Work"><PageIntro eyebrow="THINGS I’VE BEEN MAKING" title="Small ideas. Real things." description="A few things to click around in. Open a study to try it out, or peek at the decisions behind it." />
    <Tabs value={filter} onValueChange={setFilter} className="work-tabs"><div className="work-toolbar"><TabsList aria-label="Filter projects"><TabsTrigger value="all">All work <span>03</span></TabsTrigger><TabsTrigger value="tools">Useful tools</TabsTrigger><TabsTrigger value="design">Design play</TabsTrigger></TabsList><span className="work-caption">Made to be tried, not just looked at.</span></div>{["all", "tools", "design"].map(value => <TabsContent key={value} value={value}><div className="projects-grid">{visible.map(study => <ProjectCard study={study} key={study.id} index={caseStudies.indexOf(study)} />)}</div></TabsContent>)}</Tabs>
    <p className="work-footnote"><span />These are working interface studies created for this portfolio.</p>
    <a href={routeHref("about")} className="page-next-link">Curious about the process? <ArrowRight size={17} /></a>
  </section>;
}

function AboutPage() {
  const timelineData = process.map(step => ({ title: step.kicker.split(" / ")[1], content: <div className="process-entry"><span className="process-kicker">{step.kicker}</span><h3>{step.title}</h3><p>{step.description}</p><div className="deliverables">{step.deliverables.map(item => <span key={item}><Check size={13} />{item}</span>)}</div></div> }));
  return <section className="content-page about-page" aria-label="About"><PageIntro eyebrow="THE PERSON BEHIND THE PIXELS" title="Curious by default." description="I like making useful things feel a little more thoughtful. And thoughtful things feel a little more human." />
    <div className="about-layout"><div className="about-story"><h2>Somewhere between<br />“what if?” and “it works.”</h2><p>I’m drawn to the space where design becomes something you can actually use. A clear layout gets my attention. A clever little interaction keeps it.</p><p>I enjoy taking an idea apart, finding the useful bit, and building it back up with care. Sometimes that means a whole page. Sometimes it’s just making one button feel right.</p><p>Right now, this space is a place to experiment with interfaces, share the thinking behind them, and keep getting better at the details.</p></div><aside className="about-note"><Mark /><span>A NOTE TO SELF</span><h3>Keep it useful.<br />Leave a little<br /><em>personality.</em></h3><p>The best details help people feel at home.</p></aside></div>
    <div className="skills-heading"><h2>What I bring to the table.</h2><p>Tap a card for the slightly longer answer.</p></div>
    <Accordion type="single" collapsible className="skill-accordion">{skills.map((skill, index) => <AccordionItem value={"skill-" + index} key={skill.title} className="skill-item"><AccordionTrigger><span className="skill-symbol"><skill.icon size={23} /></span><span className="skill-name"><strong>{skill.title}</strong><span>{skill.summary}</span></span></AccordionTrigger><AccordionContent><p>{skill.description}</p><div className="skill-tags">{skill.tools.map(tool => <Badge variant="secondary" key={tool}>{tool}</Badge>)}</div></AccordionContent></AccordionItem>)}</Accordion>
    <Accordion type="single" collapsible className="about-process"><AccordionItem value="process"><AccordionTrigger><span><Lightbulb size={20} /> From first thought to final detail</span></AccordionTrigger><AccordionContent><div className="process-section"><p className="process-intro">Nothing fancy. Just a little structure, plenty of trying things, and a useful question at every step.</p><Timeline className="portfolio-timeline" data={timelineData} /></div></AccordionContent></AccordionItem></Accordion>
    <a href={routeHref("beyond")} className="page-next-link">Take a look at the curious corner <ArrowRight size={17} /></a>
  </section>;
}

function ContactPage() {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const timeout = useRef<number | undefined>(undefined);
  useEffect(() => () => clearTimeout(timeout.current), []);
  const copyEmail = async () => { if (!profile.email) return; try { await navigator.clipboard.writeText(profile.email); setCopied(true); setCopyError(false); clearTimeout(timeout.current); timeout.current = window.setTimeout(() => setCopied(false), 3000); } catch { setCopyError(true); } };
  return <section className="content-page contact-page" aria-label="Contact"><div className="contact-copy"><PageIntro eyebrow="SOMETHING ON YOUR MIND?" title="Good things start with a hello." description="A website idea, a small collaboration, or a problem you’d like to untangle. I’d love to hear the first thought." /><p>You don’t need a perfect brief. A few lines about who it’s for and what it should do are a good place to start.</p><div className="contact-links">{profile.email && <><a href={"mailto:" + profile.email}><Mail size={18} />{profile.email}<ArrowUpRight size={15} /></a><Button variant="outline" onClick={copyEmail}><Copy size={15} />{copied ? "Copied!" : "Copy email"}</Button><span role="status">{copied ? "Email copied." : copyError ? "Copy unavailable. Select the email address above." : ""}</span></>}{profile.github && <a href={profile.github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={16} /></a>}{profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={16} /></a>}</div><a href={routeHref("work")} className="back-link">See what I’m making <ArrowRight size={16} /></a></div>
      <aside className="contact-paper"><span className="paper-hello" aria-hidden="true">hello<span>✳</span></span><span className="eyebrow">EVERY IDEA STARTS SOMEWHERE</span><h2>What if we<br />made something<br /><em>good together?</em></h2><p>Start with the messy version.<br />The shape can come later.</p>{profile.email ? <Button asChild><a href={"mailto:" + profile.email}>Say hello <ArrowUpRight size={17} /></a></Button> : <BriefDialog />}{!profile.email && <p className="contact-smallprint">Jot down a brief and copy it to share.<br />Saved only in this browser. No message is sent.</p>}</aside>
    </section>;
}

function CurrentPage({ route }: { route: PortfolioRoute }) {
  if (route === "home") return <HomePage />;
  if (route === "work") return <WorkPage />;
  if (route === "about") return <AboutPage />;
  if (route === "beyond") return <section className="content-page beyond-page" aria-label="Beyond work"><PageIntro eyebrow="BEYOND THE TO-DO LIST" title="A little room for curiosity." description="A small collection of colors, ideas, and things worth thinking about. Pick something up. See where it takes you." /><BeyondBoard /></section>;
  if (route === "contact") return <ContactPage />;
  return <section className="content-page not-found"><PageIntro eyebrow="A SMALL WRONG TURN" title="Nothing tucked away here." description="That page doesn’t exist. There are a few good places to start, though." /><Button asChild><a href={routeHref("home")}>Back home <ArrowRight size={17} /></a></Button></section>;
}

export default function App() {
  const route = usePortfolioRoute();
  const reduceMotion = useReducedMotion();
  const firstPage = useRef(true);
  useEffect(() => {
    document.documentElement.classList.remove("dark");
    document.documentElement.dataset.theme = "light";
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", route === "home" ? "#afa9a3" : "#fcfbf8");
    try { localStorage.setItem("portfolio-theme", "light"); } catch {}
  }, [route]);
  useLayoutEffect(() => {
    const label = navigation.find(item => item.id === route)?.label || "Page not found";
    document.title = `${label} — ${profile.name || "Folio"}`;
    window.scrollTo({ top: 0, behavior: "instant" });
    if (!firstPage.current) document.querySelector<HTMLElement>("[data-page-heading]")?.focus({ preventScroll: true });
    firstPage.current = false;
  }, [route]);
  return <MotionConfig reducedMotion="user"><TooltipProvider><a className="skip-link" href="#main" onClick={event => { event.preventDefault(); const main = document.getElementById("main"); main?.focus({ preventScroll: true }); main?.scrollIntoView({ behavior: "instant" }); }}>Skip to content</a><div className="site-shell" data-page={route}>
    <header className="site-header"><a href={routeHref("home")} className="brand" aria-label="Portfolio home"><Mark /><span>{profile.name || "folio"}<i>.</i></span></a><nav aria-label="Main navigation">{navigation.filter(item => route !== "home" || item.id !== "home").map(item => <a href={routeHref(item.id)} key={item.id} className={route === item.id ? "active" : ""} aria-current={route === item.id ? "page" : undefined}>{item.label}</a>)}</nav><div className="header-actions"><a className="header-contact" href={routeHref("contact")}>Let’s talk <ArrowUpRight size={16} aria-hidden="true" /></a></div></header>
    <main id="main" tabIndex={-1}><motion.div key={route} className="route-page" initial={{ opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 9 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.24, ease: "easeOut" }}><CurrentPage route={route} /></motion.div></main>
    <footer className="route-footer"><a href={routeHref("home")} className="brand"><Mark /><span>{profile.name || "folio"}<i>.</i></span></a><p>A little curiosity goes a long way.</p><div className="footer-page-links"><a href={routeHref("work")}>Work</a><a href={routeHref("about")}>About</a><a href={routeHref("contact")}>Contact <ArrowUpRight size={13} /></a></div><span>© {new Date().getFullYear()}</span></footer>
  </div></TooltipProvider></MotionConfig>;
}
