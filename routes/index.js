const router = require('express').Router();
const authMiddleware = require('../middlewares/auth');
const auth = require('./auth');
const user = require('./user')

router.use('/auth', auth);
router.use('/userlist', authMiddleware)
router.use('/userlist', user)

module.exports = router;