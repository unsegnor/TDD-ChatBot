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
        close
    })

    async function addTest(question, responseEvaluation){
        await testUser.set("question", question)
        await testUser.set("response evaluation", responseEvaluation)
        await testUser.doAction("add test")
    }

    async function runTests(){
        await testUser.doAction('run all')
        await delay(5000)
        let result = await testUser.get('result')
        return {passed: result == 'passed'}
    }

    async function close(){
        await testUser.close()
        await solution.close()
    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }
}
