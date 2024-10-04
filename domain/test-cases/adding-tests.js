/**
    In this file we describe the tests in terms of user actions and expectations.
    We could also talk about situations in the the environment that can't be affected by the user like "today is Monday".
**/


const {expect} = require('chai');
const User = require('./test-user.js');

module.exports = function(user_interface){
    describe('Adding tests', function(){
        let user

        this.beforeEach(async function(){
            let interface = await user_interface()
            user = User(interface)
        })

        this.afterEach(async function(){
            await user.cleanUp()
        })

        it('add test with response evaluation', async () => {
            await user.addTest({
                question:"What is the color of the sky during a sunny day?",
                responseEvaluation:"Response should indicate that the sky is generally blue."
            })
            var testRunResults = await user.runTests()
            
            expect(testRunResults.passed).to.equal(true);
        });

        it('add failing test with response evaluation', async () => {
            await user.addTest({
                question:"What is the color of the sky during a sunny day?",
                responseEvaluation:"Response should indicate that the sky is generally red."
            })
            var testRunResults = await user.runTests()
            
            expect(testRunResults.passed).to.equal(false);
        });
    })
}
