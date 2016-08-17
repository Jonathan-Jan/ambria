/**
 * Created by jonathan on 17/08/16.
 */

"use strict";

let assert = require('assert');

let ambria = require('../ambria');

/**
 * Ambria test
 */
describe('ambria', function() {

    beforeEach(function() {
        delete require.cache['/home/jonathan/Projects/ambria/test/ressource/one.module.js'];
        delete require.cache['/home/jonathan/Projects/ambria/test/ressource/two.module.js'];
        delete require.cache['/home/jonathan/Projects/ambria/test/ressource/three.module.js'];
        delete require.cache[require.resolve('lodash')];

        ambria.unregisterModule('lodash');
        ambria.unregisterModule('one');
        ambria.unregisterModule('two');
        ambria.unregisterModule('three');
    });

    describe('#inject()', function () {

        /**
         * You can see this test as a NodeJS application entry point
         */
        it('lazy injection test', function () {
            ambria.module('lodash', require('lodash'));
            let one = require('./ressource/one.module');
            let two = require('./ressource/two.module');

            assert(one.test1());
            assert.deepEqual(one.testlodash(), {a:0,b:1});
            assert(two.testGetOne());
            assert.deepEqual(two.testGetOne().testlodash(), {a:0,b:1});

            assert(ambria.module('lodash').assignIn);
            assert(ambria.module('one').testlodash);
            assert(ambria.module('two').testGetOne);
        });

        it('chained injection test', function () {
            ambria
                .module('lodash', require('lodash'))
                .module('three', require('./ressource/three.module'));

            assert(ambria.module('lodash').assignIn);
            assert(ambria.module('three').test1());
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