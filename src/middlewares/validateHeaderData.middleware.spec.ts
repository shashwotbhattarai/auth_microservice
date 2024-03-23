import request from "supertest";
import express from "express";
import bodyParser from "body-parser";
import ValidateHeaderDataMiddleware from "./validateHeaderData.middleware";

const validateHeaderDataMiddleware = new ValidateHeaderDataMiddleware()
  .validateHeaderDataMiddleware;

const app = express();
app.use(bodyParser.json());
app.use(validateHeaderDataMiddleware);
app.get("/test", (req, res) => {
  res.status(200).send({ message: "Success" });
});

describe("validateHeaderDataMiddleware", () => {
  it("should allow the request to proceed when username and password are valid strings", async () => {
    const response = await request(app)
      .get("/test")
      .set("username", "testuser")
      .set("password", "testpass");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: "Success" });
  });

  it("should return 401 when username is missing", async () => {
    const response = await request(app)
      .get("/test")
      .set("password", "testpass");

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({
      message:
        "Either Username or password is missing or the data type is not string",
    });
  });

  it("should return 401 when password is missing", async () => {
    const response = await request(app)
      .get("/test")
      .set("username", "testuser");

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({
      message:
        "Either Username or password is missing or the data type is not string",
    });
  });

  it("should return 401 when username is not passed", async () => {
    const response = await request(app)
      .get("/test")
      .set("password", "testpass");

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({
      message:
        "Either Username or password is missing or the data type is not string",
    });
  });

  it("should return 401 when password is not passed", async () => {
    const response = await request(app)
      .get("/test")
      .set("username", "testuser");

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({
      message:
        "Either Username or password is missing or the data type is not string",
    });
  });
});
