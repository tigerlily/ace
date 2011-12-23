define('ace/mode/liquid', function(require, exports, module) {

var oop = require("../lib/oop");
var TextMode = require("ace/mode/text").Mode;
var Tokenizer = require("ace/tokenizer").Tokenizer;
var LiquidHighlightRules = require("ace/mode/liquid_highlight_rules").LiquidHighlightRules;

var Mode = function() {
    this.$tokenizer = new Tokenizer(new LiquidHighlightRules().getRules());
};
oop.inherits(Mode, TextMode);

exports.Mode = Mode;

});
