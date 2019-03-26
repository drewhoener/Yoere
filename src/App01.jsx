//TODO remove debug
const BREADCRUMB_MAX = 12;

// This grabs the DOM element to be used to mount React components.
const contentNode = document.getElementById("contents");

const LANG = {
    prep: {
        lang: ["at", "to", "from", "towards", "under", "over", "on top", "top", "", "off"],
        sub_lang: ["the", "a", "an", "of", "in"],
        all: () => {
            return LANG.prep.lang.concat(LANG.prep.sub_lang);
        }
    },
    verb: {
        examine: {
            lang: ["see", "look", "examine", "observe", "glance"]
        },
        touch: {
            lang: ["touch", "feel", "examine", "pick up", "wipe"]
        },
        listen: {
            lang: ["listen", "hear"]
        },
        move: {
            lang: ["move", "jump", "walk"]
        }
    }
};

const strip_input = (str) => {
    //Pesky characters
    let stripped = str.replace(/[.,\/#!$%&\*;:{}=\-_`~()]/g, "");
    //Remove extra space
    stripped = stripped.replace(/\s{2,}/g, " ");
    //https://stackoverflow.com/questions/20856197/remove-non-ascii-character-in-string for character ranges
    stripped = stripped.replace(/[^\x00-\x7F]/g, "");
    return stripped.trim();
};

const generate_pairs = (input) => {
    input = strip_input(input.toLowerCase());
    let split = input.split(" ");
    console.log(split);
    const curSet = {
        verb: null,
        prep: [],
        noun: null
    };

    restart:
        for (let splitKey in split) {
            let word = split[splitKey];
            console.log("Word is " + word);
            if (!curSet.verb) {
                console.log("Verb is null");
                for (let verbKey in LANG.verb) {
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

class EscapeView extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-4 offset-md-4 text-center">
                        <h1>Yoere!</h1>
                        <h3> Escape the Room </h3>
                    </div>
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
        let str = strip_input(input.command.value);
        //alert(str);
        this.add_command(str);
        input.command.value = '';
        console.log(generate_pairs(str));
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