const _ = require('lodash');
const {User, validate} = require('../../models/User');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', (req, res) =>
{
    res.send('testing');
})
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

    

    res.send(_.pick(user, ['_id', 'firstName', 'email']));
});

module.exports = router;