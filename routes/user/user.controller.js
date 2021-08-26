const User = require('../../models/user')
const auth = require('../auth/controllers');
//GET /api/user/list

exports.list = (req,res) => {
    if(!req.decoded.admin) {
        return res.status(403).json({
            message: 'you are not admin'
        })
    }
    User.find({})
    .then(
        users => {
            res.json({users});
        }
    )
}

exports.assignAdmin = (req, res) => {
    if(!req.decoded.admin) {
        return res.status(403).json({
            message: 'you are not admin'
        })
    }

    User.findOneByUsername(req.params.username)
    .then(
        user => user.assignAdmin()
    ).then (
        res.json({
            success: true
        })
    )
}

exports.userProfile = (req,res) => {
    username = req.params.username;
    User.findOneByUsername(username)
    .then(
        user => {
            res.json({users})
        }
    )
}