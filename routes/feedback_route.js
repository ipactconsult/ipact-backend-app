const router = require("express").Router();
const Feedback = require("../models/feedbackModel");


router.post('/post', async (req, res, next) => {
    const {username,role , message, active} = req.body;
    const newFeedback = new Feedback({
        username,
        role,
        message,
        active
    });
    newFeedback.save().then(result => {
        res.status(201).json({
            message: "feedback Content Added Successfully!",
            feedbackCreated: {
                newFeedback
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

router.get("/findAll", (req, res) => {
    Feedback.find({})
        .then(data => {
            if (!data) {
                res.status(404).send({message: "Not found feedbacks "})
            } else {
                res.json({feedbacks: data.map(feedback => feedback.toObject({getters: true}))});
            }
        })
        .catch(err => {
            res.status(500).send({message: "Erro retrieving feedbacks "})
        })
})

router.get("/findActive", (req, res) => {
    Feedback.find({active: true})
        .then(data => {
            if (!data) {
                res.status(404).send({message: "Not found feedbacks "})
            } else {
                res.json({feedbacks: data.map(feedback => feedback.toObject({getters: true}))});
            }
        })
        .catch(err => {
            res.status(500).send({message: "Erro retrieving feedbacks "})
        })
})

router.put('/put/:id', async (req, res, next) => {

    const id = req.params.id;
    const {active} = req.body;

    const feedback = await Feedback.findById(id);
    feedback.active = active;
    const savedFeedback = await feedback.save();
    res.json(savedFeedback);
})

module.exports= router;