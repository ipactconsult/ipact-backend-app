const router = require("express").Router();
const nodemailer = require('nodemailer');
router.post('/send', async (req,res,next)=>{

  const {name, email, message, formType} = req.body;
  console.log(req.body);
  
    let smtpTransport = nodemailer.createTransport({
        service:"gmail",
        port :587,
        secure: false,
        auth : {
            user : "oueslatikarim77@gmail.com",
            pass : 'fasattqbgpzgskof',
        }, tls: {
            rejectUnauthorized: false
          }
    });

    let mailOptions = {
        from : `${email}`,
        to :'oueslatikarim77@gmail.com',
        subject: `Message from ${name}`,
        html : `
            <p>From : ${email}</p>
            <p>${message}</p>
            <p>${formType}</p>
        `
    }

smtpTransport.sendEMail = function (mailRequest) {
  return new Promise(function (resolve, reject) {
    transporter.sendMail(mailRequest, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve("The message was sent!");
      }
    });
  });
}
////fasattqbgpzgskof

smtpTransport.sendMail(mailOptions)
    .then(function (email_address) {
        res.status(200).json({ success: true, msg: 'Mail sent' });
    }).catch(function (exception) {
        res.status(200).json({ success: false, msg: exception });
    });
    smtpTransport.close();

});

module.exports = router;

