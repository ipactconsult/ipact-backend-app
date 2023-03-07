const router = require("express").Router();
const Contact = require ('../models/contactModel');
const nodemailer = require('nodemailer');
//Post
router.post('/postcontact', async (req, res, next) => {

    const {name, email, message, formType} = req.body;
    const createdContact = new Contact({
        name,
        email,
        message,
        formType
    });
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
        
    
            <div style="max-width: 700px; margin:auto; border: 5px solid #ddd; padding: 50px 20px; font-size: 110%;">
            <h2 style="text-align: center; text-transform: uppercase;color: blue;">Welcome</h2>
            <p>Message received from ${name}
            </p>

            <p>Form Type:${formType}
            </p>
            
            
            <p target="_blank"
               style="background: darkblue; text-decoration: none; text-color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">
               ${email}
            </p>
            
        
            <p>${message}</p>
        
             
            </div>
            `
}

 

    
        await createdContact.save();
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
        
        smtpTransport.sendMail(mailOptions)
            .then(function (email_address) {
                res.status(200).json({ success: true, msg: 'Mail sent' });
            }).catch(function (exception) {
                res.status(200).json({ success: false, msg: exception });
            });
            smtpTransport.close();





    

    
    
    
     
});

//GET ALL FILES
router.get('/getAllFiles', async (req, res) => {
    try {
      
      const contacts = await Contact.find({});

      
      res.json({contacts: contacts.map(contact => contact.toObject({getters: true}))});
    } catch (error) {
      res.status(400).send('Error while getting list of files. Try again later.');
    }
  });

//GET ALL FILES = SHOW
router.get('/getAllFiles-show', async (req, res) => {
    try {
      const files = await Contact.find({state: "Show"});

      res.send(files);
    } catch (error) {
      res.status(400).send('Error while getting list of files. Try again later.');
    }
  });

//Delete
router.delete ("/deletecontact/:id", async (req, res) =>{
    const id = req.params.id;
    Contact.findByIdAndDelete(id)
        .then(data => {
            if(!data){
                res.status(404).send({ message : `Cannot Delete with id ${id}. Maybe id is wrong`})
            }else{
                res.send({
                    message : "Contact was deleted successfully!"
                })
            }
        })
        .catch(err =>{
            res.status(500).send({
               
  message: "Could not delete Contact with id=" + id
            });
        });
    });

// EDIT
router.put("/updatecontact/:id", async (req, res) => {
    try {
      let {
       fb_link,
       linkedin_link,
          adresse,
          phone,
          email,
          state,
      } = req.body;

      const contactedit = await Contact.findById(req.params.id);

      if (!phone){
          phone = contactedit.phone
      }
      if (!email){
          email = contactedit.email
      }
      if (!state){
          state = contactedit.state
      }

      if (!fb_link){
          fb_link = contactedit.fb_link
      }
      if (!linkedin_link){
        linkedin_link = contactedit.linkedin_link
      }
 if (!adresse){
          adresse = contactedit.adresse
      }

      contactedit.email = email;
      contactedit.phone = phone;
      contactedit.adresse= adresse;
      contactedit.linkedin_link= linkedin_link;
      contactedit.fb_link= fb_link;
      contactedit.state= state;

      const savedabout = await contactedit.save();
      res.json(savedabout);

    } catch (error) {
                res.status(404).send({ msg : `Cannot Update contact`})
    }
  });

module.exports= router;