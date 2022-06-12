const mongoose = require('mongoose')

const Polish_WordsSchema = new mongoose.Schema({
    word: {
        type: String,
        required: true,
        unique: true,
    },
})

const Polish_Words = mongoose.model('Polish_Words', Polish_WordsSchema)

module.exports = Polish_Words