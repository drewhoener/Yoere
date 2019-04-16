const LANG = {
    prep: {
        lang: ["at", "to", "from", "towards", "under", "over", "on top", "top", "", "off", "open"],
        sub_lang: ["the", "a", "an", "of", "in", "on", "with"],
        all: () => {
            return LANG.prep.lang.concat(LANG.prep.sub_lang);
        }
    },
    verb: {
        examine: {
            lang: ["see", "look", "examine", "observe", "glance"]
        },
        touch: {
            lang: ["touch", "feel", "examine", "wipe", "open"]
        },
        attack: {
            lang: ["attack", "smash", "break", "hit"]
        },
        listen: {
            lang: ["listen", "hear"]
        },
        move: {
            lang: ["move", "jump", "walk", "go"]
        },
        take: {
            lang: ["take", "pick up", "swipe"]
        },
        solve: {
            lang: ["solve", "finish"]
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
            if (curSet.verb && !curSet.noun && LANG.prep.all().includes(word)) {
                curSet.prep.push(word);
                continue;
            }

            if (!curSet.noun) {
                curSet.noun = word;
                continue;
            }

            if (use_obj && !LANG.prep.all().includes(word)) {
                curSet.obj = word;
                break;
            }

            if (curSet.noun && curSet.verb) {
                console.log(`Word is ${word}`);
                if (!LANG.prep.sub_lang.includes(word))
                    break;
                use_obj = true;
            }
        }
    return curSet;
};