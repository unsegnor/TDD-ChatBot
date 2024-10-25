/**
    This file is the entry point for the html tests.
    It mainly defines what is the user interface that we are going to use to test the logic.
    
    In this case it is the html-user-interface.
    It will run all the tests that we have defined.
**/

const test_all = require('../domain/test-cases/all')
const html_user_interface = require('./html-user-interface')

describe('Html tests', function(){
    test_all(html_user_interface)
})
