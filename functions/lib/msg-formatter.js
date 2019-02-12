const formatMessage = (err, messages) => {
    return err && messages[err.code] ? messages[err.code]:  'Oops, something went wrong, please try again or contact an admin';
};

module.exports = {
    kickedOffSuccess: (featureCode) => `
    Ok, your new branch is ready
    You can go check it out here: http://osherel.net.s3-website-us-east-1.amazonaws.com/${featureCode}`,
    kickedOffFailed: (featureCode, err) => formatMessage(err, {
        EGITBRANCHEXISTS: `
            Oops! it seems the branch name (${featureCode}) is taken, please choose another name or remove the existing branch by typing: "reject ${featureCode}"        
        `
    }),
    acceptSuccess: (featureCode) => `
        We did it! the branch ${ featureCode } is ready.
        Go check it out here: http://osherel.net.s3-website-us-east-1.amazonaws.com/${ featureCode }    
    `,
    acceptFailed: (featureCode, err) => formatMessage(err, {
        EGITBRANCHNOTFOUND: `
            Oops! We were unable to find the project you were looking for.
            Please check if ${featureCode} exists or create it by writing: "lets kickoff ${featureCode}"
        `
    }),
    rejectSuccess: (featureCode) => `
        Ok, The branch ${ featureCode } has been removed.    
    `,
    rejectFailed: (featureCode, err) => formatMessage(err, {
        EGITBRANCHNOTFOUND: `
            Oops! We were unable to find the project you were looking for.
            Please check if ${featureCode} exists or create it by writing: "lets kickoff ${featureCode}"
        `,
    }),
    toMasterSuccess: (featureCode) => `
        Ok, The branch ${ featureCode } has been pushed to master.    
    `,
    toMasterFailed: (featureCode, err) => formatMessage(err, {
        EGITBRANCHNOTFOUND: `
            Oops! We were unable to find the project you were looking for.
            Please check if ${featureCode} exists or create it by writing: "lets kickoff ${featureCode}"
        `,
    }),
}
