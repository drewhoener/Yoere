//Provides language support for the player's input
//It's by no means perfect but it does what I want it to do

const LANG = {
    prep: {                 //Words to skip over (not main words)
        lang: ["at", "to", "from", "towards", "under", "over", "on top", "top", "", "off", "up"],
        sub_lang: ["the", "a", "an", "of", "in", "on", "with"],
        all: () => {
            return LANG.prep.lang.concat(LANG.prep.sub_lang);
        }
    },
    verb: {                 //Verb keys, words that are alike get reduced to a key for easier parsing and allow the player to use their own language.
        examine: {
            lang: ["see", "look", "examine", "observe", "glance", "inspect"]    //Words that flatten to examine
        },
        touch: {
            lang: ["touch", "feel", "wipe", "open", "use", "unlock"]
        },
        attack: {
            lang: ["attack", "smash", "break", "hit", "slap", "hit", "punch"],
            handle_incorrect: true                                              //Automatically tell you when you can't use these words
        },
        listen: {
            lang: ["listen", "hear"]
        },
        move: {
            lang: ["move", "jump", "walk", "go"],
            handle_incorrect: true
        },
        take: {
            lang: ["take", "pick", "swipe", "grab", "get"]
        },
        solve: {
            lang: ["solve", "finish", "answer", "write"]
        }
    }
};

/**
 * @author Drew Hoener
 * */
const strip_input = (str) => {      //Remove unneeded characters from the string, like non ASCII and punctuation
    //Pesky characters
    let stripped = str.replace(/[.,\/#!$%&\*;:{}=\-_`~()]/g, "");
    //Remove extra space
    stripped = stripped.replace(/\s{2,}/g, " ");
    //https://stackoverflow.com/questions/20856197/remove-non-ascii-character-in-string for character ranges
    stripped = stripped.replace(/[^\x00-\x7F]/g, "");
    return stripped.trim();
};

/**
 * @author Drew Hoener
 * */
export const generate_pairs = (input) => {      //Split the input into an object we can actually use in our parser
    input = strip_input(input.toLowerCase());
    let split = input.split(" ");
    console.log(split);
    const curSet = {                            //Our output
        verb: null,
        originalVerb: null,
        prep: [],
        noun: null,
        obj: null
    };

    let use_obj = false;
    restart:
        for (let splitKey in split) {
            let word = split[splitKey];
            console.log("Split word is " + word);
            if (!curSet.verb) {
                console.log("Verb is null");
                for (let verbKey in LANG.verb) {
                    console.log("Verbkey is " + verbKey);
                    console.log("Comparing " + word + " to elements of " + LANG.verb[verbKey].lang);
                    if (LANG.verb[verbKey].lang.includes(word)) {
                        curSet.verb = verbKey;
                        curSet.originalVerb = word;
                        continue restart;
                    }
                }
            }
            //console.log(LANG.prep.all());
            if (curSet.verb && !curSet.noun && LANG.prep.all().includes(word)) {        //Set the verb first
                curSet.prep.push(word);
                continue;
            }

            if (!curSet.noun) {                                                         //Then the noun
                curSet.noun = word;
                if (LANG.verb.take.lang.includes(curSet.verb))                          //Bit of a hack but the onLang method in RoomView looks in the location
                    curSet.obj = word;                                                  //object for the [obj] key and that's not set with something like 'take hammer'
                continue;
            }

            if (use_obj && !LANG.prep.all().includes(word)) {
                curSet.obj = word;
                if (curSet.verb === 'touch' && curSet.prep[curSet.prep.length - 1] === 'on') {
                    //this isn't how languages work but to make it fit with how the parser works we're gonna go with it
                    //Makes 'hit desk with hammer' and 'use paper on chalkboard' both return object sets where it can parse the data correctly
                    curSet.obj = curSet.noun;
                    curSet.noun = word;
                }
                break;
            }

            if (curSet.noun && curSet.verb) {
                console.log(`Word is ${word}`);
                if (!LANG.prep.sub_lang.includes(word))
                    break;
                curSet.prep.push(word);
                use_obj = true;
            }
        }
    if (curSet.noun && !curSet.obj)
        curSet.obj = curSet.noun;
    return curSet;
};