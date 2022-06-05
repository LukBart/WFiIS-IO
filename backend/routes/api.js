const express = require('express')
const router = express.Router()

const userActions = require('../actions/api/user')

router.post('/register', userActions.register)
router.post('/login', userActions.login)
router.post('/createUserData', userActions.createUserData)
router.post('/updateUserData', userActions.updateUserData)
router.post('/getUserData', userActions.getUserData)

module.exports = router