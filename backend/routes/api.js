const express = require('express')
const router = express.Router()

const userActions = require('../actions/api/user')

router.post('/register', userActions.register)
router.post('/login', userActions.login)

module.exports = router