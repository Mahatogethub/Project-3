const express=require('express')
const aws=require("aws-sdk")
const userController=require("../controller/userController")
const bookController=require("../controller/bookController")
const reviewController=require("../controller/reviewController")
const {authenticate,authorization}=require("../middleware/mid")
const router=express.Router()




router.get("/demo/:name",function(req,res){
    const a=req.params.name
    console.log(a)
    res.send("done")
})

// start api 

// signup user
router.post("/register",userController.signUp)

// log in user
router.post("/login",userController.loginUser)

// create book
router.post("/books",authenticate,bookController.createBook)

// get book
router.get("/books",authenticate,bookController.getBooks)

// get get with params 
router.get("/books/:bookId",authenticate,bookController.getBooksByParam)

// update book
router.put("/books/:bookId",authenticate,authorization,bookController.updateBook)

// delete book
router.delete("/books/:bookId",authenticate,authorization,bookController.DeleteBook)

// create review
router.post("/books/:bookId/review",reviewController.createReview)

// update review
router.put("/books/:bookId/review/:reviewId",reviewController.updateReview)

// delete review
router.delete("/books/:bookId/review/:reviewId",reviewController.deleteReview)

aws.config.update({
    accessKeyId: "AKIAY3L35MCRZNIRGT6N",
    secretAccessKey: "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",
    region: "ap-south-1"
})

let uploadFile= async ( file) =>{
   return new Promise( function(resolve, reject) {
    // this function will upload file to aws and return the link
    let s3= new aws.S3({apiVersion: '2006-03-01'}); // we will be using the s3 service of aws

    var uploadParams= {
        ACL: "public-read",
        Bucket: "classroom-training-bucket",  //HERE
        Key: "abc/" + file.originalname, //HERE 
        Body: file.buffer
    }


    s3.upload( uploadParams, function (err, data ){
        if(err) {
            return reject({"error": err})
        }
        console.log(data)
        console.log("file uploaded succesfully")
        return resolve(data.Location)
    })

    // let data= await s3.upload( uploadParams)
    // if( data) return data.Location
    // else return "there is an error"

   })
}

router.post("/write-file-aws", async function(req, res){

    try{
        let files= req.files
        console.log(files);
        if(files && files.length>0){
            //upload to s3 and get the uploaded link
            // res.send the link back to frontend/postman
            let uploadedFileURL= await uploadFile( files[0] )
            res.status(201).send({msg: "file uploaded succesfully", data: uploadedFileURL})
        }
        else{
            res.status(400).send({ msg: "No file found" })
        }
        
    }
    catch(err){
        res.status(500).send({msg: err})
    }
    
})

// for random request
router.all("/**", function (req, res) {         
    res.status(400).send({
        status: false,
        msg: "The api you request is not available"
    })
})



module.exports = router;