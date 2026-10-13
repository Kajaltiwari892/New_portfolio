import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type FocusCard = { id: string; content: ReactNode; className?: string };

// Aceternity's focus-card pattern, with persistent labels and keyboard support.
export function FocusCards({ cards, className }: { cards: FocusCard[]; className?: string }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [focused, setFocused] = useState<string | null>(null);
  const active = focused ?? hovered;
  return <div className={cn("focus-cards", className)} onPointerLeave={() => setHovered(null)}>
    {cards.map(card => <div key={card.id}
      className={cn("focus-card", card.className)}
      data-muted={active !== null && active !== card.id}
      data-focused={active === card.id}
      onPointerEnter={event => { if (event.pointerType === "mouse") { setHovered(card.id); setFocused(null); } }}
      onFocusCapture={event => setFocused(event.target.matches(":focus-visible") ? card.id : null)}
      onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(null); }}>
      {card.content}
    </div>)}
  </div>;
}
