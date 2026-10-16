import { ArrowUpRight, Braces, Database, Sparkles } from "lucide-react";
import { routeHref } from "@/lib/portfolio-router";

const skillGroups = [
  { icon: Braces, title: "Interfaces & interaction", detail: "Responsive screens, clear flows, and motion with a purpose.", tools: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Motion", "GSAP"], proof: "Across my web projects" },
  { icon: Database, title: "APIs & application data", detail: "Connecting the interface to authentication, APIs, and useful data.", tools: ["Node.js", "Express", "Python", "FastAPI", "PostgreSQL", "MongoDB"], proof: "Used in Abhyaas & ResumeIQ" },
  { icon: Sparkles, title: "AI in real workflows", detail: "Putting AI where it helps someone learn, prepare, or improve.", tools: ["Gemini", "RAG", "Qdrant", "Document parsing", "Prompt design"], proof: "Explored in Abhyaas, ResumeIQ & AIssist" },
];

const approach = [
  { title: "Understand the problem.", description: "Who is this for, what is difficult today, and why is it worth solving? I start with the user’s task and the value the product should deliver.", outcome: "User need · Product value" },
  { title: "Define the smallest useful version.", description: "I map the main flow, choose the MVP, and write a short PRD: the goal, essential features, and what can wait. That keeps the first version focused.", outcome: "MVP scope · Short PRD" },
  { title: "Choose tools with a reason.", description: "I pick the stack around the problem, data, and deployment needs. Simplicity, API costs, and maintenance matter alongside what I want to learn.", outcome: "Stack choices · Practical trade-offs" },
  { title: "Build one complete flow.", description: "I connect the interface, API, and database early. One working journey helps me find gaps before I spend too long polishing the rest.", outcome: "UI → API → Data" },
  { title: "Use AI. Keep the judgment.", description: "I use AI to explore options, break down unfamiliar concepts, and work through code. I review its suggestions, check the docs, and test the behavior myself.", outcome: "Explore · Review · Verify" },
  { title: "Test, learn, improve.", description: "I check the main flow, mobile layouts, and loading and error states. Then I refine what feels unclear and use feedback to decide what comes next.", outcome: "Usability · Feedback · Iteration" },
];

export function ProfessionalAbout() {
  return <div className="content-page professional-about">
    <div className="professional-intro">
      <div><span className="about-overline">FULL-STACK DEVELOPMENT / APPLIED AI</span><h3>I like understanding<br />the <em>why.</em><br />Then building the <em>how.</em></h3></div>
      <div className="professional-summary"><p className="summary-primary">I’m Kajal, a full-stack developer building web applications with thoughtful interfaces and practical AI features.</p><p>My projects explore learning, career preparation, and interactive experiences. With Abhyaas and ResumeIQ, I’ve worked across frontend development, backend APIs, databases, and AI integration—connecting individual features into a complete user journey.</p><p>I’m still learning, and I enjoy that part. I care about understanding the problem, making deliberate choices, and building something people can actually use.</p><a href={routeHref("work")}>See that thinking in my projects <ArrowUpRight size={17} /></a></div>
    </div>

    <div className="professional-skills"><div className="about-subheading"><span className="about-overline">01 / THE TOOLKIT</span><h3>What I work with.</h3><p>The tools make more sense in the context of what I build.</p></div><div className="skill-ledger">{skillGroups.map(group => <article className="skill-ledger-row" key={group.title}><div className="ledger-category"><group.icon size={23} strokeWidth={1.5} /><div><h4>{group.title}</h4><p>{group.detail}</p></div></div><div className="ledger-tools"><div>{group.tools.map(tool => <span key={tool}>{tool}</span>)}</div><small>{group.proof}</small></div></article>)}</div></div>

    <div className="professional-approach"><div className="about-subheading"><span className="about-overline">02 / HOW I APPROACH A PROJECT</span><h3>A little structure.<br />A lot of intentional building.</h3><p>From the first “what if” to a useful first version.</p></div><div className="approach-grid">{approach.map((step, index) => <article key={step.title} className="approach-cell"><span className="approach-number">0{index + 1}</span><h4>{step.title}</h4><p>{step.description}</p><span className="approach-outcome">{step.outcome}</span></article>)}</div></div>

    <aside className="ai-principle"><span className="ai-principle-icon"><Sparkles size={28} strokeWidth={1.3} /></span><div><span className="about-overline">MY VIEW ON AI</span><h3>A useful collaborator.<br />A human still makes the decisions.</h3><p>In my workflow, AI helps me explore and learn. In my projects, it helps with specific tasks—like reviewing a resume or explaining a study concept. The output still needs context, verification, and a clear next step for the person using it.</p></div><span className="ai-principle-note">Curiosity drives the questions.<br />Care shapes the answers.</span></aside>
  </div>;
}
