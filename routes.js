const express = require("express");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("./config");
const { ExpressError } = require("./expressError");
const { ensureCorrectUser, ensureLoggedIn } = require("./middleware/auth");
const axios = require("axios");

const {User} = require("./models/users");
const API_KEY = `923cdfb34c684486ae9912d7ada90b4b`


const router = new express.Router();


//AUTH ROUTES

 // Register user: registers, logs in, and returns token.
router.post("/register", async function(req, res, next) {
    try {
        let {username , password} = req.body;
         const newUser = await User.Register({username, password});
        const token = jwt.sign(newUser.username, SECRET_KEY);
        return res.status(201).json({token})
    }
    catch(err) {
        return next(err)
    }
})


// Login User: logs in user, returns token

router.post("/login", async function(req, res, next) {
    try {
        let {username, password} = req.body;
        if(await User.authenticate(username, password)) {
            let token = jwt.sign({username}, SECRET_KEY);
            return res.json({token})
        } else {
            throw new ExpressError("Invalid username/password", 400)
        }
    } catch (err) {return next(err)}
});


//Retrieve Current User
router.get("/:username", ensureCorrectUser, async function (req, res, next) {

    try {
        const user = await User.getUser(req.params.username);

        return res.json({user});
    } catch (err) {
        return next(err);
    }
})

//Update User data
router.patch("/:username", ensureCorrectUser, async function(req, res, next) {
    try {
        let {username, password} = req.body;
        const user = await User.update(req.params.username, {username, password});

        return res.json({user});
    } catch (err) {
        return next(err);
    }
});


//Retrieve Current Stories
router.get("/stories", ensureLoggedIn, async function(req, res, next) {
try{
    let result = await axios.get(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`);

    let stories = result.data.articles;
    let newStories = stories.map((story) => {delete story.source; return story})
    return res.status(201).json({newStories})}

    catch(err) {return next(err)}
})







//STORY ROUTES
// Post new story to DB
router.post("/:username/saveStory", ensureCorrectUser, async function(req, res, next){
    try {
        let story = req.body;
        let user = await User.getUser(req.params.username)
        let savedStory = await User.saveStory(story, user.id);

        return res.status(201).json({savedStory})
    }
    catch(err) {return next(err)}
})

// Retrieve all user stories from DB

router.get("/:username/userstories", ensureCorrectUser, async function(req, res, next) {
    try{
        let user = await User.getUser(req.params.username)
        let stories = await User.getStories(user.id)

         return res.status(201).json({stories})

    }
    catch (err) {return next(err)}
})



//Remove User's story from DB

router.delete("/:username/deleteStory", ensureCorrectUser, async function(req, res, next) {
    try{
        let storyId = req.body;
        await User.removeStory(storyId);

        return res.json({deleted: storyId})
    }
    catch(err) {return next(err)}
})

module.exports = router;


