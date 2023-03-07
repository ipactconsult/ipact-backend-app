const router = require ("express").Router()
const Dev = require ('../models/developerModel');
const cloudinary = require('cloudinary');
const multer = require('multer');

cloudinary.config({
    cloud_name: "dl0o9l8xz",
    api_key: "241258522581488",
    api_secret: "lWWXDxogVgYPerfCYm84SM7shC0"
});
//destroy cloudinary image
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
//post
router.post('/post', async (req, res, next) => {
    const newDev = new Dev({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        description: req.body.description,
        country: req.body.country,
        phone: req.body.phone,
        email: req.body.email,
        role : req.body.role,
        avatar: req.body.avatar,
        birthday: req.body.birthday,
        bio: req.body.bio,
        fb_link: req.body.fb_link,
        linkedin_link: req.body.linkedin_link
    });
    newDev.save().then(result => {
        res.status(201).json({
            message: "Developer  Added Successfully!",
            devCreated: {
                newDev
            }
        })
    })
        .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
});

//find
router.get("/findAll",(req, res) => {
    Dev.find({})
        .then(data =>{
            if(!data){
                res.status(404).send({ message : "Not found Developer"})
            }else{
                res.json({developers: data.map(developer => developer.toObject({getters: true}))});
            }
        })
        .catch(err =>{
            res.status(500).send({ message: "Erro retrieving Developer"})
        })
});

//put
router.put("/put/:id", async (req, res) => {
    try {
      let {
        firstname,
        lastname,
        description,
        country,
        phone,
        email,
        role,
        avatar,
        birthday,
        bio,
        fb_link,
        linkedin_link
      } = req.body;
      const dev = await Dev.findById(req.params.id);
       if (!firstname) {
        firstname = dev.firstname;
        }
        if (!lastname) {
            lastname = dev.lastname;
            }
            if (!description) {
                description = dev.description;
            }
        if (!country) {
            country = dev.country;
        }
        if (!phone) {
            phone = dev.phone;
        }
        if (!email) {
            email = dev.email;
        }
        if (!role) {
            role = dev.role;
        }
        if (!birthday) {
            birthday = dev.birthday;
        }
        if (!bio) {
            bio = dev.bio;
        }
        if (!fb_link) {
            fb_link = dev.fb_link;
        }
        if (!linkedin_link) {
            linkedin_link = dev.linkedin_link;
        }
          
 
        dev.firstname = firstname;
        dev.lastname = lastname;
        dev.description=description
        dev.country= country;
        dev.avatar= avatar;
        dev.phone = phone;
        dev.email= email;
        dev.role= role;
        dev.birthday = birthday;
        dev.bio= bio;
        dev.fb_link= fb_link;
        dev.linkedin_link= linkedin_link;
      
      const savedAbout= await dev.save();
      res.json(savedAbout);
  
    } catch (error) {
      console.log(error);
    }
  });

  //put state to show
router.put("/dev_show/:id", async (req, res) => {
    try {
      let {
        state = 'show'
      } = req.body;
      const dev_edit_show = await Dev.findById(req.params.id);
     
      dev_edit_show.state = state;
     
      
      const saved_dev_edit_show = await dev_edit_show.save();
      res.json(saved_dev_edit_show);
  
    } catch (error) {
      console.log(error);
    }
  });

  //put state to hide
router.put("/dev_hide/:id", async (req, res) => {
    try {
      let {
        state = 'hide'
      } = req.body;
      const dev_edit_hide = await Dev.findById(req.params.id);
     
      dev_edit_hide.state = state;
     
      
      const saved_dev_edit_hide = await dev_edit_hide.save();
      res.json(saved_dev_edit_hide);
  
    } catch (error) {
      console.log(error);
    }
});
//delete
router.delete ("/delete/:id", async (req, res) =>{
    const id = req.params.id;
    Dev.findByIdAndDelete(id)
        .then(data => {
            if(!data){
                res.status(404).send({ message : `Cannot Delete with id ${id}. Maybe id is wrong`})
            }else{
                res.send({
                    message : "Item was deleted successfully!"
                })
            }
        })
        .catch(err =>{
            res.status(500).send({
                message: "Could not delete item with id=" + id
            });
        });
    });


    const multerConfig = multer.diskStorage({
        destination: (req, file, callback) => {
        callback(null,"../backend/uploads/team");
        
        },
    
       
        filename: (req, file, callback) => {
          // const ext= file.mimetype.split('/')[1];
          console.log(req);
          callback(null, `${req.body.username}.png`);
        },
      });
    
      
      const uploadd = multer({
        storage: multerConfig,
      });
      const uploadImage = uploadd.single("photo");
      
       const upload = (req, res) => {
        res.status(200).json({
          succes: "success",
        });
      }
      router.post('/uploadImg',uploadImage,upload);
      
    

module.exports=router;
