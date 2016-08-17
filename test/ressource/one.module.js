/**
 * Created by jonathan on 17/08/16.
 */

"use strict";

let ambira = require('../../ambira');

module.exports = ambira.module('one',[
    'lodash',
    function(lodash) {

        function test1(){
            return true;
        }

        function testlodash(){
            return lodash.assignIn({a:0},{b:1});
        }

        return {
            test1:test1,
            testlodash:testlodash
        }
    }]);