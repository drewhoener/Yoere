import React, {Component} from 'react';
import {generate_pairs} from "./../../scripts/action_lang";
import {isEqual} from "lodash/lang";

const BREADCRUMB_MAX = 12;

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

class InputView extends Component {

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

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.scrollRef)
            this.scrollRef.scrollIntoView({behavior: 'smooth'});
        if (!isEqual(prevProps.inputResponse, this.props.inputResponse)) {
            if (Array.isArray(this.props.inputResponse)) {
                this.props.inputResponse.forEach(item => this.add_command(item, true));
            } else {
                this.add_command(this.props.inputResponse, true);
            }
        }
    }

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
        //alert(str);
        let pairs = generate_pairs(str);
        if (pairs && pairs.verb && !this.props.player) {
            this.add_command(`I can't parse commands without knowing who you are! Please enter your first name.`, true);
            input.command.value = '';
            return;
        }
        let split = str.split(' ');
        if (split.length === 1 && !this.props.player) {
            this.props.setName(split[0]);
            input.command.value = '';
            return;
        }
        this.add_command(str);
        input.command.value = '';
        console.log(pairs);
        //this.add_command(`You ${str.toLowerCase()}`, true);
        this.validateLang(pairs);
    };

    validateLang(pairs) {
        if (!pairs || !pairs.verb) {
            this.add_command(`Invalid input command`, true);
            return;
        }
        this.props.onLang(pairs);
    }

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