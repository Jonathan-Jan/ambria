/**
 * Created by jonathan on 17/08/16.
 */

"use strict";

let modules = {};
let lodash = require('lodash');

/**
 * Two way to call this function.
 * first :
 *      paramter one : name
 *      paramter two : module
 * second :
 *      paramter one : Object (which is basicaly a key-value object where key is a name and value is a module)
 */
function register() {
    if (arguments.length == 1) {
        registerAll(arguments[0]);
    }
    else if (arguments.length == 2) {
        registerModule(arguments[0], arguments[1]);
    }
}

/**
 * Inject the given module
 * and inject the module dependencies into himself
 * @param name
 * @param moduleSkeleton : ['dependency1','dependency2', function(dependency1,dependency2){return module}]
 */
function mod(name, moduleSkeleton) {
    //if there is only one param, we return a registered module
    if (arguments.length == 1) {
        return modules[name];
    }

    //if moduleSkeleton is not an Array, we assume that it is a module which has to be registered as it
    if (!(moduleSkeleton instanceof Array)) {
        register(name, moduleSkeleton);

        //chain function
        // return {
        //     module: this.module,
        //     get: function() {
        //         return moduleSkeleton;
        //     }
        // };
        return createChain(name, moduleSkeleton);
    }

    //getting the function which will build the module
    let func = moduleSkeleton[moduleSkeleton.length-1];
    //check
    if (typeof func !== 'function' ) {
        throw new Error('last parameter should be a function');
    }
    //removing the function
    moduleSkeleton.splice(moduleSkeleton.length-1, 1);

    //getting dependecies...
    let params = [];
    let missing = [];
    moduleSkeleton = moduleSkeleton.length > 0 ? moduleSkeleton : getParamNames(func);
    moduleSkeleton.forEach(name => {

        let module = modules[name];
        if (!module) {
            try {
                module = require(name);
            }
            catch(err){
                missing.push(name);
            }
        }
        params.push(module);
    });

    if (missing.length > 0) {
        let err = new Error("Missing dependencies : " + missing.join(" "));
        err.missing = missing;
        throw err;
    }

    let module = func.apply(func, params);

    register(name, module);

    //chain function
    return createChain(name, module);
}

function createChain(name, registeredModule) {
    if (registeredModule.module) {
        console.warn('the module', name,'already has a module attribute. call "get" function on this to retrieve the module');
        return {
            module: mod,
            get: function() {
                return registeredModule;
            }
        };
    }
    else {
        registeredModule.module = mod;
        return registeredModule;
    }
}

let STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
let ARGUMENT_NAMES = /([^\s,]+)/g;
/**
 * Retrieve parameter name from a function
 * thanks to http://stackoverflow.com/questions/1007981/how-to-get-function-parameter-names-values-dynamically-from-javascript
 * @param func
 * @returns {Array|{index: number, input: string}}
 */
function getParamNames(func) {
    var fnStr = func.toString().replace(STRIP_COMMENTS, '');
    var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
    if(result === null)
        result = [];
    return result;
}


/**
 * Register a module
 * @param name
 * @param module
 */
function registerModule(name, module) {
    modules[name] = module;
}

/**
 * Register all given module
 * @param modulesToInject
 */
function registerAll(modulesToInject) {
    lodash.assignIn(modules, modulesToInject);
}

function unregisterModule(name) {
    delete modules[name];
}

module.exports = new function() {
    this.module = mod;
    this.unregisterModule = unregisterModule;
};