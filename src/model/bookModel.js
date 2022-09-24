const mongoose=require("mongoose")
const moment=require("moment")
const ObjectId = mongoose.Schema.Types.ObjectId


const bookModel=new mongoose.Schema(
    { 
        title: {
            type:String, 
            required:true, 
            unique:true
        },
        excerpt: {
            type:String, 
            required:true}, 
        userId: {
            type:ObjectId,
            ref:"user",
            required:true,
        },
        ISBN: {
            type:String, 
            required:true,
             unique:true
            },
        category: {
            type:String,
             required:true
            },
        subcategory:{
           type:[String], 
           required:true
        } ,
        reviews: {
            type:Number, 
            default: 0, 
            },
        deletedAt: Date, 
        isDeleted: {
            type:Boolean,
             default: false
            },
        releasedAt: {
            type:Date,
            required:true, // format("YYYY-MM-DD")
            
        },
        
      },{timestamps:true}



)
module.exports = mongoose.model("book", bookModel)