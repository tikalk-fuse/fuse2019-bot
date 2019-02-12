import { kickedOffSuccess, kickedOffFailed } from  "../../../lib/msg-formatter"

describe('Kick Off Success', function() {
    it('Attempts to run the kick off command', function() {
        expect(kickedOffSuccess("")).to.contain("Success")
    })
});

describe('Kick Off Error', function() {
    it('Attempts to run the kick off command', function() {
        expect(kickedOffFailed("", "Branch name already exists")).to.contain("Oops")
    })
});

describe('Accept Success', function() {
    it('Attempts to run the accept command', function() {
        expect(kickedOffSuccess("")).to.contain("Success")
    })
});

describe('Accept Error', function() {
    it('Attempts to run the accept command', function() {
        expect(kickedOffFailed("", "Merge conflict ")).to.contain("Oops")
    })
});

describe('Reject Success', function() {
    it('Attempts to run the reject command', function() {
        expect(kickedOffSuccess("")).to.contain("Success")
    })
});

describe('Reject Error', function() {
    it('Attempts to run the reject command', function() {
        expect(kickedOffFailed("", "Could not find project")).to.contain("Oops")
    })
});
