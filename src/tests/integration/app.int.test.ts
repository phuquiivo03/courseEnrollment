import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../../app";
import { setupTestDatabase } from "../helpers/test-db";

let accessToken = "";

describe("Integration: Courses & Enrollments", () => {
  beforeAll(async () => {
    setupTestDatabase();

    // Register admin user (ignore if already exists)
    const registerRes = await request(app).post("/api/auth/register").send({
      username: "admin",
      password: "admin",
      role: "ADMIN",
    });
    if (![201, 409].includes(registerRes.status)) {
      // 409 if username already exists
      // If some other status, throw to surface issue
      throw new Error(`Register failed with status ${registerRes.status}`);
    }

    // Login to get access token
    const loginRes = await request(app).post("/api/auth/login").send({
      username: "admin",
      password: "admin",
    });
    expect(loginRes.status).toBe(200);
    accessToken = loginRes.body?.token;
    expect(typeof accessToken).toBe("string");
  });

  it("Create Course - 201 Created (happy path)", async () => {
    const res = await request(app)
      .post("/api/courses")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ title: "JS 101", description: "Intro", difficulty: "Beginner" });

    expect(res.status).toBe(201);
    expect(res.body?.data?.title).toBe("JS 101");
  });

  it("Create Course - 400 when missing title", async () => {
    const res = await request(app)
      .post("/api/courses")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ description: "No title", difficulty: "Beginner" });

    expect(res.status).toBe(400);
  });

  it("Enroll Student - 201 Created (happy path)", async () => {
    // Ensure a course exists
    const course = await request(app)
      .post("/api/courses")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        title: "TS 101",
        description: "TypeScript",
        difficulty: "Beginner",
      });

    const res = await request(app)
      .post("/api/enrollments")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        studentEmail: "student@example.com",
        courseId: course.body.data.id,
      });

    expect(res.status).toBe(201);
    expect(res.body?.data?.studentEmail).toBe("student@example.com");
  });

  it("Enroll Student - 409 on duplicate enrollment", async () => {
    const course = await request(app)
      .post("/api/courses")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        title: "Node 101",
        description: "NodeJS",
        difficulty: "Beginner",
      });

    const payload = {
      studentEmail: "dup@example.com",
      courseId: course.body.data.id,
    };

    const first = await request(app)
      .post("/api/enrollments")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(payload);
    expect(first.status).toBe(201);

    const second = await request(app)
      .post("/api/enrollments")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(payload);
    expect(second.status).toBe(409);
  });

  it("List a Student's Enrollments - returns list", async () => {
    const course = await request(app)
      .post("/api/courses")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        title: "DB 101",
        description: "DB Intro",
        difficulty: "Beginner",
      });

    const email = "list@example.com";
    await request(app)
      .post("/api/enrollments")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ studentEmail: email, courseId: course.body.data.id });

    const res = await request(app).get(
      `/api/enrollments/students/${encodeURIComponent(email)}/enrollments`
    );
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body?.data)).toBe(true);
    expect(res.body?.data.length).toBeGreaterThanOrEqual(1);
  });
});
