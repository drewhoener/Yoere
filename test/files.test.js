import {describe} from 'mocha';

const fs = require('fs');

//We have an image for every permutation of the chalkboard because we're not using something like cairo
//and I didn't plan enough ahead to use a library to dynamically insert the text into a base image
//This is a unit test to help me figure out which ones we missed. Don't judge me.
describe('files', () => {
    it('detects all files', () => {
        for (let i = 0; i < 32; i++) {
            let string = `./src/img/chalkboard/${(i >>> 0).toString(2).padStart(5, '0')}.png`;
            try {
                if (!fs.existsSync(string))
                    console.log(`Missing file ${string}`);
                else
                    console.log(`Found file ${string}`);
            } catch (err) {
                console.error(err);
            }
        }
    });
});