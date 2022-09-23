const bookModel=require('../model/bookModel')

const getBooks=async function(req,res){
    try{
        //InAlphabital=req.
    obj={isDeleted:false}
   const {userId,category,subcategory}=req.query
   
   if(userId){obj.userId=userId}
   //if(!bookId){return res.status(400).send({status:false,message:""})}
   if(category){obj.category=category}
   if(subcategory){obj.subcategory=subcategory}
  // arr = elements.sort((a, b) => a.localeCompare(b));
  let showData=await bookModel.find(obj)
  if(showData.length=0){ 
    return res.status(400).send({status:false,message:"Please provide filter"})
  }
  return res.status(200).send({status:true,message:showData})
}
  catch(err){
    return res.status(500).send({status:false,message:err.message})
  }
}

module.exports.getBooks=getBooks