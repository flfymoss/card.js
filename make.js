import fs from 'fs';
import { make } from './libs/maker.js';

const graphicPath = process.argv[2];
const scriptPath = process.argv[3];
const outputPath = process.argv[4];

const gBuffer = fs.readFileSync(graphicPath);
const sBuffer = fs.readFileSync(scriptPath);
const cBuffer = make(gBuffer, sBuffer);

fs.writeFileSync(outputPath, Buffer.from(cBuffer));
