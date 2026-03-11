import express from 'express';
import {User} from '../models/user.model.js';
import { randomBytes, createHmac } from 'crypto';
import jwt from 'jsonwebtoken';
import { ensureAuthenticated } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.patch('/', ensureAuthenticated, async(req,res) => {
    const {name} = req.body;
    await User.findByIdAndUpdate(req.user._id, {name});
    return res.status(200).json({status: 'success', data: {name}});
})

router.post('/signup', async(req,res) => {
    const {name, email, password} = req.body;
    const existingUser = await User.findOne({email});

    if(existingUser){
        return res.status(400).json({message: 'User already exists!'});
    }

    const salt = await randomBytes(256).toString('hex');
    const hashedPassword = await createHmac('sha256', salt).update(password).digest('hex');

    const user = await User.insertOne({
        name,
        email,
        password: hashedPassword,
        salt,
    })

    return res.status(201).json({status: 'success', data: {id: user._id}});  
});

router.post('/login', async(req,res) => {
    const {email, password} = req.body;
    const existingUser = await User.findOne({
        email,
    });
    if(!existingUser){
        return res.status(400).json({message: `User with ${email} does not exist`});
    }
    const salt = existingUser.salt;
    const hashedPassword = existingUser.password;

    const hashedLoginPassword = await createHmac('sha256', salt).update(password).digest('hex');
    if(hashedLoginPassword !== hashedPassword){
        return res.status(400).json({message: 'Invalid credentials!'});
    }
    const payload = {
        name: existingUser.name,
        _id: existingUser._id,
        email: existingUser.email,
    }
    const token = jwt.sign(payload, process.env.JWT_SECRET);
    return res.status(200).json({status: 'success', data: {token}});

})

export default router;