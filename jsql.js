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
        this.data = this.tmp = value;

        this.query = {
            select: [],
            distinct: undefined,
            sort: {}
        };
    };

    /**
     * Utility to merge defaults with user options
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
     * @private
     * @param  {array} collection array of objects
     * @param  {object} property   object containing properties to search
     * @return {array}            collection of matched objects
     */
    JSQL.prototype._queryObj = function(collection, property){
        return this._filter(collection, function(obj){
            for(var prop in property){
                if(property.hasOwnProperty(prop)){
                    if(obj[prop] != property[prop]){
                        return false;
                    }
                }
            }
            return true;
        });
    };

    /**
     * Utility to check if value is empty object
     * @private
     * @param  {mixed}  value value to check
     * @return {Boolean}
     */
    JSQL.prototype._isObjectEmpty = function(value){
        if(value === {}){
            return true;
        }
        return false;
    };

    /**
     * Gets an array of unique values
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

    JSQL.prototype.pluck = function(list, key){
        var i = 0;
        var len = list.length
        var plucked = [];
        for(i = 0; i < len; i++){
            plucked.push(list[i][key]);
        }
        return plucked;
    }

    /**
     * Query options
     * @param  {object} options options
     * @return {void}
     */

    JSQL.prototype.options = function(options){
        this.options = this._extend(this.options, options);
    };

    /**
     * Similiar to SELECT in SQL
     * will filter out only the properties passed
     * as arguments
     * @public
     * @return {string} 0 or many string arguments allowed
     */

    JSQL.prototype.select = function(){
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
    JSQL.prototype.where = function(val){

        // where({a: 10} , {a:12, b:23})
        if(arguments.length > 1 && this._areAllObjects(arguments)){
            this.orWhere(arguments);
            return this;
        }

        // where('a', 44)
        if(arguments.length === 2 && typeof arguments[0] === 'string'){
            var obj = {};
            obj[arguments[0]] = arguments[1];
            this.tmp = this._queryObj(this.tmp, obj);
            return this;
        }

        // where([{a: 10} , {a:12, b:23}])
        if(Array.isArray(val)){
            this.orWhere(val);
            return this;
        }

        // where({a: 10})
        if(typeof val === 'object'){
            this.tmp = this._queryObj(this.tmp, val);
            return this;
        }

        // no arguments
        if(arguments.length === 0){
            return this;
        }

        throw 'Invalid arguments for where clause';
    };

    /**
     * Checks if all elmeents are objects {}
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
     * @public
     * @param  {array} val objects containing where clauses
     * @return {object}
     */
    JSQL.prototype.orWhere = function(val){
        var self = this;
        this.tmp = this._filter(this.tmp, function(obj){
                        var i;
                        var len = val.length;
                        for(i = 0; i < len; i++){
                            if(self._queryObj([obj], val[i]).length){
                                return true;
                            }
                        }
                    });
        return this;
    };

    /**
     * Similiar to a JOIN however it will merge only
     * the given items
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
     * @public
     * @param  {integer} limit  maximum number of objects to return
     * @param  {integer} offset the offset of the first object to return
     * @return {array}
     */
    JSQL.prototype.limit = function(limit, offset){
        offset = offset || 0;
        this.tmp = this.tmp.slice(0 + offset, limit + offset);
        return this;
    };

    /**
     * Checks if value is in an array set
     * @public
     * @param  {string} key property to test
     * @param  {array} val array set to check in
     * @return {object}
     */
    JSQL.prototype.in = function(key, val){
        this.tmp = this._filter(this.tmp, function(obj){
            return val.indexOf(obj[key]) !== -1;
        });
        return this;
    };

    /**
     * Checks if value is not in an array set
     * @public
     * @param  {string} key property to test
     * @param  {array} val array set to check in
     * @return {object}
     */
    JSQL.prototype.notIn = function(key, val){
        this.tmp = this._filter(this.tmp, function(obj){
            return val.indexOf(obj[key]) === -1;
        });
        return this;
    };

    /**
     * Retrieve values within a range
     * default is inclusive
     * @public
     * @param  {string} key property to check
     * @param  {integer} min minimum value
     * @param  {integer} max maximum value
     * @param  {boolean} exclusive flag
     * @return {object}
     */
    JSQL.prototype.between = function(key, min, max, exclusive){
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
     * @public
     * @param  {string} key   key property to check
     * @param  {regEx} regex regular exression /expression/
     * @param  {boolean} i     case insensitive flag
     * @return {object}
     */
    JSQL.prototype.regEx = function(key, regex, i){
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
     * @private
     * @param  {string} val string regular expression
     * @return {string}     escaped regex as string
     */
    JSQL.prototype._escapeRegex = function(val){
        return String(val).replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    };

    /**
     * Gets objects that have property that starts with value
     * @public
     * @param  {string} key property name
     * @param  {string} val string fragment
     * @return {object}
     */
    JSQL.prototype.startsWith = function(key, val){
        val = this._escapeRegex(val);
        this.regEx(key, '^' + val, true);
        return this;
    };

    /**
     * Gets objects that have property that ends with value
     * @public
     * @param  {string} key property name
     * @param  {string} val string fragment
     * @return {object}
     */
    JSQL.prototype.endsWith = function(key, val){
        val = this._escapeRegex(val);
        this.regEx(key, val + '$', true);
        return this;
    };

    /**
     * Gets objects that have property that contains value
     * @public
     * @param  {string} key property name
     * @param  {string} val string fragment
     * @return {object}
     */
    JSQL.prototype.like = function(key, val){
        val = this._escapeRegex(val);
        this.regEx(key, val, true);
        return this;
    };

    /**
     * Less than
     * @public
     * @param  {string} key property name
     * @param  {number} val number to test against
     * @return {object}
     */
    JSQL.prototype.lt = function(key, val){
        this.tmp = this._filter(this.tmp, function(obj){
            return obj[key] < val;
        });
        return this;
    };

    /**
      * Greater than
      * @public
      * @param  {string} key property name
      * @param  {number} val number to test against
      * @return {object}
      */
    JSQL.prototype.gt = function(key, val){
        this.tmp = this._filter(this.tmp, function(obj){
            return obj[key] > val;
        });
        return this;
    };

    /**
      * Less than or equal to
      * @public
      * @param  {string} key property name
      * @param  {number} val number to test against
      * @return {object}
      */
    JSQL.prototype.lte = function(key, val){
        this.tmp = this._filter(this.tmp, function(obj){
            return obj[key] <= val;
        });
        return this;
    };

    /**
      * Greater than or equal to
      * @public
      * @param  {string} key property name
      * @param  {number} val number to test against
      * @return {object}
      */
    JSQL.prototype.gte = function(key, val){
        this.tmp = this._filter(this.tmp, function(obj){
            return obj[key] >= val;
        });
        return this;
    };

    /**
     * Extracts the properties given from
     * objects.  Select implementation
     * @param  {array} list list of objects
     * @param  {array} keys properties to extract
     * @return {object}
     */
    JSQL.prototype._pluckMany = function(list, keys){
        return list.map(function(item){
            var obj = {};
            var i;
            var len = keys.length;
            for(i = 0; i < len; i++){
                obj[keys[i]] = item[keys[i]];
            }

            return obj;
        });
    };

    /* output */

    /**
     * Returns value of internal collection
     * applying rules
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
            finalVal = this._getUnique(this._filter(this.pluck(finalVal, this.query.distinct), function(item){
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
     * @public
     * @return {object}
     */
    JSQL.prototype.getOne = function(){
        return this.get().slice(0, 1)[0];
    };

    /**
     * Returns count of objects at
     * any given point in the query
     * @public
     * @return {integer}
     */
    JSQL.prototype.count = function(){
        return this.tmp.length;
    };

    /**
     * Sets unique values of a property to
     * extract once rules applied
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
     * @return {void}
     */
    JSQL.prototype._reset = function(){
        this.tmp = this.data;
        this.query = {
            select: [],
            distinct: undefined,
            sort: {}
        };
    };

    return JSQL;
}));