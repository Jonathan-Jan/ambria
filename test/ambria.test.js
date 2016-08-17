/**
 * Created by jonathan on 17/08/16.
 */

"use strict";

let assert = require('assert');

let ambira = require('../ambira');

/**
 * Ambria test
 */
describe('ambria', function() {

    beforeEach(function() {
        delete require.cache['/home/jonathan/Projects/ambria/test/ressource/one.module.js'];
        delete require.cache['/home/jonathan/Projects/ambria/test/ressource/two.module.js'];
        delete require.cache['/home/jonathan/Projects/ambria/test/ressource/three.module.js'];
        ambira.unregisterModule('lodash');
        ambira.unregisterModule('one');
        ambira.unregisterModule('two');
        ambira.unregisterModule('three');
    });

    describe('#inject()', function () {

        /**
         * You can see this test as a NodeJS application entry point
         */
        it('lazy injection test', function () {
            ambira.module('lodash', require('lodash'));
            let one = require('./ressource/one.module').get();
            let two = require('./ressource/two.module').get();

            assert(one.test1());
            assert.deepEqual(one.testlodash(), {a:0,b:1});
            assert(two.testGetOne());
            assert.deepEqual(two.testGetOne().testlodash(), {a:0,b:1});

            assert(ambira.module('lodash').assignIn);
            assert(ambira.module('one').testlodash);
            assert(ambira.module('two').testGetOne);
        });

        it('chained injection test', function () {
            ambira
                .module('lodash', require('lodash'))
                .module('three', require('./ressource/three.module'));

            assert(ambira.module('lodash').assignIn);
            assert(ambira.module('three').test1());
        });
    });

    describe('#inject() Error', function () {
        it('lazy injection test', function () {
            let res = false;
            let missing = [];
            try {
                require('./ressource/one.module');
            } catch(err){
                res = true;
                missing = err.missing;
            }
            assert(res);
            assert(missing);
            assert.deepEqual(missing[0], 'lodash');
        });
    });
});