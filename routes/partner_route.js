const router = require ("express").Router()
const Partner = require ('../models/partnerModel');

//Post partner
router.post('/post', async (req, res, next) => {
    const {title,type, image} = req.body;
    const newPartner = new Partner({
        title,
        type,
        image,
    });
    newPartner.save().then(result => {
        res.status(201).json({
            message: "Partner Content Added Successfully!",
            partnerCreated: {
                newPartner
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
    Partner.find({})
        .then(data =>{
            if(!data){
                res.status(404).send({ message : "Not found partner with id "+ id})
            }else{
                res.json({partners: data.map(partner => partner.toObject({getters: true}))});
            }
        })
        .catch(err =>{
            res.status(500).send({ message: "Erro retrieving partner with id " + id})
        })
});

  //PUT
  router.put("/put/:id", async (req, res) => {
    try {
      let {
       title,
       type,
       image,
      } = req.body;
      const partner = await Partner.findById(req.params.id);
       if (!title) {
            title = partner.title;
        }
          
  if (!type) {
    type = partner.type;
        }
        partner.title = title;
        partner.type= type;
        partner.image= image;
      
      const savedPartner = await partner.save();
      res.json(savedPartner);
  
    } catch (error) {
      console.log(error);
    }
  });


  //DELETE
router.delete ("/delete/:id", async (req, res) =>{
    const id = req.params.id;
    Partner.findByIdAndDelete(id)
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