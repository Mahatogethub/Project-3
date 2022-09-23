const express=require('express')
const router=express.Router()
const userController=require("../controller/userController")
const bookController=require("../controller/bookController")

router.post("/register",userController.signUp)
router.post("/login",userController.loginUser)
router.get("/get",bookController.getBooks)
router.get("/demo/:name",function(req,res){
    const a=req.params.name
    console.log(a)
    res.send("done")
})






module.exports = router;