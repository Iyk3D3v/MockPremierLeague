const express = require('express');
const bcrypt = require('bcryptjs'); 
const router  = express.Router();
const User = require('../models/User');
const {createValidation, loginValidation} =  require('../validation')
const jwt  = require('jsonwebtoken');


router.get('/', async (req, res) => {
    

    try{
        const users  = await User.find();
        res.json(users);
    }
    catch(err)
    {
        res.json({message: err});
    }
});

//to create a User
router.post('/create',  async (req, res) =>{
    const {error} = createValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const emailExists = await User.findOne({"email":req.body.email});

    if(emailExists) return res.status(400).send("user exists aalready");

    //hashing the password
    const salt = await bcrypt.genSalt(10);
    const passwordhash = await bcrypt.hash(req.body.password, salt);   

    const newuser = new User({
        userName : req.body.userName,
        password: passwordhash,
        email: req.body.email // need to learn to hash password
    });

    try{
        const addedUser = await newuser.save();
        res.json({ User: addedUser._id});
    }
    catch(err)
    {
        res.json({message: err});
    }
});

//to update a user
router.patch('/:id', async (req,res)=>{
    try{
        const updatedUser = await User.updateOne({"_id":req.params.id},
        {$set:{userName:req.params.userName}}
        );
        res.json(updatedUser);
    }
    catch(err)
    {
        res.json({message: err});

    }
});

//to delete a user
router.delete('/:id', async (req, res)=>{
    try{
        const deleteUser = await User.remove({"_id": req.params.id});
        res.json(deleteUser);
    }
    catch(err){
        res.json({mesage: err})
    }
})

//login user
router.post('/login', async (req, res) =>{
    
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send("Email or Password is invalid");

    const validPass = await bcrypt.compare(req.body.password, user.password);

    if(!validPass) return res.status(400).send('Email or Password invalid');

    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send("Success");

});


module.exports = router;