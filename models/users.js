//User model for TopNewsAmerica


const { BCRYPT_WORK_FACTOR } = require("../config");
const db = require("../db");
const bcrypt = require("bcrypt")

const { BadRequestError, UnauthorizedError, NotFoundError } = require("../expressError");

class User {
  

    //Takes registration details, registers user
    static async Register({username, password}) {
        const checkDuplicate = await db.query(
            `SELECT username
            FROM users
            WHERE username = $1`, [username]
        );

        if(checkDuplicate.rows[0]) {
            throw new BadRequestError(`Duplicate username: ${username}`)
        }

        const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

        const result = await db.query(
            `INSERT INTO users
            (username, password)
            VALUES($1, $2)
            RETURNING id, username, password
            `,
            [username, hashedPassword]
        );

        const user = result.rows[0];

        return user;
        
        
    }
    
    //Takes login details, logs in user
   static async authenticate(username, password) {

        const result = await db.query(
            `SELECT id,
            username,
            password
            FROM users
            WHERE username = $1`,
            [username]
        );

        const user = result.rows[0];

        if(user) {
            const isValid = await bcrypt.compare(password, user.password);
            if(isValid === true) {
                delete user.password;
                return  user;
            }
        }

        throw new UnauthorizedError("Invalid username/password")

    }

   


    //Retrieve User from DB, returned "user" contains username and id properties

    static async getUser(username) {
        const userRes = await db.query(
            `SELECT username,
            id
            FROM users
            WHERE username = $1`,
            [username]
        );

        const user = userRes.rows[0];

        if(!user) throw new NotFoundError(`No user: ${username}`);

        return user

    }

    //Save Story To User
   static  async saveStory( story, id ){
         story.saved_by = id;
         let {saved_by, author, title, description, published_at, url, urlToImage} = story;
        if(story.id === undefined) {
            const result = await db.query(
                `INSERT INTO storys
                (saved_by,
                author,
                title,
                description,
                published_at,
                url, 
                urlToImage)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING id, title, description, saved_by`,
                [saved_by, author, title, description, published_at, url, urlToImage]
            );

           let  savedStory = result.rows[0];

           return savedStory

        } else {
            throw new BadRequestError("Story already exists!")
        }

    }



    //Update User Data
    static async update(currentUsername, newUsername, password ) {

        if(password) { password = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
        }


        if(newUsername && password) {
            const result = await db.query(
                `UPDATE users
                SET username = $1,
                password = $2,
                WHERE username = $3
                RETURNING username`, [newUsername, password, currentUsername]
            );

            const user = result.rows[0];
            if (!user) throw new NotFoundError(`No user: ${username}`);

            delete user.password;
            return user
        } else if (newUsername && !password) {
            const result = await db.query(
                `UPDATE users
                SET username = $1,
                WHERE username = $2
                RETURNING username`, [newUsername, currentUsername]
            );

            const user = result.rows[0];
            if (!user) throw new NotFoundError(`No user: ${username}`);
                return user
        } else if (password) {
            const result = await db.query(
                `UPDATE users
                SET password = $1,
                WHERE username = $2
                RETURNING username`, [password, currentUsername]
            );
            const user = result.rows[0];
            if (!user) throw new NotFoundError(`No user: ${username}`);

            delete user.password;
            return user

        }


    }



     
    
  
    //Retrieve array of user stories, based on user id
   static async getStories(id){
       const results = await db.query(
           `SELECT id,
           saved_by,
           author,
           title,
           description,
           published_at,
           url,
           urlToImage
           FROM storys
           WHERE saved_by = $1`,
           [id]
       );

       let stories = results.rows

       if(!stories) throw new NotFoundError("Stories Not found for user!")

       return stories ;

   }

   



    //Removes Story from DB
    static async removeStory(id) {
        let result = await db.query(
            `DELETE
            FROM storys
            WHERE id = $1
            RETURNING id`,
            [id]
        );
        
        const story = result.rows[0];

        if(!story) throw new NotFoundError("Story Not Found!")

    }




}







module.exports = {User};