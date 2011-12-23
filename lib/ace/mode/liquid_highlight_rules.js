define('ace/mode/liquid_highlight_rules', function(require, exports, module) {

var oop = require("../lib/oop");
var lang = require("../lib/lang");

var HtmlHighlightRules = require("ace/mode/html_highlight_rules").HtmlHighlightRules;
var TextHighlightRules = require("ace/mode/text_highlight_rules").TextHighlightRules;

var LiquidVariableHighlightRules = function() {
    this.$rules = {
      "start" : [
          {
             token : "variable.context",
             regex : "[a-z_][a-zA-Z0-9_$]*\\b",
             next  : 'filter',
          }, {
             token : "constant.language",
             regex : "[a-zA-Z][a-zA-Z0-9_$]*\\b",
             next  : 'filter',
          }, {
             token : "string", // single line
             regex : '["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'
          }, {
             token : "string", // single line
             regex : "['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']"
         }, {
             token : "string", // backtick string
             regex : "[`](?:(?:\\\\.)|(?:[^'\\\\]))*?[`]"
         }
      ],
      'filter' : [
          {
            token : "keyword.operator",
            regex : "\\|",
            next  : 'filter'
          }, {
              token : "keyword.operator",
              regex : "\:"
          }, {
            token : "support.function",
            regex : "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
          }, {
            token : "string", // single line
            regex : '["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'
          }, {
            token : "string", // single line
            regex : "['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']"
          }, {
            token : "string", // backtick string
            regex : "[`](?:(?:\\\\.)|(?:[^'\\\\]))*?[`]"
          } 
      ]
    };
};

oop.inherits(LiquidVariableHighlightRules, TextHighlightRules);
exports.LiquidVariableHighlightRules = LiquidVariableHighlightRules;


var LiquidTagHighlightRules = function() {

    var builtinConstants = lang.arrayToMap(
        ("true|false|nil|in").split("|")
    );
    this.$rules = {
        "start" : [
            {
               token : "support.function",
               regex : "[a-zA-Z_$][a-zA-Z0-9_$]*\\b",
               next  : "literals"
            }
        ],
        "literals" : [
            {
                token : "string", // single line
                regex : '["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'
            }, {
                token : "string", // single line
                regex : "['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']"
            }, {
                token : "string", // backtick string
                regex : "[`](?:(?:\\\\.)|(?:[^'\\\\]))*?[`]"
            }, {
                token : "text", // namespaces aren't symbols
                regex : "::"
            }, {
                token : "constant.class", // class name
                regex : "[A-Z](?:[a-zA-Z_]|\d)+"
            }, {
                token : "constant.numeric", // hex
                regex : "0[xX][0-9a-fA-F](?:[0-9a-fA-F]|_(?=[0-9a-fA-F]))*\\b"
           },{
                token : "constant.numeric", // float
                regex : "[+-]?\\d(?:\\d|_(?=\\d))*(?:(?:\\.\\d(?:\\d|_(?=\\d))*)?(?:[eE][+-]?\\d+)?)?\\b"
           },
           {
                token : function(value) {
                    if (builtinConstants.hasOwnProperty(value))
                        return "constant.language";
                    else
                        return "variable.context";
                },
                regex : "[a-z_$][a-zA-Z0-9_$]*\\b"
           }, {
                token : "text",
                regex : "\\s+"
           }
        ]
    };
};
oop.inherits(LiquidTagHighlightRules, TextHighlightRules);
exports.LiquidTagHighlightRules = LiquidTagHighlightRules;

var LiquidHighlightRules = function() {
  // TODO: make it work for scriptembed and cssembed
  this.$rules = new HtmlHighlightRules().getRules();
  this.$rules.start.unshift({
    token: "keyword.operator",
    regex: '{%',
    next: 'liquid-tag-start'
  });

  this.embedRules(LiquidTagHighlightRules, "liquid-tag-", [
    {
      token: ["keyword.operator", "string"],
      regex: '(%})(")',
      next: "tagembed-attribute-list"
    }, {
      token: "keyword.operator",
      regex: '%}',
      next: "start"
    }
  ]);

  this.embedRules(LiquidVariableHighlightRules, "liquid-variable-", [
    {
       token: ["keyword.operator", "string"],
       regex: '(}})(")',
       next: "tagembed-attribute-list"
    }, {
       token: "keyword.operator",
       regex: '}}',
       next: "start"
    }
  ]);

  this.$rules.start.unshift({
    token: "keyword.operator",
    regex: '{{',
    next: 'liquid-variable-start'
  });

  this.$rules['tagembed-attribute-list'].unshift({
    token: ["string", "keyword.operator"],
    regex: '(")({%)',
    next: 'liquid-tag-start'
  });
  this.$rules['tagembed-attribute-list'].unshift({
    token: ["string", "keyword.operator"],
    regex: '(")({{)',
    next: 'liquid-variable-start'
  });

}

oop.inherits(LiquidHighlightRules, HtmlHighlightRules);
exports.LiquidHighlightRules = LiquidHighlightRules;

});
