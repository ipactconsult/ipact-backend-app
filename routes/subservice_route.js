const router = require ("express").Router()
const Subservice = require ('../models/subserviceModel');
const Service = require ('../models/serviceModel');
const auth = require('../middleware/auth');
const mongoose = require("mongoose");


router.post('/post', async (req, res)=>{
    let trainingskill='';
    if(req.body.trainingSkill){
        trainingskill=req.body.trainingSkill
    }
   // const find_service = await Service.findOne({title: req.body.title});
  const newsubservice = new Subservice({
        name: req.body.name,
        description: req.body.description,
        file_path: req.body.file_path,
        public_id: req.body.public_id,
        serviceType: req.body.serviceType,
        state: req.body.state,
    });
    let existingService;
    try {
        existingService = await Service.findById(req.body.serviceType);
    } catch (e) {
        res.status(500).send({ message : "Not found service "})
    }

    if (!existingService) {
        res.status(404).send({ message : "Not found service for the provided Id "})
    }

    console.log(existingService);

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await newsubservice.save({session: sess});
        existingService.subservices.push(newsubservice);
        await existingService.save({session: sess});
        await sess.commitTransaction();
    } catch (e) {
        console.log(e)
        res.status(404).send({ message : "Creating subService failed, please try again"})
    }

    res.status(201).json({subservice: newsubservice});
});


//Find
router.get("/findAll",(req, res) => {
    Subservice.find({}).populate("squads")
        .then(data =>{
            if(!data){
                res.status(404).send({ message : "Not found subService"})
            }else{
                res.json({subServices: data.map(subService => subService.toObject({getters: true}))});
            }
        })
        .catch(err =>{
            res.status(500).send({ message: "Erro retrieving subServices"})
        })
  })

  router.delete ("/delete/:id", async (req, res) =>{
      const subServiceId = req.params.id;
      
      console.log(req.params.id)

      let subService;
      try {
          subService = await Subservice.findById(subServiceId).populate('serviceType');
      }catch (e) {
          res.status(500).send({ message : "Error finding subService"})

      }

      try {
          const sess = await  mongoose.startSession();
          sess.startTransaction();
          await subService.remove({session: sess});
          subService.serviceType.subservices.pull(subService);
          await subService.serviceType.save({session: sess});
          await sess.commitTransaction()
      }catch (e) {
        console.log(e)
          res.status(404).send({ message : "Error finding subService"})
          


      }
      res.status(200).send({ message : "SubService deleted"})
     
    });


  
router.get("/find/:id",async (req, res) =>  {
    const subServiceId = req.params.id;
    console.log(subServiceId)
    let subService;
    try {
        subService = await Subservice.findById(subServiceId).populate("squads");
    } catch (e) {
        res.status(404).send({ message : "Not found subService"+ subServiceId})
    }
    if (!subService) {
        res.status(404).send({ message : "Not found subService with id "+ subServiceId})
    }
    console.log(subService);
    res.json({subService: subService.toObject({getters: true})});
})
  router.get('/', async(req,res)=>{
 
    const qService=req.query.service;
   
    try{
        let subserv;
          if(qService){
            subserv =await Subservice.find({serviceType:{
                $in: [qService],
            },
        })
       
          

        } 
        else {
            subserv=await  Subservice.find({}) ;
        }
         
       // const prod = await products.find().sort({_id:-1})
        res.json(subserv)

    }catch(err){
        res.send('Error '+ err)
    }
})


  module.exports= router;