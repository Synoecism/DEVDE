const mongoose = require('mongoose')

const SettingSchema = new mongoose.Schema({
    attributes : [
        {
            key: String,
            value: String
        }
    ],
    log: {
        type: [String],
        required: true
    },
})

module.exports = Setting = mongoose.model('setting',SettingSchema )