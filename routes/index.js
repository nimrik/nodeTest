const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const db = require('monk')('localhost:27017/test');
const userData = db.get('user-data');

const url = 'mongodb://localhost:27017/test';


router.get('/forms', (req, res, next) => {
    res.render('forms');
});
router.get('/get-data', (req, res, next) => {
    const data = userData.find({}).then(docs => {
        res.render('forms', {items: docs})
    });
});

router.post('/insert', (req, res, next) => {
    const item = {
        title: req.body.title,
        content: req.body.content,
        author: req.body.author
    };

    userData.insert(item);

    res.redirect('/forms')
});
router.post('/update', (req, res, next) => {
    let item = {
        title: req.body.title,
        content: req.body.content,
        author: req.body.author
    };
    let id = req.body.id;

    userData.update ({"_id": db.id(id)}, {$set: item});
});
router.post('/delete', (req, res, next) => {
    let id = req.body.id;

    userData.remove({"_id": db.id(id)})
});

/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('index', {
        title: 'Supp bro',
        condition: true,
        array: [1, 2, 3],
        success: req.session.success,
        errors: req.session.errors
    });

    req.session.errors = null;
});


router.post('/submitError', [
        check('email', 'Invalid email adress').isEmail(),
        check('password', 'Invalid password').isLength({min: 4}),
        check('confirmPassword', 'Passwords do not match').custom((value, {req}) => (value === req.body.password))
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if (errors.length) {
            req.session.errors = errors;
            req.session.success = false;
            console.log(req.session.errors, "req.session.errors");
        } else {
            req.session.success = true;
        }
        res.redirect('/');
    }
);

router.get('/test/:id', (req, res, next) => {
    res.render('test', {output: req.params.id})
});

router.post('/test/submit', (req, res, next) => {
    let id = req.body.id;
    res.redirect('/test/' + id)
});

module.exports = router;
