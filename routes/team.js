const express = require('express');

const router  = express.Router();

const Team = require('../models/Team');

//to create a private route
const verify = require('../verifier');

//to get all teams
router.get('/',verify, async (req, res)=>{
 try{
    const teams = await Team.find();
    res.json(teams);
 }
 catch(err)
 {
    res.json({message : err});
 }
});

//to get team details by teamName 
router.get('/:teamName', async (req, res)=>{
    try{
        console.log(req.params.teamName);
        const team = await Team.find({"name":req.params.teamName});
        res.json(team);
    }
    catch(err)
    {
        res.json({message : err});
    }
});

// to create a new team
router.post('/add', async (req, res)=>{
    const team  = new Team({
        name: req.body.name
    });
    try{
        const savedteam = await team.save();
     res.json(savedteam);
    }
    catch(err)
    {
        res.json({message: err});
    }
     
});

//to delete a team by name
router.delete('/:teamName', async (req, res)=>{
   try{
    const deletedTeam = await Team.remove({"name":req.params.teamName});
    res.json(deletedTeam);
   }
   catch(err)
   {
       res.json({message : err})
   }
});

//to edit a team
router.patch('/:teamName', async (req, res) => {
    try{
       const updatedTeam = await Team.updateOne({"name":req.params.teamName},
        { $set:{name:req.body.name}}
        );
        res.json(updatedTeam);
    }
    catch(err)
    {
        res.json({message: err});
    }
});

module.exports= router;