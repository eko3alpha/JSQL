/* globals jkm, jkmMin, QUnit */
'use strict';
var runTests = function(title, JSQL, data){


/**
 * ADVANCED QUERIES
 */

    QUnit.test(title + 'advanced queries', function(assert){

        var e = new JSQL(data);

        assert.notEqual(
            e.transform(function(obj){
                obj.full = obj.first + ' ' + obj.last;
            }), [],
            "e.transform()"
        );

        assert.notEqual(
            e.select('first','age').where([{'age': 18}, {'age': 66}]).get()
            , [],
            "e.select('first','age').where([{'age': 18}, {'age': 66}]).get()"
            );

        assert.notEqual(
            e.select('first','age').between('age', 18, 35).like('first', 'Ha').get()
            , [],
            "e.select('first','age').between('age', 18, 35).like('first', 'Ha').get()"
            );

        assert.notEqual(
            e.select('first').startsWith('first','Je').get()
            , [],
            "e.select('first').startsWith('first','Je').get()"
            );

        assert.notEqual(
            e.select('first').endsWith('first','ane').get()
            , [],
            "e.select('first').endsWith('first','ane').get()"
            );

        assert.notEqual(
             e.select().gt('age', 25).like('email', 'et.').like('last', 'a').distinct('email').get()
            , [],
              "e.select().gt('age', 25).like('email', 'et.').like('last', 'a').distinct('email').get()"
             );

        assert.notEqual(
            e.select('first', 'last').where({'last': 'Carson'}, {'last': 'Coleman'}).get()
            ,[ ],
             "e.select('first', 'last').where({'last': 'Carson'}, {'last': 'Coleman'}).get()"
             );
    });

};

runTests('', JSQL, testData);
runTests('Minified : ', JSQLMIN, testData);

