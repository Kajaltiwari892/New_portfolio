import { useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import { routeHref, type PortfolioRoute } from "@/lib/portfolio-router";

type NavigationItem = { id: Exclude<PortfolioRoute, "not-found">; label: string };

export function PortfolioNavigation({ items, route }: { items: NavigationItem[]; route: PortfolioRoute }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [focused, setFocused] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();
  const highlighted = hovered ?? focused ?? (route === "home" ? null : route);
  return <LayoutGroup id="portfolio-navigation">
    <nav className="portfolio-navigation" aria-label="Main navigation" onPointerLeave={() => setHovered(null)} onBlur={event => {
      if (!event.currentTarget.contains(event.relatedTarget)) setFocused(null);
    }}>
      {items.map(item => <a href={routeHref(item.id)} key={item.id} onPointerEnter={() => setHovered(item.id)} onFocus={() => setFocused(item.id)} aria-current={route === item.id ? "page" : undefined}>
        <AnimatePresence initial={false}>
          {highlighted === item.id && <motion.span className="nav-glide" layoutId="nav-glide" aria-hidden="true" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 340, damping: 28, mass: 0.65, opacity: { duration: 0.16 } }} />}
        </AnimatePresence>
        <span className="nav-label">{item.label}</span>
      </a>)}
    </nav>
  </LayoutGroup>;
}
