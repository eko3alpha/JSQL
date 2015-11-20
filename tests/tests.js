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
            {'a': 3, 'b': -87.3, 'c': 'u'},
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

};

runTests('', JSQL);
runTests('Minified : ', JSQLMIN);

