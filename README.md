# Ambria

An easy to use dependency injector for NodeJS application.
To work, Ambria need you to develop your module in a particular way (quite similar to an angular controller). You will just have to add a small amount of code in your module declaration.

## Installation
```
npm install ambria
```

## Features 

 * "Automatic" dependency injection (you have to write a bit of code)
 * Automatic binding 

## Quick exemple
here's a quick exemple of how to use Ambria and what should you change in your application to make it work.

### A random node module : 
```javascript
"use strict";

let ambria = require('ambria');

module.exports = 
    // Call ambria.module function to register this has a new module.
    ambria.module(
        'one', //This module name. Other module can use him by this name
        [
            // A dependency name. Note that lodash has not been imported here. 
            // This is mandantory, but obfuscation will break your app if you don't
            'lodash', 
            function(lodash) {
        
                function assingIn(){
                    return lodash.assingIn;
                }
                
                //return whatever you need to export for this module
                return {
                    assingIn:assingIn
                }
            }
        ]
);

```

### Application entry point
```javascript
"use strict";

let ambria = require('ambria');

// register lodash into Ambria
ambria.module('lodash', require('lodash'));

// just call require and this module will be registered into ambria 
// with all of his dependencies injected
require('./ressource/one.module')

```

For more example, you can read the tests

## Use
Ambria is based on a unique function "module". which return a loaded module. It can be used in four way.

Register a module which has some dependencies :  
```javascript
//we asume that dependencyOne and dependencyTwo has already been registered.
ambria
    .module('myModule', 
    [
        'dependencyOne', 'dependencyTwo', 
        function myModuleFunction(dependencyOne, dependencyTwo){...}
    ]);
```

Register a module with dependencies (auto binding) : 
```javascript
// dependencyOne and dependencyTwo will be found by their name 
// from already registered module list, and injected into myModule
ambria.module('myModule', [function myModuleFunction(dependencyOne, dependencyTwo){...}]);
```

Register a module which does not have any dependencies : 
```javascript
ambria.module('lodash', lodash)
//just don't wrap it into an Array, and Ambria will just register the module "has it"
```

Get an already registered module : 
```javascript
ambria.module('myModule')
```

## Tips
To initialize Ambria with some module who don't need any injection, module function can be chain like it :
```javascript
ambria
    .module('lodash', lodash)
    .module('express', express)
    .module('somethingElse', somethingElse)
```
In fact, ambria add its module function on every loaded module. If this module already has an attribute named module, ambria will return an object with a function named "get" to retrieve the loaded module and the Ambria module function.

## Contributing

Contributions are welcome as long as you add test. 
Please send separate merge requests and don't combine things.

## License

MIT - see LICENSE.md.