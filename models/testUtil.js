const bcrypt = require("bcrypt");

const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config");

async function testBeforeAll() {
    
    
    
    await db.query("DELETE FROM users");

    await db.query("DELETE FROM storys");



    await db.query(`
    INSERT INTO users(username,
                      password,
                      )
    VALUES ('u1', $1),
           ('u2', $2)
    RETURNING username`,
  [
    await bcrypt.hash("password1", BCRYPT_WORK_FACTOR),
    await bcrypt.hash("password2", BCRYPT_WORK_FACTOR),
  ]);



  await db.query(`
  INSERT INTO storys(
      saved_by,
      author,
      title,
      description,
      published_at,
      url,
      urlToImage)
      VALUES(1, "Jon", "War", "Story description", "2022-01-02T00:15:09Z", "https://www.macrumors.com/2022/01/01/apple-watch-life-saving-911-ad/", "https://images.macrumors.com/t/PvHWwlMR5LrYla3IjTpwcep860o=/1600x/article-new/2022/01/apple-watch-911-ad.jpeg" ),
      (2, "Jon", "War", "Story description", "2022-01-02T00:15:09Z", "https://www.macrumors.com/2022/01/01/apple-watch-life-saving-911-ad/", "https://images.macrumors.com/t/PvHWwlMR5LrYla3IjTpwcep860o=/1600x/article-new/2022/01/apple-watch-911-ad.jpeg" )
      RETURNING id, title, description
  `);
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

  module.exports = {testBeforeAll, testBeforeEach, testAfterEach, testAfterAll}