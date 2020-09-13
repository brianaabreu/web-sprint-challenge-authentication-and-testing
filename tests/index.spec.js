const request = require("supertest");
const server = require("../api/server.js");
const db = require("../database/dbConfig.js");
// const { authenticate } = require("./auth/authenticate-middleware.js");



beforeEach(async () => {
    // run the seed db automatically with each test, to get a fresh database
    await db.seed.run()
})

afterAll(async () => {
    // close the database connection so the test process doesn't hang or give a warning
    await db.destroy();
});

describe("GET /", () => {
    it('should GET /', async () => {
        const res = await request(server).get('/')
        expect(res.statusCode).toBe(200)
        expect(res.headers['content-type']).toBe('application/json; charset=utf-8')
    })
})

describe("register route", () => {
    it('should test user registration process', async () => {
        const res = await request(server)
            .post("/api/auth/register")
            .send({ username: "testUser1", password: "12Ob67b6n5" });
        expect(res.statusCode).toBe(201);
        expect(res.type).toBe("application/json");
        expect(res.body.username).toBe("testUser1");
    });
});

describe("login route", () => {
    it('should test user login process', async () => {
        const res = await request(server)
            .post("/api/auth/login")
            .send({ username: "testUser", password: "hi5556131" });
        expect(res.statusCode).toBe(200);
        expect(res.type).toBe("application/json");
        expect(res.body.message).toBe("Welcome testUser!");
    });
});

describe("jokes route", () => {
    it('should test jokes login process', async () => {
        const fakeServer = request(server);
        await fakeServer
            .post("/api/auth/login")
            .send({ username: "testUser", password: "12Ob67b6nt5" });
        const res = await fakeServer.get("/api/jokes");
        expect(res.statusCode).toBe(200);
        expect(res.type).toBe("application/json");
    });
});

describe("jokes integration tests", () => {
    it('should /GET /api/jokes', async () => {
        const fakeServer = request(server);
        const res = await fakeServer.get('/api/jokes')
        expect(res.statusCode).toBe(200)
        expect(res.headers['content-type']).toBe('application/json; charset=utf-8')
    }); // how to refactor for varying cases of being logged in or not?
    it('should return a JSON object', () => {
        return request(server).get('/api/jokes/')
            .then(jokes => {
                expect(jokes.type).toEqual("application/json")
            })
    });
    it('should return a 200 status code if logged in', () => {
        return request(server).get('/api/jokes/')
            .then(jokes => {
                expect(jokes.status).toEqual(200)
            })
    });
})