import ValidateSignupMiddleware from "./signupInputValidation.middleware";
import express from "express";
import supertest from "supertest";

const validateSignupMiddleware = new ValidateSignupMiddleware();

jest.mock("../configs/logger.config", () => ({
  error: jest.fn(),
}));

const app = express();
app.use(express.json());
app.post("/signup", validateSignupMiddleware.validateSignup, (req, res) => {
  res.status(200).send("Passed validation");
});

describe("validateSignup", () => {
  it("passes validation for correct signup data", async () => {
    const response = await supertest(app)
      .post("/signup")
      .set("username", "testuser")
      .set("password", "password123")
      .send({ email: "test@example.com", role: "candidate" });

    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("Passed validation");
  });

  it("fails validation for incorrect signup data", async () => {
    const response = await supertest(app)
      .post("/signup")
      .set("username", "testuser")
      .set("password", "")
      .send({ email: "test@example", role: "recruiter" });

    expect(response.statusCode).toBe(400);
  });
});
