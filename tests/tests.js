/* globals jkm, jkmMin, QUnit */
'use strict';
var runTests = function(title, JSQL){

    QUnit.test(title + 'select()', function(assert){
        var testData = [
            {'a': 1, 'b': 100, 'c': 23},
            {'a': 1, 'b': 23, 'c': 11},
            {'a': 2, 'b': 44.3, 'c': 2},
            {'a': 3, 'b': -87.3, 'c': 3},
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
            {'a': 3, 'b': 'ca'},
        ];
        var e = new JSQL(testData);
        assert.deepEqual(e.select().where({'a': 1}).get(), [{'a': 1, 'b': 'pa'}], 'e.select().where({\'a\': 1}).get()');
        assert.deepEqual(e.select().where({'a': 5}).get(), [], 'e.select().where({\'a\': 5}).get()');
        assert.deepEqual(e.select().where({'a': '1'}).get(), [{'a': 1, 'b': 'pa'}], 'e.select().where({\'a\': \'1\'}).get()');
        assert.deepEqual(e.select().where({'a': '5'}).get(), [], 'e.select().where({\'a\': \'5\'}).get()');
        assert.deepEqual(e.select().where('a', 1).get(), [{'a': 1, 'b': 'pa'}], 'e.select().where(\'a\', 1).get()');
        assert.deepEqual(e.select().where('bb', 5).get(), [], 'e.select().where(\'bb\', 5).get()');
        assert.deepEqual(e.select().where({'a': ''}).get(), [], 'e.select().where({\'a\': \'\'}).get()');
        assert.deepEqual(e.select().where({'h': ''}).get(), [], 'e.select().where({\'a\': \'\'}).get()');
        assert.throws(function(){e.select().where(4)});

        var testData = [
            {'a': 1, 'b': 'pa'},
            {'a': 1, 'b': 'dd'},
            {'a': 2, 'b': 'dc'},
            {'a': 3, 'b': 'ca'},
        ];
        var e = new JSQL(testData);
        assert.deepEqual(e.select().where({'a': 2}, {'a': 3}, {'b': 'pa'}).get(), [{'a': 1, 'b': 'pa'}, {'a': 2, 'b': 'dc'}, {'a': 3, 'b': 'ca'}], 'e.select().where({\'a\': 2}, {\'a\': 3}, {\'b\': \'pa\'}).get()');
        assert.deepEqual(e.select().where([{'a': 1}]).get(), [{'a': 1, 'b': 'pa'}, {'a': 1, 'b': 'dd'}], 'e.select().where([{\'a\': 1}]).get()');
        assert.deepEqual(e.select().where([{'a': 2}, {'a': 3}]).get(), [{'a': 2, 'b': 'dc'}, {'a': 3, 'b': 'ca'}], 'e.select().where([{\'a\': 2}, {\'a\': 3}]).get()');
        assert.deepEqual(e.select().where({'a': 5}).get(), [], 'e.select().where({\'a\': 5}).get()');

        var testData = [
            {'a': 1, 'b': 'pa'},
            {'a': 2, 'b': 'dc'},
            {'a': 3, 'b': 'ca'},
        ];
        var e = new JSQL(testData);
        assert.deepEqual(e.select().where({'a': 1}).get(), [{'a': 1, 'b': 'pa'}], 'e.select().where({\'a\': 1}).get()');
        assert.deepEqual(e.select().where({'a': 5}).get(), [], 'e.select().where({\'a\': 5}).get()');
        assert.deepEqual(e.select().where({'a': ''}).get(), [], 'e.select().where({\'a\': \'\'}).get()');
        assert.deepEqual(e.select().where({'h': ''}).get(), [], 'e.select().where({\'a\': \'\'}).get()');

    });

    QUnit.test(title + 'orWhere()', function(assert){
        var testData = [
            {'a': 1, 'b': 'pa'},
            {'a': 1, 'b': 'dd'},
            {'a': 2, 'b': 'dc'},
            {'a': 3, 'b': 'ca'},
        ];
        var e = new JSQL(testData);
        assert.deepEqual(e.select().orWhere([{'a': 1}]).get(), [{'a': 1, 'b': 'pa'}, {'a': 1, 'b': 'dd'}], 'e.select().orWhere([{\'a\': 1}]).get()');
        assert.deepEqual(e.select().orWhere([{'a': 2}, {'a': 3}]).get(), [{'a': 2, 'b': 'dc'}, {'a': 3, 'b': 'ca'}], 'e.select().orWhere([{\'a\': 2}, {\'a\': 3}]).get()');
        assert.deepEqual(e.select().orWhere({'a': 5}).get(), [], 'e.select().orWhere({\'a\': 5}).get()');
    });

    QUnit.test(title + 'associate()', function(assert){

        var testData = [
            {'id': 1, 'statusId': 0},
            {'id': 2, 'statusId': 1},
            {'id': 3, 'statusId': 2},
            ]

        var statusData = [
                {'id': 0, 'name': 'Deleted'},
                {'id': 1, 'name': 'Active'},
                {'id': 2, 'name': 'Pending'},
            ];

        var e = new JSQL(testData);

        assert.deepEqual(e.select().associate('statusId', statusData, 'name', 'statName').get(), [

            {'id': 1, 'statName': 'Deleted','statusId': 0},
            {'id': 2, 'statName': 'Active','statusId': 1},
            {'id': 3, 'statName': 'Pending','statusId': 2}

            ],
           'e.select().associate(\'statusId\', statusData, \'name\', \'statName\').get()');

        var testData = [
            {'id': 1, 'statusId': 0},
            {'id': 2, 'statusId': 99},
            {'id': 3, 'statusId': 2},
            ]

        var statusData = [
                {'id': 0, 'name': 'Deleted'},
                {'id': 1, 'name': 'Active'},
                {'id': 2, 'name': 'Pending'},
            ];

        var e = new JSQL(testData);

        assert.deepEqual(e.select().associate('statusId', statusData, 'name', 'statName').get(), [

            {'id': 1, 'statName': 'Deleted','statusId': 0},
            {'id': 2, 'statName': undefined,'statusId': 99},
            {'id': 3, 'statName': 'Pending','statusId': 2}

            ],
           'e.select().associate(\'statusId\', statusData, \'name\', \'statName\').get()');

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
                {'a': 40, 'b': 'df'},
            ],
            'e.select().sortBy(\'a\', \'asc\').get()'
        );

        assert.deepEqual(e.select().sortBy('a').get(),
            [
                {'a': 1, 'b': 'pa'},
                {'a': 3, 'b': 'cy'},
                {'a': 5, 'b': 33},
                {'a': 20, 'b': 'd2'},
                {'a': 40, 'b': 'df'},
            ],
            'e.select().sortBy(\'a\').get()'
        );

        assert.deepEqual(e.select().sortBy('a').get(),
            [
                {'a': 1, 'b': 'pa'},
                {'a': 3, 'b': 'cy'},
                {'a': 5, 'b': 33},
                {'a': 20, 'b': 'd2'},
                {'a': 40, 'b': 'df'},
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
                {'a': 40, 'b': 'df'},
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

    QUnit.test(title + 'count()', function(assert){
        var testData = [
            {'a': 1, 'b': 'pa'},
            {'a': 1, 'b': 'dd'},
            {'a': 2, 'b': 'dc'},
            {'a': 3, 'b': 'ca'},
        ];
        var e = new JSQL(testData);
        assert.deepEqual(e.select().orWhere([{'a': 1}]).count(), 2, 'e.select().orWhere([{\'a\': 1}]).count()');
        assert.deepEqual(e.select().orWhere([{'a': 2}, {'a': 3}]).count(), 2, 'e.select().orWhere([{\'a\': 2}, {\'a\': 3}]).count()');
        assert.deepEqual(e.select().orWhere({'a': 5}).count(), 0, 'e.select().orWhere({\'a\': 5}).count()');
    });

    QUnit.test(title + 'in()', function(assert){
        var testData = [
            {'a': 1, 'b': 'pa'},
            {'a': 1, 'b': 'dd'},
            {'a': 2, 'b': 'dc'},
            {'a': 3, 'b': 'ca'},
        ];
        var e = new JSQL(testData);
        assert.deepEqual(e.in('a', [4, 3]).get(), [{'a': 3, 'b': 'ca'}], 'e.in(\'a\', [4, 3]).get()');
        assert.deepEqual(e.in('b', ['d', 5]).get(), [], 'e.in(\'b\', [\'d\', 5]).get()');
    });

    QUnit.test(title + 'notIn()', function(assert){
        var testData = [
            {'a': 1, 'b': 'pa'},
            {'a': 1, 'b': 'dd'},
            {'a': 2, 'b': 'dc'},
            {'a': 3, 'b': 'ca'},
        ];
        var e = new JSQL(testData);
        assert.deepEqual(e.select().notIn('a', [1, 2]).get(), [{'a': 3, 'b': 'ca'}], 'e.select().notIn(\'a\', [1, 2]).get()');
        assert.deepEqual(e.select().notIn('b', ['pa', 'dd', 'dc', 'ca']).get(), [], 'e.select().notIn(\'b\', [\'pa\', \'dd\', \'dc\', \'ca\']).get()');
        assert.deepEqual(e.select().notIn('a', [4, 4]).get(), [
            {'a': 1, 'b': 'pa'},
            {'a': 1, 'b': 'dd'},
            {'a': 2, 'b': 'dc'},
            {'a': 3, 'b': 'ca'},
        ],
        'e.select().notIn(\'a\', [4, 4]).get()');
    });

    QUnit.test(title + 'between()', function(assert){
        var testData = [
            {'a': 1, 'b': 100},
            {'a': 1, 'b': 23},
            {'a': 2, 'b': 44.3},
            {'a': 3, 'b': -87.3},
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
            {'a': 3, 'b': -87.3},
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
            {'a': 3, 'b': -87.3},
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
            {'a': 3, 'b': -87.3, 'c': 3},
        ];
        var e = new JSQL(testData);
        assert.deepEqual(e.distinct('a').get(), [1,2,3], 'e.distinct(\'a\').get()');
        assert.deepEqual(e.distinct('d').get(), [55], 'e.distinct(\'d\').get()');
    });

   QUnit.test(title + 'transform()', function(assert){

        var testData = [
            {a: 'abc', b: 99},
            {a: 'xyz', b: 10}
        ];

        var e = new JSQL(testData);

        assert.deepEqual(e.select().transform('b', function(obj){ return obj['b'] * 10}).get(),
        [
            {a: 'abc', b: 990},
            {a: 'xyz', b: 100}
        ], "e.select().transform('b', function(obj) return obj.b * 10}).get()");

        assert.deepEqual(e.select().transform('a', function(obj){ return obj['a'].toUpperCase()}).get(),
        [
            {a: 'ABC', b: 990},
            {a: 'XYZ', b: 100}
        ], "e.select().transform('b', function(obj) { return obj['a'].toUpperCase()}).get()");

       assert.deepEqual(e.select().transform('c', function(obj){ return obj['a']+obj['b']}).get(),
        [
            {a: 'ABC', b: 990, c: 'ABC990'},
            {a: 'XYZ', b: 100, c: 'XYZ100'}
        ], "e.select().transform('c', function(obj){ return obj['a']+obj['b']}).get()");

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
            {'a': 3, 'b': 'ca'},
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
            {'a': 3, 'b': -87.3, 'c': 3},
        ];
        var e = new JSQL(testData);
        assert.deepEqual(e._pluckMany(testData, ['a', 'b']), [{'a': 1, 'b': 100}, {'a': 1, 'b': 23}, {'a': 2, 'b': 44.3}, {'a': 3, 'b': -87.3}], 'e._pluckMany(testData, [\'a\', \'b\'])');
    });

   QUnit.test(title + '_filter()', function(assert){
        var e = new JSQL;
        assert.deepEqual(
            e._filter([1,2,3,4,5,6], function(arg){
            return !(arg % 2);
        })
        , [2,4,6], '_filter([1,2,3,4,5,6]');
    });

   QUnit.test(title + '_map()', function(assert){
        var e = new JSQL;
        assert.deepEqual(
            e._map([1,2,3,4,5,6], function(arg){
            return arg * 2;
        })
        , [2,4,6,8,10,12], 'e._map([1,2,3,4,5,6], function(arg){ return arg * 2; }');
    });

    QUnit.test(title + '_getUnique()', function(assert){
        var e = new JSQL;
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
            {'a': 3, 'b': -87.3, 'c': 'u'},
        ];

        var e = new JSQL;
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
            {'a': 3, 'b': -87.3, 'c': 'u'},
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
    });


    QUnit.test(title + '_areAllObjects()', function(assert){
        var testData = [{'a': 'b', 'c': [1,2,3]}, {}, []];
        var e = new JSQL(testData);
        assert.deepEqual(e._areAllObjects(['a', []]), false, '["a", []]');
        assert.deepEqual(e._areAllObjects([{}, {}]), true, '[{}, {}]');
        assert.deepEqual(e._areAllObjects([{}]), true, '[{}]');
        assert.deepEqual(e._areAllObjects([]), false, '[]');
        assert.deepEqual(e._areAllObjects([null]), false, '[null]');
        assert.deepEqual(e._areAllObjects([true]), false, '[true]');
        assert.deepEqual(e._areAllObjects([false]), false, '[false]');
        assert.deepEqual(e._areAllObjects([0]), false, '[0]');
        assert.deepEqual(e._areAllObjects([1]), false, '[1]');
        assert.deepEqual(e._areAllObjects(['0']), false, '["0"]');
        assert.deepEqual(e._areAllObjects(['1']), false, '["1"]');
        assert.deepEqual(e._areAllObjects([{}, null]), false, '[{}, null]');
        assert.deepEqual(e._areAllObjects([{}, true]), false, '[{}, true]');
        assert.deepEqual(e._areAllObjects([{}, false]), false, '[{}, false]');
        assert.deepEqual(e._areAllObjects([{}, 0]), false, '[{}, 0]');
        assert.deepEqual(e._areAllObjects([{}, 1]), false, '[{}, 1]');
        assert.deepEqual(e._areAllObjects([{}, '0']), false, '[{}, "0"]');
        assert.deepEqual(e._areAllObjects([{}, '1']), false, '[{}, "1"]');
    });

/**
 * ADVANCED QUERIES
 */

    QUnit.test(title + 'advanced queries', function(assert){
        var testData = [{'id': 1, 'first': 'Adria', 'last': 'Carson', 'email': 'et.malesuada.fames@Vestibulumaccumsanneque.co.uk', 'city': 'Crowsnest Pass', 'date': '2015-12-07 01:12:03', 'age': 48}, {'id': 2, 'first': 'Alfonso', 'last': 'Morrow', 'email': 'commodo.auctor.velit@Integer.edu', 'city': 'Burntisland', 'date': '2016-02-08 03:43:36', 'age': 62}, {'id': 3, 'first': 'Hedley', 'last': 'Burt', 'email': 'aliquam.adipiscing.lacus@Aliquamerat.org', 'city': 'Affligem', 'date': '2015-02-25 12:58:54', 'age': 18}, {'id': 4, 'first': 'Noel', 'last': 'Barnes', 'email': 'lectus.convallis.est@faucibus.co.uk', 'city': 'Red Deer', 'date': '2015-06-07 22:16:35', 'age': 35}, {'id': 5, 'first': 'Nicholas', 'last': 'Stafford', 'email': 'fermentum.arcu@vulputaterisus.com', 'city': 'Shawinigan', 'date': '2015-09-07 08:55:34', 'age': 33}, {'id': 6, 'first': 'Wang', 'last': 'Higgins', 'email': 'nascetur.ridiculus.mus@vitaealiquet.com', 'city': 'Mayerthorpe', 'date': '2015-12-28 06:13:44', 'age': 47}, {'id': 7, 'first': 'Talon', 'last': 'Pratt', 'email': 'massa@Cumsociis.com', 'city': 'Redwater', 'date': '2016-05-27 20:51:37', 'age': 39}, {'id': 8, 'first': 'Heidi', 'last': 'Houston', 'email': 'ullamcorper@commodoatlibero.com', 'city': 'Edremit', 'date': '2016-11-02 18:37:32', 'age': 70}, {'id': 9, 'first': 'Carly', 'last': 'Mcfarland', 'email': 'fringilla.Donec.feugiat@pellentesque.co.uk', 'city': '100 Mile House', 'date': '2015-03-10 18:08:23', 'age': 29}, {'id': 10, 'first': 'Ursa', 'last': 'Warren', 'email': 'ipsum.Curabitur.consequat@sapienimperdietornare.co.uk', 'city': 'Folkestone', 'date': '2016-02-17 10:32:25', 'age': 41}, {'id': 11, 'first': 'Castor', 'last': 'Dean', 'email': 'diam.eu.dolor@velarcu.com', 'city': 'Gore', 'date': '2016-10-18 05:06:28', 'age': 57}, {'id': 12, 'first': 'Boris', 'last': 'Welch', 'email': 'Cras.pellentesque@erat.com', 'city': 'Fort Good Hope', 'date': '2016-07-16 02:12:30', 'age': 23}, {'id': 13, 'first': 'Curran', 'last': 'Fletcher', 'email': 'congue.a.aliquet@tempus.co.uk', 'city': 'Oostkerke', 'date': '2014-11-15 05:38:53', 'age': 19}, {'id': 14, 'first': 'Nora', 'last': 'Burch', 'email': 'arcu.Sed@tristiquesenectus.edu', 'city': 'Genappe', 'date': '2016-01-24 12:30:47', 'age': 30}, {'id': 15, 'first': 'Tana', 'last': 'Coleman', 'email': 'diam.luctus.lobortis@non.edu', 'city': 'Carterton', 'date': '2016-08-27 02:52:47', 'age': 27}, {'id': 16, 'first': 'Miriam', 'last': 'James', 'email': 'orci.lobortis@estarcuac.com', 'city': 'Anamur', 'date': '2016-03-28 07:39:36', 'age': 31}, {'id': 17, 'first': 'Simon', 'last': 'Koch', 'email': 'erat.semper@velquamdignissim.net', 'city': 'Port Harcourt', 'date': '2015-09-12 17:14:18', 'age': 60}, {'id': 18, 'first': 'Keefe', 'last': 'Oneil', 'email': 'sed.libero.Proin@Aenean.ca', 'city': 'Bavikhove', 'date': '2016-05-02 03:38:08', 'age': 74}, {'id': 19, 'first': 'Tana', 'last': 'Fleming', 'email': 'erat@amet.org', 'city': 'Anthisnes', 'date': '2015-06-13 06:16:51', 'age': 68}, {'id': 20, 'first': 'Kane', 'last': 'Ortega', 'email': 'In.nec.orci@Nunc.edu', 'city': 'Iseyin', 'date': '2015-08-27 11:15:19', 'age': 27}, {'id': 21, 'first': 'Thane', 'last': 'Christensen', 'email': 'ornare.sagittis@Suspendisse.co.uk', 'city': 'Ortacesus', 'date': '2015-06-15 05:04:59', 'age': 20}, {'id': 22, 'first': 'Montana', 'last': 'Jackson', 'email': 'a@faucibusMorbi.co.uk', 'city': 'Gols', 'date': '2015-06-29 10:14:15', 'age': 30}, {'id': 23, 'first': 'Hedy', 'last': 'Griffith', 'email': 'libero.lacus.varius@semperNamtempor.co.uk', 'city': 'Sandy', 'date': '2016-06-11 09:49:14', 'age': 51}, {'id': 24, 'first': 'William', 'last': 'Villarreal', 'email': 'enim.Etiam.gravida@in.com', 'city': 'Aubervilliers', 'date': '2016-05-01 22:41:27', 'age': 69}, {'id': 25, 'first': 'Armando', 'last': 'Keller', 'email': 'faucibus.orci@quis.net', 'city': 'Bala', 'date': '2015-07-08 05:06:32', 'age': 32}, {'id': 26, 'first': 'Maia', 'last': 'Stanley', 'email': 'primis.in@eu.ca', 'city': 'Vauda Canavese', 'date': '2015-09-08 17:30:37', 'age': 21}, {'id': 27, 'first': 'Ray', 'last': 'Brooks', 'email': 'dolor.Fusce.mi@pedenecante.org', 'city': 'Talgarth', 'date': '2016-07-05 21:55:14', 'age': 36}, {'id': 28, 'first': 'Willow', 'last': 'Mercer', 'email': 'et.tristique.pellentesque@In.org', 'city': 'St. Johann in Tirol', 'date': '2016-04-04 02:40:20', 'age': 72}, {'id': 29, 'first': 'Stacey', 'last': 'Estrada', 'email': 'risus.Nulla@pharetranibh.org', 'city': 'Curridabat', 'date': '2015-01-19 02:47:48', 'age': 39}, {'id': 30, 'first': 'Dolan', 'last': 'Bean', 'email': 'magna.Cras@Donec.co.uk', 'city': 'Langenburg', 'date': '2016-07-31 13:48:03', 'age': 29}, {'id': 31, 'first': 'Keith', 'last': 'Carpenter', 'email': 'Cras.eu@nostraper.co.uk', 'city': 'Alsemberg', 'date': '2015-03-28 12:27:52', 'age': 60}, {'id': 32, 'first': 'Emma', 'last': 'Conrad', 'email': 'nunc.In.at@Utsagittis.edu', 'city': 'Gagliano del Capo', 'date': '2015-11-11 01:49:16', 'age': 34}, {'id': 33, 'first': 'Wilma', 'last': 'Knowles', 'email': 'sit.amet.consectetuer@ut.net', 'city': 'Ã‡ermik', 'date': '2016-04-17 23:38:32', 'age': 22}, {'id': 34, 'first': 'Jackson', 'last': 'Baird', 'email': 'mi.Duis.risus@lacusNullatincidunt.org', 'city': 'Sacramento', 'date': '2015-06-06 16:45:48', 'age': 51}, {'id': 35, 'first': 'Myra', 'last': 'Bradford', 'email': 'id.sapien.Cras@molestie.net', 'city': 'Olathe', 'date': '2015-12-16 06:51:33', 'age': 30}, {'id': 36, 'first': 'Cairo', 'last': 'Nash', 'email': 'viverra@nonantebibendum.org', 'city': 'Davenport', 'date': '2016-05-16 09:23:02', 'age': 74}, {'id': 37, 'first': 'Karly', 'last': 'Rios', 'email': 'egestas.Aliquam@duiCras.co.uk', 'city': 'Westerlo', 'date': '2016-07-07 09:04:06', 'age': 63}, {'id': 38, 'first': 'Porter', 'last': 'Bryant', 'email': 'metus.Aenean.sed@purusDuiselementum.com', 'city': 'Saint-Remy-Geest', 'date': '2016-05-15 08:21:17', 'age': 61}, {'id': 39, 'first': 'Tobias', 'last': 'Mcfarland', 'email': 'auctor@Namtempor.org', 'city': 'Mayerthorpe', 'date': '2015-12-07 05:39:47', 'age': 64}, {'id': 40, 'first': 'Shana', 'last': 'Sanford', 'email': 'Mauris@Maurisut.net', 'city': 'Vezzi Portio', 'date': '2015-10-22 12:55:47', 'age': 30}, {'id': 41, 'first': 'Burke', 'last': 'Snow', 'email': 'sodales@nunc.co.uk', 'city': 'Detroit', 'date': '2016-04-09 03:02:07', 'age': 74}, {'id': 42, 'first': 'Fulton', 'last': 'Marks', 'email': 'sit@nonegestas.org', 'city': 'Klosterneuburg', 'date': '2015-01-13 04:20:57', 'age': 23}, {'id': 43, 'first': 'Kevyn', 'last': 'Wilkinson', 'email': 'leo@erat.edu', 'city': 'Bharatpur', 'date': '2016-01-16 03:46:05', 'age': 50}, {'id': 44, 'first': 'Allegra', 'last': 'Solis', 'email': 'mi.fringilla@dictumeu.com', 'city': 'Orciano Pisano', 'date': '2016-08-23 22:11:50', 'age': 71}, {'id': 45, 'first': 'Nathaniel', 'last': 'Small', 'email': 'vel.lectus.Cum@NullafacilisisSuspendisse.edu', 'city': 'Dorval', 'date': '2015-05-05 02:12:32', 'age': 53}, {'id': 46, 'first': 'Daquan', 'last': 'Beard', 'email': 'sapien.imperdiet.ornare@vitaerisusDuis.edu', 'city': 'Tain', 'date': '2015-03-07 10:15:40', 'age': 36}, {'id': 47, 'first': 'Derek', 'last': 'Hurst', 'email': 'gravida.molestie.arcu@Proinnonmassa.net', 'city': 'Williams Lake', 'date': '2016-02-11 15:57:00', 'age': 61}, {'id': 48, 'first': 'Nissim', 'last': 'Bowers', 'email': 'erat@urna.co.uk', 'city': 'Cuddapah', 'date': '2015-10-17 11:21:08', 'age': 29}, {'id': 49, 'first': 'Anjolie', 'last': 'Brooks', 'email': 'magna.Nam@malesuadaaugue.edu', 'city': 'Columbia', 'date': '2015-06-25 14:38:03', 'age': 19},
                         {'id': 50, 'first': 'Shelley', 'last': 'Guthrie', 'email': 'montes@nuncullamcorper.net', 'city': 'Delta', 'date': '2014-12-13 02:32:59', 'age': 62}, {'id': 51, 'first': 'Beck', 'last': 'Mckinney', 'email': 'nibh.Quisque.nonummy@erat.com', 'city': 'Castel Volturno', 'date': '2015-04-05 02:33:41', 'age': 73}, {'id': 52, 'first': 'September', 'last': 'Estes', 'email': 'dictum.eu.placerat@SedmolestieSed.net', 'city': 'Kaster', 'date': '2015-12-01 19:16:21', 'age': 40}, {'id': 53, 'first': 'Curran', 'last': 'Riddle', 'email': 'Suspendisse.tristique.neque@Suspendissetristique.edu', 'city': 'Heerenveen', 'date': '2015-11-19 21:08:11', 'age': 75}, {'id': 54, 'first': 'Audrey', 'last': 'Buckner', 'email': 'a.tortor@atlacus.co.uk', 'city': 'Norderstedt', 'date': '2016-07-17 23:43:29', 'age': 27}, {'id': 55, 'first': 'Kathleen', 'last': 'Barr', 'email': 'cursus.in@tempuseuligula.co.uk', 'city': 'Cambridge Bay', 'date': '2015-10-25 02:34:58', 'age': 52}, {'id': 56, 'first': 'Lacy', 'last': 'Melendez', 'email': 'ornare@aauctor.ca', 'city': 'Gonnosfanadiga', 'date': '2016-06-02 19:59:58', 'age': 28}, {'id': 57, 'first': 'Callum', 'last': 'Rivas', 'email': 'ut.dolor.dapibus@pedenec.co.uk', 'city': 'Lawton', 'date': '2015-12-29 08:08:47', 'age': 72}, {'id': 58, 'first': 'Cheryl', 'last': 'Frazier', 'email': 'aliquet@cursusvestibulum.edu', 'city': 'Aparecida de GoiÃ¢nia', 'date': '2015-10-07 05:21:04', 'age': 19}, {'id': 59, 'first': 'Bree', 'last': 'Morin', 'email': 'urna.nec.luctus@Phasellus.net', 'city': 'Green Bay', 'date': '2015-09-15 05:13:16', 'age': 31}, {'id': 60, 'first': 'Merrill', 'last': 'Todd', 'email': 'In.faucibus@non.org', 'city': 'Daman', 'date': '2016-05-05 18:00:53', 'age': 23}, {'id': 61, 'first': 'Xanthus', 'last': 'Holmes', 'email': 'Nullam.vitae.diam@cursus.net', 'city': 'Gembloux', 'date': '2016-09-14 04:04:53', 'age': 51}, {'id': 62, 'first': 'Melodie', 'last': 'Smith', 'email': 'pharetra.sed@vitaedolor.ca', 'city': 'Newtown', 'date': '2015-06-12 03:36:55', 'age': 38}, {'id': 63, 'first': 'Adam', 'last': 'Savage', 'email': 'faucibus.Morbi@Integervulputaterisus.ca', 'city': 'Rixensart', 'date': '2015-10-25 02:03:48', 'age': 53}, {'id': 64, 'first': 'Honorato', 'last': 'Castaneda', 'email': 'tellus.Nunc.lectus@nisiMaurisnulla.org', 'city': 'Bellevue', 'date': '2016-06-04 16:52:00', 'age': 22}, {'id': 65, 'first': 'Yuli', 'last': 'Perkins', 'email': 'orci@augue.ca', 'city': 'Pradamano', 'date': '2015-06-24 14:02:35', 'age': 29}, {'id': 66, 'first': 'Wilma', 'last': 'Rodgers', 'email': 'ligula@Aliquamornare.net', 'city': 'Santu Lussurgiu', 'date': '2015-03-16 13:03:36', 'age': 44}, {'id': 67, 'first': 'Riley', 'last': 'Salazar', 'email': 'dignissim@Donec.net', 'city': 'Goes', 'date': '2016-08-25 18:33:07', 'age': 39}, {'id': 68, 'first': 'Marvin', 'last': 'Barker', 'email': 'Vestibulum.ante.ipsum@lectus.edu', 'city': 'Jambes', 'date': '2016-05-24 03:24:49', 'age': 32}, {'id': 69, 'first': 'Jocelyn', 'last': 'Diaz', 'email': 'risus.Nulla@consectetuerrhoncus.net', 'city': 'Guelph', 'date': '2015-09-04 18:34:01', 'age': 42}, {'id': 70, 'first': 'Justina', 'last': 'Melton', 'email': 'Nunc.ut@Nullam.edu', 'city': 'BÃ¼nyan', 'date': '2015-09-20 03:46:09', 'age': 38}, {'id': 71, 'first': 'Risa', 'last': 'Stein', 'email': 'Aenean.egestas@placeratvelitQuisque.co.uk', 'city': 'VitÃ³ria da Conquista', 'date': '2016-02-10 07:43:03', 'age': 21}, {'id': 72, 'first': 'Merrill', 'last': 'Mcdonald', 'email': 'ullamcorper.eu@veliteu.org', 'city': 'Eisden', 'date': '2015-10-28 18:48:36', 'age': 58}, {'id': 73, 'first': 'MacKenzie', 'last': 'Compton', 'email': 'ornare.libero@eliteratvitae.com', 'city': 'Lorient', 'date': '2015-01-29 18:02:34', 'age': 60}, {'id': 74, 'first': 'Maile', 'last': 'Barry', 'email': 'nisl.elementum.purus@nisiCumsociis.com', 'city': 'San Francisco', 'date': '2016-05-06 15:55:54', 'age': 68}, {'id': 75, 'first': 'Madonna', 'last': 'Hogan', 'email': 'ornare@auctorquis.com', 'city': 'Coatbridge', 'date': '2016-02-29 15:43:24', 'age': 52}, {'id': 76, 'first': 'Tyrone', 'last': 'Perkins', 'email': 'scelerisque@semper.com', 'city': 'Oakham', 'date': '2015-09-13 05:50:14', 'age': 40}, {'id': 77, 'first': 'Samantha', 'last': 'Emerson', 'email': 'ullamcorper.velit.in@utmolestie.edu', 'city': 'Vitry-sur-Seine', 'date': '2015-02-11 05:50:27', 'age': 61}, {'id': 78, 'first': 'Brett', 'last': 'Gray', 'email': 'posuere.at.velit@Ut.co.uk', 'city': 'Sunset Point', 'date': '2015-03-21 10:59:58', 'age': 67}, {'id': 79, 'first': 'Dorian', 'last': 'Reese', 'email': 'lorem.auctor.quis@egetmollis.ca', 'city': 'Tranent', 'date': '2016-09-20 16:44:11', 'age': 39}, {'id': 80, 'first': 'Cassandra', 'last': 'Griffith', 'email': 'sit.amet.ultricies@eget.org', 'city': 'Paulatuk', 'date': '2016-04-06 10:30:50', 'age': 73}, {'id': 81, 'first': 'Shea', 'last': 'Taylor', 'email': 'Nulla.tincidunt@gravidanonsollicitudin.org', 'city': 'Cap-de-la-Madeleine', 'date': '2015-04-30 16:53:20', 'age': 74}, {'id': 82, 'first': 'Abdul', 'last': 'Hodges', 'email': 'mi@nuncQuisqueornare.com', 'city': 'Blankenfelde-Mahlow', 'date': '2015-08-28 03:19:54', 'age': 48}, {'id': 83, 'first': 'Christian', 'last': 'Price', 'email': 'ante.dictum@nisi.co.uk', 'city': 'Gosselies', 'date': '2015-02-03 08:25:11', 'age': 36}, {'id': 84, 'first': 'Jenette', 'last': 'Gonzalez', 'email': 'tristique.aliquet.Phasellus@etmagna.org', 'city': 'Ã‡ermik', 'date': '2016-10-09 20:16:09', 'age': 73}, {'id': 85, 'first': 'Inga', 'last': 'Cook', 'email': 'est@ornarelectusante.edu', 'city': 'Leeuwarden', 'date': '2016-01-12 14:07:48', 'age': 36}, {'id': 86, 'first': 'Knox', 'last': 'Lang', 'email': 'Vivamus@nonlorem.net', 'city': 'Shawville', 'date': '2015-06-19 02:23:15', 'age': 53}, {'id': 87, 'first': 'Yael', 'last': 'Sweeney', 'email': 'enim.Mauris@Curabitur.edu', 'city': 'Ethe', 'date': '2015-02-24 14:32:57', 'age': 58}, {'id': 88, 'first': 'Drew', 'last': 'Hayden', 'email': 'Nulla.facilisis@gravida.net', 'city': 'Lembeek', 'date': '2015-04-18 04:20:31', 'age': 28}, {'id': 89, 'first': 'Baker', 'last': 'Hahn', 'email': 'id@tincidunt.edu', 'city': 'Morinville', 'date': '2015-06-16 09:28:38', 'age': 73}, {'id': 90, 'first': 'Brielle', 'last': 'Greene', 'email': 'aliquet.magna.a@molestiedapibus.co.uk', 'city': 'Port Moody', 'date': '2014-12-31 17:24:57', 'age': 25}, {'id': 91, 'first': 'Ursula', 'last': 'Mays', 'email': 'eu.accumsan.sed@ullamcorper.edu', 'city': 'Biloxi', 'date': '2015-01-04 07:52:26', 'age': 46}, {'id': 92, 'first': 'Richard', 'last': 'Langley', 'email': 'nibh.Aliquam.ornare@ipsum.co.uk', 'city': 'Dollard-des-Ormeaux', 'date': '2016-07-26 13:12:52', 'age': 49}, {'id': 93, 'first': 'Leonard', 'last': 'Shepard', 'email': 'eget.magna.Suspendisse@bibendum.org', 'city': 'Bendigo', 'date': '2015-02-18 09:52:04', 'age': 33}, {'id': 94, 'first': 'Daryl', 'last': 'Baker', 'email': 'Nam@leo.co.uk', 'city': 'Governador Valadares', 'date': '2016-08-12 14:56:56', 'age': 50}, {'id': 95, 'first': 'Wyoming', 'last': 'Barton', 'email': 'a@aliquameros.org', 'city': 'Dole', 'date': '2016-09-13 19:33:33', 'age': 21}, {'id': 96, 'first': 'Azalia', 'last': 'Talley', 'email': 'cursus.purus.Nullam@tinciduntaliquam.com', 'city': 'RibeirÃ£o Preto', 'date': '2016-04-07 01:24:01', 'age': 31}, {'id': 97, 'first': 'Samson', 'last': 'Abbott', 'email': 'eu.ligula.Aenean@maurisSuspendissealiquet.co.uk', 'city': 'Crowsnest Pass', 'date': '2016-03-02 19:01:12', 'age': 52}, {'id': 98, 'first': 'Hayes', 'last': 'Kane', 'email': 'egestas.hendrerit@ut.ca', 'city': 'Lake Cowichan', 'date': '2015-08-30 16:13:12', 'age': 31}, {'id': 99, 'first': 'Beau', 'last': 'Lester', 'email': 'semper.pretium@Cum.ca', 'city': 'Thalassery', 'date': '2016-06-08 00:57:49', 'age': 75}, {'id': 100, 'first': 'Acton', 'last': 'Bradley', 'email': 'sagittis@Maurisutquam.ca', 'city': 'Independence', 'date': '2016-11-03 07:57:34', 'age': 30},
                         {'id': 101, 'first': 'Ryder', 'last': 'Hill', 'email': 'dictum.sapien.Aenean@lacusUtnec.com', 'city': 'DivinÃ³polis', 'date': '2016-07-16 05:50:42', 'age': 35}, {'id': 102, 'first': 'Karyn', 'last': 'Cherry', 'email': 'montes.nascetur@id.org', 'city': 'Koersel', 'date': '2016-01-08 13:48:50', 'age': 44}, {'id': 103, 'first': 'Frances', 'last': 'David', 'email': 'id@consectetueradipiscingelit.co.uk', 'city': 'Whitchurch-Stouffville', 'date': '2015-02-24 23:04:47', 'age': 32}, {'id': 104, 'first': 'Richard', 'last': 'Warner', 'email': 'arcu@inmagnaPhasellus.co.uk', 'city': 'San Martino in Pensilis', 'date': '2015-05-14 09:08:16', 'age': 60}, {'id': 105, 'first': 'Kane', 'last': 'Lloyd', 'email': 'Donec.est@mauriserat.net', 'city': 'Castelmarte', 'date': '2016-09-11 08:37:18', 'age': 40}, {'id': 106, 'first': 'Hadassah', 'last': 'Wilder', 'email': 'ut@semelit.org', 'city': 'Las Vegas', 'date': '2016-07-14 04:22:20', 'age': 70}, {'id': 107, 'first': 'Brendan', 'last': 'Flynn', 'email': 'ullamcorper.magna@Nunc.edu', 'city': 'LiÃ©vin', 'date': '2016-01-04 04:03:51', 'age': 68}, {'id': 108, 'first': 'Raya', 'last': 'Stephenson', 'email': 'nec@Aenean.com', 'city': 'Maria', 'date': '2016-10-24 07:46:04', 'age': 35}, {'id': 109, 'first': 'Griffin', 'last': 'Kline', 'email': 'arcu.ac.orci@cursusvestibulum.com', 'city': 'Parla', 'date': '2016-06-09 11:08:48', 'age': 67}, {'id': 110, 'first': 'Gabriel', 'last': 'Waters', 'email': 'rhoncus.Donec@hendrerita.net', 'city': 'Craco', 'date': '2015-01-27 16:22:40', 'age': 24}, {'id': 111, 'first': 'Erich', 'last': 'Oneil', 'email': 'turpis.egestas.Aliquam@purusDuis.co.uk', 'city': 'Curridabat', 'date': '2016-03-01 05:48:49', 'age': 74}, {'id': 112, 'first': 'Imogene', 'last': 'Sheppard', 'email': 'nec.enim@Curabitur.ca', 'city': 'Dunstable', 'date': '2016-09-20 06:33:21', 'age': 33}, {'id': 113, 'first': 'Abdul', 'last': 'Clarke', 'email': 'varius.ultrices@arcuVestibulumante.edu', 'city': 'Veldegem', 'date': '2016-05-29 20:06:54', 'age': 23}, {'id': 114, 'first': 'Wilma', 'last': 'Douglas', 'email': 'est.tempor@placerat.org', 'city': 'Romano d\'Ezzelino', 'date': '2015-07-25 03:23:43', 'age': 59}, {'id': 115, 'first': 'Judah', 'last': 'Russo', 'email': 'in.faucibus@enimnectempus.net', 'city': 'Collinas', 'date': '2015-03-03 18:17:50', 'age': 69}, {'id': 116, 'first': 'Naida', 'last': 'Puckett', 'email': 'libero@Donecsollicitudin.net', 'city': 'Sannazzaro de\' Burgondi', 'date': '2015-04-22 14:28:20', 'age': 46}, {'id': 117, 'first': 'Sybil', 'last': 'Velez', 'email': 'nonummy.ac@ipsum.com', 'city': 'Springfield', 'date': '2016-06-01 07:32:46', 'age': 24}, {'id': 118, 'first': 'Kirsten', 'last': 'Frye', 'email': 'orci.sem.eget@atvelit.co.uk', 'city': 'Saint-Georges', 'date': '2016-07-28 00:37:18', 'age': 53}, {'id': 119, 'first': 'Shellie', 'last': 'Ortiz', 'email': 'dui.augue@montesnasceturridiculus.org', 'city': 'Tione di Trento', 'date': '2016-03-15 19:51:48', 'age': 37}, {'id': 120, 'first': 'Bert', 'last': 'Gill', 'email': 'Sed@iaculis.net', 'city': 'Soma', 'date': '2016-08-05 21:56:14', 'age': 25}, {'id': 121, 'first': 'Patrick', 'last': 'William', 'email': 'Etiam.gravida.molestie@dis.net', 'city': 'Pau', 'date': '2016-10-25 22:21:35', 'age': 66}, {'id': 122, 'first': 'Kevin', 'last': 'Donovan', 'email': 'sit.amet@adipiscing.net', 'city': 'Bristol', 'date': '2016-06-26 01:28:09', 'age': 64}, {'id': 123, 'first': 'Elijah', 'last': 'Gonzales', 'email': 'interdum.Curabitur.dictum@sem.com', 'city': 'Lede', 'date': '2016-04-29 00:59:39', 'age': 48}, {'id': 124, 'first': 'Jamalia', 'last': 'Richardson', 'email': 'ut.lacus@pharetra.ca', 'city': 'Arviat', 'date': '2015-11-28 18:17:16', 'age': 61}, {'id': 125, 'first': 'Tobias', 'last': 'Cleveland', 'email': 'ligula@Morbi.net', 'city': 'Rangiora', 'date': '2016-02-25 01:49:35', 'age': 49}, {'id': 126, 'first': 'Hadley', 'last': 'Contreras', 'email': 'Donec.sollicitudin.adipiscing@feugiattelluslorem.org', 'city': 'Nives', 'date': '2015-09-19 08:51:24', 'age': 74}, {'id': 127, 'first': 'Tashya', 'last': 'Hodges', 'email': 'velit.egestas.lacinia@atarcuVestibulum.edu', 'city': 'North Las Vegas', 'date': '2015-12-10 00:48:50', 'age': 63}, {'id': 128, 'first': 'Kyra', 'last': 'Randolph', 'email': 'metus.urna@scelerisqueneque.org', 'city': 'Leoben', 'date': '2016-06-10 23:32:51', 'age': 74}, {'id': 129, 'first': 'Charlotte', 'last': 'Bruce', 'email': 'Morbi.metus.Vivamus@Suspendisse.co.uk', 'city': 'Neerharen', 'date': '2016-03-04 12:54:45', 'age': 71}, {'id': 130, 'first': 'Emmanuel', 'last': 'Rush', 'email': 'pede.blandit.congue@augueutlacus.com', 'city': 'Lakeshore', 'date': '2016-11-08 09:07:21', 'age': 48}, {'id': 131, 'first': 'Mollie', 'last': 'Dotson', 'email': 'in@lectus.edu', 'city': 'Lugnano in Teverina', 'date': '2015-12-28 06:11:01', 'age': 55}, {'id': 132, 'first': 'Avye', 'last': 'Calhoun', 'email': 'ipsum@dignissimpharetraNam.org', 'city': 'Berwick-upon-Tweed', 'date': '2015-05-07 15:57:50', 'age': 54}, {'id': 133, 'first': 'Bert', 'last': 'Houston', 'email': 'Morbi.sit@montesnascetur.co.uk', 'city': 'Rutigliano', 'date': '2016-08-18 23:43:39', 'age': 48}, {'id': 134, 'first': 'Sage', 'last': 'Petersen', 'email': 'tellus.Aenean.egestas@nondui.com', 'city': 'Offenbach am Main', 'date': '2016-08-31 13:30:59', 'age': 46}, {'id': 135, 'first': 'Ruth', 'last': 'Moreno', 'email': 'ornare@scelerisquesedsapien.net', 'city': 'Heerlen', 'date': '2015-03-03 11:28:32', 'age': 44}, {'id': 136, 'first': 'Kenneth', 'last': 'Gibson', 'email': 'Sed.neque.Sed@Maurisvel.co.uk', 'city': 'Fresno', 'date': '2015-12-27 12:04:31', 'age': 71}, {'id': 137, 'first': 'Emma', 'last': 'Guzman', 'email': 'pellentesque.massa.lobortis@rutrumFusce.net', 'city': 'Wiekevorst', 'date': '2016-08-18 19:36:54', 'age': 43}, {'id': 138, 'first': 'Emi', 'last': 'Hayden', 'email': 'luctus.felis@vitaealiquetnec.ca', 'city': 'Moliterno', 'date': '2015-10-20 05:26:05', 'age': 41}, {'id': 139, 'first': 'Ulysses', 'last': 'Chavez', 'email': 'Vivamus@dolordolortempus.com', 'city': 'Rouen', 'date': '2015-01-24 03:54:20', 'age': 34}, {'id': 140, 'first': 'Garrison', 'last': 'Wallace', 'email': 'lorem.tristique.aliquet@Phasellusdolorelit.org', 'city': 'Comblain-au-Pont', 'date': '2015-06-23 10:15:48', 'age': 21}, {'id': 141, 'first': 'Chloe', 'last': 'Rice', 'email': 'Sed@velit.co.uk', 'city': 'Arnhem', 'date': '2016-05-25 12:10:04', 'age': 55}, {'id': 142, 'first': 'Armando', 'last': 'Rosa', 'email': 'eu@elitfermentumrisus.org', 'city': 'Hall in Tirol', 'date': '2016-10-02 07:36:19', 'age': 65}, {'id': 143, 'first': 'Myra', 'last': 'Bauer', 'email': 'egestas.nunc@vehiculaPellentesque.com', 'city': 'Cambrai', 'date': '2015-11-12 11:00:46', 'age': 56}, {'id': 144, 'first': 'Gareth', 'last': 'Oneal', 'email': 'ligula@nisiAenean.ca', 'city': 'Bayreuth', 'date': '2015-01-20 08:18:34', 'age': 62}, {'id': 145, 'first': 'Phillip', 'last': 'Durham', 'email': 'tristique@acmattisornare.co.uk', 'city': 'Virginia Beach', 'date': '2015-09-28 04:00:18', 'age': 27}, {'id': 146, 'first': 'Kai', 'last': 'Grimes', 'email': 'Nunc@placerat.edu', 'city': 'Piracicaba', 'date': '2016-01-06 04:03:42', 'age': 28}, {'id': 147, 'first': 'Isaiah', 'last': 'Conrad', 'email': 'sociis@velconvallisin.com', 'city': 'Vlissegem', 'date': '2016-06-09 23:50:48', 'age': 75}, {'id': 148, 'first': 'Alma', 'last': 'Short', 'email': 'Praesent@blandit.com', 'city': 'Raigarh', 'date': '2015-12-08 19:38:44', 'age': 71}, {'id': 149, 'first': 'Philip', 'last': 'Paul', 'email': 'facilisis@aliquetvelvulputate.org', 'city': 'Clearwater Municipal District', 'date': '2016-08-13 13:06:51', 'age': 42},
                         {'id': 150, 'first': 'Aimee', 'last': 'Johns', 'email': 'Duis.mi.enim@aliquet.ca', 'city': 'Bettiah', 'date': '2015-01-07 05:47:53', 'age': 60}, {'id': 151, 'first': 'Geoffrey', 'last': 'Clemons', 'email': 'elit.pede.malesuada@laoreet.edu', 'city': 'Cuceglio', 'date': '2016-05-02 19:49:17', 'age': 31}, {'id': 152, 'first': 'Stacey', 'last': 'Perez', 'email': 'molestie.sodales@pedeultrices.org', 'city': 'Hoorn', 'date': '2015-09-24 20:58:02', 'age': 46}, {'id': 153, 'first': 'Xena', 'last': 'Villarreal', 'email': 'lectus@neque.edu', 'city': 'Villers-Perwin', 'date': '2015-02-08 13:20:38', 'age': 56}, {'id': 154, 'first': 'Octavia', 'last': 'Maldonado', 'email': 'lorem.luctus.ut@nullaatsem.net', 'city': 'Richmond Hill', 'date': '2016-10-23 18:41:35', 'age': 74}, {'id': 155, 'first': 'Ulric', 'last': 'Conley', 'email': 'in.sodales@egetmetus.co.uk', 'city': 'Le Puy-en-Velay', 'date': '2015-03-17 13:43:40', 'age': 44}, {'id': 156, 'first': 'Wynne', 'last': 'Gibson', 'email': 'turpis@Duis.edu', 'city': 'Ã‰pernay', 'date': '2016-06-10 20:47:10', 'age': 26}, {'id': 157, 'first': 'Lavinia', 'last': 'Schroeder', 'email': 'sed.sem@sagittisaugueeu.co.uk', 'city': 'Gillette', 'date': '2015-11-22 08:20:14', 'age': 54}, {'id': 158, 'first': 'Iona', 'last': 'Parsons', 'email': 'fermentum.risus@quamdignissim.com', 'city': 'Gmunden', 'date': '2015-11-22 20:28:24', 'age': 54}, {'id': 159, 'first': 'Kay', 'last': 'Nelson', 'email': 'Integer.vulputate.risus@consequatnecmollis.org', 'city': 'Neu-Isenburg', 'date': '2016-03-30 16:24:02', 'age': 46}, {'id': 160, 'first': 'Rina', 'last': 'Lynch', 'email': 'aliquam.arcu.Aliquam@dolordolortempus.com', 'city': 'Korneuburg', 'date': '2016-01-02 13:57:48', 'age': 69}, {'id': 161, 'first': 'Regan', 'last': 'Douglas', 'email': 'facilisis.non.bibendum@Phasellusdolor.net', 'city': 'High Level', 'date': '2015-04-22 04:47:02', 'age': 52}, {'id': 162, 'first': 'Alec', 'last': 'Hart', 'email': 'fringilla.est@sodales.co.uk', 'city': 'Castiglione Messer Raimondo', 'date': '2015-03-11 16:10:39', 'age': 20}, {'id': 163, 'first': 'Kibo', 'last': 'Johnston', 'email': 'Vestibulum@Morbiaccumsan.com', 'city': 'Annan', 'date': '2016-04-09 15:12:24', 'age': 74}, {'id': 164, 'first': 'Dominic', 'last': 'Acevedo', 'email': 'et.arcu.imperdiet@amet.net', 'city': 'Eschwege', 'date': '2015-08-22 22:36:37', 'age': 36}, {'id': 165, 'first': 'Ivor', 'last': 'Murphy', 'email': 'sit.amet.consectetuer@necenimNunc.edu', 'city': 'Robelmont', 'date': '2016-06-14 13:43:41', 'age': 40}, {'id': 166, 'first': 'Chandler', 'last': 'Reed', 'email': 'adipiscing@fermentum.co.uk', 'city': 'Schiltigheim', 'date': '2015-11-19 07:29:48', 'age': 51}, {'id': 167, 'first': 'Colby', 'last': 'Campbell', 'email': 'Nullam@sed.co.uk', 'city': 'Callander', 'date': '2016-06-19 19:56:50', 'age': 74}, {'id': 168, 'first': 'Claudia', 'last': 'Russo', 'email': 'Integer@sodaleseliterat.edu', 'city': 'Livingston', 'date': '2016-03-28 02:20:30', 'age': 60}, {'id': 169, 'first': 'Boris', 'last': 'Chavez', 'email': 'Donec@parturient.ca', 'city': 'San Clemente', 'date': '2016-03-01 19:29:45', 'age': 29}, {'id': 170, 'first': 'Hyatt', 'last': 'Beard', 'email': 'velit.justo@auctor.org', 'city': 'Ibadan', 'date': '2015-10-17 02:32:48', 'age': 66}, {'id': 171, 'first': 'Isaiah', 'last': 'Martin', 'email': 'Quisque@perconubia.edu', 'city': 'Gualdo Tadino', 'date': '2015-11-27 10:13:26', 'age': 55}, {'id': 172, 'first': 'Boris', 'last': 'Jackson', 'email': 'turpis.egestas.Aliquam@Loremipsum.ca', 'city': 'Ellesmere Port', 'date': '2015-03-14 19:11:37', 'age': 67}, {'id': 173, 'first': 'Grace', 'last': 'Reed', 'email': 'ac.turpis@ullamcorper.org', 'city': 'Oud-Turnhout', 'date': '2016-09-18 14:23:49', 'age': 25}, {'id': 174, 'first': 'Stephen', 'last': 'Brewer', 'email': 'posuere@seddolorFusce.org', 'city': 'Merzig', 'date': '2015-11-22 19:16:06', 'age': 57}, {'id': 175, 'first': 'Channing', 'last': 'Jenkins', 'email': 'orci.adipiscing.non@sapienNunc.org', 'city': 'Beaconsfield', 'date': '2015-12-13 00:36:50', 'age': 69}, {'id': 176, 'first': 'Vivien', 'last': 'Wiggins', 'email': 'semper.egestas.urna@risusDonecegestas.net', 'city': 'Cabano', 'date': '2014-11-26 19:02:24', 'age': 48}, {'id': 177, 'first': 'Maris', 'last': 'Whitley', 'email': 'nascetur.ridiculus@egestas.org', 'city': 'Lakeshore', 'date': '2015-04-23 10:23:41', 'age': 39}, {'id': 178, 'first': 'Hyacinth', 'last': 'Hamilton', 'email': 'lorem.eget@metusAenean.com', 'city': 'Oostkamp', 'date': '2016-08-26 06:40:23', 'age': 24}, {'id': 179, 'first': 'Fritz', 'last': 'Fry', 'email': 'nec.orci.Donec@pede.com', 'city': 'Bissegem', 'date': '2014-12-03 10:02:49', 'age': 33}, {'id': 180, 'first': 'Dana', 'last': 'Mclean', 'email': 'tellus.justo.sit@semper.org', 'city': 'Auvelais', 'date': '2015-05-08 03:02:17', 'age': 61}, {'id': 181, 'first': 'Meredith', 'last': 'Parrish', 'email': 'dictum.Proin@sitamet.edu', 'city': 'Teralfene', 'date': '2014-12-12 15:11:53', 'age': 38}, {'id': 182, 'first': 'Ulric', 'last': 'Koch', 'email': 'eu.odio.tristique@massa.co.uk', 'city': 'Adana', 'date': '2016-05-22 04:49:28', 'age': 37}, {'id': 183, 'first': 'Avram', 'last': 'Sears', 'email': 'id.erat.Etiam@augueSed.edu', 'city': 'Coquitlam', 'date': '2016-03-03 17:25:13', 'age': 50}, {'id': 184, 'first': 'Vernon', 'last': 'Mathis', 'email': 'odio.Phasellus@leoin.edu', 'city': 'Ottignies-Louvain-la-Neuve', 'date': '2015-08-19 15:13:20', 'age': 50}, {'id': 185, 'first': 'Axel', 'last': 'Harrison', 'email': 'lacinia@Nuncmauris.net', 'city': 'Monacilioni', 'date': '2015-05-24 19:09:44', 'age': 37}, {'id': 186, 'first': 'Sheila', 'last': 'Workman', 'email': 'Quisque.nonummy@sodalespurus.net', 'city': 'Ã‡aldÄ±ran', 'date': '2016-10-16 07:15:58', 'age': 43}, {'id': 187, 'first': 'Jada', 'last': 'Crawford', 'email': 'Aliquam.nec@utsemNulla.com', 'city': 'Neath', 'date': '2015-12-27 09:48:07', 'age': 47}, {'id': 188, 'first': 'Eden', 'last': 'Mcintosh', 'email': 'Aliquam.erat@in.co.uk', 'city': 'Troyes', 'date': '2015-04-09 00:18:13', 'age': 57}, {'id': 189, 'first': 'Wang', 'last': 'Wilder', 'email': 'sagittis@amet.ca', 'city': 'Sooke', 'date': '2016-09-18 15:55:37', 'age': 39}, {'id': 190, 'first': 'Quamar', 'last': 'Montgomery', 'email': 'Nulla.semper@Mauris.edu', 'city': 'Pietragalla', 'date': '2015-10-22 14:05:36', 'age': 60}, {'id': 191, 'first': 'Winter', 'last': 'Zimmerman', 'email': 'Suspendisse.eleifend@Cumsociis.com', 'city': 'Walhain-Saint-Paul', 'date': '2015-03-27 18:41:16', 'age': 59}, {'id': 192, 'first': 'Raphael', 'last': 'Figueroa', 'email': 'Cras.convallis.convallis@adlitoratorquent.com', 'city': 'Naperville', 'date': '2015-03-02 14:49:07', 'age': 68}, {'id': 193, 'first': 'Rebekah', 'last': 'Fitzpatrick', 'email': 'montes.nascetur@tincidunt.ca', 'city': 'Paularo', 'date': '2015-09-11 19:28:25', 'age': 27}, {'id': 194, 'first': 'Deacon', 'last': 'Cote', 'email': 'Vestibulum@nullaanteiaculis.org', 'city': 'Senneville', 'date': '2016-08-18 01:35:29', 'age': 36}, {'id': 195, 'first': 'Wynne', 'last': 'Valenzuela', 'email': 'sodales@etmagnis.co.uk', 'city': 'Saint-Eugï¿½ne-de-Guigues', 'date': '2015-07-22 18:54:41', 'age': 56}, {'id': 196, 'first': 'Alika', 'last': 'Christensen', 'email': 'ante.blandit.viverra@Suspendisseacmetus.edu', 'city': 'Tarcento', 'date': '2015-05-13 00:04:49', 'age': 35}, {'id': 197, 'first': 'Xaviera', 'last': 'Hines', 'email': 'Etiam.imperdiet.dictum@bibendumDonecfelis.co.uk', 'city': 'Dessau', 'date': '2016-05-13 00:12:27', 'age': 70}, {'id': 198, 'first': 'Lael', 'last': 'Garner', 'email': 'porttitor@montesnasceturridiculus.co.uk', 'city': 'Warburg', 'date': '2015-05-09 06:50:23', 'age': 53}, {'id': 199, 'first': 'Malik', 'last': 'Mendez', 'email': 'id.ante@dictumeu.ca', 'city': 'Bludenz', 'date': '2016-05-19 13:43:56', 'age': 39}, {'id': 200, 'first': 'Camille', 'last': 'Hernandez', 'email': 'vitae@Integertinciduntaliquam.co.uk', 'city': 'Asti', 'date': '2016-03-04 20:28:30', 'age': 33}
                    ];

        var e = new JSQL(testData);

        assert.deepEqual(
            e.select('first','age')
            .orWhere([{'age': 18}, {'age': 66}])
            .get()
            , [
                  {'age': 18, 'first': 'Hedley'},
                  {'age': 66, 'first': 'Patrick'},
                  {'age': 66, 'first': 'Hyatt'}
            ],
            'select(\'first\',\'age\').orWhere([{\'age\': 18}, {\'age\': 66}]).get()'
            );

        assert.deepEqual(
            e.select('first','age')
            .between('age', 18, 35)
            .like('first', 'Ha')
            .get()
            , [
                {'age': 20, 'first': 'Thane'},
                {'age': 30, 'first': 'Shana'},
                {'age': 31, 'first': 'Hayes'}
            ],
            'select(\'first\',\'age\').between(\'age\', 18, 35).like(\'first\', \'Ha\').get()'
            );

        assert.deepEqual(
            e.select('first')
            .startsWith('first','Je')
            .get()
            , [
                {'first': 'Jenette'}
            ],
            'select(\'first\').startsWith(\'first\',\'Je\').get()'
            );

        assert.deepEqual(
            e.select('first')
            .endsWith('first','ane')
            .get()
            , [
                {'first': 'Kane'},
                {'first': 'Thane'},
                {'first': 'Kane'}
            ],
            'select(\'first\').startsWith(\'first\',\'Je\').get()'
            );

        assert.deepEqual(
             e.select()
             .gt('age', 25)
             .like('email', 'et.')
             .like('last', 'a')
             .distinct('email')
             .get()
            , [
                   'et.malesuada.fames@Vestibulumaccumsanneque.co.uk',
                   'sapien.imperdiet.ornare@vitaerisusDuis.edu',
                   'tristique.aliquet.Phasellus@etmagna.org',
                   'eget.magna.Suspendisse@bibendum.org',
                   'eu.ligula.Aenean@maurisSuspendissealiquet.co.uk',
                   'et.arcu.imperdiet@amet.net',
                   'dictum.Proin@sitamet.edu'
                 ],
              '.gt(\'age\', 25).like(\'email\', \'et.\').like(\'last\', \'a\').distinct(\'email\').get()'
             );

        assert.deepEqual(
            e.select('first', 'last')
            .where({'last': 'Carson'}, {'last': 'Coleman'})
            .get()
            ,[
                  {
                      'first': 'Adria',
                      'last': 'Carson'
                  },
                  {
                      'first': 'Tana',
                      'last': 'Coleman'
                  }
                ],
                '.select(\'first\', \'last\').where({\'last\': \'Carson\'}, {\'last\': \'Coleman\'}).get()');

    });

};

runTests('', JSQL);
runTests('Minified : ', JSQLMIN);

