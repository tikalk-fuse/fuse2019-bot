const express = require('express');
const app = express();
const port = 80;
const gitController = require('./functions/lib/git-controller')({
    user:     'fuse2019team4',
    password: 'fus3#t3am4',
    repo:     'https://github.com/tikalk-fuse/fuse-2019-the-product.git'
});
const msgController = require('./functions/lib/msg-formatter');

app.get('/kickoff', (req, res) => {
    const featureCode = req.query.featureCode;

    gitController.kickoff({branch:featureCode})
        .then(() => {
            const msg = msgController.kickedOffSuccess(featureCode);

            res.type('json')
            res.send({
                message: msg
            })
        })
        .catch((err) => {
            const msg = msgController.kickedOffFailed(featureCode, err);

            res.type('json')
            res.send({
                message: msg
            })
        })
        .catch((err) => {
            res.type('json')
            res.send({
                message: 'oh, dear. snap. sorry, something had hit me...'
            })
        })
});

app.get('/accept', (req, res) => {
    const featureCode = req.query.featureCode;

    gitController.kickoff({branch:featureCode})
        .then(() => {
            const msg = msgController.acceptSuccess(featureCode);

            res.type('json')
            res.send({
                message: msg
            })
        })
        .catch((err) => {
            const msg = msgController.acceptFailed(featureCode, err);

            res.type('json')
            res.send({
                message: msg
            })
        })
        .catch((err) => {
            res.type('json')
            res.send({
                message: 'oh, dear. snap. sorry, something had hit me...'
            })
        })
});

app.get('/reject', (req, res) => {
    const featureCode = req.query.featureCode;

    gitController.kickoff({branch:featureCode})
        .then(() => {
            const msg = msgController.rejectSuccess(featureCode);

            res.type('json')
            res.send({
                message: msg
            })
        })
        .catch((err) => {
            const msg = msgController.rejectFailed(featureCode, err);

            res.type('json')
            res.send({
                message: msg
            })
        })
        .catch((err) => {
            res.type('json')
            res.send({
                message: 'oh, dear. snap. sorry, something had hit me...'
            })
        })
});

app.get('/release', (req, res) => {
    const featureCode = req.query.featureCode;

    gitController.kickoff({branch:featureCode})
        .then(() => {
            const msg = msgController.kickedOffSuccess(featureCode);

            res.type('json')
            res.send({
                message: msg
            })
        })
        .catch((err) => {
            const msg = msgController.kickedOffFailed(featureCode, err);

            res.type('json')
            res.send({
                message: msg
            })
        })
        .catch((err) => {
            res.type('json')
            res.send({
                message: 'oh, dear. snap. sorry, something had hit me...'
            })
        })
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
