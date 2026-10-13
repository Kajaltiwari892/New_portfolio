import { ArrowDown, ArrowUpRight, Asterisk } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { routeHref } from "@/lib/portfolio-router";

const tools = ["React", "Next.js", "TypeScript", "Python", "FastAPI"];

export function PortraitHero() {
  const reduceMotion = useReducedMotion();
  const enter = (delay = 0) => ({
    initial: { opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduceMotion ? 0 : 0.8, delay: reduceMotion ? 0 : delay, ease: "easeOut" as const },
  });

  return <div className="portrait-hero">
    <div className="portrait-stage">
      <motion.h1 className="portrait-name" tabIndex={-1} data-page-heading {...enter()}>
        KAJAL TIWARI
      </motion.h1>
      <motion.p className="portrait-role" {...enter(0.12)}>
        <span>FULL-STACK</span><span>DEVELOPER</span>
      </motion.p>

      <motion.div className="portrait-image-wrap" {...enter(0.18)}>
        <img className="portrait-image" src="/assets/kajal-portrait.png" alt="Kajal Tiwari in a white blazer" width="1122" height="1402" fetchPriority="high" />
      </motion.div>

      <motion.div className="portrait-intro" {...enter(0.3)}>
        <span className="portrait-kicker"><span /> A MIND THAT KEEPS EXPLORING</span>
        <p>Hey, I’m Kajal. I turn curious ideas into thoughtful web experiences — from the first pixel to the last API.</p>
        <a className="portrait-work-link" href={routeHref("work")}>Explore my work <ArrowUpRight size={18} aria-hidden="true" /></a>
      </motion.div>

      <motion.div className="portrait-aside" {...enter(0.4)}>
        <Asterisk size={37} strokeWidth={1.25} aria-hidden="true" />
        <p>A developer’s mind.<br />An artist’s eye.<br /><em>Endlessly curious.</em></p>
        <a href={routeHref("about")}>A little about me <ArrowUpRight size={15} aria-hidden="true" /></a>
      </motion.div>
      <span className="portrait-edition" aria-hidden="true">A PERSONAL SPACE / 01</span>
    </div>

    <div className="portrait-bottom">
      <p>IDEAS, BUILT WITH</p>
      <ul aria-label="Technologies I work with">{tools.map(tool => <li key={tool}>{tool}</li>)}</ul>
      <a className="portrait-scroll" href="#explore" onClick={event => {
        event.preventDefault();
        const destination = document.getElementById("explore");
        destination?.focus({ preventScroll: true });
        destination?.scrollIntoView({ behavior: reduceMotion ? "instant" : "smooth", block: "start" });
      }}>More to explore <ArrowDown size={15} aria-hidden="true" /></a>
    </div>
  </div>;
}
