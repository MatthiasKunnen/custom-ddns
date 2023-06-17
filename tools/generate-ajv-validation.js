import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

import Ajv from 'ajv';
import standaloneCode from 'ajv/dist/standalone/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Generate the validation file. Can be replaced with
// `ajv compile --code-esm -s config.schema.json -o config.schema.validate.js` when
// <https://github.com/ajv-validator/ajv-cli/pull/200> is merged.
// Taken and modified from https://ajv.js.org/standalone.html#generating-using-the-js-library.

const schema = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'config.schema.json'), {encoding: 'utf-8'}));

const ajv = new Ajv({
    code: {
        source: true,
        esm: true,
    },
    schemas: [schema],
});

let moduleCode = standaloneCode(ajv);

fs.writeFileSync(path.join(__dirname, '..', 'config.schema.validate.js'), moduleCode);
