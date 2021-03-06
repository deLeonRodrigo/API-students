var WebSocketServer = require('ws').Server,
  wss = new WebSocketServer({
    port: 9090
  });
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var dbconnection = require('./dbconnection');
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

// Inicia el servidor REST en 8081
var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port
  console.log(`Websocket event broadcaster REST API listening on http://${host}:${port}`);
});

// Manda actualizaziones a todos los clientes del websocket
app.post('/notify/spanner/:spanner_id/update', function (req, res) {
  var spanner_id = req.params.spanner_id;
  console.log('Event: spanner %s updated', spanner_id);
  wss.clients.forEach(function each(client) {
    client.send("broadcast: spanner " + spanner_id + " updated");
  });
  res.sendStatus(200);
});

app.post('/insertStudents', (req, res) => {
  dbconnection.insert(req.body);
  res.redirect('/');
});

app.get('/', (req, res) => {
  dbconnection.get();
  setTimeout(() => {
      res.render('index', {
        Students: dbconnection.students()
      })
    },
    3000
  );
});

app.post('/updateStudent', (req, res) => {
  dbconnection.update(req.body);
  res.redirect('/');
})

app.post('/deleteStudent', (req, res) => {
  dbconnection.delete(req.body);
  res.redirect('/');
})