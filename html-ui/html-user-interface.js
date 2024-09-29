const {TestUser} = require("html-e2e")
const HtmlSolution = require('./htmlSolution.js')

module.exports = async function(){
    async function runHtmlSolution(){
        return await HtmlSolution()
    }

    const solution = await runHtmlSolution()
    const testUser = await TestUser()
    testUser.open(solution.url)

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
        let result = await testUser.get('result')
        return {passed: result == 'passed'}
    }

    async function close(){
        await testUser.close()
        await solution.close()
    }
}
