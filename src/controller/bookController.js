const mongoose=require('mongoose')
const bookModel=require('../model/bookModel')
const userModel = require('../model/userModel')
const ObjectId=mongoose.Types.ObjectId


const createBook=async function(req,res){
try{
        const data=req.body
        
        //CHECKING EDGE CASES IF AT THE TIME OF INPUT SOME FIELD IS MISSING//

        if(Object.keys(req.body).length==0) return res.status(400).send({status:false,msg:"body should not be empty"})
        if(!data.title) return res.status(400).send({status:false,msg:"title is mandetory"})
        if(!data.excerpt) return res.status(400).send({status:false,msg:"excerpt is mandetory"})
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
        if(bookbytitle) return res.status(400).send({status:false,msg:"title is already exist give another id"})

        const bookbyisbn=await bookModel.findOne({ISBN:data.ISBN})
        if(bookbyisbn) return res.status(400).send({status:false,msg:"ISBN is already exist give Unique ISBN"})

        const createBook=await bookModel.create(data)
        return res.status(201).send({status:true,msg:"successfully created",data:createBook})


}
catch(error){
    return res.status(500).send({status:false,msg:error.message})

}
}


module.exports.createBook=createBook