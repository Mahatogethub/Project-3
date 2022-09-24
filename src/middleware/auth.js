const jwt=require("jsonwebtoken")

const authentication=function(req,res,next){
    try{
        let Headers=req.headers
        let token =Headers["x-api-token"];
        // if(Object.keys(req.body).length==0){
        //     return res.status(400).send({status:false,message:"Headers must be present"})
        // }
        //let token =Headers["x-token-key"];
        if(!token){
            return res.status(404).send({status:false,message:"token must be present"});
        }
        let decodedToken=jwt.verify(token,"functionUp");
        if(!decodedToken){
            return res.status(401).send({status:false,message:"Invalid token"});
        }
        
      req.logginedInUser=decodedToken.userId;
      next();
     }
    catch(err){
        return res.status(500).send({message:"server error",error:err});
    }
}

module.exports={authentication}