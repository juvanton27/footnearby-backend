"use strict";
let express = require("express");
let router = express.Router();
let Film = require("../models/Film.js");


// Create a new film : POST /api/films/
router.post("/", function (req, res) {  
  let newFilm = new Film(req.body);
  newFilm.save();
  return res.json(newFilm);
});

// Read all the existing films : GET /api/films/
router.get("/",  function (req, res) { 
  return res.json(Film.list);
});

// Read an identified film : GET /api/films/:id
router.get("/:id", function (req, res) {
  const filmFound = Film.get(req.params.id);
  if (!filmFound) return res.status(404).end();

  return res.json(filmFound);
});

// Delete a film : DELETE /api/films/:id
router.delete("/:id", function (req, res) {
  const filmDeleted = Film.delete(req.params.id);
  if (!filmDeleted) return res.status(404).end();
  return res.json(filmDeleted);
});

// Update a film : PUT /api/films/:id
router.put("/:id", function (req, res) {
  const filmUpdated = Film.update(req.params.id, req.body);
  if (!filmUpdated) return res.status(404).end();
  return res.json(filmUpdated);
});

module.exports = router;
