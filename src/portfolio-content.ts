/** Draft editorial content. Personal facts remain unset until supplied. */
export const profile: {
  name: string | null;
  email: string | null;
  github: string | null;
  linkedin: string | null;
} = {
  name: null,
  email: null,
  github: null,
  linkedin: null,
};

export const strengths = [
  {
    title: 'Interfaces with a clear point of view',
    description:
      'Start with what someone needs to do. Give the important action room, make the next step easy to find, and let the visual details support that order.',
    items: ['Information hierarchy', 'Interaction patterns', 'Responsive layouts'],
  },
  {
    title: 'Design that works in the browser',
    description:
      'A layout becomes a product through its behavior: how a control responds, how content adapts, and how the interface explains a change.',
    items: ['Reusable components', 'Useful state and feedback', 'Purposeful motion'],
  },
  {
    title: 'Attention beyond the first screen',
    description:
      'The empty list, the long title, the keyboard path, the small screen. These ordinary situations deserve the same care as the first impression.',
    items: ['Keyboard and focus', 'Empty and error states', 'Content that holds up'],
  },
];

export const process = [
  {
    title: 'Find the real task',
    kicker: '01 / Understand',
    description:
      'Describe who will use the page, what brought them there, and what a successful visit looks like. A clear task is a stronger starting point than a long feature list.',
    deliverables: ['A focused brief', 'Key user journeys', 'Content and constraints'],
  },
  {
    title: 'Make the structure visible',
    kicker: '02 / Explore',
    description:
      'Arrange the content before polishing it. Try a few directions, compare the reading order, and work out where each action belongs.',
    deliverables: ['Page structure', 'Interaction sketches', 'Visual direction'],
  },
  {
    title: 'Build something you can use',
    kicker: '03 / Make',
    description:
      'Move into the browser early. Connect the controls, test the real content, and shape the components around the way the experience behaves.',
    deliverables: ['Working components', 'Responsive screens', 'States and transitions'],
  },
  {
    title: 'Check the less obvious moments',
    kicker: '04 / Refine',
    description:
      'Walk through the experience on a phone and with a keyboard. Look for awkward wrapping, unclear feedback, and motion that gets in the way. Adjust what the checks reveal.',
    deliverables: ['Usability checks', 'Accessibility review', 'A considered final pass'],
  },
];

export const caseStudies = [
  {
    id: 'board' as const,
    title: 'Taskboard',
    category: 'Interactive study',
    summary:
      'A compact task board that makes progress visible. Move a task through its stages and see the shape of the work change.',
    challenge:
      'A task list can tell you what exists without making it clear what needs attention. The challenge was to show status and progress in a small space without turning every card into a form.',
    approach:
      'Separate the work into a few clear stages. Keep the task title prominent, use the same card structure throughout, and put the status change close to the task it affects.',
    outcome:
      'A working interface study for organizing tasks and changing their status. It explores how grouping and immediate feedback can make a board easier to understand.',
    stack: ['React', 'TypeScript', 'Local state'],
  },
  {
    id: 'focus' as const,
    title: 'Focus timer',
    category: 'Interactive study',
    summary:
      'A timer with one job: make the next stretch of focused work feel manageable. Settle in, start a session, and keep the controls close.',
    challenge:
      'A timer needs to explain its state at a glance. Running, paused, and ready should feel distinct, while the interface stays quiet enough to leave open beside the work.',
    approach:
      'Give the remaining time the strongest visual weight. Pair it with explicit controls, a clear session state, and progress that can be understood without relying on color alone.',
    outcome:
      'A working timer study with direct controls and visible progress. The focus is on predictable behavior and feedback that stays useful throughout a session.',
    stack: ['React', 'TypeScript', 'Browser timers'],
  },
  {
    id: 'palette' as const,
    title: 'Palette lab',
    category: 'Interactive study',
    summary:
      'A small space to explore color combinations. See colors together, compare their roles, and take a useful starting point into the next design.',
    challenge:
      'A row of attractive swatches does not always make a useful interface palette. Colors need to work together as backgrounds, text, accents, and supporting details.',
    approach:
      'Make color exploration immediate and keep the values readable. Present the palette as a group so changes can be judged in context, with a short path from viewing a color to using it.',
    outcome:
      'An interactive color study for trying combinations and inspecting their values. It offers a starting point for a visual direction; real text and controls still need contrast checks.',
    stack: ['React', 'TypeScript', 'CSS color'],
  },
];

