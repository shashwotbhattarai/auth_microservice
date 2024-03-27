import InputValidationMiddleware from "./inputValidation.middleware";
import express from "express";
import supertest from "supertest";

const inputvalidationMiddleware = new InputValidationMiddleware();

jest.mock("../configs/logger.config", () => ({
  error: jest.fn(),
}));

describe("validateSignup", () => {
  const app = express();
  app.use(express.json());
  app.post(
    "/test",
    inputvalidationMiddleware.validateSignupData,
    (req, res) => {
      res.status(200).send("Passed validation");
    },
  );
  it("passes validation for correct signup data", async () => {
    const response = await supertest(app)
      .post("/test")
      .set("username", "testuser")
      .set("password", "Password@123")
      .send({ email: "test@example.com", role: "candidate" });

    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("Passed validation");
  });

  it("fails validation for incorrect signup data", async () => {
    const response = await supertest(app)
      .post("/test")
      .set("username", "testuser")
      .set("password", "")
      .send({ email: "test@example", role: "recruiter" });

    expect(response.statusCode).toBe(400);
  });
});

describe("validateHeaderForUsername", () => {
  const validateHeaderDataMiddleware = new InputValidationMiddleware();

  const app = express();
  app.use(express.json());
  app.use(validateHeaderDataMiddleware.validateResetPasswordData);
  app.get("/test", (req, res) => {
    res.status(200).send({ message: "Success" });
  });
  it("should allow the request when valid password is passed", async () => {
    const response = await supertest(app)
      .get("/test")
      .set("password", "Password@1234");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: "Success" });
  });

  it("should return 400 when password is not strong", async () => {
    const response = await supertest(app)
      .get("/test")
      .set("password", "password123");

    expect(response.statusCode).toBe(400);
  });
});
