const router = require ("express").Router()
const Taas = require ('../models/taasModel');
const auth = require('../middleware/auth');

//Post taas
router.post('/post',auth, async (req, res, next) => {
    const newTaas = new Taas({
        title: req.body.title,
        description: req.body.description,
        members: req.body.members,
        tools: req.body.tools
    });
    newTaas.save().then(result => {
        res.status(201).json({
            message: "Taas Content Added Successfully!",
            partnerCreated: {
                newTaas
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
    Taas.find({})
        .then(data =>{
            if(!data){
                res.status(404).send({ message : "Not found taas with id "+ id})
            }else{
                res.send(data)
            }
        })
        .catch(err =>{
            res.status(500).send({ message: "Erro retrieving taas with id " + id})
        })
});
//findbytools
router.get('/', async(req,res)=>{
    const qCateg=req.query.tools;
    try{
        let taass;
       if(qCateg){
            taass =await Taas.find({tools:{
                $in: [qCateg],
            },
        })
        }else {
            taass=await Taas.find({}) ;
        }
        res.json(taass)

    }catch(err){
        res.send('Error '+ err)
    }
})

// router.get("/findbytools/:tools",(req, res) => {
//     Taas.find(req.params.tools)
//         .then(data =>{
//             if(!data){
//                 res.status(404).send({ message : "Not found taas with this tool "+ tools})
//             }else{
//                 res.send(data)
//             }
//         })
//         .catch(err =>{
//             res.status(500).send({ message: "Erro retrieving taas with this tool " + tools})
//         })
// });

 //PUT
 router.put("/put/:id",auth, async (req, res) => {
    try {
      let {
       title,
       description,
       members,
       tools,
      } = req.body;
      const taas = await Taas.findById(req.params.id);
       if (!title) {
            title = taas.title;
        }
          
  if (!description) {
            description = taas.description;
        }
        if (!members) {
            members = taas.members;
        }
        if (!tools) {
            tools = taas.tools;
        }
        taas.title = title;
        taas.description= description;
        taas.members= members;
        taas.tools= tools;
      
      const savedTaas = await taas.save();
      res.json(savedTaas);
  
    } catch (error) {
      console.log(error);
    }
  });

  //DELETE
router.delete ("/delete/:id",auth, async (req, res) =>{
    const id = req.params.id;
    Taas.findByIdAndDelete(id)
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



module.exports= router;