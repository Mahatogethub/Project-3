const express=require('express')
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
router.post("/books/:bookId/review",authenticate,authorization,reviewController.createReview)

// update review
router.put("/books/:bookId/review/:reviewId",authenticate,authorization,reviewController.updateReview)

// delete review
router.delete("/books/:bookId/review/:reviewId",authenticate,authorization,reviewController.deleteReview)

// for random request
router.all("/**", function (req, res) {         
    res.status(400).send({
        status: false,
        msg: "The api you request is not available"
    })
})



module.exports = router;