const mongoose = require("mongoose");


const orderSchema = new mongoose.Schema({
    schoolId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "School",
    },
    trusteeId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    student:{
        name: {
            type: String,
            required: true
        },
        id: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        }
    },
    gatewayName:{
        type: String,
        required: true
    },
    customOrderId:{
        type: String,
        unique: true
    },
    orderAmount:{
        type: Number,
        required: true
    },

},{
    timestamps: true
})

orderSchema.pre('save', async function (next) {
    if(this.isNew && !this.customOrderId){
        const count = await mongoose.model("Order").countDocuments();
        this.customOrderId = `ORD${Date.now()}${count.toString().padStart(6, '0')}`;
    }
    next();
});


module.exports = mongoose.model("Order", orderSchema);