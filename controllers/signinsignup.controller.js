const { generate_token } = require("../utilities/jwt_token");
const { sendMailTo } = require("../utilities/nodeMailer");
const signupModel = require("../models/signup.model");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const saltRounds = 2;

exports.signupController = async (req, res, next) => {

  const db_email = await signupModel.findOne({ email: req.body.email })
  if (db_email) {

    res.send("User Already Exist Please Signin")

  } else {

    const hass = await bcrypt.hash(req.body.password, saltRounds);
    req.body.password = hass

    signupModel(req.body).save(async (err, result) => {
      if (err) {
        next(new Error("Data not saved"));
      }
      //  ----------------------------
      const verifyAccount = generate_token(result._id, `${60 * 15}s`);  //second argument are Lifetime of generated token
      const emailLink = `http://localhost:1616/verify-account?token=${verifyAccount}`;



      // *********<this function is used for sending email>************//

      const emailStatus = await sendMailTo(
        ["rajendrayadav900500@gmail.com"],
        emailLink
      );
      // ---------------------------------
      res.status(200).send({ result, emailStatus });
    })
  }
};

exports.verifyAccountController = (req, res, next) => {

  const { data = "" } = req.body.token;

  // -----------------------------------------
  signupModel.findOne({ _id: data }, async (err, result) => {
    if (err) {
      next(err);
    } else if (result) {
      const updateAccount = await signupModel.findByIdAndUpdate(
        { _id: data },
        { is_Verified: 1 }
      );
      res.send({ status: "Account Verified", updateAccount });
    } else {
      res.send({ status: "Invalid Url" });
    }
  });
  // ------------------------------------------
};


exports.signinController = async (req, res) => {


  const db_email = await signupModel.findOne({ email: req.body.email })
  console.log("db_email", db_email)
  
  const verification = db_email.is_Verified

  if (!verification) {
    res.send({ varify_Status: "you are already signup please verify account" })
    const verifyAccount = generate_token(db_email._id, `${60 * 15}s`);  //second argument are Lifetime of generated token
    const emailLink = `http://localhost:1616/verify-account?token=${verifyAccount}`;
    const emailStatus = await sendMailTo(
      ["rajendrayadav900500@gmail.com"],
      emailLink
    );

  }
  //**********<This function is used for comparing the password from login user and saved password in dataBase >*******************/
  else {
    const match_pass = await bcrypt.compare(req.body.password, db_email.password)
    if (match_pass) {
      const token = generate_token(req.body?.userInfo);

      res.status(200).send({ userInfo: req.body.userInfo, token });

    } else {
      res.status(400).send("Wrong Password")
    }


  }

}

