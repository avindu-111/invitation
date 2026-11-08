import { describe, it, expect } from "vitest";
import { CEREMONY_ISO, timeLeft } from "./wedding";

describe("countdown", () => {
  it("ceremony is 20 Jan 2027 9:00 Sri Lanka time", () => {
    expect(new Date(CEREMONY_ISO).toISOString()).toBe("2027-01-20T03:30:00.000Z");
  });
  it("counts one day and one hour", () => {
    const t = Date.parse(CEREMONY_ISO);
    expect(timeLeft(t, t - 90000000)).toMatchObject({ days: 1, hours: 1, minutes: 0 });
  });
  it("stops at zero after the ceremony", () => {
    const t = Date.parse(CEREMONY_ISO);
    expect(timeLeft(t, t + 5000).done).toBe(true);
  });
});
