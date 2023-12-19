import fs from 'fs';
import readline from 'readline/promises';
import { load } from '../../libs/loader.js';
import { createInterpreter } from '../../libs/interpreter.js';

const cardPath = process.argv[2];

const cBuffer = fs.readFileSync(cardPath);
const sBuffer = load(cBuffer);
const code = (new TextDecoder()).decode(sBuffer);

const logger = (text, props) => {
  const print = props?.kl ? process.stdout.write.bind(process.stdout) : console.log;
  print(text);
};
const interpreter = createInterpreter(code, logger, 10);
interpreter.hook('status', async (status) => {
  if (status === interpreter.StatusValue.WAITING_INPUT) {
    const prompt = readline.createInterface({ input: process.stdin, output: process.stdout });
    const input = await prompt.question('INPUT > ');
    interpreter.setInput(input);
    prompt.close();
  }
  if (status === interpreter.StatusValue.DONE) {
    console.log('\n（再現終了）');
  }
});
console.log('（再現開始）\n');
interpreter.run();
