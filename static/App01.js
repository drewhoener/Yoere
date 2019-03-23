"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// This is a place holder for the initial application state.

var state = [];

// This grabs the DOM element to be used to mount React components.
var contentNode = document.getElementById("contents");
var inputNode = document.getElementById("input");

var MyComponent = function (_React$Component) {
    _inherits(MyComponent, _React$Component);

    function MyComponent(props) {
        _classCallCheck(this, MyComponent);

        return _possibleConstructorReturn(this, (MyComponent.__proto__ || Object.getPrototypeOf(MyComponent)).call(this, props));
    }

    _createClass(MyComponent, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                null,
                React.createElement(
                    "h1",
                    null,
                    "My View 01"
                ),
                React.createElement(
                    "h3",
                    null,
                    " Build On Pull Test "
                )
            );
        }
    }]);

    return MyComponent;
}(React.Component);

var TextForm = function (_React$Component2) {
    _inherits(TextForm, _React$Component2);

    function TextForm(props) {
        _classCallCheck(this, TextForm);

        var _this2 = _possibleConstructorReturn(this, (TextForm.__proto__ || Object.getPrototypeOf(TextForm)).call(this, props));

        console.log(props);
        console.log(_this2.props);
        console.log(_this2.state);
        return _this2;
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
                            placeholder: "Enter a command..." })
                    )
                )
            );
        }
    }]);

    return TextForm;
}(React.Component);

var BreadCrumb = function (_React$Component3) {
    _inherits(BreadCrumb, _React$Component3);

    function BreadCrumb() {
        _classCallCheck(this, BreadCrumb);

        return _possibleConstructorReturn(this, (BreadCrumb.__proto__ || Object.getPrototypeOf(BreadCrumb)).apply(this, arguments));
    }

    _createClass(BreadCrumb, [{
        key: "render",
        value: function render() {
            var list = this.props.elements.map(function (command, index) {
                return React.createElement(
                    "span",
                    { key: index },
                    command,
                    React.createElement("br", null)
                );
            });
            return React.createElement(
                "p",
                null,
                list
            );
        }
    }]);

    return BreadCrumb;
}(React.Component);

var InputView = function (_React$Component4) {
    _inherits(InputView, _React$Component4);

    function InputView(props) {
        _classCallCheck(this, InputView);

        var _this4 = _possibleConstructorReturn(this, (InputView.__proto__ || Object.getPrototypeOf(InputView)).call(this, props));

        _this4.state = {
            previous: []
        };
        _this4.add_command = _this4.add_command.bind(_this4);
        _this4.formSubmit = _this4.formSubmit.bind(_this4);
        _this4.textform = React.createElement(TextForm, { submitHandler: _this4.formSubmit });
        return _this4;
    }

    _createClass(InputView, [{
        key: "add_command",
        value: function add_command(command) {
            this.setState(function (state) {
                var newList = state.previous.concat(command).filter(function (val, index, arr) {
                    if (arr.length > 4) return index >= arr.length - 4;
                    return true;
                });
                return {
                    previous: newList
                };
            });
        }
    }, {
        key: "formSubmit",
        value: function formSubmit(e) {
            e.preventDefault();
            var input = document.forms.commandForm;
            this.add_command(input.command.value);
            input.command.value = '';
        }
    }, {
        key: "render",
        value: function render() {
            console.log(this.state.previous);
            return React.createElement(
                "div",
                { className: "fixed-bottom" },
                React.createElement(
                    "div",
                    { className: "gradient-background" },
                    React.createElement(BreadCrumb, { elements: this.state.previous })
                ),
                this.textform
            );
        }
    }]);

    return InputView;
}(React.Component);

// This renders the JSX component inside the content node:


ReactDOM.render(React.createElement(MyComponent, null), contentNode);
ReactDOM.render(React.createElement(InputView, null), inputNode);