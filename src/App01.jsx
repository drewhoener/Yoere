// This is a place holder for the initial application state.
//TODO remove debug

const BREADCRUMB_MAX = 12;

// This grabs the DOM element to be used to mount React components.
const contentNode = document.getElementById("contents");

class EscapeView extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="container">
                <div>
                    <h1>My View 01</h1>
                    <h3> Build On Pull Test </h3>
                </div>
                <InputView/>
            </div>
        );
    }
}

class TextForm extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <form name="commandForm" onSubmit={this.props.submitHandler}>
                    <div className="form-group">
                        <input type="text" name="command" className="form-control" id="commandInput"
                               aria-describedby="commandhelp"
                               placeholder="Enter a command..." autoComplete="off"/>
                    </div>
                </form>
            </div>
        );
    }
}

class InputView extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            previous: [],
            breadcrumb_id: 0
        };
        this.add_command = this.add_command.bind(this);
        this.formSubmit = this.formSubmit.bind(this);
        this.scrollRef = null;
    }

    componentDidUpdate() {
        if (this.scrollRef)
            this.scrollRef.scrollIntoView({behavior: 'smooth'});
    };

    add_command(command, isResponse) {
        this.setState((state) => {
            const breadcrumb_id = state.breadcrumb_id;
            const newList = state.previous.concat(
                <span key={state.breadcrumb_id} className={(isResponse ? "command-response" : "command")}>{command}<br/></span>
            ).filter((val, index, arr) => {
                if (arr.length > BREADCRUMB_MAX)
                    return index >= arr.length - BREADCRUMB_MAX;
                return true;
            });
            return {
                previous: newList,
                breadcrumb_id: breadcrumb_id + 1
            };
        });
    };

    formSubmit(e) {
        e.preventDefault();
        let input = document.forms.commandForm;
        let str = input.command.value;
        this.add_command(str);
        input.command.value = '';
        this.add_command("Test response " + this.state.breadcrumb_id, true);
    };

    render() {
        //console.log(this.state.previous);
        return (
            <div className="fixed-bottom">
                <div className="gradient-background">
                    {this.state.previous}
                    <div ref={(ref) => this.scrollRef = ref}/>
                </div>
                <TextForm submitHandler={this.formSubmit}/>
            </div>
        );
    }

}

// This renders the JSX component inside the content node:
ReactDOM.render(<EscapeView/>, contentNode);