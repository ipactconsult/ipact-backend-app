const router = require('express').Router()
const ipUser= require('../models/userModel');
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
//Register user
router.post("/registerUser", async (req, res) => {
    try{
      const {firstname, lastname, email, password, passwordVerify} = req.body;
      const user = await ipUser.findOne({email})
              if (user) return res.status(400).json({msg: "This email already exists."})
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
            
            
            <a href="${process.env.CLIENT_URL}/authenticate/activate/${token}"
               target="_blank"
               style="background: darkblue; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">
               Verify Your Email Address
            </a>
            
        
            <p>If the button doesn't work for any reason, you can also copy this link below and paste it in the browser:</p>
        
            <a>${process.env.CLIENT_URL}/authenticate/activate/${token}</a>
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
        })  
  
      }catch(err){
        return res.status(500).json({msg: err.message})
  
      }
  });

  //email-activate
router.post('/email-activate', async(req,res)=>{
    try {
    const {token}= req.body;
    if(token){
      jwt.verify(token, process.env.JWT_ACC_ACTIVATE, function(err,decodedToken){
        if(err){
          return res.status(400).json({msg:"Incorrect or Expired link."});
        }
        const {firstname,lastname,email,password} = decodedToken;
        ipUser.findOne({email}).exec(async(err,user)=>{
           
        if(user){
          return res.status(400).json({msg:"User with this email already exists."});
        }
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);
        console.log(passwordHash);
      
        let newUser= new ipUser({
          avatar:"https://image.flaticon.com/icons/png/512/61/61205.png",
          role: "user",
          firstname,
          lastname,
          email,
          password:passwordHash,
        });
        newUser.save((err,success)=>{
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
      const user = await ipUser.findOne({email: email});
      if (!user) {
          return res.status(400).json({msg: "No account with this email has been founded"});
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(400).json({msg: "Invalid credentials"});
      }        
        const token = jwt.sign(
          {id: user._id},
          process.env.JWT_SECRET);
      res.json({
          token,
          user: {
              id: user._id,
              role: user.role,
              avatar : user.avatar,
              firstname: user.firstname,
              lastname: user.lastname,
              email: user.email,
              password: user.password,
              phone: user.phone,
              birthday: user.birthday,
              country:user.country
          }
      });
  } catch (err) {
      res.status(500).json({error: err.message});
  }
});

//forget password
router.post('/forgot-password/:email', async (req,res)=>{
  try {
    console.log(req.params.email);
    const user = await ipUser.findOne({email: req.params.email});
      if(!user){
        return res.status(400).json({error: "User with the email "+req.params.email+ " does not exist"})
      }
      const token = jwt.sign({_id: user._id},process.env.RESET_PASSWORD_KEY,{expiresIn:'10m'})
      console.log(user.email+ " yodhher wéllé");
      
      const options = {
        from :'ipact2021@gmail.com',
        to: user.email,
        subject: 'Account Activation Link',
        html: `
        <div style="max-width: 700px; margin:auto; border: 5px solid #ddd; padding: 50px 20px; font-size: 110%;">
        <h2 style="text-align: center; text-transform: uppercase;color: blue;">Welcome to I-PACT website.</h2>
        <p>Congratulations! 
            Just click the button below to reset your password.
        </p>
        
        <p>${process.env.CLIENT_URL}/resetpassword/${token}</p>
        `
    }
      return user.updateOne({resetLink: token},function(err,success){
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
        ipUser.findOne({resetLink},async(err,user)=>{
          if(err || !user){
            return res.status(400).json({error: "User with token does not exists"});
          }
        
          const salt = await bcrypt.genSalt();
          const passwordHash1 = await bcrypt.hash(newPass, salt);
          console.log(passwordHash1);
          const obj = {
           password: passwordHash1,
           resetLink: ''
         }
         user = _.extend(user,obj)
         user.save((err,result)=>{
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
  const user = await ipUser.findById(req.params.id);
  const salt = await bcrypt.genSalt();
  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
      return res.status(400).json({msg: "The password you entered is incorrect"});
  }
  const passwordHash = await bcrypt.hash(newPassword, salt);
  if (newPassword !== confirmNewPassword) {
      return res.status(400).json({msg: "New Password and confirm new password are not equal"});
  }
  const isMatchOld = await bcrypt.compare(newPassword, user.password);
  if (isMatchOld) {
      return res.status(400).json({msg: "New Password you entered is your current password"});
  }
  user.password = passwordHash;
  const updatedUIP = await user.save();
  res.json(updatedUIP);
  } catch (err) {
    res.status(500).json(err.message);
  }
})

//valid token
router.post("/tokenIsValidUser", async (req, res) => {
  try {
      const token = req.header("x-auth-token");
      if (!token) return res.json(false);
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      if (!verified) return res.json(false);
      const user = await ipUser.findById(verified.id);
      if (!user) return res.json(false);

      return res.json(true);
  } catch (err) {
      res.status(500).json({error: err.message});
  }
});

//get
router.get('/',auth,  async (req, res) => {
    const user = await ipUser.findById(req.user);
    res.json({
      id: user._id,
      role: user.role,
      avatar : user.avatar,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      password: user.password,
      phone: user.phone,
      birthday: user.birthday,
      country:user.country
        
    })
  });
  
//Update Profile
router.put("/update/:id", async (req, res) => {
    try {
  
      let {
        firstname,
        lastname,
        email,
        birthday,
        country,
        bio,
        phone
      } = req.body;
   
  
      const userUpdate = await ipUser.findById(req.params.id);
      if(!firstname){
        firstname= userUpdate.firstname
    }
    if(!lastname){
      lastname= userUpdate.lastname
  }
    if(!email){
      email= userUpdate.email
  }
  if(!birthday){
    birthday= userUpdate.birthday
  }
  if(!country){
    country= userUpdate.country
  }
  if(!bio){
    bio= userUpdate.bio
  }
  if(!phone){
    phone= userUpdate.phone
  }
  userUpdate.lastname = lastname;
  userUpdate.firstname = firstname;
  userUpdate.email = email;
  userUpdate.birthday = birthday;
  userUpdate.country = country;
  userUpdate.bio = bio;
  userUpdate.phone = phone;
      
       await userUpdate.save();
      res.json(
        
        {
          user:{
            id: userUpdate.id,
            role: userUpdate.role,
            avatar : userUpdate.avatar,
            lastname : userUpdate.lastname,
            firstname : userUpdate.firstname,
            email: userUpdate.email,
            phone: userUpdate.phone,
            birthday: userUpdate.birthday,
            bio: userUpdate.bio,
            country:userUpdate.country
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
      const userUpdate = await ipUser.findById(req.params.id);
      if(!avatar){
        avatar= userUpdate.avatar
      }
      userUpdate.avatar = avatar;
       await userUpdate.save();
      res.json(   
        {
          user:{
            id: userUpdate.id,
            role: userUpdate.role,
            avatar : userUpdate.avatar,
            firstname: userUpdate.firstname,
            lastname: userUpdate.lastname,
            email: userUpdate.email,
            phone: userUpdate.phone,
            birthday: userUpdate.birthday,
            country:userUpdate.country,
          }     
        }
      );
  
    } catch (error) {
      console.log(error);
    }
  });

module.exports = router;