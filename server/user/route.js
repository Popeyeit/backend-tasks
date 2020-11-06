const express = require('express');
const Joi = require('joi');
const { handleValidate } = require('../helpers/validate');
const path = require('path');
const userRouter = express.Router();
const { checkUniqueEmail, registerUser } = require('./controller');
const registerSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
  name: Joi.string().required(),
});
userRouter.post(
  '/register',
  handleValidate(registerSchema),
  checkUniqueEmail,
  registerUser,
);
module.exports = userRouter;
