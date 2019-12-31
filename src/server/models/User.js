const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    okta_id : {
        type: String,
        required: true
    },
    createdAt: {
        date: String,
        user: String
    }
})

module.exports = User = mongoose.model('user',UserSchema)