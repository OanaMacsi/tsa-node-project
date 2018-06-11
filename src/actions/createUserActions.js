const { readFile, writeFile, maxId } = require("../helpers/helpers");
const userSchema = require("../models/userModels");

let createUser = (req, response) => {
  let user = req.body;
  dataValid(user)
    .then(()=>{saveUserToDb();response.status(200).send(user);})
    .catch(err => {
      if(/email_1/.test(err.message))
        response.status(400).send({"message":"Adresa de e-mail deja exista in baza de date"});
    });
};

let dataValid = body => {
  return new Promise((res, rej) => {
    let ok = "";
    if (!/^[a-zA-Z]+$/.test(body.firstName))
      ok += "Ati introdus prenumele gresit" + "\n";
    if (!/^[a-zA-Z]+$/.test(body.lastName))
      ok += "Ati introdus numele gresit" + "\n";
    if (!/^([a-z0-9A-Z])+\@([a-z0-9])+\.([a-z])+$/.test(body.email))
      ok += "Ati introdus emailul gresit" + "\n";
    if (!/^([0]{1})\d{5,9}$/.test(body.phone))
      ok += "Ati introdus gresit numarul de telefon";
    if (ok === "") {
      body.links = {
        GET: `http://localhost:3000/users/${Number(body.id)}`,
        DELETE: `http://localhost:3000/users/${Number(body.id)}`
      };
      res(body);
    }
    else 
    {rej(ok)}
  });
};

let saveUserToDb = body => {
  return new Promise((res, rej) => {
    let newUser = new userSchema(body);
    newUser.save((err, data) => {
      if (err) {
        rej(err);
      } else {
        resolve();
      }
    });
  });
};

if (process.env.NODE_ENV == "dev") {
  module.exports = {
    createUser,
    dataValid,
    checkMail
  };
} else {
  module.exports = {
    createUser
  };
}
