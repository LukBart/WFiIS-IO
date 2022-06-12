const User = require('../../db/models/user')

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const UserExperience = require('../../db/models/userExperience')
const Polish_Words = require('../../db/models/polishWords')


module.exports = {

    login: async (req, res) => {
        const user = await User.findOne({ username: req.body.username })
        if (!user) {
            return res.status(422).json({ status: 'error', error: 'Invalid username' })
        }
        const isPasswordValid = await bcrypt.compare(
            req.body.password,
            user.password
        )
        if (isPasswordValid) {
            // const token = jwt.sign({ username: user.username }, 'userToken')
            return res.status(201).json({ status: 'ok', user })
        } else {
            return res.status(422).json({ status: 'error', user: null })
        }
    },
    register: async (req, res) => {
        try {
            const password = await bcrypt.hash(req.body.password, 10)
            await User.create({
                username: req.body.username,
                password: password,
            })
            return res.status(201).json({ status: 'ok' })
        } catch (err) {
            return res.status(422).json({ status: 'error', error: err.message })
        }
    },
    createUserData: async (req, res) => {
        try {
            const user = await UserExperience.create({
                username: req.body.username,
                level: req.body.level,
                experience: req.body.experience,
            })
            if (!user) {
                return res.status(422).json({ status: 'error', error: 'Invalid username' })
            }
        }
        catch (err) { }
    },
    updateUserData: async (req, res) => {
        try {
            const user = await UserExperience.findOne({ username: req.body.username });
            user.overwrite({
                username: req.body.username,
                level: req.body.level,
                experience: req.body.experience
            });
            if (user) {
                user.save();
            }

            return res.status(201).json({ status: 'ok' })
        }
        catch (err) { return res.status(422).json({ status: 'error', error: 'Invalid username' }) }
    },
    getUserData: async (req, res) => {
        try {
            const user = await UserExperience.findOne({ username: req.body.username });
            return res.status(201).json({ status: 'ok', user })
        }
        catch (err) { return res.status(422).json({ status: 'error', error: 'Invalid username' }) }
    },
    getPolishWord: async (req, res) => {
        try {
            const word = await Polish_Words.aggregate([{ $sample: { size: req.body.num_of_words } }]);
            return res.status(201).json({ status: 'ok', word })
        }
        catch (err) { return res.status(422).json({ status: 'error', error: 'Error' }) }
    }
}
