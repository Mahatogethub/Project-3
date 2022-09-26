const jwt = require("jsonwebtoken")
const bookModel = require("../model/bookModel")
const mongoose=require("mongoose")
ObjectId = mongoose.Types.ObjectId

// authontication
const authenticate = function (req, res, next) {
    try {
        let token = req.headers["x-api-key"]

        if (!token) return res.status(401).send({ status: false, msg: "Token must be present" })

        jwt.verify(token, "functionUp",
            (error, response) => {
                if (error) {
                    return res.status(400).send({ status: false, msg: error });
                }
                req["decodedToken"] = response.userId
                next()
            })
    }
    catch (error) {
        res.status(500).send({ msg: error.message })
    }
}
// create book authorization
const auth = function (req, res, next) {
    const userId = req.body.userId
    if (!userId) return res.status(400).send({ status: false, message: "userId not present in the body" })
   
    if (userId !== req["decodedToken"]) return res.status(400).send({ status: false, message: "you are not able to do this task" })
    next()
}


// authorization
const authorization = async function (req, res, next) {
    try {
        // const bookId=req.body.bookId
        const bookIdpath = req.params.bookId

        // if(bookId) {
        //     const data=await bookModel.findOne({_id:bookId}).select({userId:1})
        //     if(!data) return res.status(400).send({statas:false,message:"unauthorize operation"})
        //     if(data.userId.toString()!==req["decodedToken"]) 
        //     return res.status(401).send({status:false,message:"Unauthorize access"}) 
        //     else
        //    return next()
        // }
    
        if (bookIdpath) {
            if(!ObjectId.isValid(bookIdpath)) return res.status(400).send({status:false,message:"book is not a objectId"})
            const data = await bookModel.findById(bookIdpath).select({ userId: 1 })

            if (!data) return res.status(400).send("unauthorize operation")

            if (data.userId.toString() !== req["decodedToken"])
                return res.status(401).send({ status: false, message: "Unauthorize access" })
            else
                return next()
        }
        return res.statas(400).send({ stataus: false, message: "didn't get book" })
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}



module.exports = { authenticate, auth, authorization }