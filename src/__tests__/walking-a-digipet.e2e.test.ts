import supertest from "supertest";
import { Digipet, setDigipet } from "../digipet/model";
import app from "../server";

describe("When a user walks a digipet repeatedly, its happiness increases by 10 each time until it eventually maxes out at 100", () => {
  beforeAll(() => {
    // setup: give an initial digipet
    const startingDigipet: Digipet = {
      happiness: 75,
      nutrition: 80,
      discipline: 60,
    };
    setDigipet(startingDigipet);
  });

  test("GET /digipet informs them that they have a digipet with expected stats", async () => {
    const response = await supertest(app).get("/digipet");
    expect(response.body.message).toMatch(/your digipet/i);
    expect(response.body.digipet).toHaveProperty("happiness", 75);
  });

  test("1st GET /digipet/walk informs them about the walk and shows increase happiness and decreased nutrition for digipet", async () => {
    const response = await supertest(app).get("/digipet/walk");
    expect(response.body.digipet).toHaveProperty("happiness", 85);
  });

  test("2nd GET /digipet/walk shows continued stats change", async () => {
    const response = await supertest(app).get("/digipet/walk");
    expect(response.body.digipet).toHaveProperty("happiness", 95);
  });

  test("3rd GET /digipet/walk shows happiness hitting a ceiling of 100", async () => {
    const response = await supertest(app).get("/digipet/walk");
    expect(response.body.digipet).toHaveProperty("happiness", 100);
  });

  test("4th GET /digipet/walk shows no further increase in happiness but still shows decrease in nutrition", async () => {
    const response = await supertest(app).get("/digipet/walk");
    expect(response.body.digipet).toHaveProperty("happiness", 100);
  });
});

describe("When a user walks a digipet repeatedly, its nutrition decreases by 5 each time until it eventually floors out at 0", () => {
  beforeAll(() => {
    // setup: give an initial digipet
    const startingDigipet: Digipet = {
      happiness: 40,
      nutrition: 11,
      discipline: 60,
    };
    setDigipet(startingDigipet);
  });

  test("GET /digipet informs them that they have a digipet with expected stats", async () => {
    const response = await supertest(app).get("/digipet");
    expect(response.body.message).toMatch(/your digipet/i);
    expect(response.body.digipet).toHaveProperty("nutrition", 11);
  });

  test("1st GET /digipet/walk informs them about the walk and shows decreased nutrition for digipet", async () => {
    const response = await supertest(app).get("/digipet/walk");
    expect(response.body.digipet).toHaveProperty("nutrition", 6);
  });

  test("2nd GET /digipet/walk shows continued stats change", async () => {
    const response = await supertest(app).get("/digipet/walk");
    expect(response.body.digipet).toHaveProperty("nutrition", 1);
  });

  test("3rd GET /digipet/walk shows nutrition hitting a floor of 0", async () => {
    const response = await supertest(app).get("/digipet/walk");
    expect(response.body.digipet).toHaveProperty("nutrition", 0);
  });

  test("4th GET /digipet/walk shows no further decrease in nutrition", async () => {
    const response = await supertest(app).get("/digipet/walk");
    expect(response.body.digipet).toHaveProperty("nutrition", 0);
  });
});