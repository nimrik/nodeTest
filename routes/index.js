const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const mongo = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectID;
const assert = require('assert');

const url = 'mongodb://localhost:27017/test';


router.get('/forms', (req, res, next) => {
    res.render('forms');
});
router.get('/get-data', (req, res, next) => {
    const resultArray = [];

    mongo.connect(url, (err, client) => {
        assert.equal(null, err);

        let db = client.db('test');
        const cursor = db.collection('user-data').find();

        cursor.forEach((doc, err) => {
            assert.equal(null, err);
            resultArray.push(doc)
        }, () => {
            client.close();
            res.render('forms', {items: resultArray});
        })
    });
});

router.post('/insert', (req, res, next) => {
    let item = {
        title: req.body.title,
        content: req.body.content,
        author: req.body.author
    };

    mongo.connect(url, (err, client) => {
        assert.equal(null, err);
        let db = client.db('test');
        db.collection('user-data').insertOne(item, (err, result) => {
            assert.equal(null, err);
            console.log("inserted");
            client.close();
        });
    });
});
router.post('/update', (req, res, next) => {
    let item = {
        title: req.body.title,
        content: req.body.content,
        author: req.body.author
    };
    let id = req.body.id;

    mongo.connect(url, (err, client) => {
        assert.equal(null, err);
        let db = client.db('test');
        db.collection('user-data').updateOne({'_id': objectId(id)}, {$set: item}, (err, result) => {
            assert.equal(null, err);
            console.log("Item updated");
            client.close();
        });
    });
});
router.post('/delete', (req, res, next) => {
    let id = req.body.id;

    mongo.connect(url, (err, client) => {
        assert.equal(null, err);
        let db = client.db('test');
        db.collection('user-data').deleteOne({'_id': objectId(id)}, (err, result) => {
            assert.equal(null, err);
            console.log("Item deleted");
            client.close();
        });
    });
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
