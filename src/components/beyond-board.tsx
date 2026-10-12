import { useRef, useState, type MouseEvent } from 'react';
import { ArrowUpRight, Heart, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { notes } from '@/portfolio-content';
import '../beyond-board.css';

type BoardItem = {
  id: string;
  title: string;
  category: string;
  caption: string;
  art: 'color' | 'type' | 'sketch' | 'clarity' | 'motion' | 'responsive';
  paragraphs: string[];
  readTime?: string;
};

const palette = [
  { name: 'Paper', hex: '#FAF7F2' },
  { name: 'Coral', hex: '#DB5947' },
  { name: 'Mint', hex: '#C9DDCF' },
  { name: 'Lilac', hex: '#DBD0E8' },
  { name: 'Ink', hex: '#302D2A' },
];

const boardItems: BoardItem[] = [
  {
    id: 'warm-and-a-little-unexpected', title: 'Warm. And a little unexpected.', category: 'Color study',
    caption: 'A small palette with room for a little personality.', art: 'color',
    paragraphs: [
      'A quiet background makes a bright accent feel brighter. This little study brings warm paper, coral, mint, and lilac together, with charcoal to give the softer colors some weight.',
      'Each color gets a job. Paper holds the page, ink carries the words, and coral points to the next action. Mint and lilac give related ideas their own space without making every part compete.',
      'The swatches are a starting point, not a promise that every combination works. The background, text size, and contrast of an actual interface still need to be checked together.',
    ],
  },
  {
    id: 'make-room', title: 'Make room for the good stuff.', category: 'Type & space',
    caption: 'A typographic reminder to leave a little breathing room.', art: 'type',
    paragraphs: [
      'One sentence. A generous margin. A small, slightly overenthusiastic star. This poster explores how little a composition needs before it starts to feel like something.',
      'The line breaks slow the sentence down. The heavier words give it a center of gravity, while the empty space around them keeps it from feeling crowded.',
      'Try the same idea on a screen: remove one decorative element, shorten one label, or give an important sentence more space. Sometimes the useful detail is the one you leave out.',
    ],
  },
  {
    id: 'a-clear-question', ...notes[0], art: 'clarity',
    caption: 'Before the colors and corners, decide what the page is for.',
  },
  {
    id: 'take-the-scenic-line', title: 'Take the scenic line.', category: 'A tiny drawing',
    caption: 'A wandering line, a few shapes, and a place to begin.', art: 'sketch',
    paragraphs: [
      'This little drawing starts with a line that refuses to take the shortest route. It passes a few simple shapes, changes direction, and finally arrives somewhere new.',
      'A rough sketch can do the same job in a design process. It makes an idea visible before the details are settled, so there is still room to try a different direction.',
      'Nothing here needs to become a finished illustration. The useful part is making a first mark, noticing what it suggests, and following the next idea.',
    ],
  },
  {
    id: 'motion-with-a-purpose', ...notes[1], art: 'motion',
    caption: 'The best movement helps you follow what just happened.',
  },
  {
    id: 'content-at-every-size', ...notes[2], art: 'responsive',
    caption: 'A smaller screen deserves its own thoughtful decisions.',
  },
];

const savedKey = 'portfolio-inspiration-saved-v1';

function readSavedItems(): string[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(savedKey) ?? '[]');
    return Array.isArray(value)
      ? [...new Set(value.filter((id): id is string => typeof id === 'string' && boardItems.some(item => item.id === id)))]
      : [];
  } catch { return []; }
}

function BoardArt({ art }: { art: BoardItem['art'] }) {
  return (
    <span className={`bb-art bb-art-${art}`} aria-hidden="true">
      {art === 'color' && <>
        <span className="bb-color-label">A LITTLE COLOR THERAPY</span>
        <span className="bb-swatch-stack">{palette.map(color => <span key={color.hex} style={{ background: color.hex }}><i>{color.name}</i></span>)}</span>
        <span className="bb-color-foot">warm paper + unexpected company <Sparkles /></span>
      </>}
      {art === 'type' && <>
        <span className="bb-poster-label">A NOTE TO KEEP AROUND</span>
        <span className="bb-poster-words">make room<br />for the<br /><em>good stuff.</em></span>
        <span className="bb-poster-star">✳</span>
        <span className="bb-poster-foot">Less noise. More meaning.</span>
      </>}
      {art === 'sketch' && <>
        <span className="bb-sketch-label">NO STRAIGHT LINES REQUIRED</span>
        <svg viewBox="0 0 300 200" fill="none" className="bb-drawing">
          <path d="M28 169C31 118 101 184 104 123C107 65 45 92 82 52C126 7 161 40 150 82C137 134 255 135 244 65" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="1 0" />
          <path d="m231 73 12-14 13 15" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="29" cy="169" r="9" fill="#DB5947" />
          <path d="m201 33 6 12 14 2-10 10 2 14-12-7-13 7 3-14-11-10 15-2z" fill="#C9DDCF" stroke="#536E5B" strokeWidth="2" strokeLinejoin="round" />
          <rect x="177" y="143" width="33" height="33" rx="8" transform="rotate(16 177 143)" fill="#DBD0E8" />
          <path d="m40 63 12 3m-4-12-4 20" stroke="#DB5947" strokeWidth="3" strokeLinecap="round" />
        </svg>
        <span className="bb-sketch-foot">start somewhere. see where it goes.</span>
      </>}
      {art === 'clarity' && <>
        <span className="bb-mini-label">THINKING OUT LOUD / 01</span>
        <span className="bb-question">What should<br />happen <em>next?</em></span>
        <span className="bb-clarity-arrow">↗</span>
      </>}
      {art === 'motion' && <>
        <span className="bb-mini-label">THINKING OUT LOUD / 02</span>
        <span className="bb-motion-track"><i /><i /><i /><span>→</span></span>
        <span className="bb-art-note">A little movement.<br /><strong>A little more meaning.</strong></span>
      </>}
      {art === 'responsive' && <>
        <span className="bb-mini-label">THINKING OUT LOUD / 03</span>
        <span className="bb-device-row"><span className="bb-device bb-wide"><i /><b /><b /></span><span className="bb-device bb-tall"><i /><b /><b /></span><span className="bb-device bb-phone"><i /><b /><b /></span></span>
        <span className="bb-art-note">Same idea. <strong>Room to adapt.</strong></span>
      </>}
    </span>
  );
}

