import { describe, it, expect } from "vitest";
import { calculateTotals } from "../utils/calculateTotals.js";

describe("calculateTotals", () => {
  it("charges shipping and tax under the free-shipping threshold", () => {
    // One $44.99 hoodie: the hand-checked example from Step 12
    const t = calculateTotals([{ price: 44.99, quantity: 1 }]);
    expect(t).toEqual({ subtotal: 44.99, shippingCost: 6.99, tax: 5.85, total: 57.83 });
  });

  it("gives free shipping at exactly $75", () => {
    const t = calculateTotals([{ price: 75, quantity: 1 }]);
    expect(t.shippingCost).toBe(0);
    expect(t.total).toBe(84.75);
  });

  it("multiplies price by quantity", () => {
    const t = calculateTotals([{ price: 20, quantity: 3 }, { price: 10, quantity: 1 }]);
    expect(t.subtotal).toBe(70);
  });

  it("avoids floating point errors", () => {
    // In plain JavaScript, 0.1 + 0.2 is 0.30000000000000004
    const t = calculateTotals([{ price: 0.1, quantity: 1 }, { price: 0.2, quantity: 1 }]);
    expect(t.subtotal).toBe(0.3);
  });
});