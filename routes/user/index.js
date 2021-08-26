const router = require('express').Router();
const controller = require('./user.controller')
const authcontroller = require('../auth/controllers')

router.get('/list', controller.list)
router.post('/assignAdmin/:username', controller.assignAdmin);
router.use('/profile:username', authcontroller.tokenverify)
router.get('/profile:username', controller.userProfile)

module.exports = router;