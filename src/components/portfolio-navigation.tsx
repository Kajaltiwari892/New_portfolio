import { useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { routeHref, type PortfolioRoute } from "@/lib/portfolio-router";

type NavigationItem = { id: Exclude<PortfolioRoute, "not-found">; label: string };
type Highlight = { x: number; y: number; width: number; height: number };

export function PortfolioNavigation({ items, route }: { items: NavigationItem[]; route: PortfolioRoute }) {
  const navRef = useRef<HTMLElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [focused, setFocused] = useState<string | null>(null);
  const [highlight, setHighlight] = useState<Highlight | null>(null);
  const reduceMotion = useReducedMotion();
  const highlighted = hovered ?? focused ?? (route === "home" ? null : route);
  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const measure = () => {
      const link = highlighted ? nav.querySelector<HTMLAnchorElement>(`[data-nav-id="${highlighted}"]`) : null;
      setHighlight(link ? { x: link.offsetLeft, y: link.offsetTop, width: link.offsetWidth, height: link.offsetHeight } : null);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(nav);
    nav.querySelectorAll("a").forEach(link => observer.observe(link));
    return () => observer.disconnect();
  }, [highlighted, route]);

  return <nav ref={navRef} className="portfolio-navigation" aria-label="Main navigation" onPointerLeave={() => setHovered(null)} onBlur={event => {
    if (!event.currentTarget.contains(event.relatedTarget)) setFocused(null);
  }}>
    {/* Keep one highlight below all labels while it moves between links. */}
    <motion.span className="nav-glide" aria-hidden="true" initial={false}
      animate={highlight ? { ...highlight, opacity: 1 } : { opacity: 0 }}
      transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 32, mass: 0.65, opacity: { duration: 0.12 } }} />
    {items.map(item => <a href={routeHref(item.id)} key={item.id} data-nav-id={item.id} onPointerEnter={() => setHovered(item.id)} onFocus={() => setFocused(item.id)} aria-current={route === item.id ? "location" : undefined}>
      <span className="nav-label">{item.label}</span>
    </a>)}
  </nav>;
}
