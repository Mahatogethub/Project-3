const jwt =require("jsonwebtoken")
const userSchema=require("../controller/userController.js")




const loginUser=async function(req,res){
    try{
    const userName=req.body.email;
    const passWord=req.body.password;
    const user=await userSchema.findOne({email:userName})
 //==========================If user doesn't exist and provide invalid email============================================
    if(!user){ 
       return res.status(400).send({status:false,message:"Please provide userName"})
    }
    
    const pw=await userSchema.findOne({password:passWord})
//==========================If password doesn't exist and provide invalid password=======================================
    if(!pw){
       return res.status(400).send({status:false,message:"Please provide password"})
    }
 //=====================================Token creation==================================================================   
    const token=jwt.sign({
        userId:user._id,
        expiresIn: "24h",
        batch:"Project 3",
        organisation:"Group 29"
    },
      "functionUp"
    )
   
  return res.status(200).send({status:true,data:token})
}
catch(err){
    res.status(500).send({message:"server error",error:err})
}
}

module.exports.loginUser=loginUser
module.exports.signUp=signUp