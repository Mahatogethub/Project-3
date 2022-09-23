const express=require('express')
const userController=require("../controller/userController")
const bookController=require("../controller/bookController")
const reviewController=require("../controller/reviewController")
const router=express.Router()
const userController=require("../controller/userController")
const bookController=require("../controller/bookController")



router.get("/demo/:name",function(req,res){
    const a=req.params.name
    console.log(a)
    res.send("done")
})


router.post("/register",userController.signUp)
router.post("/login",userController.loginUser)
router.post("/demo2",userController.demo)
router.post("/books",bookController.createBook)
router.get("/books",bookController.getBooks)
router.put("/books/:bookId",bookController.updateBook)
router.delete("/books/:bookId",bookController.DeleteBook)
router.post("/books/:bookId/review",reviewController.createReview)
router.put("/books/:bookId/review/:reviewId",reviewController.updateReview)
router.delete("/books/:bookId/review/:reviewId",reviewController.deleteReview)







module.exports = router;