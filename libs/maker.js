import UPNG from 'upng-js';
import Constants from './constants.js';
import { transformSync } from '@babel/core';

const make = (gBuffer, sBuffer) => {
  const cardGraphic = UPNG.decode(gBuffer);
  const gPxBytes = cardGraphic.ctype < 4 ? Constants.BYTES_24BIT : Constants.BYTES_32BIT;
  const [gWidth, gHeight, gSize] = [cardGraphic.width, cardGraphic.height, cardGraphic.width * cardGraphic.height * Constants.BYTES_32BIT];

  // Transform source code to ES5-comliant code.
  const rawSource = (new TextDecoder()).decode(sBuffer);
  const newSource = transformSync(rawSource, {presets: ['@babel/preset-env', 'minify'], comments: false}).code;
  const sArray = (new TextEncoder()).encode(newSource);

  const cWidth = gWidth;
  const cHeight = gHeight + Math.ceil((Constants.BYTES_HEADER_SIZE + sArray.byteLength) / (Constants.BYTES_32BIT * gWidth));
  const cSize = cWidth * cHeight * Constants.BYTES_32BIT;
  const cArray = new Uint8Array(cSize);

  let padding = 0;
  for (let i = 0; i < gSize; ++i) {
    if (gPxBytes === Constants.BYTES_24BIT) {
      if ((i + 1) % Constants.BYTES_32BIT === 0) {
        ++padding;
        cArray[i] = 0xff;
        continue;
      }
    }
    cArray[i] = cardGraphic.data[i - padding];
  }

  const dataView = new DataView(cArray.buffer, gSize);
  dataView.setUint32(0, 0xdeadbeef, true); // magic number
  dataView.setUint32(4, sArray.byteLength, true); // data size

  for (let i = 0; i < sArray.byteLength; ++i) {
    cArray[gSize + Constants.BYTES_HEADER_SIZE + i] = sArray[i];
  }

  return UPNG.encode([cArray.buffer], cWidth, cHeight, 0);
};

export { make };
