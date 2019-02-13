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
    const fulfillmentText = request.body.queryResult.fulfillmentText;

    console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
    console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
    agent.add(fulfillmentText);

    async function kickoffEffort(agent) {

        logAgent('kickoffEffort', agent);
        const featureCode = agent.parameters['feature-code']; // string, branch name
        agent.add(`You chose feature-code: ${featureCode}`);

        return axios(`${SVC_BASE_URL}/kickoff/${featureCode}`)
        .then((body) => {
            agent.add(body.data.message)
            // agent.add("Just a moment, I`ll let you know when its ready!")
            // checkup(body.data.url, body.data.message);
        })
        .catch((err) => console.log('errored - ', err) || agent.add('oh, dear. snap. sorry, something had hit me...'))

        function checkup(url, msg) {
            console.log("checkup parameters - ", url, msg);

            axios.get(url)
                .then(() => {
                    console.log("checkup result - Success writing", msg);
                    agent.add(msg)
                })
                .catch((err) => console.log("checkup result - Failed trying again") || setTimeout(() => checkup(url, msg), 1000))
        }
    }

    async function acceptEffort(agent) {
        logAgent('acceptEffort', agent);
        //extract parameters
        const featureCode = agent.parameters['feature-code'];
        //notify the user for choose

        return axios(`${SVC_BASE_URL}/accept/${featureCode}`)
        .then((body) => {
            agent.add(body.data.message)
        })
        .catch((err) => console.log('errored - ', err) || agent.add('oh, dear. snap. sorry, something had hit me...'))
    }

    async function rejectEffort(agent) {
        logAgent('rejectEffort', agent);

        //extract parameters
        const featureCode = agent.parameters['feature-code'];
        //notify the user for choose

        agent.add(`You chose feature-code: ${featureCode}`);

        return axios(`${SVC_BASE_URL}/reject/${featureCode}`)
        .then((body) => {
            agent.add(body.data.message)
        })
        .catch((err) => console.log('errored - ', err) || agent.add('oh, dear. snap. sorry, something had hit me...'))
    }

    async function releaseToProd(agent) {
        logAgent('releaseToProd', agent);

        return axios(`${SVC_BASE_URL}/release`)
        .then((body) => {
            agent.add(body.data.message)
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
