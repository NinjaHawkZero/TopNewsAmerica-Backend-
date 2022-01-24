const db = require("./db.js");
const {User} = require("./models/users");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("./config");


async function testBeforeAll() {
    await db.query("DELETE FROM users");

    await db.query("DELETE FROM storys");

    await User.Register({username:"u1", password:"password1"});

    await User.Register({username:"u2", password:"password2"});

    await User.saveStory({saved_by: 1, author:"Jon Wayne", title:"War in the middleeast", description:"There are conflicting forces in the middleeast", published_at:"2022-01-02T00:15:09Z", url:"https://www.macrumors.com/2022/01/01/apple-watch-life-saving-911-ad/", urlToImage:"https://images.macrumors.com/t/PvHWwlMR5LrYla3IjTpwcep860o=/1600x/article-new/2022/01/apple-watch-911-ad.jpeg"});

    await User.saveStory({saved_by: 2, author:"Micheal John", title:"War in the middleeast", description:"There are conflicting forces in the middleeast", published_at:"2022-01-02T00:15:09Z", url:"https://www.macrumors.com/2022/01/01/apple-watch-life-saving-911-ad/", urlToImage:"https://images.macrumors.com/t/PvHWwlMR5LrYla3IjTpwcep860o=/1600x/article-new/2022/01/apple-watch-911-ad.jpeg"});
}



async function testBeforeEach() {
    await db.query("BEGIN");
  }
  
  async function testAfterEach() {
    await db.query("ROLLBACK");
  }
  
  async function testAfterAll() {
    await db.end();
  }


const u1Token = jwt.sign("u1", SECRET_KEY);
const u2Token = jwt.sign("u2", SECRET_KEY);



module.exports = {testBeforeAll, testBeforeEach, testAfterAll, testAfterEach, u1Token, u2Token}