const Joi = require('joi');

const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: 'error',
        message: error.details[0].message
      });
    }
    next();
  };
}; 

const createPaymentSchema = Joi.object({
  schoolId: Joi.string().required(), 
  trusteeId: Joi.string().required(),
  student: Joi.object({
    name: Joi.string().required(),
    id: Joi.string().required(),
    email: Joi.string().email().required()
  }).required(),
  gatewayName: Joi.string().required(),
  orderAmount: Joi.number().min(1).required()
});

const webhookSchema = Joi.object({
  status: Joi.number().required(),
  order_info: Joi.object({
    order_id: Joi.string().required(),
    order_amount: Joi.number().required(),
    transaction_amount: Joi.number().required(),
    gateway: Joi.string().required(),
    bank_reference: Joi.string().required(),
    status: Joi.string().valid('success', 'failed', 'pending').required(),
    payment_mode: Joi.string().required(),
    payemnt_details: Joi.string().required(),
    Payment_message: Joi.string().required(),
    payment_time: Joi.date().required(),
    error_message: Joi.string().allow('', null)
  }).required()
});


const signupSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required().messages({
      "string.empty": "First name is required",
      "string.min": "First name must have at least 2 characters",
    }),
  lastName: Joi.string().min(2).max(50).required().messages({
      "string.empty": "Last name is required",
      "string.min": "Last name must have at least 2 characters",
    }),
  email: Joi.string().email().required().messages({
      "string.email": "Email must be valid",
      "string.empty": "Email is required",
    }),
  password: Joi.string().min(6).max(128).required().messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 6 characters long",
    }),
   confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
   "any.only": "Confirm password must match password",
   "string.empty": "Confirm password is required"
  }),
  role: Joi.string()
    .valid("admin", "schoolAdmin", "trustee")
    .default("trustee"),
  schoolId: Joi.string().optional().pattern(/^[0-9a-fA-F]{24}$/).messages({
      "string.pattern.base": "Invalid schoolId format",
    }),
  phoneNO: Joi.number()
    .required()
    .messages({
      "number.base": "Phone number must be a number",
      "any.required": "Phone number is required",
    }),
  isActive: Joi.boolean().default(true),
});



const schoolSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
      "string.empty": "School name is required",
      "string.min": "School name must be at least 2 characters long",
    }),

  description: Joi.string().min(5).max(500).required().messages({
      "string.empty": "Description is required",
      "string.min": "Description must be at least 5 characters long",
    }),

  order: Joi.array().items(
      Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .messages({ "string.pattern.base": "Invalid Order ID format" })
    )
    .optional(),
});




module.exports = {
  validateBody,
  createPaymentSchema,
  webhookSchema,
  signupSchema,
  schoolSchema
};