'use strict';
const util = require('util');
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const admin = require('firebase-admin');
// Required for side-effects
admin.initializeApp(functions.config().firebase);
// Initialize Cloud Firestore through Firebase
const db = admin.firestore();
const SVC_BASE_URL = 'http://54.198.91.234';

const axios = require('axios');

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

    console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
    console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

    async function kickoffEffort(agent) {
      
        logAgent('kickoffEffort', agent);
        const featureCode = agent.parameters['feature-code']; // string, branch name
        agent.add(`You chose feature-code: ${featureCode}`);

        return axios(`${SVC_BASE_URL}/kickoff/${featureCode}`)
        .then((body) => {
            body.success
              ? agent.add(msgController.kickedOffSuccess(featureCode))
              : agent.add(msgController.kickedOffFailed(featureCode))
        })
        .catch((err) => agent.add('oh, dear. snap. sorry, something had hit me...'))
    }

    async function acceptEffort(agent) {
        logAgent('acceptEffort', agent);
        //extract parameters
        const featureCode = agent.parameters['feature-code'];
        //notify the user for choose
        agent.add(`You chose feature-code: ${featureCode}`);

        return axios(`${SVC_BASE_URL}/accept/${featureCode}`)
        .then((body) => {
            body.success
              ? agent.add(msgController.acceptSuccess(featureCode))
              : agent.add(msgController.acceptFailed(featureCode))
        })
        .catch((err) => agent.add('oh, dear. snap. sorry, something had hit me...'))
    }

    async function rejectEffort(agent) {
        logAgent('rejectEffort', agent);

        //extract parameters
        const featureCode = agent.parameters['feature-code'];
        //notify the user for choose

        agent.add(`You chose feature-code: ${featureCode}`);

        return axios(`${SVC_BASE_URL}/accept/${featureCode}`)
        .then((body) => {
            body.success
              ? agent.add(msgController.rejectSuccess(featureCode))
              : agent.add(msgController.rejectFailed(featureCode))
        })
        .catch((err) => agent.add('oh, dear. snap. sorry, something had hit me...'))
    }

    async function releaseToProd(agent) {
        logAgent('releaseToProd', agent);

        return axios(`${SVC_BASE_URL}/accept/${featureCode}`)
        .then((body) => {
            body.success
              ? agent.add(msgController.toMasterSuccess(featureCode))
              : agent.add(msgController.toMasterFailed(featureCode))
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
