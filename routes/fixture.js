const express = require('express');

const router = express.Router();

const Fixture = require('../models/Fixture');

//to get all fixtures
router.get('/', async (req, res)=>{
    try{
        const fixtures = await Fixture.find();
        res.json(fixtures);
    }
    catch(err)
    {
        res.json({message: err});
    }
});

//to get fixture by date
router.get('/:date', async (req, res)=>{
    try{
        const fixture = await Fixture.find({"date":req.params.date});
        res.json(fixture);
    }
    catch(err)
    {
        res.json({message: err});
    }
});


router.post('/create', async (req, res)=>{
        const fixt = new Fixture({
            teamOne : req.body.teamOne,
            teamTwo : req.body.teamTwo,
            date : req.body.date
        });

        try{
            const savedFixt = await fixt.save();
            res.json(savedFixt);
        }
        catch(err)
        {
            res.json({message : err});
        }
        
});

//to edit a fixture
router.patch('/:id', async (req, res)=>{
    try{
        const updateFixt = await Fixture.updateOne({"_id": req.params.id},
        {$set:{teamOne:req.body.teamOne, teamTwo:req.body.teamTwo, date:req.body.date}});
        res.send("Updated Successfully");
    }
    catch(err)
    {
        res.json({message : err});
    }
});

//to delete a fixture
router.delete('/:id', async (req,res)=>{
        try{
            const deletedFixt = await Fixture.remove({"_id":req.params.id});
            res.send("Deleted Successfully");
        }
        catch(err)
        {
            res.json({message: err});
        }
});

module.exports = router;