export function BeyondBoard() {
  const [savedIds, setSavedIds] = useState(readSavedItems);
  const [selected, setSelected] = useState<BoardItem>(boardItems[0]);
  const [open, setOpen] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const opener = useRef<HTMLButtonElement | null>(null);

  function openItem(item: BoardItem, event: MouseEvent<HTMLButtonElement>) {
    opener.current = event.currentTarget;
    setSelected(item);
    setOpen(true);
  }

  function toggleSaved(item: BoardItem) {
    const isSaved = savedIds.includes(item.id);
    const next = isSaved ? savedIds.filter(id => id !== item.id) : [...savedIds, item.id];
    setSavedIds(next);
    try {
      localStorage.setItem(savedKey, JSON.stringify(next));
      setSaveMessage(isSaved ? `${item.title} removed from saved items.` : `${item.title} saved on this device.`);
    } catch {
      setSaveMessage(isSaved ? `${item.title} removed.` : `${item.title} saved for this visit. Device storage is unavailable.`);
    }
  }

  return (
    <div className="bb-board">
      <div className="bb-board-caption"><span><Sparkles aria-hidden="true" /> Colors, little experiments & a few thoughts</span><span><Heart aria-hidden="true" /> {savedIds.length} saved · on this device</span></div>
      <p className="bb-sr-only" role="status">{saveMessage}</p>
      <div className="bb-masonry">
        {boardItems.map((item, index) => (
          <article className={`bb-card bb-card-${item.art}`} key={item.id} style={{ '--bb-turn': `${index % 3 === 0 ? -0.8 : index % 3 === 1 ? 0.65 : -0.35}deg` } as React.CSSProperties}>
            <button className="bb-open-card" type="button" onClick={event => openItem(item, event)} aria-label={`Open ${item.title}`}>
              <BoardArt art={item.art} />
              <span className="bb-card-copy">
                <span className="bb-card-meta">{item.category}{item.readTime && <span>{item.readTime}</span>}</span>
                <span className="bb-card-title">{item.title}<ArrowUpRight aria-hidden="true" /></span>
                <span className="bb-card-caption">{item.caption}</span>
              </span>
            </button>
            <Button className="bb-save" variant="ghost" size="icon" onClick={() => toggleSaved(item)} aria-pressed={savedIds.includes(item.id)} aria-label={`${savedIds.includes(item.id) ? 'Unsave' : 'Save'} ${item.title}`}><Heart aria-hidden="true" /></Button>
          </article>
        ))}
      </div>
      <p className="bb-bottom-note">A board to wander through. Open something that catches your eye, or tap a heart to keep it close.</p>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bb-detail" onCloseAutoFocus={event => { event.preventDefault(); opener.current?.focus(); }}>
          <DialogHeader>
            <span className="bb-detail-kicker">{selected.category}{selected.readTime ? ` / ${selected.readTime}` : ' / A small visual experiment'}</span>
            <DialogTitle>{selected.title}</DialogTitle>
            <DialogDescription>{selected.caption}</DialogDescription>
          </DialogHeader>
          <BoardArt art={selected.art} />
          {selected.art === 'color' && <div className="bb-palette-key" aria-label="Palette colors">{palette.map(color => <div key={color.hex}><i style={{ background: color.hex }} /><span>{color.name}<code>{color.hex}</code></span></div>)}</div>}
          <div className="bb-detail-text">{selected.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>
          <div className="bb-detail-footer"><Button variant="outline" onClick={() => toggleSaved(selected)} aria-pressed={savedIds.includes(selected.id)}><Heart aria-hidden="true" fill={savedIds.includes(selected.id) ? 'currentColor' : 'none'} />{savedIds.includes(selected.id) ? 'Saved' : 'Save to this board'}</Button><span role="status">{saveMessage || 'Saved items stay on this device.'}</span></div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
