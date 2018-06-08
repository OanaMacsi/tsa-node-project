let fs = require('fs')
let mongoose = require('mongoose')
let express = require("express");
let bodyParser = require("body-parser")
let morgan = require("morgan")
let moment = require('moment-timezone');
let usersRouter = require("./routes/users");
let daysRouter = require("./routes/days");
let nationalDaysRouter = require("./routes/nationalDays");
let config = require("../config/config");
let User = require("../src/models/userModel");
let DaysOff = require("../src/models/daysOffModel")

let app = express();

morgan.token('date', (req, res, tz) => moment().tz(tz).format())
morgan.token('res', (req, res, field) => res[field])
morgan.token('req', (req, res, field) => JSON.stringify(req[field], null, 2))
morgan.format('dataFormat', '[:date[Europe/Bucharest]] :method ":url" :status :res[statusMessage] - :req[body]')
const stream = fs.createWriteStream('logs/errors.log', { flags: 'a' })
const skip = (req, res) => res.statusCode < 400
app.use(morgan('dataFormat', { skip, stream }))
app.use(bodyParser.json());
app.use("/days", daysRouter);
app.use("/users", usersRouter);
app.use("/nationalDays", nationalDaysRouter);
mongoose.connect(config.mongoUrl, (err, res) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Connected to db");
        mongoose.connection.db.dropDatabase()
        let newUser = new User({
            firstName: "Gigel",
            lastName: "Muratura",
            email: "gigel@mura.ro",
            phone: "0749666000"
        })
        newUser.save((err, user) => {
            if (err) {
                console.log(err);
            }
            let newDaysOff = new DaysOff({
                userId: user._id,
                daysOff: ["2018-02-20","2018-02-21"]
            })
            newDaysOff.save((err, DaysOff) => {
                if (err) {
                    console.log(err);
                }
            });
        });
    }
    
});

app.listen(3000, function () {
    console.log('Server started on localhost:3000')
});

module.exports = app;
