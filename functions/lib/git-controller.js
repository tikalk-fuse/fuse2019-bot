const git = require('simple-git/promise');

const USER = 'fuse2019team4';
const PASS = 'fuse3#t3am4';
const REPO = 'github.com/tikalk-fuse/fuse-2019-the-product.git';

const remote = `https://${USER}:${encodeURIComponent(PASS)}@${REPO}`;

const param = process.argv[2];
console.log(param);


const obtainRepo = async () => {
    try {
        console.info('starting to work');
        const clone = await git().silent(true).clone(remote);
        return clone;
    } catch(err) {
            const _err = new Error([err]);
            if (_err.message.includes('already exists')) return git().pull();
            return err;
    }
}

class GitBot {

    constructor(config) {
        this._config = config;
    }
    
    // git checkout
    async kickoff({featureCode}) {
        try {
        await obtainRepo();
        await git().checkoutBranch(featureCode);

        } catch(err) {
            console.warn(err);
            return err;
        }
    }

    // don't merge
    async eject({featureCode}) {
        try {

        } catch(err) {
            console.warn(err);
            return err;
        }
    }

    // merge to stage 
    async accept({featureCode}) {
        try {

        } catch(err) {
            console.warn(err);
            return err;
        }
    }
}

const botFactory = (config) =>  new GitBot(config);

botFactory({}).kickoff({featureCode: 'feature/666-yair-test-fix'})
.then(() => {
   console.log(foo);
})
.catch(err => console.log(err));

