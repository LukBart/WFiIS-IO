const mongoose = require('mongoose')

const UserExperienceSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    level: {
        type: Number,
        required: true,
    },
    experience:
    {
        type: Number,
        required: true,
    }
})

const UserExperience = mongoose.model('UserExperience', UserExperienceSchema)

module.exports = UserExperience