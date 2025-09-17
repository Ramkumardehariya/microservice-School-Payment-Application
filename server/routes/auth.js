const express = require("express");
const { signup, login, verifyToken } = require("../controllers/Auth");
const { validateBody, signupSchema } = require("../midlewares/validation");
const {auth} = require("../midlewares/auth");

const router = express.Router();


router.post('/signup', validateBody(signupSchema), signup);
router.post('/login', login);
router.get('/verify-token', auth, verifyToken);

module.exports = router;