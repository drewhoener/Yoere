const LANG = {
    prep: {
        lang: ["at", "to", "from", "towards", "under", "over", "on top", "top", "", "off", "open"],
        sub_lang: ["the", "a", "an", "of", "in", "on"],
        all: () => {
            return LANG.prep.lang.concat(LANG.prep.sub_lang);
        }
    },
    verb: {
        examine: {
            lang: ["see", "look", "examine", "observe", "glance"]
        },
        touch: {
            lang: ["touch", "feel", "examine", "pick up", "wipe", "open", "smash"]
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

export const generate_pairs = (input) => {
    input = strip_input(input.toLowerCase());
    let split = input.split(" ");
    console.log(split);
    const curSet = {
        verb: null,
        originalVerb: null,
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
                        curSet.originalVerb = word;
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