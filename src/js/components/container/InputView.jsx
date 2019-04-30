import React, {Component} from 'react';
import {generate_pairs} from "./../../scripts/action_lang";
import {isEqual} from "lodash/lang";

//Max number of items we'll display in the scroll view for commands
const BREADCRUMB_MAX = 12;

//Little tiny react module instead of an entire class
//Renders a form with a callback onSubmit to the InputView for parsing, formatting and displaying
function TextForm(props) {
    return (
        <div>
            <form name="commandForm" onSubmit={props.submitHandler}>
                <div className="form-group">
                    <input type="text" name="command" className="form-control command-input" id="commandInput"
                           aria-describedby="commandhelp"
                           placeholder="Enter a command..." autoComplete="off"/>
                </div>
            </form>
        </div>
    );
}

/**
 * @author Drew Hoener
 * */
class InputView extends Component {

    constructor(props) {
        super(props);

        this.state = {
            previous: [],
            breadcrumb_id: 0
        };
        //Bind form commands so when they execute they know what 'this' is
        this.add_command = this.add_command.bind(this);
        this.formSubmit = this.formSubmit.bind(this);
        //Reference point so when we add things to our breadcrumb scroll view it'll scroll nicely
        this.scrollRef = null;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        //When we add a thing, scroll to the bottom so you can actually see it
        if (this.scrollRef)
            this.scrollRef.scrollIntoView({behavior: 'smooth'});
        //Using Lodash for isEqual because javascript doesn't have a fantastic way to compare objects of different types
        //The value for inputResponse can be an array or a single string depending.
        //An array will render multiple lines out, a single string only one (duh)
        if (!isEqual(prevProps.inputResponse, this.props.inputResponse)) {
            if (Array.isArray(this.props.inputResponse)) {
                this.props.inputResponse.forEach(item => this.add_command(item, true));
            } else {
                this.add_command(this.props.inputResponse, true);
            }
        }
    }

    //Adds a command to breadcrumb, formats differently if it's a response to a command vs a command from the player
    add_command(command, isResponse) {
        this.setState((state) => {
            //Get the old breadcrumb id
            const breadcrumb_id = state.breadcrumb_id;
            //Clone the list and add our new value because it has to be immutable
            const newList = state.previous.concat(
                <span key={state.breadcrumb_id} className={(isResponse ? "command-response" : "command")}>{command}<br/></span>
            ).filter((val, index, arr) => {
                //Run a filter check, we only want a certain number of items to appear in our breadcrumb view
                if (arr.length > BREADCRUMB_MAX)
                    return index >= arr.length - BREADCRUMB_MAX;
                return true;
            });
            //Return the updated state
            return {
                previous: newList,
                breadcrumb_id: breadcrumb_id + 1
            };
        });
    };

    //Form submit callback as referenced above
    formSubmit(e) {
        e.preventDefault();
        let input = document.forms.commandForm;
        let str = input.command.value;
        //alert(str);
        //Use our language parser to generate our language object from the input string
        let pairs = generate_pairs(str);
        //Since player progress is tied to their name, they need to identify themselves before playing.
        //Otherwise we can't track their
        if (pairs && pairs.verb && !this.props.player) {
            this.add_command(`I can't parse commands without knowing who you are! Please enter your first name.`, true);
            input.command.value = '';
            return;
        }
        let split = str.split(' ');
        //Set the player's name if they haven't already identified themselves
        //There's absolutely no checking here, they can enter whatever they want as their name
        if (split.length === 1 && !this.props.player) {
            this.props.setName(split[0]);
            input.command.value = '';
            return;
        }
        //Add their input to breadcrumb
        this.add_command(str);
        input.command.value = '';
        console.log(pairs);
        //If it's an actual command, then we'll generate a response
        this.validateLang(pairs);
    };

    validateLang(pairs) {
        //If the lang object is incomplete, fail
        if (!pairs || !pairs.verb) {
            this.add_command(`Invalid input command`, true);
            return;
        }
        //Pass the lang back to RoomView for further parsing. That's where all the locations and fun stuff is
        this.props.onLang(pairs);
    }

    //Render, kinda small but it has alll the stuff
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

export default InputView;