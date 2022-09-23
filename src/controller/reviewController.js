const reviewModel = require('../model/reviewModel')
const mongoose = require("mongoose")
const bookModel = require('../model/bookModel')
const { valid } = require("./validation")
const ObjectId = mongoose.Types.ObjectId


const createReview = async function (req, res) {

    try {
        if (Object.keys(req.body).length == 0) return res.status(400).send({ status: false, msg: "body should not be empty" })
        const bookId = req.params.bookId || req.body.bookId
        if (!bookId) return res.status(400).send({ status: false, message: "bookId is required through path params or body" })
        if (!ObjectId.isValid(bookId)) return res.status(400).send({ status: false, message: "Given bookId is not an Object type" })
        const bookByBookId = await bookModel.findOne({ _id: bookId })
        if (!bookByBookId) return res.status(404).send({ staus: false, message: "no such book exist with this Id" })

        if (bookByBookId.isDeleted == true) return res.status(400).send({ status: false, message: "you can't able to make review of a deleted book" })

        if (!req.body.reviewedBy) return res.status(400).send({ status: false, message: "reviewedBy this field is mandetory" })
        if (!valid.name(req.body.reviewedBy)) return res.status(400).send({ status: false, message: "please provide valid name" })

        if (!req.body.reviewedAt) return res.status(400).send({ status: false, message: "reviewedAt this field is mandetory" })
        if (!valid.date(req.body.reviewedAt)) return res.status(400).send({ status: false, message: "please provide valid date formet should be 'yyyy-mm-dd'" })

        if (!req.body.rating) return res.status(400).send({ status: false, message: "rating this field is mandetory" })
        if (!valid.rating(req.body.rating)) return res.status(400).send({ status: false, message: "please provide rating min 1 and max 5" })

        if (req.body.review) {
            if (!valid.name(req.body.review)) return res.status(400).send({ status: false, message: "please provide review in string in breif" })
        }
        const createdReview = await reviewModel.create(req.body)
        if (createdReview) {
            const updatedBook = await bookModel.findOneAndUpdate({ _id: bookId }, { $inc: { reviews: 1 } }, { new: true })
            return res.status(400).send({ status: true, message: "success", data: updatedBook })

        }

    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })

    }
}


// update review

const updateReview = async function (req, res) {
    try {
        const bookId = req.params.bookId
        const reviewId = req.params.reviewId
        const data = req.body
        if (!bookId) return res.status(400).send({ status: false, msg: "bookId is required through path params" })

        if (!reviewId) return res.status(400).send({ status: false, msg: "reviewId is required through path params" })

        const bookByBookId = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!bookByBookId) return res.status(404).send({ staus: false, msg: "no such book exist with this Id" })

        const ReviewByReviewId = await bookModel.findOne({ _id: reviewId, isDeleted: false })
        if (!ReviewByReviewId) return res.status(404).send({ staus: false, msg: "no such review exist with this ReviewId" })

        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "body should not be empty" })

        const alreadyReviewed = await reviewModel.findOne({ bookId: bookId })

        if (!alreadyReviewed) return res.status(400).send({ status: false, message: "no review is found by you to update, first make a review than update" })

        const updatedReview = await reviewModel.findOneAndUpdate({ bookId: bookId, isDeleted: false }, { $set: data }, { new: true })

        const allReview = await reviewModel.find({ bookId: bookId })

        const bookdata = await bookModel.findOne({ _id: bookId })

        bookdata.reviewsData = allReview

        return res.status(200).send({ status: true, message: "book list", data: bookdata })
    }
    catch (error) {
        return res.status(500).send({ status: false, msg: error.message })

    }
}

// delete review

const deleteReview = async function (req, res) {
    try {
        const bookId = req.params.bookId
        const reviewId = req.params.reviewId
        if (!bookId) return res.status(400).send({ status: false, msg: "bookId is required through path params" })

        if (!reviewId) return res.status(400).send({ status: false, msg: "reviewId is required through path params" })

        const bookByBookId = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!bookByBookId) return res.status(404).send({ staus: false, msg: "no such book exist with this Id or it is deleted" })

        const ReviewByReviewId = await bookModel.findOne({ _id: reviewId, isDeleted: false })
        if (!ReviewByReviewId) return res.status(404).send({ staus: false, msg: "no such review exist with this ReviewId or it is deleted" })

        const alreadyReviewed = await reviewModel.findOne({ bookId: bookId })

        if (!alreadyReviewed) return res.status(400).send({ status: false, message: "no review is found by you to update, first make a review than update" })

        const updatedReview = await reviewModel.findOneAndUpdate({ bookId: bookId, isDeleted: false }, { $set: { isDeleted: true } }, { new: true })

        const bookdata = await bookModel.findOneAndUpdate({ _id: bookId }, { $inc: { reviews: -1 } }, { new: true })

        return res.status(200).send({ status: true, message: "successfully deleted", data: bookdata })
    }
    catch (error) {
        return res.status(500).send({ status: false, msg: error.message })

    }
}


module.exports.createReview = createReview
module.exports.updateReview = updateReview
module.exports.deleteReview = deleteReview