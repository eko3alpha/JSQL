# Do not use, this was for my own academic purposes only!

# JSQL
JSQL allows you to dynamically build queries to run against a collection of objects in a very human readable syntax.  It's perfect for filtering/sorting table data.

[WIKI](https://github.com/eko3alpha/JSQL/wiki)

Quick Start:
------

This is the data used for the following examples.
```javascript
    var data = [
          { "name": "Portia Zamora", "age": 48, "city": "Morkhoven" },
          { "name": "Rahim Wiggins", "age": 42, "city": "Orlando" },
          { "name": "Rana Murphy", "age": 48, "city": "Armstrong" },
          { "name": "Raven Jordan", "age": 32, "city": "Atlanta" },
          { "name": "Jocelyn Weeks", "age": 28, "city": "Sant'Onofrio" },
          { "name": "Ava Stark", "age": 60, "city": "Colombo" },
          { "name": "Noelani Gibson", "age": 54, "city": "Pittsburgh" },
          { "name": "Gisela Sykes", "age": 61, "city": "Caramanico Terme" },
          { "name": "Maggy Skinner", "age": 62, "city": "Chandigarh" },
          { "name": "Jordan Holden", "age": 40, "city": "Holman" },
          { "name": "Shoshana Fox", "age": 62, "city": "Ludwigsfelde" },
          { "name": "Jack Gilbert", "age": 55, "city": "Parkland County" }
        ];
```
Once you have the data you can create a new JSQL object.
```javascript
    var people = new JSQL(data);
```
Here are some examples using slightly different syntax.
```javascript
    people
    .select()
    .where("age", "60")
    .get();

    /* result */

    { "name": "Ava Stark", "age": 60, "city": "Colombo" }

    /*---------------------------------------------------------------*/

    people
    .select()
    .startsWith("name", "jo")
    .gt("age", 30)
    .get();

    /* result */

    { "name": "Jordan Holden", "age": 40, "city": "Holman" }

    /*---------------------------------------------------------------*/

    people
    .select("name", "age")
    .sortBy({"age": "asc", "name": "desc"})
    .get();

    /* result */

    [
      { "name": "Jocelyn Weeks", "age": 28 },
      { "name": "Raven Jordan", "age": 32 },
      { "name": "Jordan Holden", "age": 40 },
      { "name": "Rahim Wiggins", "age": 42 },
      { "name": "Rana Murphy", "age": 48 },
      { "name": "Portia Zamora", "age": 48 },
      { "name": "Noelani Gibson", "age": 54 },
      { "name": "Jack Gilbert", "age": 55 },
      { "name": "Ava Stark", "age": 60 },
      { "name": "Gisela Sykes", "age": 61 },
      { "name": "Shoshana Fox", "age": 62 },
      { "name": "Maggy Skinner", "age": 62 }
    ]

    /*---------------------------------------------------------------*/

    people.select();
    people.sortBy("age", "asc");
    people.distinct("age");
    people.get();

    /* result */
    [28, 32, 40, 42, 48, 54, 55, 60, 61, 62]
```




