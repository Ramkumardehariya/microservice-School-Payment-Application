const mongoose = require("mongoose");


const orderStatusSchema = new mongoose.Schema({
    collectId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Order",
        required: true
    },
    orderAmount:{
        type: Number,
        required: true
    },
    transactionAmount:{
        type: Number,
        default: 0
    },
    paymentMode:{
        type: String,
    },
    paymentDetails:{
        type: String,
    },
    bankDetails:{
        type:String,
    },
    bankReference:{
        type: String
    },
    paymentMessage:{
        type:String,
    },
    status:{
        type: String,
        enum: ['pending', 'success', 'failed', 'cancelled'],
        default: 'pending'
    },
    errorMessage:{
        type: String,
    },
    paymentTime:{
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model("OrderStatus", orderStatusSchema);