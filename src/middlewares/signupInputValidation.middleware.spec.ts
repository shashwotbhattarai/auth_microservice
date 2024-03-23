import ValidateSignupMiddleware from "./signupInputValidation.middleware";
import express from "express";
import supertest from "supertest";

const validateSignupMiddleware = new ValidateSignupMiddleware()
  .validateSignupMiddleware;

// Mocking the dependencies
jest.mock("../configs/logger.config", () => ({
  error: jest.fn(),
}));

jest.mock("../constants/validateSignUpInput.schema", () => ({
  validateSignupInput: {
    validate: jest.fn(),
  },
}));

const app = express();
app.use(express.json());
app.post("/signup", validateSignupMiddleware, (req, res) => {
  res.status(200).send("Passed validation");
});

describe("validateSignupMiddleware", () => {
  it("passes validation for correct signup data", async () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require("../constants/validateSignUpInput.schema").validateSignupInput.validate.mockReturnValueOnce(
      {},
    );

    const response = await supertest(app)
      .post("/signup")
      .set("username", "testuser")
      .set("password", "password123")
      .send({ email: "test@example.com", role: "user" });

    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("Passed validation");
  });

  it("returns error for invalid signup data", async () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require("../constants/validateSignUpInput.schema").validateSignupInput.validate.mockReturnValueOnce(
      {
        error: {
          details: [
            {
              message: "Invalid input data",
            },
          ],
        },
      },
    );

    const response = await supertest(app)
      .post("/signup")
      .set("username", "testuser")
      .set("password", "")
      .send({ email: "test@example", role: "user" });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      status: "error",
      message: "Invalid input data",
    });
  });
});
