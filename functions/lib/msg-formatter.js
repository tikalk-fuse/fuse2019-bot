const formatMessage = (err, messages) => {
    return messages[err.code] || 'Oops, something went wrong, please try again or contact an admin';
};

module.exports = {
    kickedOffSuccess: (featureCode) => `
        Success! We have successfully kicked off a new branch.
    Your repos is located at: ${featureCode}
    Url: ${featureCode}`,
    kickedOffFailed: (featureCode, err) => formatMessage(err, {
        EGITBRANCHEXISTS: `
            Oops! it seems the banch name (${featureCode})  is taken, please choose another name or remove the existing branch by typing: "reject ${featureCode}"        
        `
    }),
    acceptSuccess: (featureCode) => `
        Success! We were able to mash all of the changes together.
        Go check it out here: ${ featureCode }    
    `,
    acceptFailed: (featureCode, err) => formatMessage(err, {
        EGITBRANCHNOTFOUND: `
            Oops! We were unable to find the project you were looking for.
            Please check that ${featureCode} exists or created it by writing: "lets kickoff ${featureCode}"
        `
    }),
    rejectSuccess: (featureCode) => `
        Ok, The branch ${ featureCode } has been removed, now what?.    
    `,
    rejectFailed: (featureCode, err) => formatMessage(err, {
        EGITBRANCHNOTFOUND: `
            Oops! We were unable to find the project you were looking for.
            Please check that ${featureCode} exists or created it by writing: "lets kickoff ${featureCode}"
        `,
    }),
}
