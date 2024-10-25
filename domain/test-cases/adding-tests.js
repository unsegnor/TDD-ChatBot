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

        it('user can see the generated response', async () => {
            let testId = await user.addTest({
                question:"What is the color of the sky during a sunny day?",
                responseEvaluation:"Response should indicate that the sky is generally red."
            })

            await user.runTests()
            var testResponse = await user.getTestResponseFor(testId)

            expect(testResponse).to.contain("blue")

        });

        it('making test to pass with prompt', async () => {
            await user.addTest({
                question:"What is the color of the sky during a sunny day?",
                responseEvaluation:"Response should indicate that the sky is generally red."
            })

            await user.setContext("We are in a planet where the sun is red. If anyone asks you about the color of the sky you should say that is is generally red.")

            var testRunResults = await user.runTests()

            expect(testRunResults.passed).to.equal(true);
        });

        it('reviewing added tests', async () => {
            let test1Id = await user.addTest({
                question:"What is my name?",
                responseEvaluation:"Response should indicate that they don't know the name."
            })

            let test2Id = await user.addTest({
                question:"What is my age?",
                responseEvaluation:"Response should indicate that they don't know the age."
            })

            let test1Info = await user.getTest(test1Id)
            let test2Info = await user.getTest(test2Id)

            expect(test1Info.question).to.equal("What is my name?")
            expect(test1Info.responseEvaluation).to.equal("Response should indicate that they don't know the name.")

            expect(test2Info.question).to.equal("What is my age?")
            expect(test2Info.responseEvaluation).to.equal("Response should indicate that they don't know the age.")
        });

        it('reviewing executed tests', async () => {
            let test1Id = await user.addTest({
                question:"What is my name?",
                responseEvaluation:"Response should indicate that they don't know the name."
            })

            let test2Id = await user.addTest({
                question:"What is my age?",
                responseEvaluation:"Response should indicate that they don't know the age."
            })

            await user.setContext("The user lives in Salobreña.")

            await user.runTests()

            let test1response = await user.getTestResponseFor(test1Id)
            let test2response = await user.getTestResponseFor(test2Id)

            expect(test1response).to.contain('name')
            expect(test2response).to.contain('age')
        });

        it('review executed tests result', async () => {
            let test1Id = await user.addTest({
                question:"What is my name?",
                responseEvaluation:"Response should indicate that the name is Juan."
            })

            let test2Id = await user.addTest({
                question:"What is my age?",
                responseEvaluation:"Response should indicate that the age is 22."
            })

            await user.setContext("The user lives in Salobreña. Their name is Juan.")

            await user.runTests()

            let test1Info = await user.getTest(test1Id)
            let test2Info = await user.getTest(test2Id)

            expect(test1Info.passed).to.be.true
            expect(test2Info.passed).to.be.false
        });

        //TODO: add variables like the time of the day, so that we can set them in the GIVEN, which is another context specific for the test
        //TODO: allow setting a given as part of the conversation so that the question comes after several other questions
        //TODO: allow generating questions from a criteria
        //TODO: allow simulating full conversations between a fake agent with some context and our agent with the result prompt, setting the ultimate goal, the expected result of the full conversation like retrieving specific data that we know the fake user has because we added it to the context
        //TODO: ser capaz de coger una conversación real y modificar el prompt del agente hasta que es capaz de reproducir la conversación, su parte de la conversación, o algo parecido
        //también se puede hacer para sacar un fake user, un agente capaz de comportarse como un usuario típico
        //o sacar clusters de usuarios, esto es machine learning


        //TODO: just missing persistence and ability to remove tests to be ready for version 1
    })
}
