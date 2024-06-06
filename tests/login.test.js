import supertest from "supertest";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import {User} from "../schemas/userSchema.js";
import app from "../app.js";
import "dotenv/config";

mongoose.set("strictQuery", false);

const { TEST_URI } = process.env;

describe("login", () => {
  beforeAll(async () => {
    console.log("Connect to database, clear old data and create new user");
    await mongoose.connect(TEST_URI);
    await User.deleteMany();
    const passwordHash = await bcrypt.hash("qwerty", 10);
    const user = new User({
      email: "test@mail.com",
      password: passwordHash,
    });
    await user.save();
  });

  afterAll(async () => {
    await mongoose.disconnect(TEST_URI);
  });

  it("should login user and return status code 200", async () => {
    const response = await supertest(app).post("/api/users/login").send({
      email: "test@mail.com",
      password: "qwerty",
    });
    expect(response.statusCode).toBe(200);
  });
  it("should login user and return token", async () => {
    const response = await supertest(app).post("/api/users/login").send({
      email: "test@mail.com",
      password: "qwerty",
    });
    expect(response.body).toHaveProperty("token");
    expect(response.body.token).toBeTruthy();
  });
  it("should login user and return return object with fields email and subscription", async () => {
    const response = await supertest(app).post("/api/users/login").send({
      email: "test@mail.com",
      password: "qwerty",
    });
    expect(response.body).toHaveProperty("user");
    expect(response.body.user).toHaveProperty(
      "email",
      "test@mail.com"
    );
    expect(response.body.user).toHaveProperty("subscription");
    expect(typeof response.body.user.email).toBe("string");
    expect(typeof response.body.user.subscription).toBe("string");
    const validSubscriptions = ["starter", "pro", "business"];
    expect(validSubscriptions).toContain(response.body.user.subscription);
  });

  it("should return 401 for invalid password", async () => {
    const response = await supertest(app).post("/api/users/login").send({
      email: "test@mail.com",
      password: "qwert",
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Email or password is wrong");
  });

  it("should return 401 for invalid email", async () => {
    const response = await supertest(app).post("/api/users/login").send({
      email: "tester@mail.com",
      password: "qwerty",
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Email or password is wrong");
  });
});
