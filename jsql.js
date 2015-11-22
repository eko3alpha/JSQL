/* globals define */
'use strict';
(function(root, factory){
    if(typeof define === 'function' && define.amd){
        // AMD. Register as an anonymous module.
        define([], factory);
    } else{
        // Browser globals
        root.JSQL = factory();
    }
}(this, function(){

    /*----------------------------------------------------------------
    // Polyfills
    -----------------------------------------------------------------*/

    // .trim()
    if(typeof String.prototype.trim !== 'function'){
        String.prototype.trim = function(){
            return this.replace(/^\s+|\s+$/g, '');
        };
    }

    // .isArray()
    if(!Array.isArray){
        Array.isArray = function(arg){
            return Object.prototype.toString.call(arg) === '[object Array]';
        };
    }

    // .keys()
    if(typeof Object.keys !== 'function'){
        Object.keys = function(obj){
            if(typeof obj !== 'object' && typeof obj !== 'function' || obj === null){
                throw TypeError('Object.keys called on non-object');
            }
            var keys = [];
            for(var p in obj){
                obj.hasOwnProperty(p) && keys.push(p);
            }
            return keys;
        };
    }

    // .indexOf()
    if(!Array.prototype.indexOf){
        Array.prototype.indexOf = function(elt /*, from*/){
            var len = this.length >>> 0;
            var from = Number(arguments[1]) || 0;
            from = (from < 0) ?
             Math.ceil(from)
                 : Math.floor(from);
            if(from < 0)
              from += len;

            for(; from < len; from++){
                if(from in this &&
                    this[from] === elt)
                  return from;
            }
            return -1;
        };
    }

    /*----------------------------------------------------------------
    // End Polyfills
    -----------------------------------------------------------------*/

    /**
     * Constructor
     *
     * @constructor
     * @param {Array} value
     */

    var JSQL = function(value){
        this.data = value;
        this.tmp = value;

        this.query = {
            debug: {
                count: value.length,
                operations: []
            },
            options: {
                ignoreEmptyString: false
            },
            select: [],
            distinct: undefined,
            sort: {}
        };
    };

    /**
     * Utility to merge defaults with user options
     *
     * @private
     * @param {Object} defaults Default settings
     * @param {Object} options User options
     * @returns {Object} Merged values of defaults and options
     */

    JSQL.prototype._extend = function(defaults, options){
        var extended = {};
        var prop;
        for(prop in defaults){
            if(defaults.hasOwnProperty(prop)){
                extended[prop] = defaults[prop];
            }
        }
        for(prop in options){
            if(options.hasOwnProperty(prop)){
                extended[prop] = options[prop];
            }
        }
        return extended;
    };

    /**
     * Utility to search a collection of objects
     * that match passed properties
     *
     * @private
     * @param  {Array} collection array of objects
     * @param  {Object} property   object containing properties to search
     * @return {Array}            collection of matched objects
     */

    JSQL.prototype._queryObj = function(collection, property){
        if(this._isObjectEmpty(property)){
            return [];
        }
        return this._filter(collection, function(obj){
            for(var prop in property){
                if(property.hasOwnProperty(prop)){
                    if(String(obj[prop]) !== String(property[prop])){
                        return false;
                    }
                }
            }
            return true;
        });
    };

    /**
     * Utility to check if value is empty object
     *
     * @private
     * @param  {Object}  obj value to check
     * @return {Boolean}
     */

    JSQL.prototype._isObjectEmpty = function(obj){
        for(var prop in obj){
            if(obj.hasOwnProperty(prop)){
                return false;
            }
        }
        return true;
    };

    /**
     * Gets an array of unique values
     *
     * @private
     * @param  {Array} list array to extract uniques
     * @return {Array}      unique values
     */

    JSQL.prototype._getUnique = function(list){
        var seen = [];
        return this._filter(list, function(x){
            if(seen.indexOf(x) !== -1){
                return false;
            }
            seen.push(x);
            return true;
        });
    };

    /**
     * Creates a new array with all elements
     * that pass the test implemented by the provided function.
     *
     * @private
     * @param  {Array}   list     list to filter on
     * @param  {Function} callback callback to execute on each iteration
     * @return {Array}
     */

    JSQL.prototype._filter = function(list, callback){
        var passedElements = [];
        var i;
        var len = list.length;
        for(i = 0; i < len; i++){
            if(callback(list[i])){
                passedElements.push(list[i]);
            }
        }
        return passedElements;
    };

    /**
     * Mapping function
     *
     * @private
     * @param  {Array}   list     list of values
     * @param  {Function} callback function to execute on every value
     * @return {*}
     */

    JSQL.prototype._map = function(list, callback){
        var mapped = [];
        var i;
        var len = list.length;
        for(i = 0; i < len; i++){
            mapped.push(callback(list[i]));
        }
        return mapped;
    };

    /**
     * Extracts the given keys
     *
     * @private
     * @param  {Array} list list of objects
     * @param  {String} key  property to extract
     * @return {Array}
     */

    JSQL.prototype._pluck = function(list, key){
        var i = 0;
        var len = list.length
        var plucked = [];
        for(i = 0; i < len; i++){
            plucked.push(list[i][key]);
        }
        return plucked;
    };

    /**
     * Extracts the properties given from
     * objects.  Select implementation
     *
     * @private
     * @param  {Array} list List of objects
     * @param  {Array} keys Properties to extract
     * @return {Array}
     */

    JSQL.prototype._pluckMany = function(list, keys){
        return this._map(list, function(item){
            var obj = {};
            var i;
            var len = keys.length;
            for(i = 0; i < len; i++){
                obj[keys[i]] = item[keys[i]];
            }

            return obj;
        });
    };

    /**
     * Removes any properties with empty strings
     * or strings with white spaces
     * from the seraches, based off of the
     * ignoreEmptyString implementation
     *
     * @private
     * @param  {Object} obj object to strip
     * @return {Object}
     */

    JSQL.prototype._stripEmptyProps = function(obj){
        var clean = {};
        for(var prop in obj){
            if(obj.hasOwnProperty(prop)){
                if(typeof obj[prop] !== 'string' || obj[prop].trim() !== ''){
                    clean[prop] = obj[prop];
                }
            }
        }
        return clean;
    };

    JSQL.prototype._stripEmptyPropsFromCollection = function(list){
        var i = 0;
        var len = list.length;
        for(i = 0; i < len; i++){
            list[i] = this._stripEmptyProps(list[i]);
        }
        return list;
    };

    /**
     * Adds operation to queue
     *
     * @private
     * @return {Undefined}
     */

    JSQL.prototype._addOp = function(op){
        this.query.debug.operations.push(op);
    };

    /**
     * Returns stats related to query
     *
     * @public
     * @returns {Object}
     */

    JSQL.prototype.debug = function(){
        return this.query.debug;
    };

    /**
     * Query options
     *
     * @public
     * @param  {Object} options options
     * @return {JSQL}
     */

    JSQL.prototype.options = function(options){
        this.query.options = this._extend(this.query.options, options);
        return this;
    };

    /**
     * Applies options on arguments
     *
     * @private
     * @param  {Array} args Array of arguments
     * @return {Array}
     */

    JSQL.prototype._applyOptions = function(args){

        // apply ignore empty string
        if(this._getOpt('ignoreEmptyString')){
            args = this._stripEmptyPropsFromCollection(args);
        }
        return args;
    };

    /**
     * Returns the option value
     *
     * @private
     * @param  {String} option option key
     * @return {*}
     */

    JSQL.prototype._getOpt = function(option){
        return this.query.options[option];
    };

    /**
     * Processes the arguments passed in the
     * where clause
     *
     * @private
     * @param  {Array} args Array of arguments
     * @return {Object}
     */

    JSQL.prototype._processArguments = function(args){

        var info = {clause: 'VOID', args: undefined, type: 0};

        // no arguments
        if(args.length === 0){
            info.type = 1;
            return info;
        }

        // invalid arguments
        if(args[0] === null || args[0] === undefined){
            info.type = 2;
            return info;
        }

        // unwrap array
        if(args.length === 1 && Array.isArray(args[0])){
            args = args[0];
        }

        // where({a: 10}) => [{a: 10}]
        // where({}) => [{}]
        if(args.length === 1 && typeof args[0] === 'object'){
            info.args = args[0];
            info.clause = 'AND';
            info.type = 5;
            return info;
        }

        // where('a', 44) => [{'a': 44}]
        if(args.length === 2 && typeof args[0] === 'string'){
            var newObj = {};
            newObj[args[0]] = args[1];
            info.args = newObj;
            info.clause = 'AND';
            info.type = 6;
            return info;
        }

        // where({a: 10} , {a:12, b:23}) => [{a: 10} , {a:12, b:23}]
        if(args.length > 1 && this._areAllObjects(args)){
            info.args = args;
            info.clause = 'OR';
            info.type = 7;
            return info;
        }

        info.type = 8;
        return info;
    };

    /**
     * Similiar to SELECT in SQL
     * will filter out only the properties passed
     * as arguments
     *
     * @public
     * @return {JSQL} 0 or many string arguments allowed
     */

    JSQL.prototype.select = function(){
        this._addOp('select');
        this._reset();
        this.query.select = arguments;
        return this;
    };

    /**
     * Where clause
     * ('a', 'b') : where 'a' = 'b'
     * ({'a': 1, 'b': 2}): where 'a' = 1 and 'b' = 2
     * ([{'a': 1}, {'b': 2}]) : where 'a' = 1 or 'b' = 2
     * ({'a': 1}, {'b': 2}) : where 'a' = 1 or 'b' = 2
     *
     * @public
     * @param  {*}
     * @return {JSQL}
     */

    JSQL.prototype.where = function(){

        var info = this._processArguments(arguments);
        info.args = this._applyOptions(info.args);

        if(info.clause === 'AND'){
            this.tmp = this._queryObj(this.tmp, info.args);
            return this;
        }

        if(info.clause === 'OR'){
            this._orWhere(info.args);
            return this;
        }

        return this;
    };

    /**
     * Returns objects with any property that contains
     * the value given, truthy ( == )
     *
     * @public
     * @param  {*} val value to test against
     * @return {JSQL}
     */

    JSQL.prototype.contains = function(val){
        this._addOp('contains');
        this.tmp = this._filter(this.tmp, function(obj){
            for(var prop in obj){
                if(obj.hasOwnProperty(prop)){
                    if(obj[prop] == val){
                        return true;
                    }
                }
            }
            return false;
        });
        return this;
    };

    /**
     * Checks if all elements are objects {}
     *
     * @private
     * @param  {Array} list collection of items
     * @return {Boolean}
     */

    JSQL.prototype._areAllObjects = function(list){
        var i;
        var len = list.length;

        // if list is empty []
        if(len === 0){
            return false;
        }

        for(i = 0; i < len; i++){
            if(typeof list[i] !== 'object' || list[i] === null){
                return false;
            }
        }
        return true;
    };

    /**
     * Or where clause
     *
     * @private
     * @param  {Array} val objects containing where clauses
     * @return {Undefined}
     */

    JSQL.prototype._orWhere = function(val){
        this._addOp('orWhere');
        var self = this;
        this.tmp = this._filter(this.tmp, function(obj){
                        var i;
                        var len = val.length;
                        for(i = 0; i < len; i++){
                            if(self._queryObj([obj], val[i]).length){
                                return true;
                            }
                        }
                        return false;
                    });
    };

    /**
     * Sets the sorting values for later processing
     *
     * @public
     * @param  {String} key  key to sort on
     * @param  {String|Undefined} sort what sorting type to use
     * @return {JSQL}
     */

    JSQL.prototype.sortBy = function(key, sort){
        if(typeof key === 'object'){
            for(var props in key){
                if(key.hasOwnProperty(props)){
                    if(key[props] === 'desc'){
                        this.sortDesc(props);
                    } else{
                        this.sortAsc(props);
                    }
                }
            }
            return this;
        }

        if(sort === 'desc'){
            this.sortDesc(key);
            return this;
        }
        this.sortAsc(key);
        return this;
    };

    /**
     * Adds entry for sorting key to asc
     *
     * @public
     * @param  {String} val key to sort on
     * @return {JSQL}
     */

    JSQL.prototype.sortAsc = function(val){
        this.query.sort[val] = 1;
        return this;
    };

    /**
     * Adds entry for sorting key to desc
     *
     * @public
     * @param  {String} val key to sort on
     * @return {JSQL}
     */

    JSQL.prototype.sortDesc = function(val){
        this.query.sort[val] = -1;
        return this;
    };

    /**
     * Sorting Implementation
     *
     * @private
     * @param  {Array} list list to sort on
     * @param  {Object} sort object containing sort criteria
     * @return {Array}      sorted collection
     */

    JSQL.prototype._getSorted = function(list, sort){
        var keys = Object.keys(sort);
        var sorted = this._sortFirstBy(keys[0], sort[keys[0]]);
        if(keys.length === 1){
            return list.sort(sorted);
        }

        delete sort[keys[0]];
        for(var prop in sort){
            if(sort.hasOwnProperty(prop)){
                this._addOp('sort');
                sorted = sorted.thenBy(prop, sort[prop]);
            }
        }

        return list.sort(sorted);
    };

    /**
     * Micro library that helps sorting arrays on multiple keys by Teun Duynstee
     * https://github.com/Teun/thenBy.js
     * @private
     */

    JSQL.prototype._sortFirstBy = (function(){
        function makeCompareFunction(f, sort){
            if(typeof(f) !== 'function'){
                var prop = f;
                f = function(v1, v2){
                    return v1[prop] < v2[prop] ? -1 : (v1[prop] > v2[prop] ? 1 : 0);
                };
            }
            if(f.length === 1){
                // f is a unary function mapping a single item to its sort score
                var uf = f;
                f = function(v1, v2){
                    return uf(v1) < uf(v2) ? -1 : (uf(v1) > uf(v2) ? 1 : 0);
                };
            }
            if(sort === -1){
                return function(v1, v2){
                    return -f(v1,v2);
                };
            }
            return f;
        }
        /* mixin for the `thenBy` property */

        function extend(f, d){
            f = makeCompareFunction(f, d);
            f.thenBy = tb;
            return f;
        }

        /* adds a secondary compare function to the target function (`this` context)
           which is applied in case the first one returns 0 (equal)
           returns a new compare function, which has a `thenBy` method as well */

        function tb(y, d){
            var x = this;
            y = makeCompareFunction(y, d);
            return extend(function(a, b){
                return x(a,b) || y(a,b);
            });
        }
        return extend;
    })();

    /**
     * Constrains the number of items in a result set
     *
     * @public
     * @param  {Number} limit  maximum number of objects to return
     * @param  {Number|Null} offset the offset of the first object to return
     * @return {JSQL}
     */

    JSQL.prototype.limit = function(limit, offset){
        this._addOp('limit');
        offset = offset || 0;
        this.tmp = this.tmp.slice(0 + offset, limit + offset);
        return this;
    };

    /**
     * Checks if value is in an array set
     *
     * @public
     * @param  {String} key property to test
     * @param  {Array} val array set to check in
     * @return {JSQL}
     */

    JSQL.prototype.isIn = function(key, val){
        this._addOp('in');
        this.tmp = this._filter(this.tmp, function(obj){
            return val.indexOf(obj[key]) !== -1;
        });
        return this;
    };

    /**
     * Checks if value is not in an array set
     *
     * @public
     * @param  {String} key property to test
     * @param  {Array} val array set to check in
     * @return {JSQL}
     */

    JSQL.prototype.isNotIn = function(key, val){
        this._addOp('notIn');
        this.tmp = this._filter(this.tmp, function(obj){
            return val.indexOf(obj[key]) === -1;
        });
        return this;
    };

    /**
     * Retrieve values within a range
     * default is inclusive
     *
     * @public
     * @param  {String} key property to check
     * @param  {Number} min minimum value
     * @param  {Number} max maximum value
     * @param  {Boolean} exclusive flag
     * @return {JSQL}
     */

    JSQL.prototype.between = function(key, min, max, exclusive){
        this._addOp('between');
        if(exclusive){
            this.tmp = this._filter(this.tmp, function(obj){
                return min < obj[key] && obj[key] < max;
            });
            return this;
        }

        this.tmp = this._filter(this.tmp, function(obj){
            return min <= obj[key] && obj[key] <= max;
        });
        return this;

    };

    /**
     * Regular Expression search
     *
     * @public
     * @param  {String} key   key property to check
     * @param  {Object} regex regular exression /expression/
     * @param  {Boolean} i     case insensitive flag
     * @return {JSQL}
     */

    JSQL.prototype.regEx = function(key, regex, i){
        this._addOp('regex');
        // case insensitive
        var regexObj;
        if(i){
            regexObj = new RegExp(regex, 'i');
            this.tmp = this._filter(this.tmp, function(obj){
                return regexObj.test(obj[key]);
            });
            return this;
        }

        regexObj = new RegExp(regex);
        this.tmp = this._filter(this.tmp, function(obj){
            return regexObj.test(obj[key]);
        });

        return this;
    };

    /**
     * Gets string version of escaped regular expression
     *
     * @private
     * @param  {String} val string regular expression
     * @return {String}     escaped regex as string
     */

    JSQL.prototype._escapeRegex = function(val){
        return String(val).replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    };

    /**
     * Gets objects that have property that starts with value
     *
     * @public
     * @param  {String} key property name
     * @param  {String} val string fragment
     * @return {JSQL}
     */

    JSQL.prototype.startsWith = function(key, val){
        this._addOp('startsWith');
        val = this._escapeRegex(val);
        this.regEx(key, '^' + val, true);
        return this;
    };

    /**
     * Gets objects that have property that ends with value
     *
     * @public
     * @param  {String} key property name
     * @param  {String} val string fragment
     * @return {JSQL}
     */

    JSQL.prototype.endsWith = function(key, val){
        this._addOp('endsWith');
        val = this._escapeRegex(val);
        this.regEx(key, val + '$', true);
        return this;
    };

    /**
     * Gets objects that have property that contains value
     *
     * @public
     * @param  {String} key property name
     * @param  {String} val string fragment
     * @return {JSQL}
     */

    JSQL.prototype.like = function(key, val){
        this._addOp('like');
        val = this._escapeRegex(val);
        this.regEx(key, val, true);
        return this;
    };

    /**
     * Less than
     *
     * @public
     * @param  {String} key property name
     * @param  {number} val number to test against
     * @return {JSQL}
     */

    JSQL.prototype.lt = function(key, val){
        this._addOp('lt');
        this.tmp = this._filter(this.tmp, function(obj){
            return obj[key] < val;
        });
        return this;
    };

    /**
      * Greater than
      *
      * @public
      * @param  {String} key property name
      * @param  {number} val number to test against
      * @return {JSQL}
      */

    JSQL.prototype.gt = function(key, val){
        this._addOp('gt');
        this.tmp = this._filter(this.tmp, function(obj){
            return obj[key] > val;
        });
        return this;
    };

    /**
      * Less than or equal to
      *
      * @public
      * @param  {String} key property name
      * @param  {number} val number to test against
      * @return {JSQL}
      */

    JSQL.prototype.lte = function(key, val){
        this._addOp('lte');
        this.tmp = this._filter(this.tmp, function(obj){
            return obj[key] <= val;
        });
        return this;
    };

    /**
      * Greater than or equal to
      *
      * @public
      * @param  {String} key property name
      * @param  {number} val number to test against
      * @return {JSQL}
      */

    JSQL.prototype.gte = function(key, val){
        this._addOp('gte');
        this.tmp = this._filter(this.tmp, function(obj){
            return obj[key] >= val;
        });
        return this;
    };

    /**
     * Allows you to set new property values,
     * object is accessible within the callback
     *
     * @public
     * @param  {Function} callback function to execute
     * @return {JSQL}
     */

    JSQL.prototype.transform = function(callback){
        this._addOp('transform');
        var i = 0;
        var len = this.tmp.length;
        for(i = 0; i < len; i++){
            callback(this.tmp[i]);
        }
        return this;
    };

    /**
     * Returns value of internal collection
     * applying rules
     *
     * @public
     * @return {Array}
     */

    JSQL.prototype.get = function(){
        var finalVal = this.tmp;

        if(!this._isObjectEmpty(this.query.sort)){
            finalVal = this._getSorted(finalVal, this.query.sort);
        }

        if(this.query.select.length){
            finalVal = this._pluckMany(finalVal, this.query.select);
        }

        if(this.query.distinct){
            this._addOp('distinct');
            finalVal = this._getUnique(this._filter(this._pluck(finalVal, this.query.distinct), function(item){
                if(item === undefined){
                    return false;
                }
                return true;
            }));
        }

        return finalVal;
    };

    /**
     * Returns the first object in collection
     * after rules have been applied
     *
     * @public
     * @return {JSQL}
     */

    JSQL.prototype.getOne = function(){
        return this.get().slice(0, 1)[0];
    };

    /**
     * Sets unique values of a property to
     * extract once rules applied
     *
     * @public
     * @param  {String} val property to get uniques from
     * @return {JSQL}
     */

    JSQL.prototype.distinct = function(val){
        this.query.distinct = val;
        return this;
    };

    /**
     * Resets internal value
     *
     * @private
     * @return {Undefined}
     */

    JSQL.prototype._reset = function(){
        this.tmp = this.data;
        this.query = {
            debug: {
                count: this.data.length,
                operations: []
            },
            options: {},
            select: [],
            distinct: undefined,
            sort: {}
        };
    };

    return JSQL;
}));
