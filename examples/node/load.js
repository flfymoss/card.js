import fs from 'fs';
import readline from 'readline/promises';
import { load } from '../../libs/loader.js';
import { createInterpreter } from '../../libs/interpreter.js';

const cardPath = process.argv[2];

const cBuffer = fs.readFileSync(cardPath);
const sBuffer = load(cBuffer);
const code = (new TextDecoder()).decode(sBuffer);

const logger = (text, props) => {
  console.log(`[LOG] ${text}`);
  if (props) {
    console.log(`  [PROPS] ${JSON.stringify(props)}`);
  }
};
const interpreter = createInterpreter(code, logger, 10);
interpreter.hook('status', async (status) => {
  if (status === interpreter.StatusValue.WAITING_INPUT) {
    const prompt = readline.createInterface({ input: process.stdin, output: process.stdout });
    const input = await prompt.question('input: ');
    interpreter.setInput(input);
    prompt.close();
  }
});
interpreter.run();
