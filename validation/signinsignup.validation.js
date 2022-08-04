const { check } = require('express-validator');
const signupModel = require('../models/signup.model')


exports.signup_validator = () => {
  return [
    check('password')
    .isLength({ min: 5 })
    .withMessage('must be at least 5 chars long')
    .matches(/\d/)
    .withMessage('must contain a number'),
    check('email').isEmail().withMessage('Invalid Email'),
    check('name').isLength({max: 5}).withMessage("'Name' Lenght mus be less then 5")
  ]
}

exports.signin_validator = () => {
  return [
    check('password')
    .isLength({ min: 5 })
    .withMessage('must be at least 5 chars long')
    .matches(/\d/)
    .withMessage('must contain a number'),
     check('email')
    .custom( async (email, { req })=>{
     const password = req.body.password
    //  MongoDB
     const result = await signupModel.findOne({email},
                     {__v:false,password:false});
      if(!result){ throw new Error(">>>>>>>>Invalid Email"); }
      
      req.body.userInfo = result;

      return true
    }),
  ]
}