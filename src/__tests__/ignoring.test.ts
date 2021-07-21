
import supertest from "supertest";
import { INITIAL_DIGIPET, setDigipet, Digipet } from "../digipet/model";
import app from "../server";

describe("GIVEN that the user does not have a digipet the server responds with a message informing them that they don't have a digipet and suggesting that they try hatching one", () => {
    setDigipet(undefined);

    test("1st GET /digipet/ignore informs them that they don't currently have a digipet", async () => {
      const response = await supertest(app).get("/digipet/ignore");
      expect(response.body.message).toMatch(/don't have/i);
      expect(response.body.digipet).not.toBeDefined();
    });
})

describe("GIVEN that the user has a digipet with all stats above 10, the server responds with a message confirming that they have ignored their digipet and includes digipet stats that show a decrease in all stats by 10",() => {
    beforeAll(() => {
        // setup: give an initial digipet
        const startingDigipet: Digipet = {
          happiness: 50,
          nutrition: 50,
          discipline: 50,
        };
        setDigipet(startingDigipet);
      });
      test("GET /digipet informs them that they have a digipet with expected stats", async () => {
        const response = await supertest(app).get("/digipet");
        expect(response.body.message).toMatch(/your digipet/i);
        expect(response.body.digipet).toHaveProperty("discipline", 50);
      });
    
      test("1st GET /digipet/ignore informs them about the ignore and reduces all stats by 10", async () => {
        const response = await supertest(app).get("/digipet/ignore");
        expect(response.body.digipet).toHaveProperty("discipline", 40)
        expect(response.body.digipet).toHaveProperty("nutrition", 40)
        expect(response.body.digipet).toHaveProperty("happiness", 40);
      });

      test("2nd GET /digipet/ignore reduces all stats by 10", async () => {
        const response = await supertest(app).get("/digipet/ignore");
        expect(response.body.digipet).toHaveProperty("discipline", 30)
        expect(response.body.digipet).toHaveProperty("nutrition", 30)
        expect(response.body.digipet).toHaveProperty("happiness", 30);
      });

      test("3rd GET /digipet/ignore reduces all stats by 10", async () => {
        const response = await supertest(app).get("/digipet/ignore");
        expect(response.body.digipet).toHaveProperty("discipline", 20)
        expect(response.body.digipet).toHaveProperty("nutrition", 20)
        expect(response.body.digipet).toHaveProperty("happiness", 20);
      });
      test("4th GET /digipet/ignore reduces all stats by 10", async () => {
        const response = await supertest(app).get("/digipet/ignore");
        expect(response.body.digipet).toHaveProperty("discipline", 10)
        expect(response.body.digipet).toHaveProperty("nutrition", 10)
        expect(response.body.digipet).toHaveProperty("happiness", 10);
      });
    
})

describe("GIVEN that the user has a digipet with some stats below 10 the server responds with a message confirming that they have ignored their digipet and includes digipet stats that have decreased by 10 down to a possible floor of 0", () => {
    beforeAll(() => {
        // setup: give an initial digipet
        const startingDigipet: Digipet = {
          happiness: 30,
          nutrition: 15,
          discipline: 8,
        };
        setDigipet(startingDigipet);
      });
    test("1st GET /digipet/ignore reduces all stats by 10, discipline bottoms out at 0", async () => {
        const response = await supertest(app).get("/digipet/ignore");
        expect(response.body.digipet).toHaveProperty("discipline", 0)
        expect(response.body.digipet).toHaveProperty("nutrition", 5)
        expect(response.body.digipet).toHaveProperty("happiness", 20);
    });
    test("2nd GET /digipet/ignore reduces all stats by 10 if above 10, discipline & nutrition bottom out at 0", async () => {
        const response = await supertest(app).get("/digipet/ignore");
        expect(response.body.digipet).toHaveProperty("discipline", 0)
        expect(response.body.digipet).toHaveProperty("nutrition", 0)
        expect(response.body.digipet).toHaveProperty("happiness", 10);
    });
    test("3rd GET /digipet/ignore reduces all stats by 10 if above 10, all stats bottom out at 0", async () => {
        const response = await supertest(app).get("/digipet/ignore");
        expect(response.body.digipet).toHaveProperty("discipline", 0)
        expect(response.body.digipet).toHaveProperty("nutrition", 0)
        expect(response.body.digipet).toHaveProperty("happiness", 0);
    });
})
