const router = require ("express").Router()
const Service = require ('../models/serviceModel');
const Subservice = require ('../models/subserviceModel');
const mongoose = require("mongoose");

const cloudinary = require('cloudinary');
const auth = require('../middleware/auth');
cloudinary.config({
    cloud_name: "dl0o9l8xz",
    api_key: "241258522581488",
    api_secret: "lWWXDxogVgYPerfCYm84SM7shC0"
});
router.post('/destroy',auth, (req, res) =>{
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
//Post service
router.post('/post',async(req, res, next) => {
  const {title, description} = req.body;
  console.log(title);
    const newService = new Service({
        title,
        description,
       
    });
  
      await  newService.save().then(result => {
          res.status(201).json({
              message: "Serivce Content Added Successfully!",
              serviceCreated: {
                newService
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
  

//Find
router.get("/findAll",(req, res) => {
    Service.find({}).populate({
      path: "subservices", // populate blogs
      populate: {
         path: "squads" // in blogs, populate comments
      }
   }).then(data =>{
            if(!data){
                res.status(404).send({ message : "Not found service with id "+ id})
            }else{
                res.json({services: data.map(service => service.toObject({getters: true}))});
            }
        })
        .catch(err =>{
            res.status(500).send({ message: "Erro retrieving service with id " + id})
        })
  })
// find one
router.get("/find/:id",async (req, res) =>  {
    const serviceId = req.params.id;
    let service;
    try {
        service = await Service.findById(serviceId).populate({
          path: "subservices", // populate blogs
          populate: {
             path: "squads" // in blogs, populate comments
          }
       });
    } catch (e) {
        res.status(404).send({ message : "Not found service"+ serviceId})
    }
    if (!service) {
        res.status(404).send({ message : "Not found service with id "+ serviceId})
    }
    console.log(service);
    res.json({service: service.toObject({getters: true})});
})

  //PUT
router.put("/put/:id", async (req, res) => {
    try {
      let {
       title,
       description,
       file_path,
      } = req.body;
      const service = await Service.findById(req.params.id);
       if (!title) {
            title = service.title;
        }
          
  if (!description) {
            description = service.description;
        }
        service.title = title;
        service.description= description;
        
      const savedService = await service.save();
      res.json(savedService);
  
    } catch (error) {
      console.log(error);
    }
  });

//DELETE
router.delete ("/delete/:id",async (req, res) =>{
    const id = req.params.id;
    let service;
  
      service = await Service.findById(id);
    
        try {
          // await product.remove();
          const sess = await mongoose.startSession();
          sess.startTransaction();
          Subservice.deleteMany({_id: {$in: service.subservices}}, err => console.log(err)).session(sess)
          await service.remove({session: sess});
          await sess.commitTransaction()
      } catch (e) {
        
          console.log(e)
      }
      res.json("sucess");
    });

//Update State to Show
router.put("/service_show/:id", async (req, res) => {
    try {
      let {
        state = 'show'
      } = req.body;
      const service_edit_show = await Service.findById(req.params.id);
     
      service_edit_show.state = state;
     
      
      const saved_service_edit_show = await service_edit_show.save();
      res.json(saved_service_edit_show);
  
    } catch (error) {
      console.log(error);
    }
  });


//Update State to Show
router.put("/service_hide/:id", async (req, res) => {
    try {
      let {
        state = 'hide'
      } = req.body;
      const service_edit_hide = await Service.findById(req.params.id);
     
      service_edit_hide.state = state;
     
      
      const saved_service_edit_hide = await service_edit_hide.save();
      res.json(saved_service_edit_hide);
  
    } catch (error) {
      console.log(error);
    }
});

//Count Services || State = Show
router.get("/count_show", async(req,res)=>{
    Service.find({state:'show'}).count(function(err,result){
      if(err){
        res.send(err)
      }else{
        res.json(result)
      }
    })
});

//Count Services || State = Hide
router.get("/count_hide", async(req,res)=>{
  Service.find({state:'hide'}).count(function(err,result){
    if(err){
      res.send(err)
    }else{
      res.json(result)
    }
  })
});


module.exports= router;