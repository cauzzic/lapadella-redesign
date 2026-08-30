import { Link } from "@/lib/router-compat";
import type { MouseEvent, ReactNode } from "react";

export function scrollToReservation() {
  const el = document.getElementById("rezervace");
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    return true;
  }
  return false;
}

/** Link na sekci Rezervace – funguje i při opakovaném kliknutí na stejné stránce. */
export function ReserveLink({
  className,
  children,
  onClick,
}: {
  className?: string;
  children?: ReactNode;
  onClick?: () => void;
}) {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.();
    if (window.location.pathname === "/" && scrollToReservation()) {
      e.preventDefault();
    }
  };

  return (
    <Link to="/#rezervace" className={className} onClick={handleClick}>
      {children ?? "Rezervovat stůl"}
    </Link>
  );
}
