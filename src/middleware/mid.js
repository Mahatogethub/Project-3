const jwt=require("jsonwebtoken")
const bookModel = require("../model/bookModel")

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
                req.decodedToken= response.userId
                next()
            })
    }
    catch (error) {
        res.status(500).send({ msg: error.message })
    }
}
// create book authorization
const auth=function(req,res,next){
    const userId=req.body.userId
    if(!userId) return res.status(400).send({status:false,message:"userId not present in the body"})
    if(!userId==req["decodedToken"].userId) return res.status(400).send({status:false,message:"you are not able to do this task"})
    next()  
}


// authorization
const authorization=async function(req,res,next)
{
    const bookId=req.body.bookId
    const bookIdpath=req.params.bookId

    var decodedToken=req["decodedToken"]

    if(bookId) {
        const data=await bookModel.findOne({_id:bookId}).select({userId:1})
        if(data.userId!==decodedToken.userId) 
        return res.status(401).send({status:false,message:"Unauthorize access"}) 
        else
       return next()
    }
    if(bookIdpath) {
        const data=await bookModel.findOne({_id:bookIdpath}).select({userId:1})
        
    if(!data) return res.status(400).send("unauthorize operation")
    console.log(data.userId,req["decodedToken"].userId)
        if(data.userId!==req["decodedToken"].userId) 
        return res.status(401).send({status:false,message:"Unauthorize access"}) 
        else
       return next()
    }
}



module.exports={authenticate,auth,authorization}