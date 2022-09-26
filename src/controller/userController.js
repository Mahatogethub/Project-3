const jwt=require("jsonwebtoken")
const userSchema=require("../model/userModel")

const {valid}=require("./validation")


//============================================== register user =====================================

const signUp=async function(req,res){
   try{
   const  reqData=req.body

   
   if(!valid.body(reqData)) return res.status(400).send({
    status:false,message:"enter data in body"
   })
   

   // title
   if(!reqData.title) return res.status(400).send({
    status:false,message:"title is mendatory"
   })
    
    if(!valid.titleValid(reqData.title)) return res.status(400).send({
    status:false,message:"enter title among [Mr, Mrs, Miss]"
   })
 
   // name
   if(!reqData.name) return res.status(400).send({
    status:false,message:"name is mendatory"
   })
    if(!valid.name(reqData.name)) return res.status(400).send({
    status:false,message:"enter valid name"
   })

   // mobile
   if(!reqData.phone) return res.status(400).send({
    status:false,message:"mobile is mendatory"
   })
    if(!valid.mobile(reqData.phone)) return res.status(400).send({
    status:false,message:"enter valid phone number"
   })
   const getMobile=await userSchema.findOne({phone:reqData.phone})
 if(getMobile) return res.status(400).send({status:false,messege:"enter new number "})

 // email
 if(!reqData.email) return res.status(400).send({
  status:false,message:"email is mendatory"
 })
  if( !valid.email(reqData.email)) return res.status(400).send({
    status:false,message:"enter valid eamil"
   })
   const getEmail=await userSchema.findOne({email:reqData.email})
 if(getEmail) return res.status(400).send({status:false,messege:"enter new email "})

 // password
 if(!reqData.password) return res.status(400).send({
  status:false,message:"password is mendatory"
 })
 if(!valid.password(reqData.password)) return res.status(400).send({
    status:false,message:"enter valid password"
   })

   // address street
if(reqData.address.street){
    if(!valid.address(reqData.address.street)) return res.status(400).send({
        status:false,message:"enter street in string"
      })
}

// address city
if(reqData.address.city){
    if(!valid.address(reqData.address.city)) return res.status(400).send({
        status:false,message:"enter valid city name"
      })
}

// address pincode
if(reqData.address.pincode){
    if(!valid.pincode(reqData.address.pincode)) return res.status(400).send({
        status:false,message:"enter valid pincode"
      })
}

// now register and responce
   const output=await userSchema.create(reqData)
   res.status(201).send({ status: true,message: 'Success',data: output})
}catch(error){
  res.status(500).send({status:false,message: error.messege})
}
}



//================================== login user ==================================================

const loginUser=async function(req,res){
  try{
   // get data from body
  const userEmail=req.body.email;
  const passWord=req.body.password;

  // there is any data in body or not
  if(Object.keys(req.body).length==0) return res.status(400).send({status:false,msg:"body should not be empty"})

  // email
  if(!userEmail) return  res.status(400).send({status:false,message:"please provid email"})
  if(!valid.email(userEmail)) return res.status(400).send({ststus:false,message:"please provide email in valid format"})

  // password
  if(!passWord) return  res.status(400).send({status:false,message:"please provid password"})
  if(!valid.password(passWord)) return res.satatus(400).send({status:false,message:"please provide password in valid format "})

  const user=await userSchema.findOne({email:userEmail})
  if(!user) return res.status(400).send({status:false,message:"Please provide valid email"})

  const getPassword=await userSchema.findOne({password:passWord})
  if(!getPassword) return res.status(400).send({status:false,message:"Please provide correct password"})
  
//Token creation   
  const token=jwt.sign({
      userId:user._id,
      exp: Math.floor(Date.now() / 1000) + (100*60*60)
  },
    "functionUp"
  )
  let Token = token
  res.setHeader("x-api-token",token)
  let decodedToken=jwt.verify(Token, "functionUp")

return res.status(200).send({status:true,data:token,decodedToken})
}
catch(err){
  res.status(500).send({message:"server error",error:err.message})
}
}

module.exports.loginUser=loginUser
module.exports.signUp=signUp

