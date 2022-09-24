const mongoose = require('mongoose')
const bookModel = require('../model/bookModel')
const userModel = require('../model/userModel')
const { valid } = require("./validation")
const reviewModel = require("../model/reviewModel")
const ObjectId = mongoose.Types.ObjectId

// ================================================ create book ==========================================
const createBook = async function (req, res) {
    try {
        const data = req.body

        //CHECKING EDGE CASES IF AT THE TIME OF INPUT SOME FIELD IS MISSING//

        if (Object.keys(req.body).length == 0) return res.status(400).send({ status: false, message: "body should not be empty" })
        if (!data.title.trim()) return res.status(400).send({ status: false, message: "title is mandetory" })
        if (!data.excerpt.trim()) return res.status(400).send({ status: false, message: "excerpt is mandetory" })
        if (!data.userId) return res.status(400).send({ status: false, message: "userId is mandetory" })
        if (!ObjectId.isValid(data.userId)) return res.status(400).send({ status: false, message: "userId is not object type" })
        if (!data.ISBN) return res.status(400).send({ status: false, message: "ISBN is mandetory" })
        if (!valid.isbn(isbn)) return res.status(400).send({ status: false, message: "please provide valid ISBN number" })
        if (!data.category) return res.status(400).send({ status: false, message: "category is mandetory" })
        if (!data.subcategory) return res.status(400).send({ status: false, message: "subcategory is mandetory" })
        if (!data.releasedAt) return res.status(400).send({ status: false, message: "releasedAt is mandetory" })

        const userId = data.userId

        //USER ID VALIDATION CHECKING//

        if (!ObjectId.isValid(userId)) return res.status(400).send({ status: false, message: "Given userId is not an Object type" })


        const createData = await userModel.findOne({ _id: userId })
        if (!createData) return res.status(400).send({ status: false, message: "UserId is not present" })

        const bookbytitle = await bookModel.findOne({ title: data.title })
        if (bookbytitle) return res.status(400).send({ status: false, message: "title is already exist give another title" })


        const bookbyisbn = await bookModel.findOne({ ISBN: data.ISBN })
        if (bookbyisbn) return res.status(400).send({ status: false, message: "ISBN is already exist give Unique ISBN" })

        const createBook = await bookModel.create(data)
        return res.status(201).send({ status: true, message: "successfully created", data: createBook })


    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })

    }
}

// ============================================= get book ============================
const getBooks = async function (req, res) {
    try {
        //InAlphabital=req.
        let obj = { isDeleted: false }
        let b = Object.keys(req.query).length
        let count = 0
        const { userId, category, subcategory } = req.query

        if (userId) count++
        if (category) count++
        if (subcategory) count++
        if (count != b) return res.status(400).send({ status: false, message: "please provide valid data" })
        if (userId) {
            if (!ObjectId.isValid(userId)) return res.status(400).res({ status: false, messege: "please provide valid userId" })
        }
        if (userId) { obj.userId = userId }
        //if(!bookId){return res.status(400).send({status:false,message:""})}
        if (category) { obj.category = category }
        if (subcategory) { obj.subcategory = subcategory }
        // arr = elements.sort((a, b) => a.localeCompare(b));

        let showData = await bookModel.find(obj).select({ title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 })
        if (showData.length == 0) {
            return res.status(400).send({ status: false, message: "data not found" })
        }

        // sorting the list of book base is title
        showData.sort((e1, e2) => {
            if (e1.title > e2.title) return 1
            else return -1
        })
        return res.status(200).send({ status: true, message: "list book", data: showData })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


// ============================================== get book by params ============================
const getBooksByParam = async function (req, res) {
    try {
        let bookId = req.params.bookId
        if (!ObjectId.isValid(bookId)) return res.status(400).send({ status: false, message: "Given bookId is not an Object type" })
        if (!bookId) return res.status(400).send({ status: false, message: "enter bookId in path params" })

        const bookByBookId = await bookModel.findById(bookId)
        if (!bookByBookId) return res.status(404).send({ staus: false, message: "no such book exist with this Id" })
        if (bookByBookId.isDeleted == true) return res.status(404).send({ status: false, message: "you can't fetch this book because its deleted" })

        const reviewsData = await reviewModel.find({ bookId: bookId })
        let data = { ...bookByBookId["_doc"] }
        data.reviewsData = reviewsData
        return res.status(200).send({ status: true, message: "success", data })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}




// ================================= book update =====================================

const updateBook = async function (req, res) {
    try {
        const data = req.body
        const bookId = req.params.bookId
        if (!ObjectId.isValid(bookId)) return res.status(400).send({ status: false, message: "Given bookId is not an Object type" })

        const bookByBookId = await bookModel.findById(bookId)
        if (!bookByBookId) return res.status(404).send({ staus: false, message: "no such book exist with this Id" })
        if (bookByBookId.isDeleted == true) return res.status(404).send({ status: false, message: "you can't update this book because its deleted" })

        if (!valid.body(req.body)) return res.status(400).send({ status: false, message: "body should not be empty" })

        if (req.body.title) {
            if (!req.body.title.trim()) return res.status(400).send({ status: false, messege: "please enter valid title" })
            const bookbytitle = await bookModel.findOne({ title: data.title })
            if (bookbytitle) return res.status(400).send({ status: false, message: "title is already exist give another title" })
        }
        if (req.body.releasedAt) {
            if (!valid.date(req.body.releasedAt)) return res.status(400).send({ status: false, message: "please provide valid date" })
        }
        if (req.body.excerpt) {
            if (!valid.str(req.body.excerpt)) return res.status(400).send({ status: false, message: "please provide valid excerpt" })
        }

        if (req.body.ISBN) {
            if (!valid.isbn(data.ISBN)) return res.status(400).send({ status: false, messege: "enter valid ISBN" })
            const bookbyisbn = await bookModel.findOne({ ISBN: data.ISBN })
            if (bookbyisbn) return res.status(400).send({ status: false, message: "ISBN is already exist give Unique ISBN" })
        }
        if (req.body.title || req.body.excerpt || req.body.releasedAt || req.body.ISBN) {
            const updatedData = await bookModel.findOneAndUpdate({ _id: bookId }, { $set: req.body }, { new: true })

            return res.status(200).send({ status: true, message: "success", data: updatedData })
        }
        else
            return res.status(400).send({ status: false, message: "you can update only title,excerpt,releasedAt and ISBN" })


    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }

}


// ===================================================  delete book =====================================


const DeleteBook = async function (req, res) {
    try {
        const bookId = req.params.bookId

        if (!bookId) return res.status(400).send({ status: false, message: "bookId is required through path params or body" })

        if (!ObjectId.isValid(bookId)) return res.status(400).send({ status: false, message: "Given bookId is not an Object type" })

        const bookByBookId = await bookModel.findById(bookId)
        if (!bookByBookId) return res.status(404).send({ staus: false, message: "no such book exist with this Id" })

        if (bookByBookId.isDeleted == true) return res.status(400).send({ status: false, message: "this book is already deleted" })

        await bookModel.findOneAndUpdate({ _id: bookId }, { $set: { isDeleted: true, deletedAt: Date.now() } }, { new: true })

        return res.status(200).send({ status: true, message: "book is deleted successfully" })

    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

module.exports.DeleteBook = DeleteBook
module.exports.updateBook = updateBook
module.exports.createBook = createBook
module.exports.getBooks = getBooks
module.exports.getBooksByParam = getBooksByParam