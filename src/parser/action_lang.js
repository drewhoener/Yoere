//Lang Object, holds generic types
const LANG = {
    examine: ["see", "look", "examine", "observe", "glance"],
    touch: ["touch", "feel", "examine", "pick up", "wipe"],
    listen: ["listen", "hear",],
};

export const strip_input = (str) => {
    //Pesky characters
    let stripped = str.replace(/[.,\/#!$%&\*;:{}=\-_`~()]/g, "");
    //Remove extra space
    stripped = stripped.replace(/\s{2,}/g, " ");
    //https://stackoverflow.com/questions/20856197/remove-non-ascii-character-in-string for character ranges
    stripped = stripped.replace(/[^\x00-\x7F]/g, "");
    return stripped;
};

export const generate_pairs = (str) => {
    str = strip_input(str);
    let split = str.split(" ");

};

