const router = require ("express").Router()
const About = require ('../models/aboutModel');
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
//post
router.post('/post', async (req, res, next) => {
    const {title, description} = req.body;
    console.log(title);
    const newAbout = new About({
        title,
        description,
       
    });
    newAbout.save().then(result => {
        res.status(201).json({
            message: "About Content Added Successfully!",
            aboutCreated: {
                newAbout
            }
        })
    })
        .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
})

//find
router.get("/findAll",(req, res) => {
    About.find({})
        .then(data =>{
            if(!data){
                res.status(404).send({ message : "Not found about with id "})
            }else{
                res.json({abouts: data.map(abouts => abouts.toObject({getters: true}))});
            }
        })
        .catch(err =>{
            res.status(500).send({ message: "Erro retrieving about with id "})
        })
  })
//put
router.put("/put/:id", async (req, res) => {
    try {
      let {
       title,
       description,
       file_path,
      } = req.body;
      const about = await About.findById(req.params.id);
       if (!title) {
            title = about.title;
        }
          
  if (!description) {
            description = about.description;
        }
        about.title = title;
        about.description= description;
        about.file_path= file_path;
      
      const savedAbout= await about.save();
      res.json(savedAbout);
  
    } catch (error) {
      console.log(error);
    }
  });
//put state to show
router.put("/about_show/:id", async (req, res) => {
    try {
      let {
        state = 'show'
      } = req.body;
      const about_edit_show = await About.findById(req.params.id);
     
      about_edit_show.state = state;
     
      
      const saved_about_edit_show = await about_edit_show.save();
      res.json(saved_about_edit_show);
  
    } catch (error) {
      console.log(error);
    }
  });
//put state to hide
router.put("/about_hide/:id", async (req, res) => {
    try {
      let {
        state = 'hide'
      } = req.body;
      const about_edit_hide = await About.findById(req.params.id);
     
      about_edit_hide.state = state;
     
      
      const saved_about_edit_hide = await about_edit_hide.save();
      res.json(saved_about_edit_hide);
  
    } catch (error) {
      console.log(error);
    }
});
//delete
router.delete ("/delete/:id", async (req, res) =>{
    const id = req.params.id;
    About.findByIdAndDelete(id)
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

module.exports=router;
