import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type InteractiveCard = { id: string; content: ReactNode };

// Keeps interactive project previews separate from the image-only FocusCards API.
export function InteractiveFocusCards({ cards, className }: { cards: InteractiveCard[]; className?: string }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [focused, setFocused] = useState<string | null>(null);
  const active = focused ?? hovered;
  return <div className={cn("focus-cards", className)} onPointerLeave={() => setHovered(null)}>
    {cards.map(card => <div key={card.id} className="focus-card"
      data-muted={active !== null && active !== card.id}
      data-focused={active === card.id}
      onPointerEnter={event => { if (event.pointerType === "mouse") { setHovered(card.id); setFocused(null); } }}
      onFocusCapture={event => setFocused(event.target.matches(":focus-visible") ? card.id : null)}
      onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(null); }}>
      {card.content}
    </div>)}
  </div>;
}
