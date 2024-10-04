require('dotenv').config();
const {TestUser} = require("html-e2e")
const HtmlSolution = require('./htmlSolution.js')

module.exports = async function(){
    async function runHtmlSolution(){
        return await HtmlSolution()
    }

    const solution = await runHtmlSolution()
    const testUser = await TestUser()

    await testUser.open(solution.url)
    await testUser.set('credentials', process.env.OPENAI_API_KEY)


    return Object.freeze({
        addTest,
        runTests,
        setContext,
        getTestResponseFor,
        getTest,
        close
    })

    async function addTest(question, responseEvaluation){
        await testUser.set("question", question)
        await testUser.set("response evaluation", responseEvaluation)
        await testUser.doAction("add test")
        let testId = await testUser.get('latest test id') //TODO: improve testuser to return the last element of a list, the first element of a list...
        return testId
    }

    async function runTests(){
        await testUser.doAction('run all')
        await delay(10000) //TODO: improve the testUser so that it waits for progress to finish looking for visible <progress> tags
        let result = await testUser.get('result')
        return {passed: result == 'passed'}
    }

    async function close(){
        await testUser.close()
        await solution.close()
    }

    async function setContext(context){
        await testUser.set('context', context)
    }

    async function getTestResponseFor(testId){
        let response = await testUser.get(`test${testId} response`)
        return response
    }

    async function getTest(id){
        let question = await testUser.get(`test${id} question`)
        let responseEvaluation = await testUser.get(`test${id} response evaluation`)
        let result = await testUser.get(`test${id} result`)
        return {question, responseEvaluation, passed: result == 'passed'}
    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
