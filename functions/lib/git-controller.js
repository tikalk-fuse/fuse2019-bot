//kickof-effort
//accept-effort
//reject-effort
module.exports = ({}) => {
    return {
        kickoff: () => Promise.resolve(),
        accept: () => Promise.resolve(),
        reject: () => Promise.resolve()
    }
}