// This is a place holder for the initial application state.
const state = [

];

// This grabs the DOM element to be used to mount React components.
var contentNode = document.getElementById("contents");

class MyComponent extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div>
        <View/>
      </div>
    );
  }
}

class View extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      shown: false
    };
    this.onClick = this.onClick.bind(this);
  }

  onClick(e) {
    e.preventDefault();
    this.setState((state) => {
      const newShown = !state.shown;
      return {
        shown: newShown
      }
    })
  }

  render() {
    return (
        <div>
          <button onClick={this.onClick}>Click Me!</button>
          <StatsWindow shown={this.state.shown}/>
        </div>
    );
  }

}

class StatsWindow extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
        <div>
          {
            this.props.shown && <span>Hello</span>
          }
        </div>
    );
  }
}

// This renders the JSX component inside the content node:
ReactDOM.render(<MyComponent />, contentNode);
