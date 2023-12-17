const acorn = require('../JS-Interpreter/acorn');
globalThis.acorn = acorn;
require('../JS-Interpreter/interpreter');

export default Interpreter;
