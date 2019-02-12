'use strict';
const util = require('util');
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const admin = require('firebase-admin');
// Required for side-effects
admin.initializeApp(functions.config().firebase);
// Initialize Cloud Firestore through Firebase
const db = admin.firestore();

const gitController = require('./lib/git-controller')({});
const msgController = require('./lib/msg-formatter');


process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

function logAgent(agent) {
    console.log(util.inspect(agent, {showHidden: true, depth: 1}));
}


exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
    console.log('wtf');
    const agent = new WebhookClient({request, response});
    const parameters = request.body.queryResult.parameters;

    console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
    console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

    async function kickoffEffort(agent) {
        //extract parameters
        const featureCode = agent.parameters['feature-code']; // string, branch name
        //notify the user for choose
        agent.add(`You chose feature-code: ${featureCode}`);

        logAgent(agent);

        return gitController.kickoff(featureCode)
            .then(() => {
                const msg = msgController.kickedOffSuccess(featureCode);
                agent.add(msg);
            })
            .catch((err) => {
                const msg = msgController.kickedOffFailed(featureCode);
                agent.add(msg);
            })
    }

    async function acceptEffort(agent) {
        gitController.accept()
            .then(() => {
                const msg = msgController.acceptSuccess(featureCode);
                agent.add(msg);
            })
            .catch((err) => {
                const msg = msgController.acceptFailed(featureCode);
                agent.add(msg);
            })
    }

    async function rejectEffort(agent) {
        gitController.reject()
            .then(() => {
                const msg = msgController.rejectSuccess(featureCode);
                agent.add(msg);
            })
            .catch((err) => {
                const msg = msgController.rejectFailed(featureCode);
                agent.add(msg);
            })
    }

    async function releaseToProd(agent) {
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
