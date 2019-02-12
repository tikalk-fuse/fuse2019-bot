const {assign} = Object;
const fs = require('fs');
const path = require('path');
const git = require('simple-git/promise');

const obtainRepo = async (remote, dir) => {
    try {
        console.info('starting to work');
        const clone = await git().silent(true).clone(remote);
        console.info('cloned');
        return clone;
    } catch(err) {
        const _err = new Error([err]);
        if (_err.message.match(/destination path '.*' already exists and is not an empty directory/)) {
            console.log('already cloned. pulling...');
            return git(dir).pull('origin', 'stage')
        };
        console.log('clone error:: ',  err.stack);
        throw err;
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
        this.repo = repo;
        this.dir = /\/([^.\/]*)\.git/.exec(repo)[1];console.log('dir', this.dir)
        this.remote = repo.replace('https://', `https://${encodeURIComponent(user)}:${encodeURIComponent(password)}@`);
    }

    // git checkout
    async kickoff({branch}) {
        try {
            await obtainRepo(this.remote, this.dir);
            console.log('gitCtrl.kickoff - entering stage');
            await git(this.dir).checkout('stage');
            console.log('gitCtrl.kickoff - creating branch ',  branch );
            await git(this.dir).checkoutLocalBranch(branch);
            console.log('gitCtrl.kickoff - updating CHANGELOG.md');
            await new Promise((a,r) => {
                fs.appendFile(path.join(this.dir, 'CHANGELOG.md'), ` - ${branch} - started work at: ${new Date()}`,
                  err => err ? r(err) : a()
                )
            });
            console.log('gitCtrl.kickoff - adding CHANGELOG to changelist');
            await git(this.dir).add('./CHANGELOG.md');
            console.log('gitCtrl.kickoff - commiting change')
            await git(this.dir).commit("kickoff " + branch);
            console.log('gitCtrl.kickoff - pushing');
            await git(this.dir).push('origin', branch);

        } catch (err) {
            console.log(err);
            err = new Error([err]);
            if (err.message.match(/A branch named '.* already exists/))
                assign(err, { code: 'EGITBRANCHEXISTS' });

            throw assign(err, { branch });
       }
    }

    // don't merge
    async reject({branch}) {
        try {
            console.log('gitCtrl.reject - pusing --delete');
            await git(this.dir).push('origin', branch, {'--delete': null});
        } catch(err) {
            err = new Error([err]);
            if (err.message.match(/remote ref does not exist/)) {
                assign(err, {code: 'EGITBRANCHNOTFOUND'})
            }
            throw assign(err, {branch});
            return err;
        }
    }

    // merge to stage
    async accept({branch}) {
        try {
            await obtainRepo(this.remote, this.dir);
            console.log('gitCtrl.accept - entering stage');
            await git(this.dir).checkout('stage');
            console.log('gitCtrl.accept - merging -> stage', branch);
            await git(this.dir).mergeFromTo(branch, 'stage');
            console.log('gitCtrl.accept - pushing');
            const summary = await git(this.dir).push('origin', 'stage');
            console.log('gitCtrl.accept - cleanup ', branch);
            await git(this.dir).push('origin', branch, {'--delete': null});
            return summary;
        } catch(err) {
            err = new Error([err]);
            if (err.message.match(/remote ref does not exist/)) {
                assign(err, {code: 'EGITBRANCHNOTFOUND'})
            }
            throw assign(err, {branch});
        }
    }
}

const botFactory = (config) =>  console.log('creating', config) || new GitBot(config);

module.exports = botFactory

