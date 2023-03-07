const router = require ("express").Router()
const Projet = require ('../models/projectModel');
const Developer = require ('../models/developerModel');
const multer = require('multer');
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

router.post('/add-project', async (req, res)=>{

    const find_developper = await Developer.findOne({firstname: req.body.firstname, lastname: req.body.lastname});
  const newProject = new Projet({
        title: req.body.title,
        description: req.body.description,
        image: req.body.image,
        link_project: req.body.link_project,
        group_name: req.body.group_name,
        file_path: req.body.file_path,
        public_id: req.body.public_id,
      team_members: find_developper,
      state: req.body.state,
    });
    newProject.save().then(result => {
        res.status(201).json({
            message: "Project created Successfully!",
            projectCreated: {
                newProject
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
//Find
router.get("/findAll",(req, res) => {
    Projet.find({})
        .then(data =>{
            if(!data){
                res.status(404).send({ message : "Not found project "})
            }else{
                res.json({projects: data.map(project => project.toObject({getters: true}))});

            }
        })
        .catch(err =>{
            res.status(500).send({ message: "Erro retrieving project" })
        })
  })

//DELETE
router.delete ("/delete/:id", async (req, res) =>{
    const id = req.params.id;
    Projet.findByIdAndDelete(id)
        .then(data => {
            if(!data){
                res.status(404).send({ message : `Cannot Delete with id ${id}. Maybe id is wrong`})
            }else{
                res.send({
                    message : "Project was deleted successfully!"
                })
            }
        })
        .catch(err =>{
            res.status(500).send({
                message: "Could not delete Project with id=" + id
            });
        });
    });

router.put("/project-show/:id", async (req, res) => {
    try {
      let {
        state = 'Show'
      } = req.body;
      const projet_edit_show = await Projet.findById(req.params.id);

      projet_edit_show.state = state;


      const saved_projet_edit_show = await projet_edit_show.save();
      res.json(saved_projet_edit_show);

    } catch (error) {
      console.log(error);
    }
  });

//Update State to Show
router.put("/project-hide/:id", async (req, res) => {
    try {
      let {
        state = 'Hide'
      } = req.body;
      const project_edit_hide = await Projet.findById(req.params.id);

      project_edit_hide.state = state;


      const saved_project_edit_hide = await project_edit_hide.save();
      res.json(saved_project_edit_hide);

    } catch (error) {
      console.log(error);
    }
});

  //PUT
router.put("/put/:id", async (req, res) => {
    try {
      let {
       title,
       description,
       image,
      } = req.body;
      const projet = await Projet.findById(req.params.id);
        

  if (!title) {
    title = projet.title;
        }
    if (!description) {
      description = projet.description;
        }  if (!image) {
          image = projet.image;
        }  
        /*if (!team_members) {
            team_members = projet.team_members;
        }*/
         
        projet.title= title;
        projet.description= description;
        projet.image= image;
       // projet.team_members= team_members;
       // projet.public_id= public_id;

      const savedProjet = await projet.save();
      res.json(savedProjet);

    } catch (error) {
      console.log(error);
    }
  });


  const multerConfig = multer.diskStorage({
    destination: (req, file, callback) => {
    callback(null,"../backend/uploads");
    
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
  


module.exports = router;
