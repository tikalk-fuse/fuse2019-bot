const ERR_BRANCH_EXISTS = 'ERR_BRANCH_EXISTS';
const ERR_MERGE_CONFLICTS = 'ERR_MERGE_CONFLICTS';
const ERR_PROJECT_EXISTS = 'ERR_PROJECT_EXISTS';
const ERR_PROJECT_NAME_DOES_NOT_EXIST = 'ERR_PROJECT_NAME_DOES_NOT_EXIST';
const ERR_UNIDENTIFIED = 'ERR_UNIDENTIFIED';
const ERR_INSUFFICIENT_PERMISSIONS = 'ERR_INSUFFICIENT_PERMISSIONS';


const identifyErrorCase = (msg) => {
    let err = ERR_UNIDENTIFIED;

    const needles = {
        [ERR_BRANCH_EXISTS]: ['Branch name'],
        [ERR_MERGE_CONFLICTS]: ['Merge Conflict'],
        [ERR_PROJECT_EXISTS]: ['Project Exists'],
        [ERR_PROJECT_NAME_DOES_NOT_EXIST]: ['Could not find'],
    };

    /**  */
    Object.keys(needles).forEach((e) => {
        needles[e].forEach((needle) => {
            if(msg.includes(needle)) {
                err = e;
            }
        });
    });

    return err;
};

const formatMessage = (err, messages) => {
    const code = identifyErrorCase(err);

    return messages[code] || 'Unknown Error';
};

module.exports = {
    kickedOffSuccess: (featureCode) => `
        Success! We have successfully kicked off a new branch.
        Your repos is located at: ${featureCode}
        Url: ${featureCode}
        `,
    kickedOffFailed: (featureCode, err) => formatMessage(err, {
        [ERR_PROJECT_EXISTS]: `
            Oops! it seems the project name (${featureCode})  is taken, please try again        
        `,
        [ERR_BRANCH_EXISTS]: `
            Oops! it seems the branch name (${featureCode})  is taken, please try again        
        `
    }),
    acceptSuccess: (featureCode) => `
        Success! We were able to mash all of the changes together.
        Go check it out here: ${featureCode}    
    `,
    acceptFailed: (featureCode, err) => formatMessage(err, {
        [ERR_MERGE_CONFLICTS]: `
            Oops! It seems there were a few conflicts.
            Please fix them here: ${featureCode}
        `,
        [ERR_PROJECT_NAME_DOES_NOT_EXIST]: `
            Oops! We were unable to find the project you were looking for.
            Please check that ${featureCode} exists
        `
    }),
    rejectSuccess: (featureCode) => `
        Success! The branch has been removed.    
    `,
    rejectFailed: (featureCode, err) => formatMessage(err, {
        [ERR_PROJECT_NAME_DOES_NOT_EXIST]: `
            Oops! We were unable to find the project you were looking for.
            Please check that ${featureCode} exists
        `,
        [ERR_INSUFFICIENT_PERMISSIONS]: `
            Oops! We were unable to remove the project because of insufficient permissions 
            Please update the permissions at ${featureCode}
        `,
    }),
}
