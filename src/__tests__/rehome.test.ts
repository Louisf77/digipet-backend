import supertest from "supertest";
import { Digipet, setDigipet } from "../digipet/model";
import app from "../server";

/**
 * This file has integration tests for rehoming
 *
 * It is intended to test whether rehominf the digipet resets it to initial values
 */

describe("When a user rehomes a digipet it resets the digipet to null", () => {
  beforeAll(() => {
    // setup: give an initial digipet
    const startingDigipet: Digipet = {
      happiness: 60,
      nutrition: 75,
      discipline: 60,
    };
    setDigipet(startingDigipet);
  });

  test("GET /digipet informs them that they have a digipet with expected stats", async () => {
    const response = await supertest(app).get("/digipet");
    expect(response.body.message).toMatch(/your digipet/i);
    expect(response.body.digipet).toHaveProperty("nutrition", 75);
  });

  test("1st GET /digipet/rehome sets values to null", async () => {
    const response = await supertest(app).get("/digipet/rehome");
    expect(response.body.digipet).toBeNull();
  });

});
