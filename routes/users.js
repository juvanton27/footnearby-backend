var express = require("express");
var router = express.Router();
var User = require("../models/User.js");
let { authorize, signAsynchronous } = require("../utils/auth");
const jwt = require("jsonwebtoken");
const jwtSecret = "jkjJ1235Ohno!";
const LIFETIME_JWT = 24 * 60 * 60 * 1000; // 10;// in seconds // 24 * 60 * 60 * 1000 = 24h

/* GET user list : secure the route with JWT authorization */
router.get("/", authorize, function (req, res, next) {
  return res.json(User.list);
});

/* POST user data for authentication */
router.post("/login", function (req, res, next) {
  let user = new User(req.body.email, req.body.username, req.body.password, req.body.admin);
  console.log("POST users/login:", User.list);
  user.checkCredentials(req.body.username, req.body.password).then((match) => {
    if (match) {
      jwt.sign(
        { username: user.username },
        jwtSecret,
        { expiresIn: LIFETIME_JWT },
        (err, token) => {
          if (err) {
            console.error("POST users/ :", err);
            return res.status(500).send(err.message);
          }
          console.log("POST users/ token:", token);
          return res.json({ user: user, token });
        }
      );
    } else {
      console.log("POST users/login Error:", "Unauthentified");
      return res.status(401).send("bad email/password");
    }
  });
});

/* POST a new user */
router.post("/", function (req, res, next) {
  console.log("POST users/", User.list);
  console.log("email:", req.body.email);
  if (User.isUser(req.body.username)) return res.status(409).end();
  let newUser = new User(req.body.email, req.body.username, req.body.password, req.body.admin);
  newUser.save().then(() => {
    console.log("afterRegisterOp:", User.list);
    jwt.sign(
      { username: newUser.username },
      jwtSecret,
      { expiresIn: LIFETIME_JWT },
      (err, token) => {
        if (err) {
          console.error("POST users/ :", err);
          return res.status(500).send(err.message);
        }
        console.log("POST users/ token:", token);
        return res.json({ user: newUser, token });
      }
    );
    /* Example on how to create and use your own asynchronous function (signAsynchronous())
    signAsynchronous(newUser, (err, token) => {
      if (err) {
        console.error("POST users/ :", err);
        return res.status(500).send(err.message);
      }
      console.log("POST users/ token:", token);
      return res.json({ username: req.body.email, token });
    });
    */
  });
});

/* GET user object from username */
router.get("/:username", function (req, res, next) {
  console.log("GET users/:username", req.params.username);
  const userFound = User.getUserFromList(req.params.username);
  if (userFound) {
    return res.json(userFound);
  } else {
    return res.status(404).send("ressource not found");
  }
});

// Delete a user : DELETE /api/users/:username
router.delete("/:username", function (req, res) {
  const userDeleted = User.delete(req.params.username);
  if (!userDeleted) return res.status(404).end();
  return res.json(userDeleted);
});

/* Update a user : PUT /api/users/:username
router.put("/:username", function (req, res) {
  const userUpdated = User.update(req.params.email, req.params.username, req.params.password, req.params.admin);
  if (!filmUpdated) return res.status(404).end();
  return res.json(userUpdated);
});*/

module.exports = router;
