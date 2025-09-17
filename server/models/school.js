const mongoose = require("mongoose");

const schoolSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    description:{
        type:String,
        required: true,
    },
    order:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order"
    }]
})

module.exports = mongoose.model("School", schoolSchema);