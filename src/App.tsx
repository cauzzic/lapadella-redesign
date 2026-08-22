import { useEffect } from "react";
import { BrowserRouter, Routes, Route as RouterRoute, useLocation, Link } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { useSeo } from "@/lib/seo";
import type { RouteDefinition } from "@/lib/router-compat";

import { Route as indexRoute } from "@/routes/index";
import { Route as menuRoute } from "@/routes/menu";
import { Route as weeklyRoute } from "@/routes/tydenni-menu";
import { Route as specialRoute } from "@/routes/specialni-menu";
import { Route as drinksRoute } from "@/routes/napoje";
import { Route as aboutRoute } from "@/routes/o-nas";
import { Route as galleryRoute } from "@/routes/galerie";
import { Route as contactRoute } from "@/routes/kontakt";

const routes: RouteDefinition[] = [
  indexRoute,
  menuRoute,
  weeklyRoute,
  specialRoute,
  drinksRoute,
  aboutRoute,
  galleryRoute,
  contactRoute,
];


const queryClient = new QueryClient();

function Page({ route }: { route: RouteDefinition }) {
  useSeo(route.head);
  const Component = route.component;
  return <Component />;
}

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Stránka nenalezena</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Tato stránka neexistuje nebo byla přesunuta.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Zpět na úvod
          </Link>
        </div>
      </div>
    </div>
  );
}

function ScrollBehavior() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    window.scrollTo({ top: 0 });
  }, [pathname, hash]);

  return null;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ScrollBehavior />
        <SiteHeader />
        <main>
          <Routes>
            {routes.map((route) => (
              <RouterRoute key={route.path} path={route.path} element={<Page route={route} />} />
            ))}
            <RouterRoute path="*" element={<NotFound />} />
          </Routes>
        </main>
        <SiteFooter />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
