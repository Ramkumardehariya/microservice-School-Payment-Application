const mongoose = require("mongoose");
const school = require("./school");


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName:{  
        type:String,
        required: true,
    },
    email:{
        type: String, 
        required: true,
        unique: true,
        lowercase: true
    },
    password:{
        type:String,
        required: true,
    },
    role:{
        type: String,
        enum : ['admin', 'schoolAdmin', 'trustee'],
        default: 'trustee'
    },
    schoolId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "School"
    },
    phoneNO:{
        type:Number,
        required: true
    },
    isActive:{
        type: Boolean,
        default: true
    }

},{
    timestamps: true
})

module.exports = mongoose.model("User", userSchema);