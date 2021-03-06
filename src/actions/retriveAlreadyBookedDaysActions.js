const DaysOff = require("../models/daysOffModel")
const User = require("../models/userModel")
const { checkUserExistsInDB } = require("../helpers/helpers");
const findBookedDays = (userId) => {
    return new Promise((resolve, reject) => {
        findDaysOff = DaysOff.find({ userId: userId }, "daysOff", (err, daysOff) => {
            if (err) reject({
                status: 500,
                message: "the error was logged and we’ll be checking it shortly"
            })
            resolve(daysOff)
        })
    })
}

const createArrayOffBookedDaysOff = (allBookedDays) => {
    if (allBookedDays.length === 0) throw {
        status: 404,
        message: "No days booked yet"
    }
    let alreadyBookedDays = []
    for (i of allBookedDays) {
        alreadyBookedDays.push(...i.daysOff)
    }
    return alreadyBookedDays
}

const getAlreadyBookedDays = (userId) => {
    return findBookedDays(userId)
        .then(createArrayOffBookedDaysOff)
       
}

const sendResponse = (request, response, bookedDays) => {
    return new Promise((resolve, reject) => {
        try {
            response.status(200).send({
                bookedDays: bookedDays,
                links: {
                    POST: `http://localhost:3000/days`,
                    DELETE: `http://localhost:3000/days/${
                        request.params.id
                        }`,
                },
            })
            resolve()
        } catch (err) {
            reject({
                status: 500,
                message: "the error was logged and we’ll be checking it shortly"
            })
        }
    })
}

const sendError = (response, err) => {
    console.log(err)
    response.status(err.status).json({ error: err.message })
}

const retriveAlreadyBookedDays = (request, response) => {
    checkUserExistsInDB(request.params.id)
        .then(getAlreadyBookedDays.bind(null, request.params.id))
        .then(sendResponse.bind(null, request, response))
        .catch(sendError.bind(null, response))
}
if (process.env.NODE_ENV === 'dev') {
    module.exports = {
        retriveAlreadyBookedDays,
        findBookedDays,
        getAlreadyBookedDays,
    }
} else {
    module.exports = {
        retriveAlreadyBookedDays,
        getAlreadyBookedDays
    }
}