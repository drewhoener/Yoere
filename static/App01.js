"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//TODO remove debug
var BREADCRUMB_MAX = 12;

// This grabs the DOM element to be used to mount React components.
var contentNode = document.getElementById("contents");

var LANG = {
    prep: {
        lang: ["at", "to", "from", "towards", "under", "over", "on top", "top", "", "off", "open"],
        sub_lang: ["the", "a", "an", "of", "in", "on"],
        all: function all() {
            return LANG.prep.lang.concat(LANG.prep.sub_lang);
        }
    },
    verb: {
        examine: {
            lang: ["see", "look", "examine", "observe", "glance"]
        },
        touch: {
            lang: ["touch", "feel", "examine", "pick up", "wipe", "open", "smash"]
        },
        listen: {
            lang: ["listen", "hear"]
        },
        move: {
            lang: ["move", "jump", "walk"]
        }
    }
};

var strip_input = function strip_input(str) {
    //Pesky characters
    var stripped = str.replace(/[.,\/#!$%&\*;:{}=\-_`~()]/g, "");
    //Remove extra space
    stripped = stripped.replace(/\s{2,}/g, " ");
    //https://stackoverflow.com/questions/20856197/remove-non-ascii-character-in-string for character ranges
    stripped = stripped.replace(/[^\x00-\x7F]/g, "");
    return stripped.trim();
};

var generate_pairs = function generate_pairs(input) {
    input = strip_input(input.toLowerCase());
    var split = input.split(" ");
    console.log(split);
    var curSet = {
        verb: null,
        prep: [],
        noun: null
    };

    restart: for (var splitKey in split) {
        var word = split[splitKey];
        console.log("Word is " + word);
        if (!curSet.verb) {
            console.log("Verb is null");
            for (var verbKey in LANG.verb) {
                console.log("Verbkey is " + verbKey);
                console.log("Comparing " + word + " to elements of " + LANG.verb[verbKey].lang);
                if (LANG.verb[verbKey].lang.includes(word)) {
                    curSet.verb = verbKey;
                    continue restart;
                }
            }
        }
        //console.log(LANG.prep.all());
        if (LANG.prep.all().includes(word)) {
            curSet.prep.push(word);
            continue;
        }

        if (!curSet.noun) {
            curSet.noun = word;
        }
        if (curSet.noun && curSet.verb) {
            console.log("Found both");
            break;
        }
    }
    return curSet;
};

var EscapeView = function (_React$Component) {
    _inherits(EscapeView, _React$Component);

    function EscapeView(props) {
        _classCallCheck(this, EscapeView);

        var _this = _possibleConstructorReturn(this, (EscapeView.__proto__ || Object.getPrototypeOf(EscapeView)).call(this, props));

        _this.state = {
            curImage: 0
        };
        return _this;
    }

    _createClass(EscapeView, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { className: "container" },
                React.createElement(
                    "div",
                    { className: "row" },
                    React.createElement(
                        "div",
                        { className: "col-md-4 offset-md-4 text-center" },
                        React.createElement(
                            "h1",
                            null,
                            "Yoere!"
                        ),
                        React.createElement(
                            "h3",
                            null,
                            " Escape the Room "
                        )
                    ),
                    React.createElement("div", {className: "row"})
                ),
                React.createElement(InputView, null)
            );
        }
    }]);

    return EscapeView;
}(React.Component);

var TextForm = function (_React$Component2) {
    _inherits(TextForm, _React$Component2);

    function TextForm(props) {
        _classCallCheck(this, TextForm);

        return _possibleConstructorReturn(this, (TextForm.__proto__ || Object.getPrototypeOf(TextForm)).call(this, props));
    }

    _createClass(TextForm, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                null,
                React.createElement(
                    "form",
                    { name: "commandForm", onSubmit: this.props.submitHandler },
                    React.createElement(
                        "div",
                        { className: "form-group" },
                        React.createElement("input", { type: "text", name: "command", className: "form-control", id: "commandInput",
                            "aria-describedby": "commandhelp",
                            placeholder: "Enter a command...", autoComplete: "off" })
                    )
                )
            );
        }
    }]);

    return TextForm;
}(React.Component);

var InputView = function (_React$Component3) {
    _inherits(InputView, _React$Component3);

    function InputView(props) {
        _classCallCheck(this, InputView);

        var _this3 = _possibleConstructorReturn(this, (InputView.__proto__ || Object.getPrototypeOf(InputView)).call(this, props));

        _this3.state = {
            previous: [],
            breadcrumb_id: 0
        };
        _this3.add_command = _this3.add_command.bind(_this3);
        _this3.formSubmit = _this3.formSubmit.bind(_this3);
        _this3.scrollRef = null;
        return _this3;
    }

    _createClass(InputView, [{
        key: "componentDidUpdate",
        value: function componentDidUpdate() {
            if (this.scrollRef) this.scrollRef.scrollIntoView({ behavior: 'smooth' });
        }
    }, {
        key: "add_command",
        value: function add_command(command, isResponse) {
            this.setState(function (state) {
                var breadcrumb_id = state.breadcrumb_id;
                var newList = state.previous.concat(React.createElement(
                    "span",
                    { key: state.breadcrumb_id, className: isResponse ? "command-response" : "command" },
                    command,
                    React.createElement("br", null)
                )).filter(function (val, index, arr) {
                    if (arr.length > BREADCRUMB_MAX) return index >= arr.length - BREADCRUMB_MAX;
                    return true;
                });
                return {
                    previous: newList,
                    breadcrumb_id: breadcrumb_id + 1
                };
            });
        }
    }, {
        key: "formSubmit",
        value: function formSubmit(e) {
            e.preventDefault();
            var input = document.forms.commandForm;
            var str = strip_input(input.command.value);
            //alert(str);
            this.add_command(str);
            input.command.value = '';
            console.log(generate_pairs(str));
            this.add_command("Test response " + this.state.breadcrumb_id, true);
        }
    }, {
        key: "render",
        value: function render() {
            var _this4 = this;

            //console.log(this.state.previous);
            return React.createElement(
                "div",
                { className: "fixed-bottom" },
                React.createElement(
                    "div",
                    { className: "gradient-background" },
                    this.state.previous,
                    React.createElement("div", { ref: function ref(_ref) {
                            return _this4.scrollRef = _ref;
                        } })
                ),
                React.createElement(TextForm, { submitHandler: this.formSubmit })
            );
        }
    }]);

    return InputView;
}(React.Component);

// This renders the JSX component inside the content node:


ReactDOM.render(React.createElement(EscapeView, null), contentNode);