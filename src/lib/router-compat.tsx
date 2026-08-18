import type { ComponentType, ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

export type MetaTag = Record<string, string | undefined>;
export type RouteHead = () => { meta?: MetaTag[]; links?: MetaTag[] };

export type RouteDefinition = {
  path: string;
  component: ComponentType;
  head?: RouteHead;
};

/**
 * Compatibility helper so page files keep their original shape
 * (metadata + component) on a plain Vite + React Router setup.
 */
export function createFileRoute(path: string) {
  return (options: { component: ComponentType; head?: RouteHead }): RouteDefinition => ({
    path,
    ...options,
  });
}

type LinkProps = {
  to: string;
  children?: ReactNode;
  className?: string;
  activeProps?: { className?: string };
  activeOptions?: { exact?: boolean };
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  target?: string;
  rel?: string;
  "aria-label"?: string;
};

export function Link({ to, className, activeProps, activeOptions, children, ...rest }: LinkProps) {
  return (
    <NavLink
      to={to}
      end={activeOptions?.exact ?? false}
      className={({ isActive }) => cn(className, isActive && activeProps?.className)}
      {...rest}
    >
      {children}
    </NavLink>
  );
}
