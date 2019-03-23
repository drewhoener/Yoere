// This is a place holder for the initial application state.

const state = [];

// This grabs the DOM element to be used to mount React components.
var contentNode = document.getElementById("contents");
var inputNode = document.getElementById("input");

class MyComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <h1>My View 01</h1>
                <h3> Build On Pull Test </h3>
            </div>
        );
    }
}

class TextForm extends React.Component {

    constructor(props) {
        super(props);
        console.log(props);
        console.log(this.props);
        console.log(this.state);
    }

    render() {
        return (
            <div>
                <form name="commandForm" onSubmit={this.props.submitHandler}>
                    <div className="form-group">
                        <input type="text" name="command" className="form-control" id="commandInput"
                               aria-describedby="commandhelp"
                               placeholder="Enter a command..."/>
                    </div>
                </form>
            </div>
        );
    }
}

class BreadCrumb extends React.Component {
    render() {
        const list = this.props.elements.map((command, index) => {
            return (
                <span key={index}>{command}<br/></span>
            );
        });
        return (
            <p>
                {list}
            </p>
        )
    }
}

class InputView extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            previous: []
        };
        this.add_command = this.add_command.bind(this);
        this.formSubmit = this.formSubmit.bind(this);
        this.textform = <TextForm submitHandler={this.formSubmit}/>;
    }

    add_command(command) {
        this.setState(state => {
            const newList = state.previous.concat(command).filter((val, index, arr) => {
                if (arr.length > 4)
                    return index >= arr.length - 4;
                return true;
            });
            return {
                previous: newList
            };
        });
    };

    formSubmit(e) {
        e.preventDefault();
        let input = document.forms.commandForm;
        this.add_command(input.command.value);
        input.command.value = '';
    }

    render() {
        console.log(this.state.previous);
        return (
            <div className="fixed-bottom">
                <div className="gradient-background">
                    <BreadCrumb elements={this.state.previous}/>
                </div>
                {this.textform}
            </div>
        );
    }

}


// This renders the JSX component inside the content node:
ReactDOM.render(<MyComponent/>, contentNode);
ReactDOM.render(<InputView/>, inputNode);

