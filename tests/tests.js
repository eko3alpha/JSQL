/* globals jkm, jkmMin, QUnit */
'use strict';
var runTests = function(title, JSQL){

    QUnit.test(title + 'options()', function(assert){
        var testData = {ignoreEmptyString: true};

        var e = new JSQL([]);
        e.options(testData);
        assert.deepEqual(e.query.options, {ignoreEmptyString: true}, 'e.options({ignoreEmptyString: true})');
        assert.deepEqual(e._getOpt('ignoreEmptyString'), true, "e._getOpt('ignoreEmptyString')");
        assert.deepEqual(e.select()._getOpt('ignoreEmptyString'), undefined, ".select()._getOpt('ignoreEmptyString')");
    });

    QUnit.test(title + 'options({ignoreEmptyString: true})', function(assert){
        var testData = [
            {'a': 1, 'b': 'pa'},
            {'a': 2, 'b': 'dc'},
            {'a': 3, 'b': 'ca'},
            {'a': 4, 'b': ' '}
        ];

        var e = new JSQL(testData);
        assert.deepEqual(e.select().options({ignoreEmptyString: true}).where({'a':3, 'b': 'ca'}, {'b': ''}).get(),[{'a':3, 'b': 'ca'}],".where({'a':3, 'b': 'ca'}, {'b': ''})");
        assert.deepEqual(e.select().options({ignoreEmptyString: true}).where({'a':1}, {'b': ' '}).get(),[{'a': 1, 'b': 'pa'}],".where({'a':3, 'b': 'ca'}, {'b': ' '}");
        assert.deepEqual(e.select().options({ignoreEmptyString: true}).where({'a':2, 'b': 'dc'}, {'b': 0}).get(),[{'a':2, 'b': 'dc'}],".where({'a':2, 'b': 'dc'}, {'b': 0}");

    });

    QUnit.test(title + 'select()', function(assert){
        var testData = [
            {'a': 1, 'b': 100, 'c': 23},
            {'a': 1, 'b': 23, 'c': 11},
            {'a': 2, 'b': 44.3, 'c': 2},
            {'a': 3, 'b': -87.3, 'c': 3}
        ];

        var e = new JSQL(testData);
        assert.deepEqual(e.select('a').get(), [{'a': 1}, {'a': 1}, {'a': 2}, {'a': 3}], 'e.select(\'a\').get()');
        assert.deepEqual(e.select('a', 'c').get(), [{'a': 1, 'c': 23}, {'a': 1, 'c': 11}, {'a': 2, 'c': 2}, {'a': 3, 'c': 3}], 'e.select(\'a\').get()');
        assert.deepEqual(e.select('a').getOne(), {'a': 1}, 'e.select(\'a\').getOne()');
    });

    QUnit.test(title + 'where()', function(assert){
        var testData = [
            {'a': 1, 'b': 'pa'},
            {'a': 2, 'b': 'dc'},
            {'a': 3, 'b': 'ca'}
        ];

        var e = new JSQL(testData);

        assert.deepEqual(e.select().where().get(), testData, 'e.select().where().get()');
        assert.deepEqual(e.select().where([]).get(), testData, 'e.select().where([]).get()');
        assert.deepEqual(e.select().where({'a': 1}).get(), [{'a': 1, 'b': 'pa'}], "e.select().where({'a': 1}).get()");
        assert.deepEqual(e.select().where({'a': 5}).get(), [], 'e.select().where({\'a\': 5}).get()');
        assert.deepEqual(e.select().where({'a': '1'}).get(), [{'a': 1, 'b': 'pa'}], 'e.select().where({\'a\': \'1\'}).get()');
        assert.deepEqual(e.select().where({'a': '5'}).get(), [], 'e.select().where({\'a\': \'5\'}).get()');
        assert.deepEqual(e.select().where('a', 1).get(), [{'a': 1, 'b': 'pa'}], 'e.select().where(\'a\', 1).get()');
        assert.deepEqual(e.select().where('bb', 5).get(), [], 'e.select().where(\'bb\', 5).get()');
        assert.deepEqual(e.select().where({'a': ''}).get(), [], 'e.select().where({\'a\': \'\'}).get()');
        assert.deepEqual(e.select().where({'h': ''}).get(), [], 'e.select().where({\'a\': \'\'}).get()');

        assert.deepEqual(e.select().where(null).get(), testData);
        assert.deepEqual(e.select().where(undefined).get(), testData);
        assert.deepEqual(e.select().where(1).get(), testData);
        assert.deepEqual(e.select().where(0).get(), testData);
        assert.deepEqual(e.select().where(4).get(), testData);
        assert.deepEqual(e.select().where('string').get(), testData);
        assert.deepEqual(e.select().where(false).get(), testData);
        assert.deepEqual(e.select().where(true).get(), testData);

        var testData = [
            {'a': 1, 'b': 'pa'},
            {'a': 1, 'b': 'dd'},
            {'a': 2, 'b': 'dc'},
            {'a': 3, 'b': 'ca'}
        ];
        var e = new JSQL(testData);
        //assert.deepEqual(e.select().where({'a': 2}, {'a': 3}, {'b': 'pa'}).get(), [{'a': 1, 'b': 'pa'}, {'a': 2, 'b': 'dc'}, {'a': 3, 'b': 'ca'}], 'e.select().where({\'a\': 2}, {\'a\': 3}, {\'b\': \'pa\'}).get()');
        assert.deepEqual(e.select().where([{'a': 1}]).get(), [{'a': 1, 'b': 'pa'}, {'a': 1, 'b': 'dd'}], 'e.select().where([{\'a\': 1}]).get()');
        assert.deepEqual(e.select().where([{'a': 2}, {'a': 3}]).get(), [{'a': 2, 'b': 'dc'}, {'a': 3, 'b': 'ca'}], 'e.select().where([{\'a\': 2}, {\'a\': 3}]).get()');
        assert.deepEqual(e.select().where({'a': 5}).get(), [], 'e.select().where({\'a\': 5}).get()');

        var testData = [
            {'a': 1, 'b': 'pa'},
            {'a': 2, 'b': 'dc'},
            {'a': 3, 'b': 'ca'}
        ];
        var e = new JSQL(testData);
        assert.deepEqual(e.select().where({'a': 1}).get(), [{'a': 1, 'b': 'pa'}], 'e.select().where({\'a\': 1}).get()');
        assert.deepEqual(e.select().where({'a': 5}).get(), [], 'e.select().where({\'a\': 5}).get()');
        assert.deepEqual(e.select().where({'a': ''}).get(), [], 'e.select().where({\'a\': \'\'}).get()');
        assert.deepEqual(e.select().where({'h': ''}).get(), [], 'e.select().where({\'a\': \'\'}).get()');
    });

    QUnit.test(title + 'regEx()', function(assert){
        var testData = [
            {'a': 1, 'b': 'pa'},
            {'a': 2, 'b': 'd2'},
            {'a': 3, 'b': 'cy'},
            {'a': 4, 'b': 'df'},
            {'a': 5, 'b': 33}
        ];
        var e = new JSQL(testData);
        assert.deepEqual(e.regEx('b', /\D\d/).get(), [{'a': 2, 'b': 'd2'}], 'e.regEx(\'b\', /\D\d/).get()');
        assert.deepEqual(e.regEx('b', /none/).get(), [], 'e.regEx(\'b\', /none/).get()');
    });

    QUnit.test(title + 'like()', function(assert){
        var testData = [
            {'a': 1, 'b': 'padf'},
            {'a': 2, 'b': 'd2ssf'},
            {'a': 3, 'b': 'cyasf'},
            {'a': 4, 'b': 'dfSh'},
            {'a': 5, 'b': 33}
        ];
        var e = new JSQL(testData);
        assert.deepEqual(e.select().like('b', 's').get(), [{'a': 2, 'b': 'd2ssf'},{'a': 3, 'b': 'cyasf'}, {'a': 4, 'b': 'dfSh'}], 'e.select().like(\'b\', \'s\').get()');
        assert.deepEqual(e.select().like('a', 5).get(), [{'a': 5, 'b': 33}], 'e.select().like(\'a\', 5).get()');
    });

    QUnit.test(title + 'startsWith()', function(assert){
        var testData = [
            {'a': 'mike', 'b': '$pa'},
            {'a': 'john', 'b': '%d2'},
            {'a': 'jack', 'b': '.cy'},
            {'a': 'mary', 'b': '..^df'},
            {'a': 'sue', 'b': 332}
        ];

        var e = new JSQL(testData);
        assert.deepEqual(e.select().startsWith('b', '..^').get(),
            [{'a': 'mary','b': '..^df'}]

        );

        assert.deepEqual(e.select().startsWith('b', '$').get(),
            [{'a': 'mike', 'b': '$pa'}]

        );

        assert.deepEqual(e.select().startsWith('b', '.').get(),
             [{'a': 'jack', 'b': '.cy'}, {'a': 'mary', 'b': '..^df'}]
         );
    });

    QUnit.test(title + 'endsWith()', function(assert){
        var testData = [
            {'a': 'mike', 'b': 'pa$'},
            {'a': 'john', 'b': '%d2%'},
            {'a': 'jack', 'b': '.cy.'},
            {'a': 'mary', 'b': '..^df^..$'},
            {'a': 'sue', 'b': 332}
        ];

        var e = new JSQL(testData);
        assert.deepEqual(e.select().endsWith('b', '$').get(),
            [{'a': 'mike', 'b': 'pa$'}, {'a': 'mary', 'b': '..^df^..$'}],
            'endsWith(\'b\', \'$\').get()'
        );

        assert.deepEqual(e.select().endsWith('b', '.').get(),
            [{'a': 'jack', 'b': '.cy.'}],
            'endsWith(\'b\', \'.\').get()'
        );

        assert.deepEqual(e.select().endsWith('b', '%').get(),
             [{'a': 'john', 'b': '%d2%'}],
             'endsWith(\'b\', \'%\').get()'
         );
    });

    QUnit.test(title + 'sortBy() : init sorts', function(assert){

        var e = new JSQL([]);

        assert.deepEqual(e.select().sortBy('a', 'asc').query.sort, {'a': 1}, 'setting 1 sort value');
        assert.deepEqual(e.select().sortBy('a', 'asc').sortBy('b', 'desc').query.sort, {'a': 1, 'b': -1}, 'setting 2 sort value');

        // reset values
        e.get();
        assert.deepEqual(e.select().sortBy({'a': 'asc'}).query.sort, {'a': 1}, 'setting 1 sort value using object');
        assert.deepEqual(e.select().sortBy({'a': 'desc', 'b': 'asc'}).query.sort, {'a': -1, 'b': 1}, 'setting 2 sort value using object');

        // reset values
        e.get();
        e.select().sortBy('a')
        .sortBy('b', 'asc')
        .sortBy('c', 'desc')
        .sortBy({'d': 'asc'})
        .sortBy({'e': 'desc'})
        .sortBy({'f': 'asc', 'g': 'desc'});

        assert.deepEqual(e.query.sort, {
            'a': 1,
            'b': 1,
            'c': -1,
            'd': 1,
            'e': -1,
            'f': 1,
            'g': -1
        }, 'setting 7 values using different input methods');
    });

    QUnit.test(title + 'sortBy() : asc', function(assert){

        var testData = [
            {'a': 1, 'b': 'pa'},
            {'a': 20, 'b': 'd2'},
            {'a': 3, 'b': 'cy'},
            {'a': 40, 'b': 'df'},
            {'a': 5, 'b': 33}
        ];
        var e = new JSQL(testData);

        assert.deepEqual(e.select().sortBy('a', 'asc').get(),
            [
                {'a': 1, 'b': 'pa'},
                {'a': 3, 'b': 'cy'},
                {'a': 5, 'b': 33},
                {'a': 20, 'b': 'd2'},
                {'a': 40, 'b': 'df'}
            ],
            'e.select().sortBy(\'a\', \'asc\').get()'
        );

        assert.deepEqual(e.select().sortBy('a').get(),
            [
                {'a': 1, 'b': 'pa'},
                {'a': 3, 'b': 'cy'},
                {'a': 5, 'b': 33},
                {'a': 20, 'b': 'd2'},
                {'a': 40, 'b': 'df'}
            ],
            'e.select().sortBy(\'a\').get()'
        );

        assert.deepEqual(e.select().sortBy('a').get(),
            [
                {'a': 1, 'b': 'pa'},
                {'a': 3, 'b': 'cy'},
                {'a': 5, 'b': 33},
                {'a': 20, 'b': 'd2'},
                {'a': 40, 'b': 'df'}
            ],
            'e.select().sortBy(\'a\').get()'
        );
    });

    QUnit.test(title + 'sortBy() : desc', function(assert){
        var testData = [
            {'a': 1, 'b': 'pa'},
            {'a': 20, 'b': 'd2'},
            {'a': 3, 'b': 'cy'},
            {'a': 40, 'b': 'df'},
            {'a': 5, 'b': 33}
        ];
        var e = new JSQL(testData);
        assert.deepEqual(e.select().sortBy('a', 'desc').get(),
            [
                {'a': 40, 'b': 'df'},
                {'a': 20, 'b': 'd2'},
                {'a': 5, 'b': 33},
                {'a': 3, 'b': 'cy'},
                {'a': 1, 'b': 'pa'}
            ],
            'e.select().sortBy(\'a\', \'desc\').get()'
        );
    });

    QUnit.test(title + 'sortBy() : multiple', function(assert){

        var testData = [
            {'a': 1, 'b': 3},
            {'a': 5, 'b': 2},
            {'a': 3, 'b': 4},
            {'a': 2, 'b': 5},
            {'a': 2, 'b': 1},
            {'a': 2, 'b': 9},
            {'a': 5, 'b': 8}
        ];
        var e = new JSQL(testData);

        assert.deepEqual(e.select().sortBy({'a': 'asc', 'b': 'desc'}).get(),
        [
            {'a': 1, 'b': 3},
            {'a': 2, 'b': 9},
            {'a': 2, 'b': 5},
            {'a': 2, 'b': 1},
            {'a': 3, 'b': 4},
            {'a': 5, 'b': 8},
            {'a': 5, 'b': 2}
        ], '');

    });

    QUnit.test(title + 'sortAsc()', function(assert){
        var testData = [
            {'a': 1, 'b': 'pa'},
            {'a': 20, 'b': 'd2'},
            {'a': 3, 'b': 'cy'},
            {'a': 40, 'b': 'df'},
            {'a': 5, 'b': 33}
        ];
        var e = new JSQL(testData);
        assert.deepEqual(e.sortAsc('a').get(),
            [
                {'a': 1, 'b': 'pa'},
                {'a': 3, 'b': 'cy'},
                {'a': 5, 'b': 33},
                {'a': 20, 'b': 'd2'},
                {'a': 40, 'b': 'df'}
            ],
            'e.sortAsc(\'a\').get()'
        );
    });

    QUnit.test(title + 'sortDesc()', function(assert){
        var testData = [
            {'a': 1, 'b': 'pa'},
            {'a': 20, 'b': 'd2'},
            {'a': 3, 'b': 'cy'},
            {'a': 40, 'b': 'df'},
            {'a': 5, 'b': 33}
        ];
        var e = new JSQL(testData);
        assert.deepEqual(e.sortDesc('a').get(),
            [
                {'a': 40, 'b': 'df'},
                {'a': 20, 'b': 'd2'},
                {'a': 5, 'b': 33},
                {'a': 3, 'b': 'cy'},
                {'a': 1, 'b': 'pa'}
            ],
            'e.sortDesc(\'a\').get()'
        );
    });

    QUnit.test(title + 'isIn()', function(assert){
        var testData = [
            {'a': 1, 'b': 'pa'},
            {'a': 1, 'b': 'dd'},
            {'a': 2, 'b': 'dc'},
            {'a': 3, 'b': 'ca'}
        ];
        var e = new JSQL(testData);
        assert.deepEqual(e.isIn('a', [4, 3]).get(), [{'a': 3, 'b': 'ca'}], 'e.isIn(\'a\', [4, 3]).get()');
        assert.deepEqual(e.isIn('b', ['d', 5]).get(), [], 'e.isIn(\'b\', [\'d\', 5]).get()');
    });

    QUnit.test(title + 'isNotIn()', function(assert){
        var testData = [
            {'a': 1, 'b': 'pa'},
            {'a': 1, 'b': 'dd'},
            {'a': 2, 'b': 'dc'},
            {'a': 3, 'b': 'ca'}
        ];
        var e = new JSQL(testData);
        assert.deepEqual(e.select().isNotIn('a', [1, 2]).get(), [{'a': 3, 'b': 'ca'}], 'e.select().isNotIn(\'a\', [1, 2]).get()');
        assert.deepEqual(e.select().isNotIn('b', ['pa', 'dd', 'dc', 'ca']).get(), [], 'e.select().isNotIn(\'b\', [\'pa\', \'dd\', \'dc\', \'ca\']).get()');
        assert.deepEqual(e.select().isNotIn('a', [4, 4]).get(), [
            {'a': 1, 'b': 'pa'},
            {'a': 1, 'b': 'dd'},
            {'a': 2, 'b': 'dc'},
            {'a': 3, 'b': 'ca'}
        ],
        'e.select().isNotIn(\'a\', [4, 4]).get()');
    });

    QUnit.test(title + 'between()', function(assert){
        var testData = [
            {'a': 1, 'b': 100},
            {'a': 1, 'b': 23},
            {'a': 2, 'b': 44.3},
            {'a': 3, 'b': -87.3}
        ];
        var e = new JSQL(testData);
        assert.deepEqual(e.select().between('b', 40, 50).get(), [{'a': 2, 'b': 44.3}], 'e.select().between(\'b\', 40, 50).get()');
        assert.deepEqual(e.select().between('b', 400, 500).get(), [], 'e.select().between(\'b\', 400, 500).get()');
        assert.deepEqual(e.select().between('b', 23, 100, true).get(), [{'a': 2, 'b': 44.3}], 'e.select().between(\'b\', 23, 100, true).get()');
        assert.deepEqual(e.select().between('b', 23, 100).get(), [{'a': 1, 'b': 100}, {'a': 1, 'b': 23}, {'a': 2, 'b': 44.3}], 'e.select().between(\'b\', 23, 100, true).get()');
    });

    QUnit.test(title + 'lt()', function(assert){
        var testData = [
            {'a': 1, 'b': 100},
            {'a': 1, 'b': 23},
            {'a': 2, 'b': 44.3},
            {'a': 3, 'b': -87.3}
        ];
        var e = new JSQL(testData);
        assert.deepEqual(e.select().lt('b', 40).get(), [{'a': 1, 'b': 23}, {'a': 3, 'b': -87.3}], 'e.select().lt(\'b\', 40).get()');
        assert.deepEqual(e.select().lt('b', 0).get(), [{'a': 3, 'b': -87.3}], 'e.select().lt(\'b\', 0).get()');
        assert.deepEqual(e.select().lt('b', -100).get(), [], 'e.select().lt(\'b\', -100).get()');
    });

    QUnit.test(title + 'gt()', function(assert){
        var testData = [
            {'a': 1, 'b': 100},
            {'a': 1, 'b': 23},
            {'a': 2, 'b': 44.3},
            {'a': 3, 'b': -87.3}
        ];
        var e = new JSQL(testData);
        assert.deepEqual(e.select().gt('b', 50).get(), [{'a': 1, 'b': 100}], 'e.select().gt(\'b\', 50).get()');
        assert.deepEqual(e.select().gt('b', 25).get(), [{'a': 1, 'b': 100}, {'a': 2, 'b': 44.3}], 'e.select().gt(\'b\', 25).get()');
        assert.deepEqual(e.select().gt('b', 100).get(), [], 'e.select().gt(\'b\', 100).get()');
    });

    QUnit.test(title + 'lte()', function(assert){
        var testData = [
            {'a': 1.5},
            {'a': 2.5},
            {'a': 3.6},
            {'a': 7}
        ];
        var e = new JSQL(testData);
        assert.deepEqual(e.select().lte('a', 2.5).get(), [{'a': 1.5}, {'a': 2.5}], 'e.select().lte(\'a\', 2.5).get()');
        assert.deepEqual(e.select().lte('a', 2.00001).get(), [{'a': 1.5}], 'e.select().lte(\'a\', 2.00001).get()');
        assert.deepEqual(e.select().lte('a', -100).get(), [], 'e.select().lte(\'a\', -100).get()');
    });

    QUnit.test(title + 'gte()', function(assert){
        var testData = [
            {'a': 1.5},
            {'a': 2.5},
            {'a': 3.6},
            {'a': 7}
        ];
        var e = new JSQL(testData);
        assert.deepEqual(e.select().gte('a', 7).get(), [{'a': 7}], 'e.select().gte(\'a\', 7).get()');
        assert.deepEqual(e.select().gte('a', 3.5).get(), [{'a': 3.6},{'a': 7}], 'e.select().gte(\'a\', 3.5).get()');
        assert.deepEqual(e.select().gte('a', 100).get(), [], 'e.select().gte(\'a\', 100).get()');
    });

    QUnit.test(title + 'distinct()', function(assert){
        var testData = [
            {'a': 1, 'b': 100, 'c': 23, 'd': 55},
            {'a': 1, 'b': 23, 'c': 11},
            {'a': 2, 'b': 44.3, 'c': 2},
            {'a': 3, 'b': -87.3, 'c': 3}
        ];
        var e = new JSQL(testData);
        assert.deepEqual(e.distinct('a').get(), [1,2,3], 'e.distinct(\'a\').get()');
        assert.deepEqual(e.distinct('d').get(), [55], 'e.distinct(\'d\').get()');
    });

   QUnit.test(title + 'contains()', function(assert){

        var testData = [
            {a: 'abc', b: 1},
            {a: 'zed', b: 2345},
            {a: 'cgw', b: 0},
            {a: 'cde', b: '2345'},
            {a: 'edf', b: '0'},
            {a: 'dfg', b: '1'},
            {a: 'dfg', b: 'String'},
            {a: 'fgh', b: true},
            {a: 'ghi', b: false},
            {a: 'fgh', b: 'true'},
            {a: 'ghi', b: 'false'},
            {a: 'hij', b: null},
            {a: 'ijk', b: undefined},
            {a: 'jkl', b: []},
            {a: 'klm', b: {}}
        ];

        var e = new JSQL(testData);

        assert.deepEqual(e.select().contains(2345).get(),
        [
            {a: 'zed', b: 2345},
            {a: 'cde', b: '2345'}
        ], "e.select().contains(2345).get()");

       assert.deepEqual(e.select().contains(null).get(),
        [
            {a: 'hij', b: null},
            {a: 'ijk', b: undefined}
        ], "e.select().contains(null).get()");

        assert.deepEqual(e.select().contains('2345').get(),
        [
            {a: 'zed', b: 2345},
            {a: 'cde', b: '2345'}
        ], "e.select().contains('2345').get()");

        assert.deepEqual(e.select().contains('abc').get(),
        [
            {a: 'abc', b: 1}
        ], "e.select().contains('abc').get()");

        assert.deepEqual(e.select().contains('xy').get(),
        [
        ], "e.select().contains('xy').get()");

        assert.deepEqual(e.select().contains('1').get(),
        [
            {a: 'abc', b: 1},
            {a: 'dfg', b: '1'},
            {a: 'fgh', b: true}
        ], "e.select().contains('1').get()");

        assert.deepEqual(e.select().contains(1).get(),
        [
            {a: 'abc', b: 1},
            {a: 'dfg', b: '1'},
            {a: 'fgh', b: true}
        ], "e.select().contains('1').get()");

        assert.deepEqual(e.select().contains(0).get(),
        [
            {a: 'cgw', b: 0},
            {a: 'edf', b: '0'},
            {a: 'ghi', b: false},
            {a: 'jkl', b: []}
        ], "e.select().contains(0).get()");

        assert.deepEqual(e.select().contains(true).get(),
        [
          {"a": "abc", "b": 1 },
          {"a": "dfg", "b": "1"},
          {"a": "fgh", "b": true}
        ], "e.select().contains(true).get()");

   });

   QUnit.test(title + 'transform()', function(assert){

        var testData = [
            {a: 'abc', b: 99},
            {a: 'xyz', b: 10}
        ];

        var e = new JSQL(testData);

        assert.deepEqual(e.transform(function(obj){ obj.b = obj.b * 10}).get(),
        [
            {a: 'abc', b: 990},
            {a: 'xyz', b: 100}
        ], "e.transform(function(obj){ obj.b = obj.b * 10}).get()");

        assert.deepEqual(e.transform(function(obj){ obj.a = obj.a.toUpperCase()}).get(),
        [
            {a: 'ABC', b: 990},
            {a: 'XYZ', b: 100}
        ], "e.transform(function(obj){ obj.a = obj.a.toUpperCase()}).get()");

       assert.deepEqual(e.transform(function(obj){ obj.c = obj.a + obj.b }).get(),
        [
            {a: 'ABC', b: 990, c: 'ABC990'},
            {a: 'XYZ', b: 100, c: 'XYZ100'}
        ], "e.transform(function(obj){ obj.c = obj.a + obj.b }).get()");

    });

    QUnit.test(title + 'get()', function(assert){
        var testData = [{'a': 'b', 'c': [1,2,3]}];
        var e = new JSQL(testData);
        assert.deepEqual(e.select().get(), testData, 'e.select().get()');

        var e = new JSQL(testData);
        assert.deepEqual(e.get(), testData, 'e.get()');

    });

    QUnit.test(title + 'getOne()', function(assert){
        var testData = [
            {'a': 1, 'b': 'pa'},
            {'a': 1, 'b': 'dd'},
            {'a': 2, 'b': 'dc'},
            {'a': 3, 'b': 'ca'}
        ];
        var e = new JSQL(testData);
        assert.deepEqual(e.select().where('a', 1).getOne(), {'a': 1, 'b': 'pa'}, 'e.select().where(\'a\', 1).getOne()');
        assert.deepEqual(e.select().where({'a': 1, 'b': 'dd'}).getOne(), {'a': 1, 'b': 'dd'}, 'e.select().where({\'a\': 1, \'b\': \'dd\'}).getOne()');
        assert.deepEqual(e.select().where({'a': 5}).getOne(), undefined, 'e.select().where({\'a\': 5}).getOne()');
        assert.deepEqual(e.select().where({'non existant': 5}).getOne(), undefined, 'e.select().where({\'non existant\': 5}).getOne()');
    });

    QUnit.test(title + 'limit()', function(assert){
        var testData = [
            {'a': 1, 'b': 'pa'},
            {'a': 2, 'b': 'dc'},
            {'a': 3, 'b': 'ca'},
            {'a': 4, 'b': 'df'},
            {'a': 5, 'b': 'hi'}
        ];

        var e = new JSQL(testData);
        assert.deepEqual(e.select().limit(2, 2).get(),
            [
                {'a': 3, 'b': 'ca'},
                {'a': 4, 'b': 'df'}
            ], 'e.select().limit(2, 2).get()');

        assert.deepEqual(e.select().limit(1, 2).get(),
            [
                {'a': 3, 'b': 'ca'}
            ], 'e.select().limit(1, 2).get()');

        assert.deepEqual(e.select().limit(2).get(),
            [
                {'a': 1, 'b': 'pa'},
                {'a': 2, 'b': 'dc'}
            ], 'e.select().limit(2).get()');

        assert.deepEqual(e.select().limit(0).get(), [], 'e.select().limit(0).get()');
    });

    QUnit.test(title + '_pluckMany()', function(assert){
        var testData = [
            {'a': 1, 'b': 100, 'c': 23},
            {'a': 1, 'b': 23, 'c': 11},
            {'a': 2, 'b': 44.3, 'c': 2},
            {'a': 3, 'b': -87.3, 'c': 3}
        ];
        var e = new JSQL(testData);
        assert.deepEqual(e._pluckMany(testData, ['a', 'b']), [{'a': 1, 'b': 100}, {'a': 1, 'b': 23}, {'a': 2, 'b': 44.3}, {'a': 3, 'b': -87.3}], 'e._pluckMany(testData, [\'a\', \'b\'])');
    });

   QUnit.test(title + '_filter()', function(assert){
        var e = new JSQL([]);
        assert.deepEqual(
            e._filter([1,2,3,4,5,6], function(arg){
            return !(arg % 2);
        })
        , [2,4,6], '_filter([1,2,3,4,5,6]');
    });

   QUnit.test(title + '_map()', function(assert){
        var e = new JSQL([]);
        assert.deepEqual(
            e._map([1,2,3,4,5,6], function(arg){
            return arg * 2;
        })
        , [2,4,6,8,10,12], 'e._map([1,2,3,4,5,6], function(arg){ return arg * 2; }');
    });

    QUnit.test(title + '_getUnique()', function(assert){
        var e = new JSQL([]);
        assert.deepEqual(
            e._getUnique([1,1,0,0,false,false,true,true,null,null,undefined,undefined, '1', '1', '0', '0'])
        , [1,0,false,true,null,undefined,'1','0'], "_getUnique([1,1,0,0,false,false,true,true,null,null,undefined,undefined, '1', '1', '0', '0'])");
    });

    QUnit.test(title + '_pluck()', function(assert){
        var testData = [
            {'a': 1, 'b': 100, 'c': 23},
            {'a': 1, 'b': 23, 'c': 11},
            {'a': 2, 'b': 44.3, 'c': 2},
            {'a': 0, 'b': 44.3, 'c': 2},
            {'a': null, 'b': 44.3, 'c': 2},
            {'a': 3, 'b': -87.3, 'c': 'u'}
        ];

        var e = new JSQL([]);
        assert.deepEqual(
            e._pluck(testData, 'a'), [1,1,2,0,null,3], '_pluck(testData, \'a\')');
    });

    QUnit.test(title + '_queryObj()', function(assert){

        var testData = [
            {'a': 1, 'b': 100, 'c': 23},
            {'a': 1, 'b': 23, 'c': 11},
            {'a': 2, 'b': 44.3, 'c': 2},
            {'a': 0, 'b': 44.3, 'c': 2},
            {'a': null, 'b': 44.3, 'c': 2},
            {'a': 3, 'b': -87.3, 'c': 'u'}
        ];
        var e = new JSQL([]);

        assert.deepEqual(
            e._queryObj(testData, {'a': 1, 'c': 11})
        , [{'a': 1, 'b': 23, 'c': 11}], '_queryObj(testData, {\'a\': 1, \'c\':11})');

        assert.deepEqual(
            e._queryObj(testData, {'a': 1})
        , [{'a': 1, 'b': 100, 'c': 23}, {'a': 1, 'b': 23, 'c': 11}], '_queryObj(testData, {\'a\': 1})');

        assert.deepEqual(
            e._queryObj(testData, {'a': 0})
        , [{'a': 0, 'b': 44.3, 'c': 2}], '_queryObj(testData, {\'a\': 0})');

        assert.deepEqual(
            e._queryObj(testData, {'a': '0'})
        , [{'a': 0, 'b': 44.3, 'c': 2}], "{'a': '0'}");



        assert.deepEqual(
            e._queryObj(testData, {})
        , [], 'empty object returns empty array, matches nothing');

    });

    QUnit.test(title + '_areAllObjects()', function(assert){
        var testData = [{'a': 'b', 'c': [1,2,3]}, {}, []];
        var e = new JSQL(testData);
        var f = e._areAllObjects;
        assert.deepEqual(f(['a', []]), false, '["a", []]');
        assert.deepEqual(f([{}, {}]), true, '[{}, {}]');
        assert.deepEqual(f([{}]), true, '[{}]');
        assert.deepEqual(f([]), false, '[]');
        assert.deepEqual(f([null]), false, '[null]');
        assert.deepEqual(f([true]), false, '[true]');
        assert.deepEqual(f([false]), false, '[false]');
        assert.deepEqual(f([0]), false, '[0]');
        assert.deepEqual(f([1]), false, '[1]');
        assert.deepEqual(f(['0']), false, '["0"]');
        assert.deepEqual(f(['1']), false, '["1"]');
        assert.deepEqual(f([{}, null]), false, '[{}, null]');
        assert.deepEqual(f([{}, true]), false, '[{}, true]');
        assert.deepEqual(f([{}, false]), false, '[{}, false]');
        assert.deepEqual(f([{}, 0]), false, '[{}, 0]');
        assert.deepEqual(f([{}, 1]), false, '[{}, 1]');
        assert.deepEqual(f([{}, '0']), false, '[{}, "0"]');
        assert.deepEqual(f([{}, '1']), false, '[{}, "1"]');
    });

    QUnit.test(title + '_stripEmptyProps()', function(assert){

        var e = new JSQL([]);
        assert.deepEqual(e._stripEmptyProps({
            'a': 0,
            'b': 1,
            'c': true,
            'd': false,
            'e': null,
            'f': undefined,
            'g': '0',
            'h': '1',
            'i': 'test',
            'j': '       ',
            'k': ''
         }), {
            'a': 0,
            'b': 1,
            'c': true,
            'd': false,
            'e': null,
            'f': undefined,
            'g': '0',
            'h': '1',
            'i': 'test'
        }, "strip blank/empty strings");

        assert.deepEqual(e._stripEmptyProps({
            'j': '       ',
            'k': ''
         }), {}, "return empty object");

    });

    QUnit.test(title + '_isObjectEmpty()', function(assert){
        var e = new JSQL([]);
        assert.deepEqual(e._isObjectEmpty({'a': '', 'b': 'test'}), false, "e._isObjectEmpty({'a': '', 'b': 'test'}");
        assert.deepEqual(e._isObjectEmpty({}), true, "e._isObjectEmpty({})");

    });

    QUnit.test(title + '_processArguments()', function(assert){
        var e = new JSQL([]);
        var f = e._processArguments;

        assert.deepEqual(f([]).clause, 'VOID', '[] => VOID');
        assert.deepEqual(f(['a', 1]).clause, 'AND', "['a', 1] => AND");
        assert.deepEqual(f([{}]).clause, 'AND', '[{}] => AND');
        assert.deepEqual(f([{'a': 3}]).clause, 'AND', "[{'a': 3}] => AND");
        assert.deepEqual(e._processArguments([{'a': 3}, {}]).clause, 'OR', "[{'a': 3}, {}] => OR");

    });

};

runTests('', JSQL);
runTests('Minified : ', JSQLMIN);

