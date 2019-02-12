const cmd = process.argv[2];
const branch = process.argv[3];

if (!cmd || !branch) {
    console.error(`
Synopsys: node bin/git-ctrl [cmd] [branch]

    must provide [cmd] and [branch]
`);
    process.exit(1);
}

const gitCtrl = require('../lib/git-controller')({
  user:     'fuse2019team4',
  password: 'fus3#t3am4',
  repo:     'https://github.com/tikalk-fuse/fuse-2019-the-product.git'
});

if (!gitCtrl[cmd]) {
    console.error('no such command: %s.\n commands: kickoff, reject, accept', cmd);
    process.exit(1);
}

run(gitCtrl, cmd, branch);

async function run(gitCtrl, cmd, branch) {
    try {
      await gitCtrl[cmd]({branch})
      console.log('ok')
    } catch(e) {
      console.error('err', e)
    }
}
