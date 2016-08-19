/**
 * Created by jonathan on 18/08/16.
 */

"use strict";

let ambria = require('../../ambria');

module.exports = ambria.module('two',[

    function(one, lodash) {

        function testGetOne(){
            return one;
        }

        function testLodash() {
            return lodash;
        }

        return {
            testGetOne: testGetOne,
            testLodash:testLodash
        }
    }
]);