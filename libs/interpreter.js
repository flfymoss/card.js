import Interpreter from '../deps/JS-Interpreter_wrapper/interpreter.js';
import mitt from 'mitt';

const EventValue = {
  'STATUS': 'status'
};
const StatusValue = {
  'READY': 'ready',
  'RUNNING': 'running',
  'WAITING_INPUT': 'waiting_input',
  'PENDING_INPUT_CALLBACK': 'pending_input_callback',
  'DONE': 'done'
};

class Status {
  constructor(emitter) {
    this._emitter = emitter;
    this._value = StatusValue.READY;
  }
  get() {
    return this._value;
  }
  set(value) {
    this._value = value;
    this._emitter.emit(EventValue.STATUS, value);
  }
}

const createInterpreter = (code, logger, minTickMs = 10) => {
  let userInput = '';
  let callbackFn = undefined;
  let timeout = undefined;

  const emitter = mitt();
  const status = new Status(emitter);

  const initFunc = (interpreter, globalObject) => {
    interpreter.setProperty(globalObject, 'log', interpreter.createNativeFunction((text, rawProps) => {
      const props = rawProps ? interpreter.pseudoToNative(rawProps) : undefined;
      logger(text, props);
    }));
    interpreter.setProperty(globalObject, 'input', interpreter.createAsyncFunction((fn) => {
      // callbackFn(userInput: string)
      callbackFn = fn;
      status.set(StatusValue.WAITING_INPUT);
    }));
  };
  const myInterpreter = new Interpreter(code, initFunc);
  const scheduleNext = () => timeout = setTimeout(loop, minTickMs);
  const processCallbacks = () => {
    if (callbackFn && status.get() === StatusValue.PENDING_INPUT_CALLBACK) {
      callbackFn(userInput);
      callbackFn = undefined;
      status.set(StatusValue.RUNNING);
    }
  };
  const loop = () => {
    if (status.get() === StatusValue.DONE) return;
    processCallbacks();
    myInterpreter.run();
    if (myInterpreter.getStatus() === Interpreter.Status.DONE) {
      status.set(StatusValue.DONE);
      return;
    }
    scheduleNext();
  };
  
  /**
   * Public API
   */
  const run = () => {
    if (status.get() === StatusValue.READY) {
      status.set(StatusValue.RUNNING);
      loop();
    }
  };
  const abort = () => {
    timeout && clearTimeout(timeout);
    status.set(StatusValue.DONE);
  };
  const setInput = (input) => {
    if (status.get() !== StatusValue.WAITING_INPUT) return;
    userInput = input;
    status.set(StatusValue.PENDING_INPUT_CALLBACK);
  };

  return {
    hook: (event, fn) => emitter.on(event, fn),
    unhook: () => emitter.all.clear(),
    run,
    abort,
    setInput,
    EventValue: { ...EventValue },
    StatusValue: { ...StatusValue }
  };
};

export { createInterpreter };
