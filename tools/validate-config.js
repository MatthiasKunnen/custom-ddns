import fs from 'fs';
import path from 'path';

import * as yaml from 'js-yaml';
import {DdnsConfig} from '../config.schema.validate.js';

/*
Usage: yarn run validate-config [file]
The file will default to config.yaml.
 */

const fileToCheck = process.argv[2] ?? 'config.yaml';
const configString = fs.readFileSync(path.resolve(fileToCheck), {encoding: 'utf-8'});
const config = yaml.load(configString);

const validate = DdnsConfig;
const valid = validate(config);

if (!valid) {
    console.error(JSON.stringify(validate.errors, undefined, 4));
    process.exit(1);
} else {
    console.log(`${fileToCheck} is valid`);
}
