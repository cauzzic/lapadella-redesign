import { useEffect } from "react";

const EID = "hydra-8503c2c2-94b2-41b1-be3e-5193d5eecaa8";
const TAG_ID = "hors-hydra-8503c2c2-94b2-41b1-be3e-5193d5eecaa8";
const SCRIPT_SRC = "https://reservation.dish.co/widget.js";

export function DishWidget({ className }: { className?: string }) {
  useEffect(() => {
    const w = window as unknown as { _hors?: unknown[][] };
    w._hors = [
      ["eid", EID],
      ["tagid", TAG_ID],
      ["width", "100%"],
      ["height", ""],
      ["foregroundColor", ""],
      ["backgroundColor", ""],
      ["linkColor", ""],
      ["errorColor", ""],
      ["primaryButtonForegroundColor", ""],
      ["primaryButtonBackgroundColor", ""],
      ["secondaryButtonForegroundColor", ""],
      ["secondaryButtonBackgroundColor", ""],
    ];

    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    document.body.appendChild(script);

    return () => {
      script.remove();
      const target = document.getElementById(TAG_ID);
      if (target) target.innerHTML = "";
    };
  }, []);

  return <div id={TAG_ID} className={className} />;
}
