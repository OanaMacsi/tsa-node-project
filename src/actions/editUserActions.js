let User = require("../models/userModel");

const editUserPut = (req, res) => {
    if (Object.keys(req.body).length === 4) {
        User.findByIdAndUpdate(req.params.id, {
                $set: req.body
            }, {
                new: true
            })
            .then(reqValidData.bind(null, req.body, 1))
            .then(sendResponse.bind(null, req, res))
            .catch(err => {
                if (err["status"]) {
                    res.status(err["status"]).json({
                        "message": err["message"]
                    })
                } else {
                    res.status(500).json({
                        serverErrorMessage: "the error was logged and we’ll be checking it shortly"
                    })
                }
            })
    } else {
        res.status(500).json({
            serverErrorMessage: "need more parameters"
        })
    }
}

const editUserPatch = (req, res) => {
    User.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {
            new: true
        })
        .then(reqValidData.bind(null, req.body, 0))
        .then(sendResponse.bind(null, req, res))
        .catch(err => {
            if (err["status"]) {
                res.status(err["status"]).json({
                    "message": err["message"]
                })
            } else {
                res.status(500).json({
                    serverErrorMessage: "the error was logged and we’ll be checking it shortly"
                })
            }
        })
}


let checkMail = (newMail, allMails) => {
    for (let i = 0; i < allMails.length; i++) {
        if (newMail === allMails[i].email) return 1;
    }
    return 0;
};

let reqValidData = (body, putMethod, users) => {
    //putMethod=1 daca aplicam metoda pe put
    //putMethod=0 daca apliam metodaspe patch
    return new Promise((resolve, reject) => {

        let error = "";
        if (body.firstName) {
            if (!/^[a-zA-Z]+$/.test(body.firstName))
                error += "Ati introdus prenumele gresit" + "\n";
        } else if (putMethod) {
            error += "Nu ati introdus niciun prenume. \n"
        }

        if (body.lastName) {
            if (!/^[a-zA-Z]+$/.test(body.lastName))
                error += "Ati introdus numele gresit" + "\n";
        } else if (putMethod) {
            error += "Nu ati introdus niciun nume. \n"
        }

        if (body.email) {

            if (!/^([a-z0-9])+\@([a-z])+\.([a-z])+$/.test(body.email)) {
                error += "Ati introdus emailul gresit" + "\n";
            }

            if (checkMail(body.email, users) === 1) {
                error += "Mailul folosit exista deja in baza de date";
            }
        } else if (putMethod) {
            error += "Nu ati introdus niciun email \n"
        }

        if (body.phone) {
            if (!/^([0]{1})\d{5,9}$/.test(body.phone))
                error += "Ati introdus gresit numarul de telefon";
        } else if (putMethod) {
            error += "Nu ati introdus niciun numar de telefon \n"
        }

        if (error === "") {
            resolve(users);
        } else {
            reject({
                "status": 400,
                "message": error
            })
        }
    })
};

const sendResponse = (req, res, user) => {
    res.status(200).json({
        updatedUser: user,
        links: {
            "GET": req.headers.host + req.originalUrl,
            "PUT": req.headers.host + req.originalUrl,
            "DELETE": req.headers.host + req.originalUrl,
            "POST": req.headers.host + req.baseUrl
        }
    })
}

if (process.env.NODE_ENV == "dev") {
    module.exports = {
        editUserPut,
        editUserPatch,
        reqValidData,
        checkMail
    }
} else {
    module.exports = {
        editUserPut,
        editUserPatch
    }
}