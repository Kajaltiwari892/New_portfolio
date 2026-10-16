import { useCallback, useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from "react";
import { MotionConfig, useReducedMotion } from "motion/react";
import { ArrowRight, ArrowUpRight, Check, Code2, Copy, Layers3, Lightbulb, Mail, PenTool, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Timeline } from "@/components/aceternity/timeline";
import { PortraitHero } from "@/components/portrait-hero";
import { PortfolioNavigation } from "@/components/portfolio-navigation";
import { BeyondBoard } from "@/components/beyond-board";
import { BriefDialog, Mark } from "@/components/portfolio-pieces";
import { PortfolioFooter } from "@/components/portfolio-footer";
import { ProjectShowcase } from "@/components/project-showcase";
import { parsePortfolioHash, routeHref, type PortfolioRoute } from "@/lib/portfolio-router";
import { profile, process } from "@/portfolio-content";

const destinations = [
  { id: "work" as const, label: "Work", number: "01", title: "What I’ve done.", description: "Full-stack apps, AI experiments, and a little play with motion.", link: "Explore the work", icon: Layers3 },
  { id: "about" as const, label: "About", number: "02", title: "A little about me.", description: "The ideas, tools, and approach behind what I make.", link: "Get to know me", icon: PenTool },
  { id: "beyond" as const, label: "Beyond work", number: "03", title: "The curious corner.", description: "Colors, experiments, and a few thoughts worth keeping.", link: "Take a little detour", icon: Sparkles },
  { id: "contact" as const, label: "Contact", number: "04", title: "Start something good.", description: "Have an idea? A good conversation starts with a small thought.", link: "Let’s talk", icon: ArrowUpRight },
];
const skills = [
  { title: "Make it clear.", summary: "Websites that help people find their way.", description: "I start with the useful bit: what should someone understand or do? Then I give the content an order, make the important action easy to spot, and let the details support it.", tools: ["Visual hierarchy", "Responsive layouts", "Clear writing"], icon: PenTool },
  { title: "Make it work.", summary: "Turn a promising idea into something you can use.", description: "I like moving into the browser early. A working button or a tiny prototype tells you things a static screen can’t. The studies here explore real states, feedback, and everyday interactions.", tools: ["React", "TypeScript", "Tailwind CSS"], icon: Code2 },
  { title: "Make it feel right.", summary: "Small details that make the whole thing feel easier.", description: "A helpful empty state. A clear keyboard path. A transition that explains what changed. Those little moments get the same attention as the first screen.", tools: ["Accessible controls", "Motion", "Careful testing"], icon: Sparkles },
];

function PageIntro({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <div className="page-intro"><p className="eyebrow"><span />{eyebrow}</p><h3 className="unfold-intro-title">{title}</h3><p className="page-description">{description}</p></div>;
}

function HomePage({ opened, onToggle }: { opened: string[]; onToggle: (id: typeof destinations[number]["id"]) => void }) {
  return <section className="home-page" aria-label="Home">
    <PortraitHero />
    <div className="home-directory" id="explore" tabIndex={-1} aria-label="Explore the portfolio">
    <div className="home-directory-heading"><span>INSIDE MY WORLD</span><span>A few chapters. Unfold one. <ArrowRight size={13} /></span></div>
    <div className="unfold-sections">{destinations.map(item => {
      const isOpen = opened.includes(item.id);
      return <section key={item.id} id={item.id} className={"unfold-section unfold-" + item.id} data-open={isOpen} aria-labelledby={item.id + "-trigger"}>
        <h2 className="unfold-heading"><button id={item.id + "-trigger"} className="unfold-trigger" onClick={() => onToggle(item.id)} aria-expanded={isOpen} aria-controls={item.id + "-panel"}>
          <span className="unfold-number">{item.number}</span><span className="unfold-icon"><item.icon size={25} aria-hidden="true" /></span><span className="unfold-label"><span className="unfold-category">{item.label}</span><span className="unfold-title">{item.title}</span><span className="unfold-description">{item.description}</span></span><span className="unfold-action"><span>{isOpen ? "Fold away" : "Unfold"}</span><Plus size={22} aria-hidden="true" /></span>
        </button></h2>
        <div id={item.id + "-panel"} className="unfold-content" aria-hidden={!isOpen} inert={!isOpen}>
          <div className="unfold-content-clip"><div className="unfold-content-inner">
            {item.id === "work" ? <WorkPage /> : item.id === "about" ? <AboutPage /> : item.id === "beyond" ? <BeyondSection /> : <ContactPage />}
            <button className="unfold-close" onClick={() => { onToggle(item.id); const trigger = document.getElementById(item.id + "-trigger"); trigger?.focus({ preventScroll: true }); trigger?.scrollIntoView({ block: "start", behavior: "instant" }); }}>Fold this section away <Plus size={15} aria-hidden="true" /></button>
          </div></div>
        </div>
      </section>;
    })}</div>
    </div>
  </section>;
}

function WorkPage() {
  return <div className="content-page work-page"><p className="unfold-work-lead">Things I’ve built to make learning easier, job hunting clearer, and the web a little more fun. There’s a little something to try in each one.</p>
    <ProjectShowcase />
    <a href={routeHref("about")} className="page-next-link">Curious about the process? <ArrowRight size={17} /></a>
  </div>;
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

function BeyondSection() {
  return <div className="content-page beyond-page"><PageIntro eyebrow="BEYOND THE TO-DO LIST Day 1 Day 2" title="A little room for curiosity." description="A small collection of colors, ideas, and things worth thinking about. Pick something up. See where it takes you." /><BeyondBoard /></div>;
}

export default function App() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState<PortfolioRoute>("home");
  const [opened, setOpened] = useState<string[]>(["work"]);
  const [scrollTarget, setScrollTarget] = useState<{ id: string } | null>(null);
  const navigate = useCallback((target: PortfolioRoute, updateHistory = true) => {
    const id = target === "not-found" ? "home" : target;
    setActive(id);
    if (id !== "home") setOpened(current => current.includes(id) ? current : [...current, id]);
    if (updateHistory && window.location.hash !== routeHref(id)) window.history.pushState(null, "", routeHref(id));
    setScrollTarget({ id });
  }, []);
  const toggle = (id: typeof destinations[number]["id"]) => {
    setOpened(current => current.includes(id) ? current.filter(value => value !== id) : [...current, id]);
    setActive(opened.includes(id) ? "home" : id);
  };
  const followSectionLink = (event: MouseEvent<HTMLDivElement>) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
    const hash = link?.getAttribute("href");
    if (!hash || hash === "#main" || link?.target === "_blank") return;
    const target = parsePortfolioHash(hash);
    if (target === "not-found") return;
    event.preventDefault();
    navigate(target);
  };
  useEffect(() => {
    const followHash = () => navigate(parsePortfolioHash(window.location.hash), false);
    followHash();
    window.addEventListener("hashchange", followHash);
    window.addEventListener("popstate", followHash);
    return () => { window.removeEventListener("hashchange", followHash); window.removeEventListener("popstate", followHash); };
  }, [navigate]);
  useLayoutEffect(() => {
    if (!scrollTarget) return;
    const frame = requestAnimationFrame(() => {
      const target = document.getElementById(scrollTarget.id);
      target?.scrollIntoView({ block: "start", behavior: reduceMotion ? "instant" : "smooth" });
      if (scrollTarget.id !== "home") document.getElementById(scrollTarget.id + "-trigger")?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [scrollTarget, reduceMotion]);
  useEffect(() => {
    document.documentElement.classList.remove("dark");
    document.documentElement.dataset.theme = "light";
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", "#afa9a3");
    try { localStorage.setItem("portfolio-theme", "light"); } catch {}
  }, []);
  useLayoutEffect(() => {
    document.documentElement.dataset.portfolioReady = "true";
    document.title = `${profile.name || "Folio"} — Full-stack developer`;
  }, []);
  return <MotionConfig reducedMotion="user"><TooltipProvider><a className="skip-link" href="#main" onClick={event => { event.preventDefault(); const main = document.getElementById("main"); main?.focus({ preventScroll: true }); main?.scrollIntoView({ behavior: "instant" }); }}>Skip to content</a><div id="home" className="site-shell" data-page="home" onClick={followSectionLink}>
    <header className="site-header"><a href={routeHref("home")} className="brand" aria-label="Portfolio home"><Mark /><span>{profile.name || "folio"}<i>.</i></span></a><PortfolioNavigation items={destinations} route={active} /><div className="header-actions"><a className="header-contact" href={routeHref("contact")}>Let’s talk <ArrowUpRight size={16} aria-hidden="true" /></a></div></header>
    <main id="main" tabIndex={-1}><div className="route-page"><HomePage opened={opened} onToggle={toggle} /></div></main>
    <PortfolioFooter />
  </div></TooltipProvider></MotionConfig>;
}
