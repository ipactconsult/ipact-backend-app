const router = require ("express").Router()
const header = require('../models/headerModel');
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
//create
router.post('/post', async (req, res, next) => {
    const newHeader = new header({
        title: req.body.title,
        description: req.body.description,
        file_path: req.body.file_path,
        state: req.body.state
    });
    newHeader.save().then(result => {
        res.status(201).json({
            message: "Header Image Added Successfully!",
            headerCreated: {
              newHeader
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
    header.find({})
        .then(data =>{
            if(!data){
                res.status(404).send({ message : "Not found header with id "+ id})
            }else{
                res.send(data)
            }
        })
        .catch(err =>{
            res.status(500).send({ message: "Erro retrieving header with id " + id})
        })
});
//put
router.put("/put/:id", async (req, res) => {
    try {
      let {
       title,
       description,
       file_path,
      } = req.body;
      const head = await header.findById(req.params.id);
       if (!title) {
            title = head.title;
        }
          
  if (!description) {
            description = head.description;
        }
      head.title = title;
      head.description= description;
      head.createdAt = createdAt
      head.file_path= file_path;
      
      const savedHeader = await head.save();
      res.json(savedHeader);
  
    } catch (error) {
      console.log(error);
    }
  });
//delete
router.delete ("/delete/:id", async (req, res) =>{
    const id = req.params.id;
    header.findByIdAndDelete(id)
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
//put state to show
router.put("/edit_state_show/:id", async (req, res) => {
    try {
      let {
        state = 'show'
      } = req.body;
      const header_edit_state_show = await header.findById(req.params.id);
     
      header_edit_state_show.state = state;
     
      
      const saved_header_state_show = await header_edit_state_show.save();
      res.json(saved_header_state_show);
  
    } catch (error) {
      console.log(error);
    }
  });
//put state to hide
router.put("/edit_state_hide/:id", async (req, res) => {
    try {
      let {
        state = 'hide'
      } = req.body;
      const header_edit_state_hide = await header.findById(req.params.id);
     
      header_edit_state_hide.state = state;
     
      
      const saved_header_state_hide = await header_edit_state_hide.save();
      res.json(saved_header_state_hide);
  
    } catch (error) {
      console.log(error);
    }
  });

  module.exports= router;