const nodemailer = require('nodemailer');
//const sgTransport = require('nodemailer-sendgrid-transport');
const { google } = require("googleapis");

const clientId = "434313587437-o18cmi86e2m9in0pkiiqa5gt5o7copp9.apps.googleusercontent.com";
const clientSecret = "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";
const refreshToken = "1//040jMpsgRhMgMCgYIARAAGAQSNwF-L9IrF7M5nWgTdmv3gbCV6IwF--aNwe4lM9lKZZiboM3_oyJMQnjtK8FUUIRd_inYcQSq9hg";
const redirectUri = "https://developers.google.com/oauthplayground"


const OAuth2_client = new google.auth.OAuth2(clientId, clientSecret, redirectUri)
OAuth2_client.setCredentials({ refresh_token: refreshToken })

const accessToken = OAuth2_client.getAccessToken()

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: "yadavajay900500@gmail.com",
        //pass: process.env.MAIL_PASSWORD,
        clientId: clientId,
        clientSecret: clientSecret,
        refreshToken: refreshToken
    }
});


exports.sendMailTo = async (emailsArr, link) => {
    var email = {
        to: emailsArr,
        from: 'yadavajay900500@gmail.com', //registered Email on sendgrid
        subject: 'Verify Account',
        text: 'Account Authantication',
        html: `<a href=${link} >
         <button style="color: green"> Verify Account </button>
          </a>`
    };

    const result = new Promise((resolve, reject) => {

        transporter.sendMail(email, function (err, res) {
            if (err) {
                reject(err)
            }
            resolve(res)
        });

    })

    return await result

}




//=================================================================================================
// it is apply on sendGrid 
//  var options = {
//     auth: {
// //       //take it from sendgrid (https://app.sendgrid.com) abhardwaj1@kloudrac.com
//        api_key: "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"
// }



//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// let mailOptions = {
//     from: "yadavajay900500@gmail.com",
//     to: emailsArr,
//     subject: 'verify account',
//     text: 'Hi from your nodemailer project'
// };



// exports.sendMailTo = async (emailsArr, link) => {
//     var email = {
//         to: emailsArr,
//         from: 'yadavajay900500@gmail.com', //registered Email on sendgrid
//         subject: 'Verify Account',
//         text: 'Account Authantication',
//         html: `<a href=${link} >
//          <button style="color: green"> Verify Account </button>
//           </a>`
//     };





// transporter.sendMail(mailOptions, function (err, data) {
//     if (err) {
//         console.log("Error " + err);
//     } else {
//         console.log("Email sent successfully");
//     }
// });
// }



