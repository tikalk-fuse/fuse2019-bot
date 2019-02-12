const git = require('simple-git/promise');

const param = process.argv[2];
console.log(param);


const obtainRepo = async (remote, dir) => {
    try {
        console.info('starting to work');
        const clone = await git().silent(true).clone(remote);
        console.info('cloned');
        return clone;
    } catch(err) {
        const _err = new Error([err]);
        console.log('clone error:: ',  err.stack);
        if (_err.message.match(/destination path '.*' already exists and is not an empty directory/)) {
            console.log('already cloned. pulling...');
            return git(dir).pull('origin', 'stage')
        };
        return err;
    }
}

class GitBot {

    constructor(config) {
        const {
          user,
          password,
          repo
        } = config;
        this._config = config;
        this.dir = /\/([^.\/]*)\.git/.exec(repo)[1];console.log('dir', this.dir)
        this.remote = repo.replace('https://', `https://${encodeURIComponent(user)}:${encodeURIComponent(password)}@`);
    }
    
    // git checkout
    async kickoff({branch}) {
        try {
        await obtainRepo(this.remote, this.dir);
        console.log('entering stage');
        await git(this.dir).checkout('stage');
        console.log('creating branch ' ,  branch );
        await git(this.dir).checkoutLocalBranch(branch);

        } catch(err) {
            console.warn('problem kickoff', err);
            return err;
        }
    }

    // don't merge
    async reject({branch}) {
        try {

        } catch(err) {
            console.warn(err);
            return err;
        }
    }

    // merge to stage 
    async accept({branch}) {
        try {

        } catch(err) {
            console.warn(err);
            return err;
        }
    }
}

const botFactory = (config) =>  console.log('creating', config) || new GitBot(config);

module.exports = botFactory

