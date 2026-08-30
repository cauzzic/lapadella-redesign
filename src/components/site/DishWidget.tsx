import { useEffect } from "react";

const EID = "hydra-8503c2c2-94b2-41b1-be3e-5193d5eecaa8";
const TAG_ID = "hors-hydra-8503c2c2-94b2-41b1-be3e-5193d5eecaa8";
const SCRIPT_SRC = "https://reservation.dish.co/widget.js";

export function DishWidget({ className }: { className?: string }) {
  useEffect(() => {
    (window as unknown as { _hors: unknown }).._hors;
  }, []);

  return <div id={TAG_ID} className={className} />;
}
