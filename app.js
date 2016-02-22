var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var pg = require('pg');
var connectionString = '';
if(process.env.DATABASE_URL != undefined) {
    connectionString = process.env.DATABASE_URL + 'ssl';
} else {
    connectionString = 'postgres://localhost:5432/prime_weekend_chal_04';
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/task', function(req, res) {
    var results = [];
    pg.connect(connectionString, function(err, client, done) {
        var query = client.query('SELECT * FROM task WHERE deleted = FALSE ORDER BY complete, id ASC;');

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // close connection
        query.on('end', function() {
            done();
            return res.json(results);
        });

        if(err) {
            console.log(err);
        }
    });
});

app.post('/task', function(req, res) {
    var addEntry = {
        task: req.body.task,
        complete: "FALSE",
        deleted: "FALSE"
    };

    pg.connect(connectionString, function(err, client, done) {
        client.query("INSERT INTO task (task, complete, deleted) VALUES ($1, $2, $3) RETURNING id",
            [addEntry.task, addEntry.complete, addEntry.deleted],
            function (err, result) {
                done();
                if(err) {
                    console.log("Error inserting data: ", err);
                    res.send(false);
                } else {
                    res.send(result);
                }
            });
    });
});

app.put('/complete', function(req, res) {
    var updateTask = {
        id: req.body.id
    };
    //console.log("I'm getting here");
    //console.log(req.body.id);

    pg.connect(connectionString, function(err, client, done) {
        client.query("UPDATE task SET complete = NOT complete WHERE id = ($1) RETURNING id",
            [updateTask.id],
            function (err, result) {
                done();
                if(err) {
                    console.log("Error inserting data: ", err);
                    res.send(false);
                } else {
                    res.send(result);
                }
            });
    });
});

app.put('/delete', function(req, res) {
    var updateTask = {
        id: req.body.id
    };
    //console.log("I'm getting to the delete");
    //console.log(req.body.id);

    pg.connect(connectionString, function(err, client, done) {
        client.query("UPDATE task SET deleted = NOT deleted WHERE id = ($1) RETURNING id",
            [updateTask.id],
            function (err, result) {
                done();
                if(err) {
                    console.log("Error inserting data: ", err);
                    res.send(false);
                } else {
                    res.send(result);
                }
            });
    });
});

app.get('/*', function(req, res) {
    var file = req.params[0] || '/views/index.html';
    res.sendFile(path.join(__dirname, './public', file));
});

app.set('port', process.env.PORT || 5000);
app.listen(app.get('port'), function() {
    console.log('Listening on port: ', app.get('port'));
});