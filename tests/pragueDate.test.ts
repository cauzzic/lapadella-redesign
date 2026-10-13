import { describe, expect, test } from "bun:test";
import { isMenuValid, pickCurrentMenu, pragueToday } from "../src/lib/pragueDate";

const menu = { id: "a", plati_od: "2026-10-12", plati_do: "2026-10-16", zverejneno: true };

describe("pragueToday", () => {
  test("23:30 UTC v létě je už další den v Praze", () => {
    expect(pragueToday(new Date("2026-10-16T22:30:00Z"))).toBe("2026-10-17");
  });
  test("21:59 UTC je ještě týž den v Praze", () => {
    expect(pragueToday(new Date("2026-10-16T21:59:00Z"))).toBe("2026-10-16");
  });
});

describe("platnost menu", () => {
  test("první den platí", () => expect(isMenuValid(menu, "2026-10-12")).toBe(true));
  test("poslední den platí", () => expect(isMenuValid(menu, "2026-10-16")).toBe(true));
  test("den po konci neplatí", () => expect(isMenuValid(menu, "2026-10-17")).toBe(false));
  test("den před začátkem neplatí", () => expect(isMenuValid(menu, "2026-10-11")).toBe(false));
  test("nezveřejněné neplatí", () =>
    expect(isMenuValid({ ...menu, zverejneno: false }, "2026-10-13")).toBe(false));
  test("při překryvu vyhrává pozdější OD", () => {
    const b = { id: "b", plati_od: "2026-10-14", plati_do: "2026-10-20", zverejneno: true };
    expect(pickCurrentMenu([menu, b], "2026-10-15")?.id).toBe("b");
  });
});
