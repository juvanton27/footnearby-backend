"strict mode";
const bcrypt = require("bcrypt");
const saltRounds = 10;
const myPlaintextPassword = "145OkyayNo668Pass";
const FILE_PATH = __dirname + "/../data/users.json";

class User {
  constructor(email, username, password, admin) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.admin = admin;
  }

  /* return a promise with async / await */
  async save() {
    let userList = getUserListFromFile(FILE_PATH);
    const hashedPassword = await bcrypt.hash(this.password, saltRounds);
    console.log("save:", this.email);
    userList.push({
      username: this.username,
      email: this.email,
      password: hashedPassword,
      admin: this.admin,
    });
    saveUserListToFile(FILE_PATH, userList);
    return true;
  }

  /* return a promise with classic promise syntax*/
  checkCredentials(username, password) {
    if (!username || !password) return false;
    let userFound = User.getUserFromList(username);
    console.log("User::checkCredentials:", userFound, " password:", password);
    if (!userFound) return Promise.resolve(false);
    //try {
    console.log("checkCredentials:prior to await");
    // return the promise
    return bcrypt
      .compare(password, userFound.password)
      .then((match) => match)
      .catch((err) => err);
  }

  static get list() {
    let userList = getUserListFromFile(FILE_PATH);
    return userList;
  }

  static isUser(username) {
    const userFound = User.getUserFromList(username);
    console.log("User::isUser:", userFound);
    return userFound !== undefined;
  }
  
  static getUserFromList(username) {
    const userList = getUserListFromFile(FILE_PATH);
    for (let index = 0; index < userList.length; index++) {
      if (userList[index].username === username) return userList[index];
    }
    return;
  }

  static delete(username) {
    let usersList = getUserListFromFile(FILE_PATH);
    const index = usersList.findIndex((user) => user.username == username);
    if (index < 0) return;
    const itemRemoved = { ...usersList[index] };
    // remove the film found at index
    usersList.splice(index, 1);
    saveUserListToFile(FILE_PATH, usersList);
    return itemRemoved;
  }
}

function getUserListFromFile(filePath) {
  const fs = require("fs");
  if (!fs.existsSync(filePath)) return [];
  let userListRawData = fs.readFileSync(filePath);
  let userList;
  if (userListRawData) userList = JSON.parse(userListRawData);
  else userList = [];
  return userList;
}

function saveUserListToFile(filePath, userList) {
  const fs = require("fs");
  let data = JSON.stringify(userList);
  fs.writeFileSync(filePath, data);
}

module.exports = User;
