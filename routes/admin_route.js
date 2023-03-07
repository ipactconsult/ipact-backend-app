const router = require('express').Router()
const Admin= require('../models/adminModel');
const auth = require ('../middleware/auth');
const bcrypt = require('bcryptjs');
const jwt = require ('jsonwebtoken');
const nodemailer = require('nodemailer');
const  _ = require('lodash');
const transporter = nodemailer.createTransport ({ 
    service :'gmail',
    port:587,
    secure:false,
    requireTLS:true,
    auth:{
        user: "ipact2021@gmail.com",
        pass: "xvrlclpmqdqdjnwg",
    }
});
const cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: "dl0o9l8xz",
    api_key: "241258522581488",
    api_secret: "lWWXDxogVgYPerfCYm84SM7shC0"
});


router.post('/destroy', (req, res) =>{
    try {
        const {public_id} = req.body;
        if(!public_id) return res.status(400).json({msg: 'No images Selected'})

        cloudinary.v2.uploader.destroy(public_id, async(err, result) =>{
            if(err) throw err;

            res.json({msg: "Deleted Image"})
        })

    } catch (err) {
        return res.status(500).json({msg: err.message})
    }

})
//Register admin
router.post("/register", async (req, res) => {
    try{
      const {firstname,lastname, email, password, passwordVerify } = req.body;
      const admin = await Admin.findOne({email})
              if (admin) return res.status(400).json({msg: "This email already exists."})
        const token = jwt.sign({firstname,lastname,email,password,passwordVerify}, process.env.JWT_ACC_ACTIVATE,{expiresIn: '10m'})   
        const options = {
            from :'ipact2021@gmail.com',
            to: email,
            subject: 'Account Activation Link',
            html: `
            <div style="max-width: 700px; margin:auto; border: 5px solid #ddd; padding: 50px 20px; font-size: 110%;">
            <h2 style="text-align: center; text-transform: uppercase;color: blue;">Welcome to I-PACT website.</h2>
            <p>Congratulations! 
                Just click the button below to validate your email address.
            </p>
            
            
            <a href="${process.env.ADMIN_URL}/authenticate/activate/${token}"
               target="_blank"
               style="background: darkblue; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">
               Verify Your Email Address
            </a>
            
        
            <p>If the button doesn't work for any reason, you can also copy this link below and paste it in the browser:</p>
        
            <a>${process.env.ADMIN_URL}/authenticate/activate/${token}</a>
            </div>
            `
        }
        
        
        transporter.sendMail(options,function(err,info){
            if(err){
                console.log(err)
                return res.status(500).json({msg: err.message})
  
            }else {
             return res.json({msg: "Register Success! Please activate your email to start."}) 
            }
            console.log("Sent: "+ info.response);
  
            
        })  
  
      }catch(err){
        return res.status(500).json({msg: err.message})
  
      }
  });

  //mail-activate
router.post('/email-activate', async(req,res)=>{
    try {
    const {token}= req.body;
    if(token){
      jwt.verify(token, process.env.JWT_ACC_ACTIVATE, function(err,decodedToken){
        if(err){
          return res.status(400).json({msg:"Incorrect or Expired link."});
        }
        const {firstname,lastname,email,password}= decodedToken;
        Admin.findOne({email}).exec(async(err,admin)=>{
           
        if(admin){
          return res.status(400).json({msg:"Admin with this email already exists."});
        }
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);
        console.log(passwordHash);
      
        let newAdmin= new Admin({
          avatar:"https://image.flaticon.com/icons/png/512/61/61205.png",
          role: "admin",
          firstname,
          lastname,
          email,
          password:passwordHash,
        });
        newAdmin.save((err,success)=>{
          if(err){
            console.log("Error in signup : ",err);
            return res.status(400).json({msg: err});
          }
          res.json({
            message: "Signup success"
          })
        })
      })
    })
    }else {
        return res.status(500).json({msg: "Invalid Token"})
    }
    }catch (e) {
            return res.status(500).json({msg: e.message})
    }
});

