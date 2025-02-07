const _ = require('lodash');
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

function validate(user) 
{
  const schema = {
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().required().max(255).email(),
    password: Joi.string().min(5).max(255).required()
  };
  return Joi.validate(user, schema);
}

router.get('/me', auth, async (req, res) =>
{
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
});

router.post('/', async (req, res) =>
{
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email});
    
    if (user) return res.status(400).send('User already registered.');
    
    user = new User(_.pick(req.body, ['firstName', 'lastName', 'email', 'password']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    const token = user.generateAuthToken();
    req.session.user = user._id;
    req.session.userToken = token;
    res.header('x-auth-token', token).redirect('/');
});

module.exports = router;