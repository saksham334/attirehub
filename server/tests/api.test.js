import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.js";

describe("API basics", () => {
  it("health check responds ok", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });

  it("returns a JSON 404 for unknown routes", async () => {
    const res = await request(app).get("/api/does-not-exist");
    expect(res.status).toBe(404);
    expect(res.body.message).toContain("Route not found");
  });

  it("rejects malformed JSON with a 400", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .set("Content-Type", "application/json")
      .send('{"email": ');
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid JSON in request body");
  });
});

describe("Validation runs before the database", () => {
  it("rejects registration with a short password", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "Test", email: "test@example.com", password: "123" });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Password must be 8 to 72 characters");
  });

  it("blocks a NoSQL injection attempt on login", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: { $gt: "" }, password: "x" });
    expect(res.status).toBe(400);
  });

    it("rejects MongoDB operator keys anywhere in the body", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "a@b.com", password: { $ne: 1 } });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid characters in request");
  });
});

describe("Protected routes need a token", () => {
  it.each([
    ["/api/auth/me"],
    ["/api/cart"],
    ["/api/wishlist"],
    ["/api/orders"],
    ["/api/admin/stats"],
  ])("returns 401 for GET %s without a token", async (path) => {
    const res = await request(app).get(path);
    expect(res.status).toBe(401);
  });
});