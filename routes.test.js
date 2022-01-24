const request = require("supertest");
const db = require("./db.js");
const app = require("./app");
const {User} = require("./models/users");
const {testBeforeAll, testBeforeEach, testAfterAll, testAfterEach, u1Token, u2Token} = require("./testUtil");

beforeAll(testBeforeAll);
beforeEach(testBeforeEach);
afterEach(testAfterEach);
afterAll(testAfterAll);

/////////////////////////////

//Login 
describe("POST /login", function () {
    test("authenticates and logs in user", async function () {
        const resp = await request(app)
        .post("/login")
        .send({
            username: "u1",
            password: "password1",
        });

        expect(resp.body).toEqual({token: expect.any(String)})
    })

    test("request with wrong password", async function () {
        const resp = await request(app)
        .post("/login")
        .send({username: "u1", password: "badpassword"});
        expect(resp.statusCode).toEqual(401)
    })
})


//Register
describe("POST /register", function () {
    test("registers user", async function () {
      const resp = await request(app)
          .post("/register")
          .send({
            username: "newUser",
            password: "newPassword",
            
          })
    
      expect(resp.statusCode).toEqual(201);
      expect(resp.body).toEqual({
         token: expect.any(String),
      });
    });


    test("bad request with missing fields", async function () {
        const resp = await request(app)
            .post("/register")
            .send({
              username: "new",
            });
        expect(resp.statusCode).toEqual(500);
      });

})