export const notes = [
  {
    title: 'A clear interface starts with a clear question',
    category: 'Interface design',
    readTime: '2 min read',
    paragraphs: [
      'Before choosing a typeface or drawing a card, ask what someone came to do. A page for comparing options needs a different rhythm from a page for completing a task. When that question stays vague, every part of the screen competes to be important.',
      'Write down the main action in plain language. “Find a project that matches my interests” is useful. “Engage with the experience” is harder to design around. A concrete action helps decide what to show first, what can wait, and what does not belong on the page.',
      'Hierarchy is more than heading size. Position, spacing, contrast, and the amount of supporting text all tell people where to look. Try reading only the headings and controls. If they form a sensible path, the structure is doing some of the work before the details arrive.',
      'Labels matter just as much. A button that says “Move to done” explains a task-board action better than an unfamiliar icon on its own. Short wording helps when it names the actual result; shortening everything can make a screen harder to understand.',
      'A useful final check is to show the page briefly, then ask what stood out and what the next step would be. If the answers differ from the intended journey, adjust the structure before adding another layer of decoration.',
    ],
  },
  {
    title: 'Motion should explain what changed',
    category: 'Interaction design',
    readTime: '2 min read',
    paragraphs: [
      'The most useful animation often answers a small question. Where did that panel come from? Did the button respond? Which task just moved? Motion can connect the before and after so a change feels easier to follow.',
      'Start by building the interaction without animation. Make the states clear, check that the action works, and decide what information the transition should add. This keeps movement tied to a purpose instead of turning it into a requirement for understanding the screen.',
      'Different changes need different treatment. A pressed button can respond almost immediately. A panel opening may need a little more time to establish where it belongs. Matching every effect to the same duration can make a page feel mechanical, even when each animation is technically smooth.',
      'Movement also needs boundaries. A card that reacts slightly to a pointer can feel responsive, but text should remain easy to read and controls should stay where people expect them. Repeated background motion deserves particular care because it keeps asking for attention after its first impression.',
      'Reduced-motion preferences are part of the design. Replace large movement with a direct state change or a restrained fade, and keep every action available. The useful information should survive when the animation is removed.',
    ],
  },
  {
    title: 'Responsive design is a content decision',
    category: 'Frontend notes',
    readTime: '2 min read',
    paragraphs: [
      'A smaller screen changes more than the number of columns. It changes what appears together, how far someone travels between related details, and how comfortably they can use a control. Shrinking the desktop layout is only the beginning.',
      'Start with the reading order. A project preview beside its description on a wide screen becomes a sequence on a phone. Decide which part gives the other meaning, then put that first in the document. Good source order makes the layout easier to adapt and the page easier to navigate.',
      'Use actual content while building. A short sample title can hide a card that breaks with a longer name. Test a long link, a two-line button label, an empty state, and a paragraph that runs further than expected. These cases reveal more than repeatedly resizing the same perfect example.',
      'Controls need room as well. Leave enough space between neighboring actions, keep focus indicators visible, and avoid hiding essential information behind hover. If a visual effect depends on a mouse, the underlying action should still make sense with a touch or a keyboard.',
      'Choose breakpoints when the content starts to feel constrained. Then check the widths between them, including an open menu or dialog. A layout is ready when the relationships remain clear across those ordinary, in-between sizes.',
    ],
  },
];

export const faqs = [
  {
    question: 'What kind of work is shown here?',
    answer:
      'The featured pieces are interactive interface studies: a task board, a focus timer, and a palette tool. They are built to be tried in the browser and are presented as studies, with the design decisions explained alongside them.',
  },
  {
    question: 'Why show small tools?',
    answer:
      'A focused tool makes the decisions easier to see. You can try an action, notice the response, and judge whether the interface helps. A small scope also leaves room to work through details such as empty states, responsive layouts, and clear controls.',
  },
  {
    question: 'Where does accessibility fit in the process?',
    answer:
      'It belongs in the structure and behavior from the start: meaningful headings, explicit labels, visible focus, keyboard access, and sensible contrast. Reduced-motion preferences and smaller screens are part of the same review. Those checks need to continue as the content and interactions grow.',
  },
  {
    question: 'What makes a useful project brief?',
    answer:
      'Describe the people using the product, the problem they face, and what you want them to be able to do. Share the existing content, constraints, and a few references with a note about what you like in each. That gives the visual direction and the implementation a clear starting point.',
  },
];
