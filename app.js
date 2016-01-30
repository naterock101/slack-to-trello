var express = require('express');
var bodyParser = require('body-parser');
var Trello = require('node-trello');
var trello = new Trello(process.env.TRELLO_KEY, process.env.TRELLO_TOKEN);

var app = express();
var port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));


function postToTrello(listId, command, text, user_name, cb) {
  if (text == undefined || text == null || text == "") {
    throw new Error('Format is ' + command + ' name | [person] | [label/color] | [description]');
  } 

  var trelloArgs;
  if (text.indexOf('|') > -1) {
    trelloArgs = text.split('|');
  } else {
    trelloArgs = text;
  };

  //stupid hack for injecting member names
  var idMembers = "";

  //this check to see if the argument had a | in it.
  if (text.indexOf('|') > -1) {
    //grabs the object and gets rid of whitespace
    idMembers = trelloArgs[1].replace(/\s+/g, ''); 

    if (idMembers == "nate" || idMembers == "nathan") {
      idMembers = "51902656858a2d1d2400371f";
    } else if (idMembers == "brac") {
      idMembers = "4fe08f7a29951994158d3359";
    } else if (idMembers == "zern" || idMembers == "zernyu") {
      idMembers = "520e839359eba5b04a004244";
    } else if (idMembers == "gabe" || idMembers == "gabriel") {
      idMembers = "52d9e572ab5bf0847717c4b1";
    } else if (idMembers == "garrett" || idMembers == "garett" || idMembers == "garret" || idMembers == "garet") {
      idMembers = "52fbef485146d913398cb95a";
    } else if (idMembers == "caroline") {
      idMembers = "532897b3dda5d9550f86e39b";
    } else if (idMembers == "dan") {
      idMembers = "5580a1b779d64277225f6c39";
    } else if (idMembers == "harris") {
      idMembers = "52032ab362af020708000872";
    } else if (idMembers.length > 0) {
      throw new Error(idMembers + ' is not a real person. Or at least not a fishbit. try again.');
    };
  }
  

  //stupid hack for injecting labels
  var idLabelColor = "";
  if (trelloArgs[2] == undefined || trelloArgs[2] == null || trelloArgs[2] == "") {
    idLabelColor = "";
  } else {
    idLabelColor = trelloArgs[2].replace(/\s+/g, '');
  };

  if (idLabelColor == "backend" || idLabelColor == "lime") {
    idLabelColor = "55830296c3caa18119e722c2";
  } else if (idLabelColor == "frontend" || idLabelColor == "pink") {
    idLabelColor = "558302a5c3caa18119e722e7";
  } else if (idLabelColor == "bug" || idLabelColor == "red") {
    idLabelColor = "55778e29664ce8ff30a34400";
  } else if (idLabelColor == "firmware" || idLabelColor == "sky" || idLabelColor == "light blue") {
    idLabelColor = "558302acc3caa18119e72307";
  } else if (idLabelColor == "system" || idLabelColor == "black") {
    idLabelColor = "55778e29664ce8ff30a343fe";
  } else if (idLabelColor == "design" || idLabelColor == "yellow") {
    idLabelColor = "55778e29664ce8ff30a343fc";
  } else if (idLabelColor == "greenibl" || idLabelColor == "devops" || idLabelColor == "dev ops") {
    idLabelColor = "55778e29664ce8ff30a343fb";
  } else if (idLabelColor == "mechanical" || idLabelColor == "orange") {
    idLabelColor = "5583097cc3caa18119e73487";
  } else if (idLabelColor == "improvement" || idLabelColor == "blue") {
    idLabelColor = "55778e29664ce8ff30a343ff";
  } else if (idLabelColor.length > 0) {
    throw new Error(idLabelColor + 'is not a valid label or color dude. try again.');
  };

  var cardDescription = "";
  if (trelloArgs[3] == undefined || trelloArgs[3] == null || trelloArgs[3] == "") {
    cardDescription = "";
  } else {
    cardDescription = trelloArgs[3];
  };

  var cardName;
  if( typeof trelloArgs === 'string' ) {
    cardName = trelloArgs;
  } else {
    cardName = trelloArgs[0];
  }

  var card_data = {
    'name' : cardName + ' (@' + user_name + ')',
    'idMembers' : idMembers,
    'idLabels' : idLabelColor,
    'desc' : cardDescription,
    'due' : null,
    'idList' : listId,
    'urlSource' : null
  };

  //trello.post('/1/lists/' + listId + '/cards', card_data, cb);
  trello.post('/1/cards', card_data, cb);
}

app.post('/*', function(req, res, next) {
  var listId = req.params[0];
  var command = req.body.command,
  text = req.body.text,
  user_name = req.body.user_name;

  postToTrello(listId, command, text, user_name, function(err, data) {
    if (err) throw err;
    console.log(data);

    var name = data.name;
    var url = data.shortUrl;

    res.status(200).send('Card "' + name + '" created here: <' + url + '>');
  });
});

// test route
app.get('/', function (req, res) { res.status(200).send('Slack and Trello!') });

// error handler
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(400).send('Error: ' + err.message);
});

app.listen(port, function () {
  console.log('Started Slack-To-Trello ' + port);
});
