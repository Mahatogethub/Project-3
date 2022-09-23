const mongoose=require('mongoose')
const bookModel=require('../model/bookModel')
const userModel = require('../model/userModel')
const {valid}=require("./validation")
const ObjectId=mongoose.Types.ObjectId


const createBook=async function(req,res){
try{
        const data=req.body
        
        //CHECKING EDGE CASES IF AT THE TIME OF INPUT SOME FIELD IS MISSING//

        if(Object.keys(req.body).length==0) return res.status(400).send({status:false,msg:"body should not be empty"})
        if(!data.title.trim()) return res.status(400).send({status:false,msg:"title is mandetory"})
        if(!data.excerpt.trim()) return res.status(400).send({status:false,msg:"excerpt is mandetory"})
        if(!data.userId) return res.status(400).send({status:false,msg:"userId is mandetory"})
        if(!data.ISBN) return res.status(400).send({status:false,msg:"ISBN is mandetory"})
        if(!data.category) return res.status(400).send({status:false,msg:"category is mandetory"})
        if(!data.subcategory) return res.status(400).send({status:false,msg:"subcategory is mandetory"})
        if(!data.releasedAt) return res.status(400).send({status:false,msg:"releasedAt is mandetory"})
        
        const userId=data.userId
        
        //USER ID VALIDATION CHECKING//
        
        if(!ObjectId.isValid(userId)) return res.status(400).send({status:false,msg:"Given userId is not an Object type"}) 
        
        
        const createData=await userModel.findOne({_id:userId})
        if(!createData) return res.status(400).send({status:false,msg:"UserId is not present"})

        const bookbytitle=await bookModel.findOne({title:data.title})
        if(bookbytitle) return res.status(400).send({status:false,msg:"title is already exist give another title"})
        
        
        const bookbyisbn=await bookModel.findOne({ISBN:data.ISBN})
        if(bookbyisbn) return res.status(400).send({status:false,msg:"ISBN is already exist give Unique ISBN"})

        const createBook=await bookModel.create(data)
        return res.status(201).send({status:true,msg:"successfully created",data:createBook})


}
catch(error){
    return res.status(500).send({status:false,msg:error.message})

}
}

// get book



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
  let showData=await bookModel.find(obj).select({ title:1, excerpt:1, userId:1, category:1, releasedAt:1, reviews:1})
  if(showData.length==0){ 
    return res.status(400).send({status:false,message:"data not found"})
  }
  return res.status(200).send({status:true,message:"list book" , data:showData})
}
  catch(err){
    return res.status(500).send({status:false,message:err.message})
  }
}




// book update

const updateBook=async function(req,res)
{
   try { 
        const data=req.body
    const bookId=req.params.bookId
    if(!ObjectId.isValid(bookId)) return res.status(400).send({status:false,msg:"Given bookId is not an Object type"}) 

    const bookByBookId=await bookModel.findOne({_id:bookId})
        if(!bookByBookId) return res.status(404).send({staus:false,msg:"no such book exist with this Id"})

    if(!valid.body(req.body)) return res.status(400).send({status:false,msg:"body should not be empty"})
    if(req.body.title)
    {
        const bookbytitle=await bookModel.findOne({title:data.title})
        if(bookbytitle) return res.status(400).send({status:false,msg:"title is already exist give another title"})
    }
    if(req.body.ISBN)
    {
        if(!valid.isbn(data.ISBN)) return  res.status(400).send({status:false,messege:"enter valid ISBN"})
        const bookbyisbn=await bookModel.findOne({ISBN:data.ISBN})
        if(bookbyisbn) return res.status(400).send({status:false,msg:"ISBN is already exist give Unique ISBN"})
    }
    const bookById=await bookModel.findOne({_id:bookId})
    if(bookById.isDeleted==true) return res.status(404).send({status:false,msg:"you can't update this book because its deleted"})
    
    if(req.body.title||req.body.excerpt||req.body.releasedAt||req.body.ISBN)
    {
        const updatedData=await bookModel.findOneAndUpdate({_id:bookId},{$set:req.body},{new:true})
        // const updatedData=await bookModel.findOne({_id:bookId})
        return res.status(200).send({status:true,message:"success",data:updatedData})
    }
    else
    return res.status(400).send({status:false,message:"you can update only title,excerpt,releasedAt and ISBN"})


}
catch(error)
{
    return res.status(500).send({status:false,msg:error.message})
}
    
}


// delete book


const DeleteBook=async function(req,res)
{
    try{
        const bookId=req.params.bookId
        
        if(!bookId) return res.status(400).send({status:false,msg:"bookId is required through path params or body"})
        
        if(!ObjectId.isValid(bookId)) return res.status(400).send({status:false,msg:"Given bookId is not an Object type"})

        const bookByBookId=await bookModel.findOne({_id:bookId})
        if(!bookByBookId) return res.status(404).send({staus:false,msg:"no such book exist with this Id"}) 
        
        if(bookByBookId.isDeleted==true) return res.status(400).send({status:false,msg:"this book is already deleted"})

        const deletedBook=await bookModel.findAndUpdate({_id:bookId},{$set:{isDeleted:true,deletedAt:today.format()}},{new:true})

        return res.status(200).send({status:true,message:"book is deleted successfully"})



    }
    catch(error){

    }
}

module.exports.DeleteBook=DeleteBook
module.exports.updateBook=updateBook
module.exports.createBook=createBook
module.exports.getBooks=getBooks