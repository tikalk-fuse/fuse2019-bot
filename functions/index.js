'use strict';
const util = require('util');
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const admin = require('firebase-admin');
// Required for side-effects
admin.initializeApp(functions.config().firebase);
// Initialize Cloud Firestore through Firebase
const db = admin.firestore();

const gitController = require('./lib/git-controller')({
  user:     'fuse2019team4',
  password: 'fus3#t3am4',
  repo:     'https://github.com/tikalk-fuse/fuse-2019-the-product.git'
});
const msgController = require('./lib/msg-formatter');


process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

function logAgent(agent, title) {
    console.log(title, util.inspect(agent, {showHidden: true, depth: 1}));
}


exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
    console.log('wtf');
    const agent = new WebhookClient({request, response});
    const parameters = request.body.queryResult.parameters;
    const fulfillmentText = request.body.queryResult.fulfillmentText;

    console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
    console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
    agent.add(fulfillmentText);

    async function kickoffEffort(agent) {
        logAgent('kickoffEffort', agent);

        //extract parameters
        const featureCode = agent.parameters['feature-code']; // string, branch name
        //notify the user for choose

        return gitController.kickoff({branch:featureCode})
            .then(() => {
                const msg = msgController.kickedOffSuccess(featureCode);
                agent.add(msg);
            })
            .catch((err) => {
                const msg = msgController.kickedOffFailed(featureCode, err);
                agent.add(msg);
            })
            .catch((err) => agent.add('oh, dear. snap. sorry, something had hit me...'))
    }

    async function acceptEffort(agent) {
        logAgent('acceptEffort', agent);
        //extract parameters
        const featureCode = agent.parameters['feature-code'];
        //notify the user for choose

        return gitController.accept({branch:featureCode})
            .then(() => {
                const msg = msgController.acceptSuccess(featureCode);
                agent.add(msg);
            })
            .catch((err) => {
                const msg = msgController.acceptFailed(featureCode);
                agent.add(msg);
            })
            .catch((err) => agent.add('oh, dear. snap. sorry, something had hit me...'))
    }

    async function rejectEffort(agent) {
        logAgent('rejectEffort', agent);

        //extract parameters
        const featureCode = agent.parameters['feature-code'];
        //notify the user for choose

        return gitController.reject({branch:featureCode})
            .then(() => {
                const msg = msgController.rejectSuccess(featureCode);
                agent.add(msg);
            })
            .catch((err) => {
                const msg = msgController.rejectFailed(featureCode);
                agent.add(msg);
            })
            .catch((err) => agent.add('oh, dear. snap. sorry, something had hit me...'))
    }

    async function releaseToProd(agent) {
        logAgent('releaseToProd', agent);

        return gitController.toMaster()
            .then(() => {
                const msg = msgController.toMasterSuccess(featureCode);
                agent.add(msg);
            })
            .catch((err) => {
                const msg = msgController.toMasterFailed(featureCode);
                agent.add(msg);
            })
            .catch((err) => agent.add('oh, dear. snap. sorry, something had hit me...'))

    }

// Run the proper function handler based on the matched Dialogflow intent name
    let intentMap = new Map();
    intentMap.set('kickoff-effort', kickoffEffort);
    intentMap.set('accept-effort', acceptEffort);
    intentMap.set('reject-effort', rejectEffort);
    intentMap.set('to-production', releaseToProd);

    agent.handleRequest(intentMap);
})
;
