const mongoose=require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId


const bookModel=new mongoose.Schema(
    { 
        title: {
            type:string, 
            required:true, 
            unique:true
        },
        excerpt: {
            type:string, 
            required:true}, 
        userId: {
            type:ObjectId,
            ref:"user",
            required:true,
        },
        ISBN: {
            type:string, 
            required:true,
             unique:true
            },
        category: {
            type:string,
             required:true
            },
        subcategory:{
           type:[string], 
           required:true
        } ,
        reviews: {
            type:Number, 
            default: 0, 
            comment:String},
        deletedAt: Date, 
        isDeleted: {
            type:boolean,
             default: false
            },
        releasedAt: {
            type:Date,
            required:true, 
            // format("YYYY-MM-DD")
        },
        
      },{timestamps:true}



)
module.exports = mongoose.model("book", bookModel)