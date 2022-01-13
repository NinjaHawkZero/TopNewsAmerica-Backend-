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
        let user = await User.register({
          ...newUser,
          password: "password",
        });
        expect(user).toEqual(newUser);
        const found = await db.query("SELECT * FROM users WHERE username = 'user1'");
        expect(found.rows.length).toEqual(1);
        expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
      });

      test("bad request with duplicate data", async function () {
        try {
          await User.register({
            ...newUser,
            password: "password",
          });
          await User.register({
            ...newUser,
            password: "password",
          });
          fail();
        } catch (err) {
          expect(err instanceof BadRequestError).toBeTruthy();
        }
      });
});


//Authenticate
describe("authenticate", function() {

    test("works", async function () {
        const user = await User.authenticate("u1", "password1");
        expect(user).toEqual({
          username: "u1"});
      });

      test("unauth if no such user", async function () {
        try {
          await User.authenticate("nope", "password");
          fail();
        } catch (err) {
          expect(err instanceof UnauthorizedError).toBeTruthy();
        }
      });


      test("unauth if wrong password", async function () {
        try {
          await User.authenticate("c1", "wrong");
          fail();
        } catch (err) {
          expect(err instanceof UnauthorizedError).toBeTruthy();
        }
      });
});


//Get User
describe("get", function () {
    test("works", async function () {
      let user = await User.getUser("u1");
      expect(user).toEqual({
        username: "u1"});
    });
  
    test("not found if no such user", async function () {
      try {
        await User.getUser("nope");
        fail();
      } catch (err) {
        expect(err instanceof NotFoundError).toBeTruthy();
      }
    });
  });


//Save Story
describe("Save a story", function() {
    test("works", async function () {
        let story = { author:"Jon Wayne", title:"War in the middleeast", description:"There are conflicting forces in the middleeast", published_at:"2022-01-02T00:15:09Z", url:"https://www.macrumors.com/2022/01/01/apple-watch-life-saving-911-ad/", urlToImage:"https://images.macrumors.com/t/PvHWwlMR5LrYla3IjTpwcep860o=/1600x/article-new/2022/01/apple-watch-911-ad.jpeg"};
        let savedStory = await User.saveStory(story, 1)

        expect(savedStory.saved_by).toEqual(1)
    })
});


//Remove Story
describe("Remove a story", function() {
    test("works", async function () {
        let storyId = await User.removeStory(1);

        expect(storyId).toEqual(1)
    })
})

