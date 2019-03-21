//Lang Object, holds generic types
const LANG = {
    see: ["see", "look", "examine", "observe", "glance"],
    touch: ["touch", "feel", "examine", "pick up", "wipe"],
    hear: ["listen", "hear",],
};

let generate_pairs = (str) => {
    str = str.replace(/,|, |\.|\. |/g, "");
    let split = str.split(" ");

};

