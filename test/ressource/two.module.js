/**
 * Created by jonathan on 17/08/16.
 */

"use strict";

let ambria = require('../../ambria');

module.exports = ambria.module('two',[
    'one',
    function(one) {

        function testGetOne(){
            return one;
        }

        return {
            testGetOne: testGetOne
        }
    }]);