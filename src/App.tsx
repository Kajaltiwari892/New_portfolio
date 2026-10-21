import { useCallback, useEffect, useLayoutEffect, useState, type MouseEvent } from "react";
import { MotionConfig, useReducedMotion } from "motion/react";
import { ArrowUpRight, Layers3, PenTool, Sparkles } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ProfessionalAbout } from "@/components/professional-about";
import { PortraitHero } from "@/components/portrait-hero";
import { PortfolioNavigation } from "@/components/portfolio-navigation";
import { BeyondBoard } from "@/components/beyond-board";
import { Mark } from "@/components/portfolio-pieces";
import { PortfolioFooter } from "@/components/portfolio-footer";
import { ProjectShowcase } from "@/components/project-showcase";
import { parsePortfolioHash, routeHref, type PortfolioRoute } from "@/lib/portfolio-router";
import { profile } from "@/portfolio-content";

const destinations = [
  { id: "about" as const, label: "About", number: "01", title: "A little more about me.", description: "", link: "Get to know me", icon: PenTool },
  { id: "work" as const, label: "Work", number: "02", title: "What I’ve done.", description: "Full-stack apps, AI experiments, and a little play with motion.", link: "Explore the work", icon: Layers3 },
  { id: "beyond" as const, label: "Beyond work", number: "03", title: "The curious corner.", description: "Colors, experiments, and a few thoughts worth keeping.", link: "Take a little detour", icon: Sparkles },
  { id: "contact" as const, label: "Contact", number: "04", title: "Start something good.", description: "Have an idea? A good conversation starts with a small thought.", link: "Let’s talk", icon: ArrowUpRight },
];
function HomePage() {
  return <div className="home-page continuous-portfolio">
    <PortraitHero />
    {destinations.map(item => <section key={item.id} id={item.id} className={"portfolio-section section-" + item.id} aria-labelledby={item.id + "-heading"}>
        <div className="portfolio-section-inner">
          {item.id !== "work" && <header className="portfolio-section-heading">
            <div><p className="section-index"><span>{item.number}</span> / {item.label}</p><h2 id={item.id + "-heading"} tabIndex={-1}>{item.title}</h2></div>
            {item.description && <p className="section-introduction">{item.description}</p>}
          </header>}
            {item.id === "work" ? <WorkPage /> : item.id === "about" ? <AboutPage /> : item.id === "beyond" ? <BeyondSection /> : <ContactPage />}
        </div>
      </section>)}
  </div>;
}

function WorkPage() {
  return <div className="content-page work-page"><ProjectShowcase /></div>;
}

function AboutPage() { return <ProfessionalAbout />; }

function ContactPage() {
  return <div className="content-page contact-editorial"><div className="contact-editorial-intro"><span className="about-overline">A PROJECT, A ROLE, OR A GOOD CONVERSATION</span><h3>Let?s build<br />something <em>worth using.</em></h3><p>I?d love to connect about full-stack development, practical AI, and ideas that make someone?s day a little easier.</p></div><div className="contact-destinations">{profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noreferrer"><span><small>START A CONVERSATION</small><strong>Find me on LinkedIn</strong></span><ArrowUpRight size={26} /></a>}{profile.github && <a href={profile.github} target="_blank" rel="noreferrer"><span><small>EXPLORE THE BUILDING SIDE</small><strong>Follow along on GitHub</strong></span><ArrowUpRight size={26} /></a>}<p>A little context goes a long way: what you?re working on, who it?s for, and where I could help.</p></div></div>;
}

function BeyondSection() {
  return <div className="content-page beyond-page"><p className="section-work-lead">A small collection of colors, ideas, and things worth thinking about. Pick something up. See where it takes you.</p><BeyondBoard /></div>;
}

export default function App() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState<PortfolioRoute>("home");
  const [scrollTarget, setScrollTarget] = useState<{ id: string } | null>(null);
  const navigate = useCallback((target: PortfolioRoute, updateHistory = true) => {
    const id = target === "not-found" ? "home" : target;
    setActive(id);
    if (updateHistory && window.location.hash !== routeHref(id)) window.history.pushState(null, "", routeHref(id));
    setScrollTarget({ id });
  }, []);
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
      if (scrollTarget.id !== "home") document.getElementById(scrollTarget.id + "-heading")?.focus({ preventScroll: true });
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
    <main id="main" tabIndex={-1}><div className="route-page"><HomePage /></div></main>
    <PortfolioFooter />
  </div></TooltipProvider></MotionConfig>;
}
