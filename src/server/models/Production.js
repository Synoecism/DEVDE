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
    log: [String]

    //Continue here with all the stuff
})

module.exports = Production = mongoose.model('production',ProductionSchema)