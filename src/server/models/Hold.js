const mongoose = require('mongoose')

const HoldSchema = new mongoose.Schema({
    hotel_name : {
        type: String,
        required: true
    },
    log: {
        type: [String],
        required: true
    },
    isArchived: {
        type: Boolean,
        default: false
    }
})

module.exports = Hold = mongoose.model('hold',HoldSchema)