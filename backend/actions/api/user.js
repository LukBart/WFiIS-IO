const User = require('../../db/models/user')

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


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
            /*const token = jwt.sign({ username: user.username, password: user.password }, 'hehexd')*/
            return res.status(201).json({ status: 'ok', user: user.username })
        } else {
            return res.status(422).json({ status: 'error', user: false })
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
    }
}