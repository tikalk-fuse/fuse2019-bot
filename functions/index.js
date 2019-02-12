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
        // extract params from agent
        // pass parmas to kickof
        const result = await gitController.kickoff()
        // then()
        //     success: return ok
        //     catch: return message

        // return gitController.kickoff(p)
        //     .then(() => { OK })
        //     .catch((er)) => {...})
    }

    async function acceptEffort(agent) {
        gitController.accept()
    }

    async function rejectEffort(agent) {
        gitController.reject()
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