//login
router.post('/login', async (req, res) => {
    try {
      const {email, password} = req.body;
      //validate
      if (!email || !password) {
          return res.status(400).json({msg: "Not all fields have been entered"});
      }
      const admin = await Admin.findOne({email: email});
      if (!admin) {
          return res.status(400).json({msg: "No account with this email has been founded"});
      }
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
          return res.status(400).json({msg: "Invalid credentials"});
      }
      //Using token for login
      const token = jwt.sign(
          {id: admin._id},
          process.env.JWT_SECRET);
      res.json({
          token,
          admin: {
              id: admin._id,
              role: admin.role,
              avatar : admin.avatar,
              firstname: admin.firstname,
              lastname: admin.lastname,
              email: admin.email,
              password: admin.password,
              phone: admin.phone,
              birthday: admin.birthday,
              country:admin.country
          }
      })
  } catch (err) {
      res.status(500).json({error: err.message});
  }
});

//forget password
router.post('/forgot-password/:email', async (req,res)=>{
  try {
    console.log(req.params.email);
    const admin = await Admin.findOne({email: req.params.email});
      if(!admin){
        return res.status(400).json({error: "Admin with the email "+req.params.email+ " does not exist"})
      }
      const token = jwt.sign({_id: admin._id},process.env.RESET_PASSWORD_KEY,{expiresIn:'10m'})
      console.log(admin.email+ " yodhher wéllé");
      
      const options = {
        from :'ipact2021@gmail.com',
        to: admin.email,
        subject: 'Account Activation Link',
        html: `
        <div style="max-width: 700px; margin:auto; border: 5px solid #ddd; padding: 50px 20px; font-size: 110%;">
        <h2 style="text-align: center; text-transform: uppercase;color: blue;">Welcome to I-PACT website.</h2>
        <p>Congratulations! 
            Just click the button below to reset your password.
        </p>
        
        <p>${process.env.ADMIN_URL}/resetpassword/${token}</p>
        `
    }
      return admin.updateOne({resetLink: token},function(err,success){
        if(err){
          return res.status(400).json({error: "reset password link error."})
        }
        else {
          //SEND MAIL HERE
          transporter.sendMail(options,function(err,info){
            if(err){
                console.log(err)
                return;
            }
            console.log("Sent: "+ info.response);
        })   
        }
      })
  } catch (err) {
    res.status(500).json({error: err.message});
  }
  });
//reset password
router.put('/reset-password',async(req,res)=>{
    const {resetLink, newPass}= req.body;
    if(resetLink){
      jwt.verify(resetLink,process.env.RESET_PASSWORD_KEY,function(error,decodedData){
        if(error){
          return res.status(401).json({
            error: "Incorrect token or It is expired."
          })
        }
        Admin.findOne({resetLink},async(err,admin)=>{
          if(err || !admin){
            return res.status(400).json({error: "Admin with token does not exists"});
          }
        
          const salt = await bcrypt.genSalt();
          const passwordHash1 = await bcrypt.hash(newPass, salt);
          console.log(passwordHash1);
          const obj = {
           password: passwordHash1,
           resetLink: ''
         }
         admin = _.extend(admin,obj)
         admin.save((err,result)=>{
           if(err){
             return res.status(400).json({error:"reset password error"})
           }
           else {
            return res.status(200).json({message:"Your password has been changed."})
           }
         })
        })
      })

    }else {
        return res.status(401).json({error:"Authentication error."})
    }
  });
