const express=require('express')
const userController=require("../controller/userController")
const router=express.Router()



router.get("/demo/:name",function(req,res){
    const a=req.params.name
    console.log(a)
    res.send("done")
})


router.post("/register",userController.signUp)
router.post("/login",userController.loginUser)
router.post("/demo2",userController.demo)






module.exports = router;