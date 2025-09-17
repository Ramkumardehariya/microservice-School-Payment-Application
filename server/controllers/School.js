const School = require("../models/school");


exports.createSchool = async(req, res) => {
    try {
        //fetch data
        const {name, description} = req.body;
        // validation
        if(!name || !description){
            return res.status(400).json({
                success: false,
                message: "All fields are mendatory"
            })
        }

        //find out school
        const schoolDetails = await School.findOne({name});
        if(schoolDetails){
            return res.status(400).json({
                success: false,
                message: "School name is required"
            })
        }

        //create school
        const school = await School.create({name, description});

        //return response
        return res.status(500).json({
            success: true,
            message: "School created successfully",
            data:school
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            errors: error.message
        })
    }
}

exports.getSchool = async(req, res) => {
    try {
        // const {schoolId} = req.body;
        const {id} = req.params;

        if(!id){
            return res.status(400).json({
                success: false,
                message: "School id is required"
            })
        }

        const schoolDetails = await School.findById(id);
                                    // .populate("orders").exec();

        return res.status(200).json({
            success: true,
            message: "school fetch successfully",
            data: schoolDetails
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            errors: error.message
        })
    }
}


exports.getAllSchool = async(req, res) => {
    try {
        //find all data
        const allSchoolDetails = await School.find({});
        // .populate("orders");

        //return response
        return res.status(200).json({
            success: true,
            message: "get all details successfully",
            data: allSchoolDetails
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            errors: error.message
        })
    }
}