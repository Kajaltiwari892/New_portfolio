import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Asterisk, Pause, Play } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { routeHref } from "@/lib/portfolio-router";

const technologies = [
  { name: "React", icon: "react" },
  { name: "Next.js", icon: "nextjs" },
  { name: "TypeScript", icon: "typescript" },
  { name: "Python", icon: "python" },
  { name: "FastAPI", icon: "fastapi" },
  { name: "Tailwind CSS", icon: "tailwindcss" },
  { name: "MongoDB", icon: "mongodb" },
];

export function PortraitHero() {
  const reduceMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const [portraitReady, setPortraitReady] = useState(false);
  const portraitRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    if (portraitRef.current?.complete) setPortraitReady(true);
  }, []);
  const enter = (delay = 0) => ({
    initial: { opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduceMotion ? 0 : 0.7, delay: reduceMotion ? 0 : delay, ease: "easeOut" as const },
  });

  return <div className="portrait-hero">
    <div className="portrait-stage">
      <motion.h1 className="portrait-name" tabIndex={-1} data-page-heading {...enter()}>
        Kajal Tiwari
      </motion.h1>
      <motion.p className="portrait-role" {...enter(0.12)}>
        <span>FULL-STACK</span><span>DEVELOPER</span>
      </motion.p>
      <div className="portrait-image-wrap">
        <motion.div className="portrait-reveal"
          initial={{ opacity: reduceMotion ? 1 : 0 }}
          animate={{ opacity: portraitReady || reduceMotion ? 1 : 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.8, ease: "easeOut" }}>
          <img ref={portraitRef} className="portrait-image" src="/assets/kajal-portrait.png" alt="Kajal Tiwari in a white blazer" width="1122" height="1402" fetchPriority="high" onLoad={() => setPortraitReady(true)} />
        </motion.div>
      </div>
      <motion.div className="portrait-intro" {...enter(0.35)}>
        <span className="portrait-kicker"><span /> DEVELOPER. MAKER. EXPLORER.</span>
        <h2>Built with curiosity.<br /><span>Made to matter.</span></h2>
        <p>I’m Kajal, a full-stack developer turning ideas into web apps and useful AI tools—with a love for the details that make them feel right.</p>
        <a className="portrait-work-link" href={routeHref("work")}>Explore my work <ArrowUpRight size={18} aria-hidden="true" /></a>
      </motion.div>
      <motion.div className="portrait-aside" {...enter(0.45)}>
        <Asterisk size={34} strokeWidth={1.25} aria-hidden="true" />
        <p>A mind for code.<br />An eye for art.<br /><em>Always asking what’s next.</em></p>
        <a href={routeHref("about")}>A little about me <ArrowUpRight size={15} aria-hidden="true" /></a>
      </motion.div>
    </div>
    <div className="portrait-bottom" aria-label="My technology stack">
      <div className="tech-marquee" data-paused={paused || reduceMotion}>
        <div className="tech-track">
          {[0, 1].map(copy => <ul className="tech-group" key={copy} aria-label={copy === 0 ? "Technologies I work with" : undefined} aria-hidden={copy === 1 ? true : undefined}>
            {technologies.map(tool => <li key={tool.icon}><img src={`/assets/tech/${tool.icon}.svg`} width="28" height="28" alt="" /><span>{tool.name}</span></li>)}
          </ul>)}
        </div>
      </div>
      {!reduceMotion && <button className="tech-pause" type="button" onClick={() => setPaused(value => !value)} aria-label={paused ? "Resume technology animation" : "Pause technology animation"} aria-pressed={paused}>
        {paused ? <Play size={13} aria-hidden="true" /> : <Pause size={13} aria-hidden="true" />}
      </button>}
    </div>
  </div>;
}
