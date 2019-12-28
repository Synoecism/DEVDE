const mongoose = require('mongoose')

const ProductionSchema = new mongoose.Schema({
    title : {
        type: String,
        required: true
    },
    start_date : {
        type: Date,
        required: true
    },
    end_date : {
        type: Date,
        required: true
    },
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
    }
    ],
    holds: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'hold'
        }
    ],
    reservations: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'reservation'
        }
    ],
    settings: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'setting'
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

module.exports = Production = mongoose.model('production',ProductionSchema)