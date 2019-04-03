const _ = require('lodash');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const cookies = require('cookies');


router.post('/',  (req, res) =>
{
    req.session.destroy(err =>
    {
        if (err)
        {
            res.redirect('/');
        }
        res.clearCookie('sid');
        res.redirect('/');
    })
});
module.exports = router;