const jwt=require("jsonwebtoken")
const userSchema=require("../model/userModel")
const {valid}=require("./validation")
const moment=require("moment")



const signUp=async function(req,res){

   const  reqData=req.body
   if(!valid.body(reqData)) return res.status(400).send({
    status:false,message:"enter data in body"
   })
   

   // title
   if(!reqData.title || !valid.titleValid(reqData.title)) return res.status(400).send({
    status:false,message:"enter title among [Mr, Mrs, Miss]"
   })
 
   // name
   if(!reqData.name || !valid.name(reqData.name)) return res.status(400).send({
    status:false,message:"enter valid name"
   })

   // mobile
   if(!reqData.phone || !valid.mobile(reqData.phone)) return res.status(400).send({
    status:false,message:"enter valid phone number"
   })

   const getMobile=await userSchema.findOne({phone:reqData.phone})
 if(getMobile) return res.status(400).send({status:false,messege:"enter new number "})

 // email
 if(!reqData.email || !valid.email(reqData.email)) return res.status(400).send({
    status:false,message:"enter valid eamil"
   })
   const getEmail=await userSchema.findOne({email:reqData.email})
 if(getEmail) return res.status(400).send({status:false,messege:"enter new email "})

 // password
 if(!reqData.password || !valid.password(reqData.password)) return res.status(400).send({
    status:false,message:"enter valid password"
   })

if(reqData.address.street){
    if(!valid.address(reqData.address.street)) return res.status(400).send({
        status:false,message:"enter street in string"
      })
}
if(reqData.address.city){
    if(!valid.address(reqData.address.city)) return res.status(400).send({
        status:false,message:"enter valid city name"
      })
}
if(reqData.address.pincode){
    if(!valid.pincode(reqData.address.pincode)) return res.status(400).send({
        status:false,message:"enter valid pincode"
      })
}

   const output=await userSchema.create(reqData)
   res.status(201).send({ status: true,message: 'Success',data: output})

}



// login

const loginUser=async function(req,res){
  try{
  const userEmail=req.body.email;
  const passWord=req.body.password;
  if(!req.body) return res.status(400).send({status:false,msg:"body should not be empty"})
  if(!userEmail) return  res.status(400).send({status:false,message:"please provid email"})
  if(!passWord) return  res.status(400).send({status:false,message:"please provid password"})
  const user=await userSchema.findOne({email:userEmail})
  if(!user) return res.status(400).send({status:false,message:"Please provide valid email"})
  const getPassword=await userSchema.findOne({password:passWord})
  if(!getPassword) return res.status(400).send({status:false,message:"Please provide correct password"})
  
//Token creation   
  const token=jwt.sign({
      userId:user._id,
      exp: Math.floor(Date.now() / 1000) + (10*60)
  },
    "functionUp"
  )
return res.status(200).send({status:true,data:token})
}
catch(err){
  res.status(500).send({message:"server error",error:err.message})
}
}
const demo=async function(req,res){
  const token=req.headers["token"]
  console.log(token)
  const data=await jwt.verify(
    token,"functionUp"
  )
  res.send({data:data})
}

module.exports.loginUser=loginUser
module.exports.signUp=signUp
module.exports.demo=demo
