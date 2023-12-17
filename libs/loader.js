import UPNG from 'upng-js';
import Constants from './constants.js';

const load = (cBuffer) => {
  const card = UPNG.decode(cBuffer);
  // Graphic must be square of card.width.
  const gSize = card.width * card.width * Constants.BYTES_32BIT;

  const rView = new DataView(card.data.buffer, gSize);
  const magicNumber = rView.getUint32(0, true);
  if (magicNumber !== Constants.MAGIC_NUMBER) {
    throw new Error(`Invalid magic number : ${magicNumber}`);
  }

  const sSize = rView.getUint32(Constants.BYTES_32BIT, true);
  const sArray = new Uint8Array(sSize);
  for (let i = 0; i < sSize; ++i) {
    sArray[i] = card.data[gSize + Constants.BYTES_HEADER_SIZE + i];
  }

  return sArray.buffer;
};

export { load };
