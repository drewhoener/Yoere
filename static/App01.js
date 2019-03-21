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

    function MyComponent() {
        _classCallCheck(this, MyComponent);

        return _possibleConstructorReturn(this, (MyComponent.__proto__ || Object.getPrototypeOf(MyComponent)).call(this));
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

    function TextForm() {
        _classCallCheck(this, TextForm);

        return _possibleConstructorReturn(this, (TextForm.__proto__ || Object.getPrototypeOf(TextForm)).call(this));
    }

    _createClass(TextForm, [{
        key: "handleSubmit",
        value: function handleSubmit(e) {}
    }, {
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                null,
                React.createElement(
                    "form",
                    { name: "commandInput", onSubmit: this.handleSubmit },
                    React.createElement(
                        "div",
                        { className: "form-group" },
                        React.createElement("input", { type: "command", className: "form-control", id: "commandInput", "aria-describedby": "commandhelp",
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

    return BreadCrumb;
}(React.Component);

var InputView = function (_React$Component4) {
    _inherits(InputView, _React$Component4);

    function InputView() {
        _classCallCheck(this, InputView);

        return _possibleConstructorReturn(this, (InputView.__proto__ || Object.getPrototypeOf(InputView)).call(this));
    }

    _createClass(InputView, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { className: "fixed-bottom" },
                React.createElement(BreadCrumb, null),
                React.createElement(TextForm, null)
            );
        }
    }]);

    return InputView;
}(React.Component);

// This renders the JSX component inside the content node:


ReactDOM.render(React.createElement(MyComponent, null), contentNode);
ReactDOM.render(React.createElement(InputView, null), inputNode);