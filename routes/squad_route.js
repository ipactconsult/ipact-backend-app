const router = require("express").Router();
const Squad = require("../models/squadModel");
const Subservice = require("../models/subserviceModel");
const mongoose = require("mongoose");


router.post('/post', async (req, res, next) => {
    const {description,price , members, subService} = req.body;
    const newSquad = new Squad({
        description,
        price,
        members,
        subService
    });
    let existingSubService;
    try {
        existingSubService = await Subservice.findById(req.body.subService);
    } catch (e) {
        res.status(500).send({ message : "Not found SubService "})
    }

    if (!existingSubService) {
        res.status(404).send({ message : "Not found SubService for the provided Id "})
    }

    console.log(existingSubService);

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await newSquad.save({session: sess});
        existingSubService.squads.push(newSquad);
        await existingSubService.save({session: sess});
        await sess.commitTransaction();
    } catch (e) {
        console.log(e)
        res.status(404).send({ message : "Creating Squad failed, please try again"})
    }

    res.status(201).json({squad: newSquad});
})

router.get("/findAll", (req, res) => {
    Squad.find({})
        .then(data => {
            if (!data) {
                res.status(404).send({message: "Not found Squads "})
            } else {
                res.json({squads: data.map(squad => squad.toObject({getters: true}))});
            }
        })
        .catch(err => {
            res.status(500).send({message: "Erro retrieving Squads "})
        })
})





router.get("/find/:id",async (req, res) =>  {
    const squadId = req.params.id;
    let squad;
    try {
        squad = await squad.findById(squadId).populate("subService");
    } catch (e) {
        res.status(404).send({ message : "Not found subService"+ squadId})
    }
    if (!squad) {
        res.status(404).send({ message : "Not found subService with id "+ squadId})
    }
    console.log(squad);
    res.json({squad: squad.toObject({getters: true})});
})

router.delete ("/delete/:id", async (req, res) =>{
    const squadId = req.params.id;
    console.log(req.params.id);

    let squad;
    try {
        squad = await Squad.findById(squadId).populate('subService');
    }catch (e) {
        res.status(500).send({ message : "Error finding Squad"})

    }

    try {
        const sess = await  mongoose.startSession();
        sess.startTransaction();
        await squad.remove({session: sess});
        squad.subService.squads.pull(squad);
        await squad.subService.save({session: sess});
        await sess.commitTransaction()
    }catch (e) {
        res.status(404).send({ message : "Error finding Squad"})


    }

    res.status(200).json({message: 'Deleted  Squad.'});
});


module.exports= router;