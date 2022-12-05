var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var port = process.env.PORT || 3000;
const { json } = require("express/lib/response");
const { start } = require("repl");
const sqlite3 = require('sqlite3').verbose();
const DBPATH = 'db.db';
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("Front/"));
app.get("/get", function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.send("Get Aqui");
});

app.get("/get", function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    console.log("Recebi a requisição de dados");
    dados = {
        action: 1,
        sensor: "LED",
        status: "OFF",
    };
    json1 = JSON.stringify(dados);
    res.send(json1);
});

app.post("/start", function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    console.log(req.body);
    texto = req.body;
    startGamer = req.body.start;
    id = req.body.id;
    console.log("Recebi um dado");

    res.statusCode = 200;
    res.setHeader('Access-Control-Allow-Origin', '*');

    sql = "INSERT INTO partida (start, id) VALUES ('" + startGamer + "', '" + id + "')";
    var db = new sqlite3.Database(DBPATH);
    db.run(sql, [], err => {
        if (err) {
            throw err;
        }
    });
    db.close();
    res.send(texto);
    res.end();


});

app.post("/playerOne", function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    console.log(req.body);
    texto = req.body;
    playerOne = req.body.playerOne;
    id = req.body.id;
    console.log("Recebi um dado");
    res.statusCode = 200;
    res.setHeader('Access-Control-Allow-Origin', '*');

    sql = "UPDATE partida SET playerOne = '" + playerOne + "' WHERE id = " + id;
    var db = new sqlite3.Database(DBPATH);
    db.run(sql, [], err => {
        if (err) {
            throw err;
        }
    });
    db.close();
    res.send(texto);
    res.end();


});

app.post("/playerTwo", function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    console.log(req.body);
    texto = req.body;
    playerTwo = req.body.playerTwo;
    id = req.body.id;
    console.log("Recebi um dado");
    res.statusCode = 200;
    res.setHeader('Access-Control-Allow-Origin', '*');

    sql = "UPDATE partida SET playerTwo = '" + playerTwo + "' WHERE id = " + id;
    var db = new sqlite3.Database(DBPATH);
    db.run(sql, [], err => {
        if (err) {
            throw err;
        }
    });
    db.close();
    res.send(texto);
    res.end();


});

app.post("/postWin", function (req, res) {
    texto = req.body;
    res.statusCode = 200;
    res.setHeader('Access-Control-Allow-Origin', '*');

    sql = "UPDATE partida SET win = '" + true + "' WHERE id = 1";
    var db = new sqlite3.Database(DBPATH);
    db.run(sql, [], err => {
        if (err) {
            throw err;
        }
    });
    db.close();
    res.send(texto);
    res.end();


});


app.get('/getPartida', (req, res) => {
    res.statusCode = 200;
    res.setHeader('Access-Control-Allow-Origin', '*');
    var db = new sqlite3.Database(DBPATH);
    var sql = 'SELECT * FROM partida ORDER BY id DESC LIMIT 1';
    db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }

        res.json(rows);

    });
    db.close();
});

app.listen(port, () => {
    console.log(`Server running at: http://localhost:${port}/`);
});