//change password
router.put('/change-password/:id', async (req, res) => {
  try {
    let {
      oldPassword,
      newPassword,
      confirmNewPassword
  } = req.body
  if (!oldPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({msg: "Not all fields have been entered"});
  }
  if (newPassword.length < 6) {
      return res.status(400).json({msg: "The password needs to be at least 6 characters long"});
  }
  const adminIP = await Admin.findById(req.params.id);
  const salt = await bcrypt.genSalt();
  const isMatch = await bcrypt.compare(oldPassword, adminIP.password);
  if (!isMatch) {
      return res.status(400).json({msg: "The password you entered is incorrect"});
  }
  const passwordHash = await bcrypt.hash(newPassword, salt);
  if (newPassword !== confirmNewPassword) {
      return res.status(400).json({msg: "New Password and confirm new password are not equal"});
  }
  const isMatchOld = await bcrypt.compare(newPassword, adminIP.password);
  if (isMatchOld) {
      return res.status(400).json({msg: "New Password you entered is your current password"});
  }
  adminIP.password = passwordHash;
  const updatedAIP = await adminIP.save();
  res.json(updatedAIP);
  } catch (err) {
    res.status(500).json(err.message);
  }
})


   //logout
    router.get("/logout",(req,res)=>{
    res.cookie("token","",{
        httpOnly: true,
        expires: new Date(0)
    });
    
});

//valid token
router.post("/tokenIsValidAdmin", async (req, res) => {
  try {
      const token = req.header("x-auth-token");
      if (!token) return res.json(false);
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      if (!verified) return res.json(false);
      const admin = await Admin.findById(verified.id);
      if (!admin) return res.json(false);

      return res.json(true);
  } catch (err) {
      res.status(500).json({error: err.message});
  }
});

//get
router.get('/',auth,  async (req, res) => {
    const admin = await Admin.findById(req.admin);
    res.json({
      id: admin._id,
      role: admin.role,
      avatar : admin.avatar,
      firstname: admin.firstname,
      lastname: admin.lastname,
      email: admin.email,
      password: admin.password,
      phone: admin.phone,
      birthday: admin.birthday,
      country:admin.country
        
    })
  });
  
//Update Profile
router.put("/update/:id", async (req, res) => {
    try {
  
      let {
        id,
        firstname,
        lastname,
        email,
        birthday,
        country,
        bio,
        phone
      } = req.body;
   
  
      const adminUpdate = await Admin.findById(req.params.id);
      if(!firstname){
        firstname= adminUpdate.firstname
    }
    if(!lastname){
      lastname= adminUpdate.lastname
  }
    if(!email){
      email= adminUpdate.email
  }
  if(!birthday){
    birthday= adminUpdate.birthday
  }
  if(!country){
    country= adminUpdate.country
  }
  if(!bio){
    bio= adminUpdate.bio
  }
  if(!phone){
    phone= adminUpdate.phone
  }
      adminUpdate.lastname = lastname;
      adminUpdate.firstname = firstname;
      adminUpdate.email = email;
      adminUpdate.birthday = birthday;
      adminUpdate.country = country;
      adminUpdate.bio = bio;
      adminUpdate.phone = phone;
      
       await adminUpdate.save();
      res.json(
        
        {
          admin:{
            id: adminUpdate.id,
            role: adminUpdate.role,
            avatar : adminUpdate.avatar,
            lastname : adminUpdate.lastname,
            firstname : adminUpdate.firstname,
           email: adminUpdate.email,
            phone: adminUpdate.phone,
            birthday: adminUpdate.birthday,
            bio: adminUpdate.bio,
            country:adminUpdate.country
          }     
        }
      );
  
    } catch (error) {
      console.log(error);
    }
  });

//Update Image
router.put("/image/:id", async (req, res) => {
    try {
  
      let {
        avatar,
      } = req.body;
      const adminUpdate = await Admin.findById(req.params.id);
      if(!avatar){
        avatar= adminUpdate.avatar
    }
      adminUpdate.avatar = avatar;
       await adminUpdate.save();
      res.json(   
        {
          admin:{
            id: adminUpdate.id,
            role: adminUpdate.role,
            avatar : adminUpdate.avatar,
            firstname: adminUpdate.firstname,
            lastname: adminUpdate.lastname,
            email: adminUpdate.email,
            phone: adminUpdate.phone,
            birthday: adminUpdate.birthday,
            country:adminUpdate.country,
          }     
        }
      );
  
    } catch (error) {
      console.log(error);
    }
  });

module.exports = router;
  
  
  
  



  
