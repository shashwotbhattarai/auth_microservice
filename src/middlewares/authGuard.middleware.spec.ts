import request from "supertest";
import express, { Express } from "express";
import jwt from "jsonwebtoken";
import AuthGuardMiddleware from "./authGuard.middleware";

jest.mock("jsonwebtoken", () => ({
  verify: jest.fn(),
}));

describe("AuthGuardMiddleware", () => {
  let app: Express;
  let authGuardMiddleware: AuthGuardMiddleware;

  beforeAll(() => {
    app = express();
    authGuardMiddleware = new AuthGuardMiddleware();

    jest.mock("../configs/logger.config", () => ({
      error: jest.fn(),
    }));

    app.get(
      "/protected-route",
      authGuardMiddleware.protectRoute(["admin"]),
      (req, res) => {
        res.status(200).json({ message: "Access granted to protected route" });
      },
    );
  });

  it("should respond with 401 if authorization header is missing", async () => {
    const response = await request(app).get("/protected-route");
    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Authorization header missing");
  });

  it("should respond with 401 if access token is missing", async () => {
    const response = await request(app)
      .get("/protected-route")
      .set("Authorization", "Bearer ");
    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Access token is missing");
  });

  it("should respond with 403 if user role is not allowed", async () => {
    (jwt.verify as jest.Mock).mockReturnValueOnce({ role: "user" });

    const token = "mockedToken";
    const response = await request(app)
      .get("/protected-route")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(403);
    expect(response.body.message).toBe("Access denied");
  });

  it("should allow access if user role is allowed", async () => {
    (jwt.verify as jest.Mock).mockReturnValueOnce({ role: "admin" });

    const token = "mockedToken";
    const response = await request(app)
      .get("/protected-route")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Access granted to protected route");
  });
});
