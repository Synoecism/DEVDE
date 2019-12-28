const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    type : {
        type: String,
        required: true
    },
    okta_id : {
        type: String,
        required: true
    },
    log: {
        type: [String],
        required: true
    }
})

module.exports = User = mongoose.model('user',UserSchema)