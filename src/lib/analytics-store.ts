import { collection, doc, getDocs, limit, orderBy, query, runTransaction, serverTimestamp, startAfter, where, type QueryDocumentSnapshot } from "firebase/firestore";
import { signInAnonymously, signOut } from "firebase/auth";
import { auth, db } from "./firebase";
import { dateBounds, type AnalyticsEvent } from "./analytics-model";

export async function visitorIdentity() {
  if (!auth) return null;
  await auth.authStateReady();
  if (auth.currentUser && !auth.currentUser.isAnonymous) return null;
  const created = Number(localStorage.getItem("portfolio-analytics-created"));
  if (auth.currentUser && (!created || Date.now() - created > 90 * 86400000)) await signOut(auth);
  if (!auth.currentUser) { await signInAnonymously(auth); localStorage.setItem("portfolio-analytics-created", String(Date.now())); }
  return auth.currentUser?.uid ?? null;
}
export async function forgetVisitor() { if (auth?.currentUser?.isAnonymous) await signOut(auth); }
export async function storeEvents(events: AnalyticsEvent[]) {
  if (!db || !auth?.currentUser?.isAnonymous || events.length === 0) return;
  const visitorId = auth.currentUser.uid;
  const rows = events.filter(e => e.visitorId === visitorId && Date.now() - e.at < 14 * 60_000).slice(0, 20);
  if (!rows.length) return;
  const budget = doc(db, "analytics_writers", visitorId);
  await runTransaction(db, async tx => {
    const previous = (await tx.get(budget)).data();
    const sameWindow = previous && Date.now() - previous.windowStart.toMillis() < 60_000;
    const count = (sameWindow ? previous.count : 0) + rows.length;
    if (count > 60) throw new Error("Analytics rate limit");
    tx.set(budget, { windowStart: sameWindow ? previous.windowStart : serverTimestamp(), updatedAt: serverTimestamp(), count, ids: rows.map(e => e.id) });
    for (const row of rows) tx.set(doc(db!, "analytics_events", row.id), row);
  });
}
export async function loadEvents(from: string, to: string): Promise<AnalyticsEvent[]> {
  if (!db) throw new Error("Analytics is not connected yet.");
  const { start, end } = dateBounds(from, to);
  const output: AnalyticsEvent[] = [];
  let cursor: QueryDocumentSnapshot | undefined;
  do {
    const base = [where("at", ">=", start), where("at", "<", end), orderBy("at", "desc"), limit(500)];
    const result = await getDocs(query(collection(db, "analytics_events"), ...base, ...(cursor ? [startAfter(cursor)] : [])));
    output.push(...result.docs.map(item => item.data() as AnalyticsEvent));
    if (result.size < 500) return output;
    if (output.length >= 10000) throw new Error("This range reached the 10,000-event read limit. Choose a shorter range to see complete totals.");
    cursor = result.docs.at(-1);
  } while (cursor);
  return output;
}
