import { useState } from "react";
import { browserIsExcluded, excludeThisBrowser } from "@/lib/analytics-preferences";
import type { ReportSettings } from "@/lib/analytics-model";

const ORIGIN = "https://kajal-portfolio-brown.vercel.app";
export function AnalyticsControls({ settings, cleanOnly, onCleanOnly, saving, error, onStart, onExclude }: {
  settings: ReportSettings; cleanOnly: boolean; onCleanOnly: (value: boolean) => void;
  saving: boolean; error: string; onStart?: () => void; onExclude?: (id: string, excluded: boolean) => void;
}) {
  const [excluded, setExcluded] = useState(browserIsExcluded);
  const [notice, setNotice] = useState("");
  const copy = async (value: string) => { try { await navigator.clipboard.writeText(value); setNotice("Link copied."); } catch { setNotice("Select the link below and copy it."); } };
  return <section className="admin-controls" aria-label="Counting and exclusions">
    <div className="admin-exclusion-status"><strong>{excluded ? "This browser is excluded from visitor counts" : "Exclude your own browser"}</strong>
      <p>Your phone and other browsers need their own exclusion. Earlier visits stay in the history.</p>
      {!excluded && <button onClick={() => { const saved = excludeThisBrowser(); setExcluded(true); setNotice(saved ? "This browser is now excluded." : "Excluded for this page only: browser storage is blocked."); }}>Exclude this browser</button>}
    </div>
    {!settings.cleanFrom && <p>Earlier totals include setup and test traffic. Set a clean start below after excluding your own devices.</p>}
    <details><summary>Counting, phone setup & sharing links</summary>
      <div className="admin-controls-grid">
        <div><h3>What the numbers mean</h3>
          <p><strong>Unique visitors:</strong> one count per browser in your selected dates, even after repeated openings.</p>
          <p><strong>Visits:</strong> a new session after 30 minutes without tracked activity. <strong>Page views:</strong> page loads, refreshes and Home/Stats navigation.</p>
          <p><strong>Resume visitors:</strong> each browser that clicked your resume, counted once. Total clicks are shown separately.</p>
          <p>Example: one browser opens the portfolio five times → one visitor, up to five visits, five page views. Another device, private browsing or cleared storage can count separately. These are estimates, not identified people.</p>
        </div>
        <div><h3>Exclude your phone or a testing browser</h3><p>Open this link once in that browser. It stops future tracking before the first event. Keep this setup link out of your public profiles.</p>
          <label>Private exclusion link<input readOnly value={`${ORIGIN}/?analytics=off`} onFocus={e => e.currentTarget.select()} /></label>
          <button onClick={() => void copy(`${ORIGIN}/?analytics=off`)}>Copy exclusion link</button>
          <h3>Start a clean reporting period</h3><p>After excluding your own devices, set a start time. Earlier records remain available; no data is deleted.</p>
          <p>{settings.cleanFrom ? `Clean tracking starts ${new Date(settings.cleanFrom).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} (India time).` : "No clean start set. Earlier totals include setup and test visits."}</p>
          {onStart && <button disabled={saving} onClick={onStart}>{settings.cleanFrom ? "Set a new clean start now" : "Start clean tracking now"}</button>}
          {settings.cleanFrom && <label className="admin-check"><input type="checkbox" checked={cleanOnly} onChange={e => onCleanOnly(e.target.checked)} />Only show activity since the clean start</label>}
        </div>
        <div><h3>Links for your social profiles</h3><p>Use each link on its matching profile. Tags identify the shared link; copied links can retain that source. No access to anyone’s social account is involved.</p>
          {["instagram", "facebook", "linkedin"].map(platform => { const url = `${ORIGIN}/?utm_source=${platform}&utm_medium=social&utm_campaign=portfolio`; return <div key={platform} className="admin-share-link"><label>{platform[0].toUpperCase() + platform.slice(1)}<input readOnly value={url} onFocus={e => e.currentTarget.select()} /></label><button onClick={() => void copy(url)}>Copy {platform} link</button></div>; })}
        </div>
        <div><h3>Browsers excluded from reports</h3><p>Only exclude a visit journey you recognize as your own or a test. This filters that browser’s past and future records from every report. It does not stop collection on that remote browser.</p>
          {settings.excludedVisitorIds.length ? <ul>{settings.excludedVisitorIds.map(id => <li key={id}><code title={id}>Browser {id.slice(0, 8)}</code>{onExclude && <button disabled={saving} onClick={() => onExclude(id, false)}>Restore browser {id.slice(0, 8)}</button>}</li>)}</ul> : <p>No browser IDs have been excluded from reports.</p>}
        </div>
      </div>
    </details>
    {(notice || error || saving) && <p role="status" className={error ? "admin-message is-error" : "admin-control-notice"}>{error || (saving ? "Saving report settings…" : notice)}</p>}
  </section>;
}
