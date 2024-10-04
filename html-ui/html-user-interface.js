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
        getTestResponse,
        close
    })

    async function addTest(question, responseEvaluation){
        await testUser.set("question", question)
        await testUser.set("response evaluation", responseEvaluation)
        await testUser.doAction("add test")
    }

    async function runTests(){
        await testUser.doAction('run all')
        await delay(5000) //TODO: improve the testUser so that it waits for progress to finish looking for visible <progress> tags
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

    async function getTestResponse(){
        let response = await testUser.get('response')
        debugger
        return response
    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
