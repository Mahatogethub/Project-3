const express=require('express')
const userController=require("../controller/userController")
const bookController=require("../controller/bookController")
const reviewController=require("../controller/reviewController")
const {auth,authenticate,authorization}=require("../middleware/mid")
const router=express.Router()



router.get("/demo/:name",function(req,res){
    const a=req.params.name
    console.log(a)
    res.send("done")
})


router.post("/register",userController.signUp)
router.post("/login",userController.loginUser)
router.post("/demo2",userController.demo)
router.post("/books", authenticate,auth, bookController.createBook)


router.get("/books",authenticate,bookController.getBooks)
router.put("/books/:bookId",authenticate,authorization,bookController.updateBook)
router.delete("/books/:bookId",authenticate,bookController.DeleteBook)
router.post("/books/:bookId/review",reviewController.createReview)
router.put("/books/:bookId/review/:reviewId",reviewController.updateReview)
router.delete("/books/:bookId/review/:reviewId",reviewController.deleteReview)

router.all("/**", function (req, res) {         
    res.status(400).send({
        status: false,
        msg: "The api you request is not available"
    })
})







module.exports = router;