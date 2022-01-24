const {NotFoundError, BadRequestError, UnauthorizedError,} = require("../expressError.js");
const db = require("../db.js");
const {User} = require("./users.js");
const {testBeforeAll, testBeforeEach, testAfterEach, testAfterAll} = require("./testUtil.js");

beforeAll(testBeforeAll)
beforeEach(testBeforeEach)
afterEach(testAfterEach)
afterAll(testAfterAll)



//Register

describe("register", function() {
    const newUser = {username: "user1" };

    test("works", async function () {
        let user = await User.Register({
          ...newUser,
          password: "password",
        });
        expect(user.username).toEqual(newUser.username);
        const found = await db.query("SELECT * FROM users WHERE username = 'user1'");
        expect(found.rows[0].username).toEqual("user1");
      });

      test("bad request with duplicate data", async function () {
        try {
          await User.Register({
            ...newUser,
            password: "password",
          });
          await User.Register({
            ...newUser,
            password: "password",
          });
          fail();
        } catch (err) {
          expect(err).toBeTruthy();
        }
      });
});


//Authenticate
describe("authenticate", function() {

    test("works", async function () {
        const user = await User.authenticate("u1", "password1");
        expect(user.username).toEqual("u1");
      });

      test("unauth if no such user", async function () {
        try {
          await User.authenticate("nope", "password");
          fail();
        } catch (err) {
          expect(err).toBeTruthy();
        }
      });


      test("unauth if wrong password", async function () {
        try {
          await User.authenticate("c1", "wrong");
          fail();
        } catch (err) {
          expect(err).toBeTruthy();
        }
      });
});


//Get User
describe("get", function () {
    test("works", async function () {
      let user = await User.getUser("u1");
      expect(user.username).toEqual("u1");
    });
  
    test("not found if no such user", async function () {
      try {
        await User.getUser("nope");
        fail();
      } catch (err) {
        expect(err).toBeTruthy();
      }
    });
  });





