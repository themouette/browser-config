// Define and access application configuration the same way,
// no matter the environment.
//
// Configuration can be overriden easily, all you need to do is to
// set the value again.
//
// Universal module definiton.
// This module can be used both through AMD and CommonJS
(function (root, factory) {
  if (typeof exports === 'object') module.exports = factory();
  else if (typeof define === 'function' && define.amd) define(factory);
  else root.Config = factory();
}(this, function () {
    // This is a Array.prototype.reduce Polyfill method
    if ('function' !== typeof Array.prototype.reduce) {
        Array.prototype.reduce = function(callback, opt_initialValue){
            'use strict';
            if (null === this || 'undefined' === typeof this) {
            // At the moment all modern browsers, that support strict mode, have
            // native implementation of Array.prototype.reduce. For instance, IE8
            // does not support strict mode, so this check is actually useless.
            throw new TypeError(
                'Array.prototype.reduce called on null or undefined');
            }
            if ('function' !== typeof callback) {
                throw new TypeError(callback + ' is not a function');
            }
            var index, value,
                length = this.length >>> 0,
                isValueSet = false;
            if (1 < arguments.length) {
                value = opt_initialValue;
                isValueSet = true;
            }
            for (index = 0; length > index; ++index) {
                if (this.hasOwnProperty(index)) {
                    if (isValueSet) {
                        value = callback(value, this[index], index, this);
                    }
                    else {
                        value = this[index];
                        isValueSet = true;
                    }
                }
            }
            if (!isValueSet) {
                throw new TypeError('Reduce of empty array with no initial value');
            }
            return value;
        };
    }

    // Some exception messages
    var messages = {
        invalid_src: 'Invalid source object.'
    };

    // Constructor
    var Config = function (config) {
        this.data = {};
        if (config) {
            this.set(config);
        }
    };

    // if first argument is an Array, then `method` will be mapped
    // on every item.
    //
    // Note that extra parameters will be preserved.
    //
    // ``` js
    // function doSomething(value) {/* ... */};
    // var doBetter = Config.scalarOrArray(doSomething);
    //
    // doBetter(['a', 'b'], extra); // calls `doSomething('a', extra)` and
    //                              // then `doSomething('b', extra)`
    // doBetter('a', extra);        // calls `doSomething('a', extra)`
    // ```
    Config.scalarOrArray = function scalarOrArray(method) {
        return function () {
            var extra = _.rest(arguments);
            var arg = _.first(arguments);
            if (_.isArray(arg)) {
                return _.map(arg, function (arg) {
                    return method.apply(this, [arg].concat(extra));
                }, this);
            }
            return method.apply(this, arguments);
        };
    };

    // add the ability to a function to accept object instead of
    // `key`, `value` arguments.
    // Original funciton will be called as many time as the object length.
    //
    // Note that extra parameters will be preserved.
    //
    // ``` js
    // function doSomething(key, value) {/* ... */};
    // var doBetter = Config.keyValueOrObject(doSomething);
    //
    // doBetter({a:'foo', b: 'bar'}, extra); // calls `doSomething('a', 'foo', extra)` and
    //                                       // then `doSomething('b', 'bar', extra)`
    // doBetter('a', 'foo', extra);          // calls `doSomething('a', 'foo', extra)`
    // ```
    Config.keyValueOrObject = function keyValueOrObject(method) {
        return function (key, value) {
            var extra;
            if (typeof(key) !== "string") {
                extra = _.rest(arguments, 1);
                return _.map(key, function (value, key) {
                    return method.apply(this, [key, value].concat(extra));
                }, this);
            }
            extra = _.rest(arguments, 2);
            return method.apply(this, arguments);
        };
    };

    // deeply read a property.
    //
    // ``` js
    // var o = {a: {b: {c: 'foo'}}};
    // utils.get('a.b.c');             // returns 'foo'
    // utils.get('a.b.d', 'default');  // returns 'default' as `b` has no `d` property.
    // ```
    //
    // This method is already decorated with `scalarOrArray`, that makes
    // it possible to call directly with an array of arguments:
    //
    // ``` js
    // var o = new Config({a: {b: {c: 'foo'}}});
    // config.get(['a.b.c', 'a.b.d'], 'default'); // returns ['foo', 'default']
    // ```
    Config.prototype.get = Config.scalarOrArray(function (key, alt) {
        if (!key) {
            return this.data;
        }
        var keys = key.split('.');
        var result = _.reduce(keys, function (accumulator, property) {
            if (accumulator && property in accumulator) {
                return accumulator[property];
            }

            return ;
        }, this.data);

        return result != null ?
            result :
            alt;
    });

    // deeply set a property.
    //
    // In case task is impossible, then an error is thrown.
    //
    // ``` js
    // var o = new Config({a: {b: {c: 'foo'}}});
    // utils.setProperty('a.b.c', 'bar');
    // utils.setProperty('d.e.f', 'baz');
    // ```
    //
    // This method is already decorated with `keyValueOrObject`, that makes
    // it possible to call directly with an object:
    //
    // ``` js
    // var o = new Config({a: {b: {c: 'foo'}}});
    // utils.setProperty({
    //     'a.b.c': 'bar',
    //     'd.e.f': 'baz'
    // });
    // ```
    Config.prototype.set = Config.keyValueOrObject(function (key, value) {
        var keys = key.split('.');
        var prop = keys.pop();
        var result = _.reduce(keys, function (accumulator, property) {
            if (!accumulator instanceof Object) {
                throw new Error(messages.invalid_src);
            }
            if (property in accumulator) {
                return accumulator[property];
            }
            // create the property as an object
            accumulator[property] = {};

            return accumulator[property];
        }, this.data);

        if (prop) {
            result[prop] = value;
        }
    });

    // Return a Config object, representing the subset matching `key`.
    //
    // ``` js
    // var o = {a: {b: {c: 'foo'}}};
    // utils.subset('a.b.c');            // returns 'foo'
    // utils.subset('a.b', {d: 'bar'});  // returns Config({c: 'foo', d: 'bar'}).
    // ```
    //
    // This method is already decorated with `scalarOrArray`, that makes
    // it possible to call directly with an array of arguments:
    //
    // ``` js
    // var o = new Config({a: {b: {c: 'foo'}}});
    // config.get(['a.b.c', 'a.b.d']); // returns ['foo', 'default']
    // ```
    Config.prototype.subset = Config.scalarOrArray(function (key, defaults) {
        var ret = new Config(defaults);
        ret.set(this.get(key));

        return ret;
    });

    return Config;
}));
