const Submission = require('../../models/Submission');
const express = require('express');
const router = express.Router();

router.get('/', (req, res) =>
{
    res.render('home/submissions',
    {
        user: req.session.user
    });
});

router.post('/submit', (req, res) =>
{
    let filename = '';
    let file = req.files.fileUpload;
    filename = Date.now() + '-' + file.name;
    file.mv('./public/uploads/' + filename, (err)=>
    {
        if (err) throw err;
    });

    const newSubmission = new Submission(
        {
            name: req.body.name,
            description: req.body.description,
            email: req.body.email,
            file: filename
        }
    );

    newSubmission.save().then(savedSubmission =>
    {
        console.log(savedSubmission);
        res.redirect('/');
    }).catch(error =>
    {
        console.log(error.errors, 'Could not submit post!');
        res.status(400).send('Invalid post.');
    })
});

module.exports = router;