const router = require('express').Router();
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');

const {createValidation, loginValidation} = require('../validation');



//to create Admin

router.post('/create', async (req, res) =>{
    //validate request body
    const {error}  = createValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //check if email exists
    const emailExists = Admin.findOne({"email":req.body.email});

    if(emailExists) return res.status(400).send("Email Exists");

    //to hash password
    
    const salt = await bcrypt.genSalt(10);
    const passwordhash = await bcrypt.hash(req.body.password, salt); 


    //create Admin
    const newAdmin = new Admin({
        email: req.body.email,
        password: passwordhash,
        userName: req.body.userName
    });
    try{
        const savedadmin = await newAdmin.save();
     res.json({Admin: savedadmin._id});
    }
    catch(err)
    {
        res.status(400).json({message: err})
    }
});

//to get all admins
router.get('/', async (req, res)=>{
    try{
        const admins = await Admin.find();
        res.json(admins);
    }
    catch(err)
    {
        res.json({message: err});
    }
});

router.patch('/:id', async (req,res)=>{
    try{
        const updatedAdmin= await Admin.updateOne({"_id":req.params.id},
        {$set:{userName:req.body.userName}}
        );
        res.json(updatedAdmin);
    }
    catch(err)
    {
        res.json({message: err});

    }
});


router.delete('/delete/:id', async (req, res) =>{
    try{
        const deletedAdmin = await Admin.remove({"_id":req.params.id})
        res.send("Deleted Admin");
    }
    catch(err)
    {
        res.json({message: err});
    }
})

router.post('/login', async (req, res) =>{
    
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //checkign for email
    const admin = await Admin.findOne({email: req.body.email});
    if(!admin) return res.status(400).send("Email or Password is invalid");

    const validPass = await bcrypt.compare(req.body.password, admin.password);

    if(!validPass) return res.status(400).send('Email or Password invalid');

    const token = jwt.sign({_id: admin._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send("Success");

});

module.exports =router;