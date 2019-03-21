// This is a place holder for the initial application state.

const state = [

];

// This grabs the DOM element to be used to mount React components.
var contentNode = document.getElementById("contents");
var inputNode = document.getElementById("input");

class MyComponent extends React.Component {
  constructor() {
    super();
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

    constructor() {
        super();
    }

    handleSubmit(e) {

    }

    render() {
        return (
            <div>
                <form name="commandInput" onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <input type="command" className="form-control" id="commandInput" aria-describedby="commandhelp"
                               placeholder="Enter a command..."/>
                    </div>
                </form>
            </div>
        );
    }
}

class BreadCrumb extends React.Component {

}

class InputView extends React.Component {

    constructor() {
        super();
    }

    render() {
        return (
            <div className="fixed-bottom">
                <BreadCrumb/>
                <TextForm/>
            </div>
        );
    }

}



// This renders the JSX component inside the content node:
ReactDOM.render(<MyComponent />, contentNode);
ReactDOM.render(<InputView/>, inputNode);
