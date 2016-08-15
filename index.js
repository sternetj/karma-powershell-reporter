var mochaReporter = require('karma-mocha-reporter');
var shell = require('node-powershell');

var ps = new shell({executionPolicy: 'Bypass', debugMsg: false});

//$OrigFgColor = $a.ForegroundColor ; \

var baseScript = '\
$a = (Get-Host).UI.RawUI ;\
$OrigFgColor = "White" ; \
\
function reset {\
    $a.ForegroundColor = $OrigFgColor ;\
}\
\
function color ($fc) { \
  $a.ForegroundColor = $fc ;\
}\
\
';

// [0m reset; clears all colors and styles (to white on black)
// [1m bold on (see below)
// [3m italics on
// [4m underline on
// [7m inverse on; reverses foreground & background colors
// [9m strikethrough on
// [22m  bold off (see below)
// [23m  italics off
// [24m  underline off
// [27m  inverse off
// [29m  strikethrough off
// [30m  set foreground color to black
// [31m  set foreground color to red
// [32m  set foreground color to green
// [33m  set foreground color to yellow
// [34m  set foreground color to blue
// [35m  set foreground color to magenta (purple)
// [36m  set foreground color to cyan
// [37m  set foreground color to white
// [39m  set foreground color to default (white)
// [40m  set background color to black
// [41m  set background color to red
// [42m  set background color to green
// [43m  set background color to yellow
// [44m  set background color to blue
// [45m  set background color to magenta (purple)
// [46m  set background color to cyan
// [47m  set background color to white
// [49m  set background color to default (black)

var colorMap = {
  "[30m": "Black",//  set foreground color to black
  "[31m": "Red",//  set foreground color to red
  "[32m": "Green",//  set foreground color to green
  "[33m": "Yellow",//  set foreground color to yellow
  "[1m": "Yellow",//  set foreground color to yellow
  "[34m": "DarkBlue",//  set foreground color to blue
  "[35m": "DarkMagenta",//  set foreground color to magenta (purple)
  "[36m": "cyan",//  set foreground color to cyan
  "[37m": "white",//  set foreground color to white
  "[90m": "Gray",//  set foreground color to black
"[91m": "red",//  set foreground color to red
"[92m": "green",//  set foreground color to green
"[93m": "yellow",//  set foreground color to yellow
"[94m": "blue",//  set foreground color to blue
"[95m": "magenta",//  set foreground color to magenta (purple)
"[96m": "cyan",//  set foreground color to cyan
"[97m": "white",//  set foreground color to white
  "[39m": "$OrigFgColor"//  set foreground color to default (white)
};

var getColor = function(str){
  var escStr = JSON.stringify(str);
  var color = "$OrigFgColor";
  Object.keys(colorMap).some(function(key){
    if(escStr.includes(key)){
      color = '"' + colorMap[key] + '"';
      return true;
    }
  });

  return color;
};

var PowershellReporter = function(baseReporterDecorator, config, logger, helper, formatError) {
  config.mochaReporter = config.powershellReporter || {};

  config.mochaReporter.colors = true;

  baseReporterDecorator(this);

  var mr = new mochaReporter["reporter:mocha"][1](baseReporterDecorator, formatError, config);

  var pipe = ps.invoke();
  var self = this;
  mr.write = function(msg){
    var color = getColor(msg);
    //var ps = new shell({executionPolicy: 'Bypass', debugMsg: false});

  pipe = pipe.then(function(){
      ps.addCommand(baseScript + 'color ' + color );
      return ps.invoke();
    }).then(function(){
        self.write(msg.replace(/\\u001b\[\d{1,2}m/g, ""));
        return ps.invoke();
      });
  };

  mr.onExit = function(done){
    pipe.then(function(){
      ps.addCommand(baseScript + 'color $OrigFgColor' );
      return ps.invoke();
    })
    .then(function(){
      ps.dispose();
      done();
    }).catch(function(){
      ps.dispose();
      done();
    });
  };

  return mr;
};

// inject karma runner baseReporter and config
PowershellReporter.$inject = ['baseReporterDecorator', 'config', 'logger', 'helper', 'formatError'];

// PUBLISH DI MODULE
module.exports = {
  'reporter:powershell': ['type', PowershellReporter]
};
