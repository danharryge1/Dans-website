import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  sendMock: vi.fn(),
}));

vi.mock("resend", () => ({
  Resend: class {
    emails = {
      send: mocks.sendMock,
    };
  },
}));

import { POST } from "./route";

function makeRequest(body: unknown): Request {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/contact", () => {
  beforeEach(() => {
    mocks.sendMock.mockReset();
    mocks.sendMock.mockResolvedValue({ data: { id: "fake-id" }, error: null });
    process.env.RESEND_API_KEY = "re_fake_key_for_tests";
  });

  it("returns 200 + ok:true on valid input and calls Resend", async () => {
    const req = makeRequest({
      name: "Ada",
      email: "ada@example.com",
      message: "I want a landing page for my new analytics product.",
      website: "",
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ ok: true });
    expect(mocks.sendMock).toHaveBeenCalledTimes(1);
  });

  it("returns 400 + errors map on invalid input", async () => {
    const req = makeRequest({
      name: "",
      email: "not-an-email",
      message: "hi",
      website: "",
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.errors.name).toBe("I'll need a name.");
    expect(body.errors.email).toBe("That email looks wrong.");
    expect(body.errors.message).toBe("Say a bit more.");
    expect(mocks.sendMock).not.toHaveBeenCalled();
  });

  it("silently drops honeypot submissions (returns 200 without sending)", async () => {
    const req = makeRequest({
      name: "Ada",
      email: "ada@example.com",
      message: "I want a landing page for my new analytics product.",
      website: "bot-filled-this",
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ ok: true });
    expect(mocks.sendMock).not.toHaveBeenCalled();
  });

  it("returns 200 + ok:true when RESEND_API_KEY is missing (local dev fallback)", async () => {
    delete process.env.RESEND_API_KEY;
    const req = makeRequest({
      name: "Ada",
      email: "ada@example.com",
      message: "I want a landing page for my new analytics product.",
      website: "",
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ ok: true });
    expect(mocks.sendMock).not.toHaveBeenCalled();
  });

  it("returns 500 + ok:false when Resend throws", async () => {
    mocks.sendMock.mockRejectedValueOnce(new Error("resend API down"));
    const req = makeRequest({
      name: "Ada",
      email: "ada@example.com",
      message: "I want a landing page for my new analytics product.",
      website: "",
    });
    const res = await POST(req);
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.ok).toBe(false);
  });

  it("returns 400 + ok:false when body is not JSON", async () => {
    const req = new Request("http://localhost/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "not-json",
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.ok).toBe(false);
  });
});
