const mongoose = require('mongoose')
const mongooseHistory = require('mongoose-diff-history/diffHistory')

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
    users: {
        admins : [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user' 
            },
        ],
        accounting : [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user' 
            },
        ],
        basics : [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user' 
            },
        ]
    },
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
    createdAt: {
        date: String,
        user: String
    },
    isArchived: {
        type: Boolean,
        default: false
    }
})

ProductionSchema.plugin(mongooseHistory.plugin);

module.exports = Production = mongoose.model('Production',ProductionSchema)