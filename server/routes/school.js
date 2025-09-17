const express = require("express");
const { auth, schoolAdmin } = require("../midlewares/auth");
const { createSchool, getSchool, getAllSchool } = require("../controllers/School");
const router = express.Router();


router.post('/createSchool',auth, schoolAdmin, createSchool);
router.get('/getSchool/:id', getSchool);
router.get('/getAllSchool', getAllSchool);
 

module.exports = router;