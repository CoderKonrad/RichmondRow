const _ = require('lodash');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const cookies = require('cookies');

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

router.get('/', (req, res) =>
{
    res.send('testing');
})
router.post('/', async (req, res) =>
{
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email});
    
    if (!user) return res.status(400).send('Invalid email or password.');
    
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid email or password.');

    const token = user.generateAuthToken();
    req.session.user = user._id;
    req.session.userToken = token;
    res.header('x-auth-token', token).redirect('/');

  
});

function validate(req)
{
    const schema = 
    {
        email: Joi.string().max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    };
    return Joi.validate(req, schema);
}
module.exports = router;