import { useEffect, useState } from "react";

export type PortfolioRoute =
  | "home"
  | "work"
  | "about"
  | "beyond"
  | "contact"
  | "not-found";

type NavigableRoute = Exclude<PortfolioRoute, "not-found">;

const routePaths: Record<NavigableRoute, string> = {
  home: "#home",
  work: "#work",
  about: "#about",
  beyond: "#beyond",
  contact: "#contact",
};

const hashRoutes = new Map<string, PortfolioRoute>([
  ["", "home"],
  ["#", "home"],
  ["#/", "home"],
  ["#/work", "work"],
  ["#/about", "about"],
  ["#/beyond", "beyond"],
  ["#/contact", "contact"],
  ["#/hobbies", "beyond"],
  ["#home", "home"],
  ["#work", "work"],
  ["#about", "about"],
  ["#beyond", "beyond"],
  ["#approach", "about"],
  ["#notes", "beyond"],
  ["#questions", "contact"],
  ["#contact", "contact"],
]);

/** Resolve URL fragments without reading or changing browser state. */
export function parsePortfolioHash(
  hash: string,
  currentRoute: PortfolioRoute = "home",
): PortfolioRoute {
  // The skip link targets the current page's main element, not a new page.
  if (hash === "#main") return currentRoute;
  return hashRoutes.get(hash) ?? "not-found";
}

export function routeHref(route: NavigableRoute): string {
  return routePaths[route];
}

export function usePortfolioRoute(): PortfolioRoute {
  const [route, setRoute] = useState<PortfolioRoute>(() =>
    typeof window === "undefined"
      ? "home"
      : parsePortfolioHash(window.location.hash),
  );

  useEffect(() => {
    const update = () => {
      setRoute(current => parsePortfolioHash(window.location.hash, current));
    };

    window.addEventListener("hashchange", update);
    // Capture a fragment changed between the initial render and subscription.
    update();
    return () => window.removeEventListener("hashchange", update);
  }, []);

  return route;
}
