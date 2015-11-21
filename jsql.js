/* globals define,  _ */
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

    var JSQL = function(value){
        this.data = value;
        this.tmp  = value;

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
     * @param  {array} collection array of objects
     * @param  {object} property   object containing properties to search
     * @return {array}            collection of matched objects
     */
    JSQL.prototype._queryObj = function(collection, property){
        //console.log('filter query', property);
        //console.log('filter over collection', collection[0]);

        if(this._isObjectEmpty(property)){
            return [];
        }

        return this._filter(collection, function(obj){
            for(var prop in property){
                if(property.hasOwnProperty(prop)){
                    //console.log(obj, obj[prop], '!=', property[prop]);
                    if(obj[prop] != property[prop]){
                        //console.log('REJECT', obj);
                        return false;
                    }
                }
            }
            //console.log('PASS', obj);
            return true;
        });
    };

    /**
     * Utility to check if value is empty object
     *
     * @private
     * @param  {mixed}  value value to check
     * @return {Boolean}
     */
    JSQL.prototype._isObjectEmpty = function(obj){
        for(var prop in obj) {
            if(obj.hasOwnProperty(prop)){
                return false;
            }
        }
        return true;
    };

    /**
     * Gets an array of unique values
     *
     * @param  {array} list array to extract uniques
     * @return {array}      unique values
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
     * @param  {[type]}   list     [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
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
     * @param  {array}   list     list of values
     * @param  {Function} callback function to execute on every value
     * @return {mixed}
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
     * @param  {array} list list of objects
     * @param  {string} key  property to extract
     * @return {array}
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
     * @param  {array} list list of objects
     * @param  {array} keys properties to extract
     * @return {object}
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
     * @private
     * @param  {object} obj object to strip
     * @return {object}
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
        for(i=0; i<len; i++){
            list[i] = this._stripEmptyProps(list[i]);
        }
        return list;
    };

    /**
     * Adds operation to queue
     *
     * @private
     * @return {void}
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
        //console.log(this.query.debug);
        return this.query.debug;
    };

    /**
     * Query options
     *
     * @param  {object} options options
     * @return {void}
     */
    JSQL.prototype.options = function(options){
        this.query.options = this._extend(this.query.options, options);
        return this;
    };

    JSQL.prototype._applyOptions = function(args){

        // apply ignore empty string
        if(this._getOpt('ignoreEmptyString')){
            args = this._stripEmptyPropsFromCollection(args);
        }

        return args;
    };

    /**
     * Returns the option value
     * @private
     * @param  {string} option option key
     * @return {mixed}
     */

    JSQL.prototype._getOpt = function(option){
        return this.query.options[option];
    };

    /**
     * Similiar to SELECT in SQL
     * will filter out only the properties passed
     * as arguments
     *
     * @public
     * @return {string} 0 or many string arguments allowed
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
     * @param  {string|array|object} val
     * @param  {string|number}
     * @return {object}
     */
    JSQL.prototype.where = function(){

        var args = arguments;
//console.log("------------------------------");
//console.log('data:', this.data);
//console.log('tmp:', this.tmp);
//console.log('arguments:', args);
//console.log('type:', typeof args);
//console.log('empty', this._isObjectEmpty(args))
        // no arguments
        if(args.length === 0){
            return this;
        }

        // empty array passed
        if(args.length === 1 && args[0].length === 0){
            return this;
        }

//console.log('length', args.length)
//console.log(1)
        // where('a', 44)
        if(args.length === 2 && typeof args[0] === 'string'){
           /* this._addOp('where');
            var obj = {};
            obj[arguments[0]] = arguments[1];
            obj = this._stripEmptyProps(obj, this._getOpt('ignoreEmptyString'));
            this.tmp = this._queryObj(this.tmp, obj);
            return this;*/
            args = {};
            args[arguments[0]] = arguments[1];
            args = [args]
        }
//console.log(2)

        args = this._applyOptions(args);

        // where({a: 10} , {a:12, b:23})
        if(args.length > 1 && this._areAllObjects(args)){
            this.orWhere(args);
            return this;
        }
//console.log(3)

        // where([{a: 10} , {a:12, b:23}])
        if(Array.isArray(args[0])){
            this.orWhere(args[0]);
            return this;
        }

        if(this._isObjectEmpty(args)){
            return this;
        }

//console.log(4)
//console.log('data:', this.data);
//console.log('tmp:', this.tmp);
        // where({a: 10})
        if(typeof args[0] === 'object'){
            this._addOp('where');
            this.tmp = this._queryObj(this.tmp, args[0]);
            return this;
        }

//console.log(5)

        throw 'Invalid arguments for where clause';
    };

    /**
     * Returns objects with any property that contains
     * the value given, truthy ( == )
     *
     * @public
     * @param  {mixed} val value to test against
     * @return {object}
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
     * Checks if all elmeents are objects {}
     *
     * @private
     * @param  {array} list collection of items
     * @return {boolean}
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
     * @public
     * @param  {array} val objects containing where clauses
     * @return {object}
     */
    JSQL.prototype.orWhere = function(val){
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
        return this;
    };

    /**
     * Similiar to a JOIN however it will merge only
     * the given items
     *
     * @public
     * @param  {number|string} leftKey    key to match
     * @param  {array} collection collection to join on
     * @param  {string} oldKey     current key name in collection
     * @param  {string} newKey     new key name for joined value
     * @return {object}
     */
    JSQL.prototype.associate = function(leftKey, collection, oldKey, newKey){
        var newCollection = [];
        var i;
        var len = this.tmp.length;
        var val;
        for(i = 0; i < len; i++){
            val = this._queryObj(collection, {id: this.tmp[i][leftKey]});
            if(val.length === 1){
                this.tmp[i][newKey] = val[0][oldKey];
            } else{
                this.tmp[i][newKey] = undefined;
            }
            newCollection.push(this.tmp[i]);
        }

        this.tmp = newCollection;
        return this;
    };

    /**
     * Sets the sorting values for later processing
     *
     * @public
     * @param  {string} key  key to sort on
     * @param  {string|undefined} sort what sorting type to use
     * @return {object}
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
        } else{
            this.sortAsc(key);
        }
        return this;
    };

    /**
     * Adds entry for sorting key to asc
     *
     * @public
     * @param  {string} val key to sort on
     * @return {object}
     */
    JSQL.prototype.sortAsc = function(val){
        this.query.sort[val] = 1;
        return this;
    };

    /**
     * Adds entry for sorting key to desc
     *
     * @public
     * @param  {string} val key to sort on
     * @return {object}
     */
    JSQL.prototype.sortDesc = function(val){
        this.query.sort[val] = -1;
        return this;
    };

    /**
     * Implementation of the sorting
     *
     * @private
     * @param  {array} list list to sort on
     * @param  {object} sort object containing sort criteria
     * @return {array}      sorted collection
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
     * @param  {integer} limit  maximum number of objects to return
     * @param  {integer} offset the offset of the first object to return
     * @return {array}
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
     * @param  {string} key property to test
     * @param  {array} val array set to check in
     * @return {object}
     */
    JSQL.prototype.in = function(key, val){
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
     * @param  {string} key property to test
     * @param  {array} val array set to check in
     * @return {object}
     */
    JSQL.prototype.notIn = function(key, val){
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
     * @param  {string} key property to check
     * @param  {integer} min minimum value
     * @param  {integer} max maximum value
     * @param  {boolean} exclusive flag
     * @return {object}
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
     * @param  {string} key   key property to check
     * @param  {regEx} regex regular exression /expression/
     * @param  {boolean} i     case insensitive flag
     * @return {object}
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
     * @param  {string} val string regular expression
     * @return {string}     escaped regex as string
     */
    JSQL.prototype._escapeRegex = function(val){
        return String(val).replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    };

    /**
     * Gets objects that have property that starts with value
     *
     * @public
     * @param  {string} key property name
     * @param  {string} val string fragment
     * @return {object}
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
     * @param  {string} key property name
     * @param  {string} val string fragment
     * @return {object}
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
     * @param  {string} key property name
     * @param  {string} val string fragment
     * @return {object}
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
     * @param  {string} key property name
     * @param  {number} val number to test against
     * @return {object}
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
      * @param  {string} key property name
      * @param  {number} val number to test against
      * @return {object}
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
      * @param  {string} key property name
      * @param  {number} val number to test against
      * @return {object}
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
      * @param  {string} key property name
      * @param  {number} val number to test against
      * @return {object}
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
     * @return {object}
     */
    JSQL.prototype.transform = function(callback){
        this._addOp('transform');
        var i = 0;
        var len = this.tmp.length;
        for(i = 0 ; i < len; i++){
            callback(this.tmp[i]);
        }
        return this;
    };

    /**
     * Returns value of internal collection
     * applying rules
     *
     * @public
     * @return {array}
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
     * @return {object}
     */
    JSQL.prototype.getOne = function(){
        return this.get().slice(0, 1)[0];
    };

    /**
     * Returns count of objects at
     * any given point in the query
     *
     * @public
     * @return {integer}
     */
    JSQL.prototype.count = function(){
        return this.tmp.length;
    };

    /**
     * Sets unique values of a property to
     * extract once rules applied
     *
     * @public
     * @param  {string} val property to get uniques from
     * @return {object}
     */
    JSQL.prototype.distinct = function(val){
        this.query.distinct = val;
        return this;
    };

    /**
     * Resets internal value
     * @private
     *
     * @return {void}
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
