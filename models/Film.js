"use strict";
var escape = require("escape-html");

const FILE_PATH = __dirname + "/../data/films.json";

class Film {
  constructor(data) {
    this.id = Film.nextFilmId();
    //escape the title & link in order to protect agains XSS attacks
    this.title = escape(data.title);
    this.duration = data.duration;
    this.budget = data.budget;
    // add protocole if needed to the link
    if (data.link && !data.link.match(/^(http|https)/))
      data.link = "http://" + data.link;
    this.link = escape(data.link);
  }

  static nextFilmId() {
    let filmList = getFilmsListFromFile(FILE_PATH);
    if (filmList.length === 0) return 1;
    return filmList[filmList.length - 1].id + 1;
  }

  save() {
    let filmList = getFilmsListFromFile(FILE_PATH);
    filmList.push(this);
    saveFilmsListToFile(FILE_PATH, filmList);
  }

  static update(id, newData) {
    let filmsList = getFilmsListFromFile(FILE_PATH);
    let index = filmsList.findIndex((film) => film.id == id);
    if (index < 0 || !newData) return;
    //escape the title & link in order to protect agains XSS attacks
    if (newData.title) newData.title = escape(newData.title);
    if (newData.link) newData.link = escape(newData.link);
    //Use the spread operator to shallow copy all existing attributes of a film
    //Then replace some of the existing attributes by the keys/values of newData
    filmsList[index] = { ...filmsList[index], ...newData };
    const filmUpdated = { ...filmsList[index] };
    saveFilmsListToFile(FILE_PATH, filmsList);
    return filmUpdated;
  }

  static get(id) {
    let filmsList = getFilmsListFromFile(FILE_PATH);
    return filmsList.find((film) => film.id == id);
  }

  static get list() {
    return getFilmsListFromFile(FILE_PATH);
  }

  static delete(id) {
    let filmsList = getFilmsListFromFile(FILE_PATH);
    const index = filmsList.findIndex((film) => film.id == id);
    if (index < 0) return;
    const itemRemoved = { ...filmsList[index] };
    // remove the film found at index
    filmsList.splice(index, 1);
    saveFilmsListToFile(FILE_PATH, filmsList);
    return itemRemoved;
  }
}

function getFilmsListFromFile(filePath) {
  const fs = require("fs");
  if (!fs.existsSync(filePath)) return [];
  let filmListRawData = fs.readFileSync(filePath);
  let filmList;
  if (filmListRawData) filmList = JSON.parse(filmListRawData);
  else filmList = [];
  return filmList;
}

function saveFilmsListToFile(filePath, filmList) {
  const fs = require("fs");
  let data = JSON.stringify(filmList);
  fs.writeFileSync(filePath, data);
}

module.exports = Film;
