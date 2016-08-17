/**
 * Created by jonathan on 17/08/16.
 */

"use strict";

let ambira = require('../../ambira');

module.exports = ambira.module('two',[
    'one',
    function(one) {

        function testGetOne(){
            return one;
        }

        return {
            testGetOne: testGetOne
        }
    }]);