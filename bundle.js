(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function _initializer(generator, ...dimensions) {
  let arr = [];
  let dims = [...dimensions];
  let dim = dims.shift();

  for (let i = 0; i < dim; i++) {
    if (dims.length === 0) {
      arr.push(generator());
    } else {
      arr.push(_initializer(generator, ...dims));
    }
  }

  return arr;
}


module.exports = _initializer;

},{}],2:[function(require,module,exports){
function equals(a, b) {
  let len = a.length;
  if (len !== b.length) {
    return false;
  }

  for (let i = 0; i < len; i++) {
    let _a = a[i];
    let _b = b[i];
    if (Array.isArray(_a)) {
      if (Array.isArray(_b)) {
        return equals(_a, _b);
      } else {
        return false;
      }
    } else {
      if (_a !== _b) {
        return false;
      }
    }
  }

  return true;
}


module.exports = equals;

},{}],3:[function(require,module,exports){
module.exports = {
  equals:  require('./equals'),
  eq:      require('./equals'),
  normal:  require('./normal'),
  uniform: require('./uniform'),
  ones:    require('./ones'),
  zeros:   require('./zeros')
};

},{"./equals":2,"./normal":4,"./ones":5,"./uniform":6,"./zeros":7}],4:[function(require,module,exports){
const initializer = require('./_initializer');
const random = require('../random');

let generator = (loc, scale, rng) => {
  return random.normal(loc, scale, rng);
}

function normal(loc = 0.0, scale = 1.0, rng = Math.random, dimensions = null) {
  dimensions = dimensions || [];
  return initializer(generator.bind(null, loc, scale, rng), ...dimensions);
}

module.exports = normal;

},{"../random":32,"./_initializer":1}],5:[function(require,module,exports){
const initializer = require('./_initializer');

let generator = () => {
  return 1.0;
}

function ones(...dimensions) {
  return initializer(generator, ...dimensions);
}


module.exports = ones;

},{"./_initializer":1}],6:[function(require,module,exports){
const initializer = require('./_initializer');
const random = require('../random');

let generator = (min, max, rng) => {
  return random.uniform(min, max, rng);
}

function uniform(min = 0.0, max = 1.0, rng = Math.random, dimensions = null) {
  dimensions = dimensions || [];
  return initializer(generator.bind(null, min, max, rng), ...dimensions);
}

module.exports = uniform;

},{"../random":32,"./_initializer":1}],7:[function(require,module,exports){
const initializer = require('./_initializer');

let generator = () => {
  return 0.0;
}

function zeros(...dimensions) {
  return initializer(generator, ...dimensions);
}


module.exports = zeros;

},{"./_initializer":1}],8:[function(require,module,exports){
class ArgumentError extends Error {
  constructor(a, str = 'does not satisfy requirements') {
    let log = `Argument ${a} (${typeof a}) ${str}.`;
    super(log);
  }
}

module.exports = ArgumentError;

},{}],9:[function(require,module,exports){
class DimensionError extends Error {
  constructor(a, b, str = 'do not match') {
    let log = `Dimension ${String(a)} and ${String(b)} ${str}.`;
    super(log);
  }

  static unmatch(a, b) {
    return new DimensionError(a, b);
  }

  static unsatisfy(a, b) {
    return new DimensionError(a, b, 'does not satisfy requirements');
  }
}

module.exports = DimensionError;

},{}],10:[function(require,module,exports){
module.exports = {
  ArgumentError:  require('./ArgumentError'),
  DimensionError: require('./DimensionError')
};

},{"./ArgumentError":8,"./DimensionError":9}],11:[function(require,module,exports){
/*
 *  value: number | number[]([]+)?
 *  fn: Function
 */

function _dimensionize(value, fn) {
  if (Array.isArray(value)) {
    let _res = [];
    for (let _row of value) {
      _res.push(_dimensionize(_row, fn));
    }
    return _res;
  } else {
    return fn(value);
  }
}


module.exports = _dimensionize;

},{}],12:[function(require,module,exports){
module.exports = {
  linear:  require('./linear'),
  relu:    require('./relu'),
  sigmoid: require('./sigmoid'),
  softmax: require('./softmax'),
  tanh:    require('./tanh')
};

},{"./linear":13,"./relu":14,"./sigmoid":15,"./softmax":16,"./tanh":17}],13:[function(require,module,exports){
/*
 * x: number | number[]([]+)?
 */


const dimensionizer = require('./_dimensionize');


function _linear(x) {
  return x;
}

function _dlinear(x) {
  return 1;
}


function linear(x) {
  return dimensionizer(x, _linear);
}

function dlinear(x) {
  return dimensionizer(x, _dlinear);
}


module.exports = linear;
module.exports.grad = dlinear;

},{"./_dimensionize":11}],14:[function(require,module,exports){
/*
 * x: number | number[]([]+)?
 */


const dimensionizer = require('./_dimensionize');


function _relu(x) {
  return (x < 0) ? 0 : x;
}

function _drelu(x) {
  return (x < 0) ? 0 : 1;
}

function relu(x) {
  return dimensionizer(x, _relu);
}

function drelu(x) {
  return dimensionizer(x, _drelu);
}


module.exports = relu;
module.exports.grad = drelu;

},{"./_dimensionize":11}],15:[function(require,module,exports){
/*
 * x: number | number[]([]+)?
 */


const dimensionizer = require('./_dimensionize');


function _sigmoid(x) {
  return 1 / (1 + Math.pow(Math.E, -x));
}

function _dsigmoid(x) {
  return _sigmoid(x) * (1 - _sigmoid(x));
}

function sigmoid(x) {
  return dimensionizer(x, _sigmoid);
}

function dsigmoid(x) {
  return dimensionizer(x, _dsigmoid);
}


module.exports = sigmoid;
module.exports.grad = dsigmoid;

},{"./_dimensionize":11}],16:[function(require,module,exports){
/*
 * x: number[]
 */

const operator = require('../operator');

const max = operator.max;
const sum = operator.sum;
const divide = operator.divide;

function softmax(x) {
  let y = [];
  let maxVal = max(x);

  for (let i = 0; i < x.length; i++) {
    y.push(Math.exp(x[i] - maxVal));
  }

  return divide(y, sum(y));
}

module.exports = softmax;

},{"../operator":24}],17:[function(require,module,exports){
/*
 * x: number | number[]([]+)?
 */


const dimensionizer = require('./_dimensionize');


function _tanh(x) {
  return Math.tanh(x);
}

function _dtanh(x) {
  return 1 - Math.pow(_tanh(x), 2);
}

function tanh(x) {
  return dimensionizer(x, _tanh);
}

function dtanh(x) {
  return dimensionizer(x, _dtanh);
}


module.exports = tanh;
module.exports.grad = dtanh;

},{"./_dimensionize":11}],18:[function(require,module,exports){
const operator = require('./operator');

module.exports = {
  array:     require('./array'),
  error:     require('./error'),
  fn:        require('./fn'),
  operator:  operator,
  random:    require('./random'),
};


for (let name of Object.getOwnPropertyNames(operator)) {
  module.exports[name] = operator[name];
}

},{"./array":3,"./error":10,"./fn":12,"./operator":24,"./random":32}],19:[function(require,module,exports){
const DimensionError = require('../error').DimensionError;
const eq = require('../array/equals');
const dim = require('./dimension');


function add(a, b) {
  if (Array.isArray(a)) {
    if (Array.isArray(b)) {
      return _add(a, b);
    } else {
      return _trans(b, a);
    }
  } else if (Array.isArray(b)) {
    if (Array.isArray(a)) {
      return _add(a, b);
    } else {
      return _trans(a, b);
    }
  } else {
    return a + b;
  }
}


function _add(a, b) {
  let res = [];

  let aDim = dim(a);
  let bDim = dim(b);

  if (!eq(aDim, bDim)) {
    throw DimensionError.unmatch(aDim, bDim);
  }

  for (let i = 0; i < a.length; i++) {
    res.push(add(a[i], b[i]));
  }

  return res;
}


function _trans(scalar, arr) {
  let res = [];

  for (let elem of arr) {
    if (Array.isArray(elem)) {
      res.push(_trans(scalar, elem));
    } else {
      res.push(scalar + elem);
    }
  }

  return res;
}


module.exports = add;

},{"../array/equals":2,"../error":10,"./dimension":21}],20:[function(require,module,exports){
function argmax(v) {
  let index = 0;
  let max = v[index];

  for (let i = 1; i < v.length; i++) {
    if (max < v[i]) {
      max = v[i];
      index = i;
    }
  }

  return index;
}


module.exports = argmax;

},{}],21:[function(require,module,exports){
// a: array (tensor)

function dimension(a, dim = null) {
  if (!Array.isArray(a)) {
    return [];
  }

  dim = dim || [];
  dim.push(a.length);
  if (Array.isArray(a[0])) {
    dimension(a[0], dim);
  }
  return dim;
}


module.exports = dimension;

},{}],22:[function(require,module,exports){
const DimensionError = require('../error').DimensionError;
const ArgumentError = require('../error').ArgumentError;
const eq = require('../array/equals');
const dim = require('./dimension');


function divide(a, b) {
  if (Array.isArray(a)) {
    if (Array.isArray(b)) {
      return _divide(a, b);
    } else {
      return _scale(b, a);
    }
  } else if (Array.isArray(b)) {
    if (Array.isArray(a)) {
      return _divide(a, b);
    } else {
      throw new ArgumentError(b);
    }
  } else {
    return a / b;
  }
}


function _divide(a, b) {
  let res = [];

  let aDim = dim(a);
  let bDim = dim(b);

  if (!eq(aDim, bDim)) {
    throw DimensionError.unmatch(aDim, bDim);
  }

  for (let i = 0; i < a.length; i++) {
    res.push(divide(a[i], b[i]));
  }

  return res;
}


function _scale(scalar, arr) {
  let res = [];

  for (let elem of arr) {
    if (Array.isArray(elem)) {
      res.push(_scale(scalar, elem));
    } else {
      res.push(elem / scalar);
    }
  }

  return res;
}


module.exports = divide;

},{"../array/equals":2,"../error":10,"./dimension":21}],23:[function(require,module,exports){
// TODO: support n-dim array

const DimensionError = require('../error').DimensionError;
const dim = require('./dimension');
const transpose = require('./transpose');


function dot(a, b) {
  let aDim = dim(a);
  let bDim = dim(b);

  if (aDim.length === 1) {  // (vector dot vector) or (vector dot matrix)

    if (aDim[0] !== bDim[0]) {
      _unsatisfy(aDim, bDim);
    }

    if (bDim.length === 1) {
      return _dot(a, b);
    } else {
      let _res = [];
      for (let _v of transpose(b)) {
        _res.push(_dot(a, _v));
      }
      return _res;
    }

  } else {  // (matrix dot vector) or (matrix dot matrix)

    if (aDim[aDim.length - 1] !== bDim[0]) {
      _unsatisfy(aDim, bDim);
    }

    let _res = [];

    if (bDim.length === 1) {
      for (let _v of a) {
        _res.push(_dot(_v, b));
      }
    } else {
      let _b = transpose(b);
      for (let _v1 of a) {
        let _v = [];
        for (let _v2 of _b) {
          _v.push(_dot(_v1, _v2));
        }
        _res.push(_v)
      }
    }

    return _res;
  }
}


function _dot(v1, v2) {
  let sum = 0.0;
  for (let i = 0; i < v1.length; i++) {
    sum += v1[i] * v2[i];
  }

  return sum;
}

function _unsatisfy(a, b) {
  throw DimensionError.unsatisfy(a, b);
}


module.exports = dot;

},{"../error":10,"./dimension":21,"./transpose":31}],24:[function(require,module,exports){
module.exports = {
  add:       require('./add'),
  argmax:    require('./argmax'),
  dimension: require('./dimension'),
  divide:    require('./divide'),
  dot:       require('./dot'),
  dim:       require('./dimension'),
  max:       require('./max'),
  min:       require('./min'),
  multiply:  require('./multiply'),
  mul:       require('./multiply'),
  outer:     require('./outer'),
  subtract:  require('./subtract'),
  sub:       require('./subtract'),
  sum:       require('./sum'),
  transpose: require('./transpose'),
  T:         require('./transpose')
}

},{"./add":19,"./argmax":20,"./dimension":21,"./divide":22,"./dot":23,"./max":25,"./min":26,"./multiply":27,"./outer":28,"./subtract":29,"./sum":30,"./transpose":31}],25:[function(require,module,exports){
function max(v) {
  let max = v[0];
  for (let val of v) {
    if (max < val) {
      max = val;
    }
  }

  return max;
}


module.exports = max;

},{}],26:[function(require,module,exports){
function min(v) {
  let min = v[0];
  for (let val of v) {
    if (min > val) {
      min = val;
    }
  }

  return min;
}


module.exports = min;

},{}],27:[function(require,module,exports){
const DimensionError = require('../error').DimensionError;
const eq = require('../array/equals');
const dim = require('./dimension');


function multiply(a, b) {
  if (Array.isArray(a)) {
    if (Array.isArray(b)) {
      return _multiply(a, b);
    } else {
      return _scale(b, a);
    }
  } else if (Array.isArray(b)) {
    if (Array.isArray(a)) {
      return _multiply(a, b);
    } else {
      return _scale(a, b);
    }
  } else {
    return a * b;
  }
}


function _multiply(a, b) {
  let res = [];

  let aDim = dim(a);
  let bDim = dim(b);

  if (!eq(aDim, bDim)) {
    throw DimensionError.unmatch(aDim, bDim);
  }

  for (let i = 0; i < a.length; i++) {
    res.push(multiply(a[i], b[i]));
  }

  return res;
}


function _scale(scalar, arr) {
  let res = [];

  for (let elem of arr) {
    if (Array.isArray(elem)) {
      res.push(_scale(scalar, elem));
    } else {
      res.push(scalar * elem);
    }
  }

  return res;
}


module.exports = multiply;

},{"../array/equals":2,"../error":10,"./dimension":21}],28:[function(require,module,exports){
function outer(v1, v2) {
  let res = [];
  for (let i = 0; i < v1.length; i++) {
    res.push([]);
    for (let j = 0; j < v2.length; j++) {
      res[i].push(v1[i] * v2[j]);
    }
  }

  return res;
}


module.exports = outer;

},{}],29:[function(require,module,exports){
const DimensionError = require('../error').DimensionError;
const eq = require('../array/equals');
const dim = require('./dimension');


function subtract(a, b) {
  if (Array.isArray(a)) {
    if (Array.isArray(b)) {
      return _subtract(a, b);
    } else {
      return _trans(b, a);
    }
  } else if (Array.isArray(b)) {
    if (Array.isArray(a)) {
      return _subtract(a, b);
    } else {
      return _trans(a, b);
    }
  } else {
    return a - b;
  }
}


function _subtract(a, b) {
  let res = [];

  let aDim = dim(a);
  let bDim = dim(b);

  if (!eq(aDim, bDim)) {
    throw DimensionError.unmatch(aDim, bDim);
  }

  for (let i = 0; i < a.length; i++) {
    res.push(subtract(a[i], b[i]));
  }

  return res;
}


function _trans(scalar, arr) {
  let res = [];

  for (let elem of arr) {
    if (Array.isArray(elem)) {
      res.push(_trans(scalar, elem));
    } else {
      res.push(-scalar + elem);
    }
  }

  return res;
}


module.exports = subtract;

},{"../array/equals":2,"../error":10,"./dimension":21}],30:[function(require,module,exports){
function sum(v) {
  let res = 0.0;
  for (let val of v) {
    res += val;
  }

  return res;
}


module.exports = sum;

},{}],31:[function(require,module,exports){
const dimension = require('./dimension');
const zeros = require('../array/zeros');

function transpose(a) {
  let reverses = dimension(a).reverse();
  let res = zeros(...reverses);

  _set(a, res, reverses)

  return res;
}


function _set(a, b, reverses, ...index) {
  let reverse = reverses.shift();

  for (let i = 0; i < reverse; i++) {
    let _indices = [i, ...index];

    if (reverses.length === 0) {
      b[i] = _getValue(a, ..._indices);
    } else {
      _set(a, b[i], reverses.concat(), ..._indices);
    }
  }
}


function _getValue(a, ...index) {
  let arr = a.concat();
  let indices = [...index];
  for (let i = 0; i < indices.length; i++) {
    arr = arr[indices[i]];
  }

  return arr;
}


module.exports = transpose;

},{"../array/zeros":7,"./dimension":21}],32:[function(require,module,exports){
module.exports = {
  normal: require('./normal'),
  uniform: require('./uniform')
};

},{"./normal":33,"./uniform":34}],33:[function(require,module,exports){
function normal(loc = 0.0, scale = 1.0, rng = Math.random) {
  return Math.sqrt(-1 * Math.log(1 - rng())) * Math.cos(2 * Math.PI * rng());
}

module.exports = normal;

},{}],34:[function(require,module,exports){
function uniform(min = 0.0, max = 1.0, rng = Math.random) {
  return rng() * (max - min) + min;
}

module.exports = uniform;

},{}],35:[function(require,module,exports){
// A library of seedable RNGs implemented in Javascript.
//
// Usage:
//
// var seedrandom = require('seedrandom');
// var random = seedrandom(1); // or any seed.
// var x = random();       // 0 <= x < 1.  Every bit is random.
// var x = random.quick(); // 0 <= x < 1.  32 bits of randomness.

// alea, a 53-bit multiply-with-carry generator by Johannes Baagøe.
// Period: ~2^116
// Reported to pass all BigCrush tests.
var alea = require('./lib/alea');

// xor128, a pure xor-shift generator by George Marsaglia.
// Period: 2^128-1.
// Reported to fail: MatrixRank and LinearComp.
var xor128 = require('./lib/xor128');

// xorwow, George Marsaglia's 160-bit xor-shift combined plus weyl.
// Period: 2^192-2^32
// Reported to fail: CollisionOver, SimpPoker, and LinearComp.
var xorwow = require('./lib/xorwow');

// xorshift7, by François Panneton and Pierre L'ecuyer, takes
// a different approach: it adds robustness by allowing more shifts
// than Marsaglia's original three.  It is a 7-shift generator
// with 256 bits, that passes BigCrush with no systmatic failures.
// Period 2^256-1.
// No systematic BigCrush failures reported.
var xorshift7 = require('./lib/xorshift7');

// xor4096, by Richard Brent, is a 4096-bit xor-shift with a
// very long period that also adds a Weyl generator. It also passes
// BigCrush with no systematic failures.  Its long period may
// be useful if you have many generators and need to avoid
// collisions.
// Period: 2^4128-2^32.
// No systematic BigCrush failures reported.
var xor4096 = require('./lib/xor4096');

// Tyche-i, by Samuel Neves and Filipe Araujo, is a bit-shifting random
// number generator derived from ChaCha, a modern stream cipher.
// https://eden.dei.uc.pt/~sneves/pubs/2011-snfa2.pdf
// Period: ~2^127
// No systematic BigCrush failures reported.
var tychei = require('./lib/tychei');

// The original ARC4-based prng included in this library.
// Period: ~2^1600
var sr = require('./seedrandom');

sr.alea = alea;
sr.xor128 = xor128;
sr.xorwow = xorwow;
sr.xorshift7 = xorshift7;
sr.xor4096 = xor4096;
sr.tychei = tychei;

module.exports = sr;

},{"./lib/alea":36,"./lib/tychei":37,"./lib/xor128":38,"./lib/xor4096":39,"./lib/xorshift7":40,"./lib/xorwow":41,"./seedrandom":42}],36:[function(require,module,exports){
// A port of an algorithm by Johannes Baagøe <baagoe@baagoe.com>, 2010
// http://baagoe.com/en/RandomMusings/javascript/
// https://github.com/nquinlan/better-random-numbers-for-javascript-mirror
// Original work is under MIT license -

// Copyright (C) 2010 by Johannes Baagøe <baagoe@baagoe.org>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.



(function(global, module, define) {

function Alea(seed) {
  var me = this, mash = Mash();

  me.next = function() {
    var t = 2091639 * me.s0 + me.c * 2.3283064365386963e-10; // 2^-32
    me.s0 = me.s1;
    me.s1 = me.s2;
    return me.s2 = t - (me.c = t | 0);
  };

  // Apply the seeding algorithm from Baagoe.
  me.c = 1;
  me.s0 = mash(' ');
  me.s1 = mash(' ');
  me.s2 = mash(' ');
  me.s0 -= mash(seed);
  if (me.s0 < 0) { me.s0 += 1; }
  me.s1 -= mash(seed);
  if (me.s1 < 0) { me.s1 += 1; }
  me.s2 -= mash(seed);
  if (me.s2 < 0) { me.s2 += 1; }
  mash = null;
}

function copy(f, t) {
  t.c = f.c;
  t.s0 = f.s0;
  t.s1 = f.s1;
  t.s2 = f.s2;
  return t;
}

function impl(seed, opts) {
  var xg = new Alea(seed),
      state = opts && opts.state,
      prng = xg.next;
  prng.int32 = function() { return (xg.next() * 0x100000000) | 0; }
  prng.double = function() {
    return prng() + (prng() * 0x200000 | 0) * 1.1102230246251565e-16; // 2^-53
  };
  prng.quick = prng;
  if (state) {
    if (typeof(state) == 'object') copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

function Mash() {
  var n = 0xefc8249d;

  var mash = function(data) {
    data = data.toString();
    for (var i = 0; i < data.length; i++) {
      n += data.charCodeAt(i);
      var h = 0.02519603282416938 * n;
      n = h >>> 0;
      h -= n;
      h *= n;
      n = h >>> 0;
      h -= n;
      n += h * 0x100000000; // 2^32
    }
    return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
  };

  return mash;
}


if (module && module.exports) {
  module.exports = impl;
} else if (define && define.amd) {
  define(function() { return impl; });
} else {
  this.alea = impl;
}

})(
  this,
  (typeof module) == 'object' && module,    // present in node.js
  (typeof define) == 'function' && define   // present with an AMD loader
);



},{}],37:[function(require,module,exports){
// A Javascript implementaion of the "Tyche-i" prng algorithm by
// Samuel Neves and Filipe Araujo.
// See https://eden.dei.uc.pt/~sneves/pubs/2011-snfa2.pdf

(function(global, module, define) {

function XorGen(seed) {
  var me = this, strseed = '';

  // Set up generator function.
  me.next = function() {
    var b = me.b, c = me.c, d = me.d, a = me.a;
    b = (b << 25) ^ (b >>> 7) ^ c;
    c = (c - d) | 0;
    d = (d << 24) ^ (d >>> 8) ^ a;
    a = (a - b) | 0;
    me.b = b = (b << 20) ^ (b >>> 12) ^ c;
    me.c = c = (c - d) | 0;
    me.d = (d << 16) ^ (c >>> 16) ^ a;
    return me.a = (a - b) | 0;
  };

  /* The following is non-inverted tyche, which has better internal
   * bit diffusion, but which is about 25% slower than tyche-i in JS.
  me.next = function() {
    var a = me.a, b = me.b, c = me.c, d = me.d;
    a = (me.a + me.b | 0) >>> 0;
    d = me.d ^ a; d = d << 16 ^ d >>> 16;
    c = me.c + d | 0;
    b = me.b ^ c; b = b << 12 ^ d >>> 20;
    me.a = a = a + b | 0;
    d = d ^ a; me.d = d = d << 8 ^ d >>> 24;
    me.c = c = c + d | 0;
    b = b ^ c;
    return me.b = (b << 7 ^ b >>> 25);
  }
  */

  me.a = 0;
  me.b = 0;
  me.c = 2654435769 | 0;
  me.d = 1367130551;

  if (seed === Math.floor(seed)) {
    // Integer seed.
    me.a = (seed / 0x100000000) | 0;
    me.b = seed | 0;
  } else {
    // String seed.
    strseed += seed;
  }

  // Mix in string seed, then discard an initial batch of 64 values.
  for (var k = 0; k < strseed.length + 20; k++) {
    me.b ^= strseed.charCodeAt(k) | 0;
    me.next();
  }
}

function copy(f, t) {
  t.a = f.a;
  t.b = f.b;
  t.c = f.c;
  t.d = f.d;
  return t;
};

function impl(seed, opts) {
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (typeof(state) == 'object') copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (define && define.amd) {
  define(function() { return impl; });
} else {
  this.tychei = impl;
}

})(
  this,
  (typeof module) == 'object' && module,    // present in node.js
  (typeof define) == 'function' && define   // present with an AMD loader
);



},{}],38:[function(require,module,exports){
// A Javascript implementaion of the "xor128" prng algorithm by
// George Marsaglia.  See http://www.jstatsoft.org/v08/i14/paper

(function(global, module, define) {

function XorGen(seed) {
  var me = this, strseed = '';

  me.x = 0;
  me.y = 0;
  me.z = 0;
  me.w = 0;

  // Set up generator function.
  me.next = function() {
    var t = me.x ^ (me.x << 11);
    me.x = me.y;
    me.y = me.z;
    me.z = me.w;
    return me.w ^= (me.w >>> 19) ^ t ^ (t >>> 8);
  };

  if (seed === (seed | 0)) {
    // Integer seed.
    me.x = seed;
  } else {
    // String seed.
    strseed += seed;
  }

  // Mix in string seed, then discard an initial batch of 64 values.
  for (var k = 0; k < strseed.length + 64; k++) {
    me.x ^= strseed.charCodeAt(k) | 0;
    me.next();
  }
}

function copy(f, t) {
  t.x = f.x;
  t.y = f.y;
  t.z = f.z;
  t.w = f.w;
  return t;
}

function impl(seed, opts) {
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (typeof(state) == 'object') copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (define && define.amd) {
  define(function() { return impl; });
} else {
  this.xor128 = impl;
}

})(
  this,
  (typeof module) == 'object' && module,    // present in node.js
  (typeof define) == 'function' && define   // present with an AMD loader
);



},{}],39:[function(require,module,exports){
// A Javascript implementaion of Richard Brent's Xorgens xor4096 algorithm.
//
// This fast non-cryptographic random number generator is designed for
// use in Monte-Carlo algorithms. It combines a long-period xorshift
// generator with a Weyl generator, and it passes all common batteries
// of stasticial tests for randomness while consuming only a few nanoseconds
// for each prng generated.  For background on the generator, see Brent's
// paper: "Some long-period random number generators using shifts and xors."
// http://arxiv.org/pdf/1004.3115v1.pdf
//
// Usage:
//
// var xor4096 = require('xor4096');
// random = xor4096(1);                        // Seed with int32 or string.
// assert.equal(random(), 0.1520436450538547); // (0, 1) range, 53 bits.
// assert.equal(random.int32(), 1806534897);   // signed int32, 32 bits.
//
// For nonzero numeric keys, this impelementation provides a sequence
// identical to that by Brent's xorgens 3 implementaion in C.  This
// implementation also provides for initalizing the generator with
// string seeds, or for saving and restoring the state of the generator.
//
// On Chrome, this prng benchmarks about 2.1 times slower than
// Javascript's built-in Math.random().

(function(global, module, define) {

function XorGen(seed) {
  var me = this;

  // Set up generator function.
  me.next = function() {
    var w = me.w,
        X = me.X, i = me.i, t, v;
    // Update Weyl generator.
    me.w = w = (w + 0x61c88647) | 0;
    // Update xor generator.
    v = X[(i + 34) & 127];
    t = X[i = ((i + 1) & 127)];
    v ^= v << 13;
    t ^= t << 17;
    v ^= v >>> 15;
    t ^= t >>> 12;
    // Update Xor generator array state.
    v = X[i] = v ^ t;
    me.i = i;
    // Result is the combination.
    return (v + (w ^ (w >>> 16))) | 0;
  };

  function init(me, seed) {
    var t, v, i, j, w, X = [], limit = 128;
    if (seed === (seed | 0)) {
      // Numeric seeds initialize v, which is used to generates X.
      v = seed;
      seed = null;
    } else {
      // String seeds are mixed into v and X one character at a time.
      seed = seed + '\0';
      v = 0;
      limit = Math.max(limit, seed.length);
    }
    // Initialize circular array and weyl value.
    for (i = 0, j = -32; j < limit; ++j) {
      // Put the unicode characters into the array, and shuffle them.
      if (seed) v ^= seed.charCodeAt((j + 32) % seed.length);
      // After 32 shuffles, take v as the starting w value.
      if (j === 0) w = v;
      v ^= v << 10;
      v ^= v >>> 15;
      v ^= v << 4;
      v ^= v >>> 13;
      if (j >= 0) {
        w = (w + 0x61c88647) | 0;     // Weyl.
        t = (X[j & 127] ^= (v + w));  // Combine xor and weyl to init array.
        i = (0 == t) ? i + 1 : 0;     // Count zeroes.
      }
    }
    // We have detected all zeroes; make the key nonzero.
    if (i >= 128) {
      X[(seed && seed.length || 0) & 127] = -1;
    }
    // Run the generator 512 times to further mix the state before using it.
    // Factoring this as a function slows the main generator, so it is just
    // unrolled here.  The weyl generator is not advanced while warming up.
    i = 127;
    for (j = 4 * 128; j > 0; --j) {
      v = X[(i + 34) & 127];
      t = X[i = ((i + 1) & 127)];
      v ^= v << 13;
      t ^= t << 17;
      v ^= v >>> 15;
      t ^= t >>> 12;
      X[i] = v ^ t;
    }
    // Storing state as object members is faster than using closure variables.
    me.w = w;
    me.X = X;
    me.i = i;
  }

  init(me, seed);
}

function copy(f, t) {
  t.i = f.i;
  t.w = f.w;
  t.X = f.X.slice();
  return t;
};

function impl(seed, opts) {
  if (seed == null) seed = +(new Date);
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (state.X) copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (define && define.amd) {
  define(function() { return impl; });
} else {
  this.xor4096 = impl;
}

})(
  this,                                     // window object or global
  (typeof module) == 'object' && module,    // present in node.js
  (typeof define) == 'function' && define   // present with an AMD loader
);

},{}],40:[function(require,module,exports){
// A Javascript implementaion of the "xorshift7" algorithm by
// François Panneton and Pierre L'ecuyer:
// "On the Xorgshift Random Number Generators"
// http://saluc.engr.uconn.edu/refs/crypto/rng/panneton05onthexorshift.pdf

(function(global, module, define) {

function XorGen(seed) {
  var me = this;

  // Set up generator function.
  me.next = function() {
    // Update xor generator.
    var X = me.x, i = me.i, t, v, w;
    t = X[i]; t ^= (t >>> 7); v = t ^ (t << 24);
    t = X[(i + 1) & 7]; v ^= t ^ (t >>> 10);
    t = X[(i + 3) & 7]; v ^= t ^ (t >>> 3);
    t = X[(i + 4) & 7]; v ^= t ^ (t << 7);
    t = X[(i + 7) & 7]; t = t ^ (t << 13); v ^= t ^ (t << 9);
    X[i] = v;
    me.i = (i + 1) & 7;
    return v;
  };

  function init(me, seed) {
    var j, w, X = [];

    if (seed === (seed | 0)) {
      // Seed state array using a 32-bit integer.
      w = X[0] = seed;
    } else {
      // Seed state using a string.
      seed = '' + seed;
      for (j = 0; j < seed.length; ++j) {
        X[j & 7] = (X[j & 7] << 15) ^
            (seed.charCodeAt(j) + X[(j + 1) & 7] << 13);
      }
    }
    // Enforce an array length of 8, not all zeroes.
    while (X.length < 8) X.push(0);
    for (j = 0; j < 8 && X[j] === 0; ++j);
    if (j == 8) w = X[7] = -1; else w = X[j];

    me.x = X;
    me.i = 0;

    // Discard an initial 256 values.
    for (j = 256; j > 0; --j) {
      me.next();
    }
  }

  init(me, seed);
}

function copy(f, t) {
  t.x = f.x.slice();
  t.i = f.i;
  return t;
}

function impl(seed, opts) {
  if (seed == null) seed = +(new Date);
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (state.x) copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (define && define.amd) {
  define(function() { return impl; });
} else {
  this.xorshift7 = impl;
}

})(
  this,
  (typeof module) == 'object' && module,    // present in node.js
  (typeof define) == 'function' && define   // present with an AMD loader
);


},{}],41:[function(require,module,exports){
// A Javascript implementaion of the "xorwow" prng algorithm by
// George Marsaglia.  See http://www.jstatsoft.org/v08/i14/paper

(function(global, module, define) {

function XorGen(seed) {
  var me = this, strseed = '';

  // Set up generator function.
  me.next = function() {
    var t = (me.x ^ (me.x >>> 2));
    me.x = me.y; me.y = me.z; me.z = me.w; me.w = me.v;
    return (me.d = (me.d + 362437 | 0)) +
       (me.v = (me.v ^ (me.v << 4)) ^ (t ^ (t << 1))) | 0;
  };

  me.x = 0;
  me.y = 0;
  me.z = 0;
  me.w = 0;
  me.v = 0;

  if (seed === (seed | 0)) {
    // Integer seed.
    me.x = seed;
  } else {
    // String seed.
    strseed += seed;
  }

  // Mix in string seed, then discard an initial batch of 64 values.
  for (var k = 0; k < strseed.length + 64; k++) {
    me.x ^= strseed.charCodeAt(k) | 0;
    if (k == strseed.length) {
      me.d = me.x << 10 ^ me.x >>> 4;
    }
    me.next();
  }
}

function copy(f, t) {
  t.x = f.x;
  t.y = f.y;
  t.z = f.z;
  t.w = f.w;
  t.v = f.v;
  t.d = f.d;
  return t;
}

function impl(seed, opts) {
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / 0x100000000; };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / 0x100000000,
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  prng.quick = prng;
  if (state) {
    if (typeof(state) == 'object') copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (define && define.amd) {
  define(function() { return impl; });
} else {
  this.xorwow = impl;
}

})(
  this,
  (typeof module) == 'object' && module,    // present in node.js
  (typeof define) == 'function' && define   // present with an AMD loader
);



},{}],42:[function(require,module,exports){
/*
Copyright 2014 David Bau.

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/

(function (pool, math) {
//
// The following constants are related to IEEE 754 limits.
//
var global = this,
    width = 256,        // each RC4 output is 0 <= x < 256
    chunks = 6,         // at least six RC4 outputs for each double
    digits = 52,        // there are 52 significant digits in a double
    rngname = 'random', // rngname: name for Math.random and Math.seedrandom
    startdenom = math.pow(width, chunks),
    significance = math.pow(2, digits),
    overflow = significance * 2,
    mask = width - 1,
    nodecrypto;         // node.js crypto module, initialized at the bottom.

//
// seedrandom()
// This is the seedrandom function described above.
//
function seedrandom(seed, options, callback) {
  var key = [];
  options = (options == true) ? { entropy: true } : (options || {});

  // Flatten the seed string or build one from local entropy if needed.
  var shortseed = mixkey(flatten(
    options.entropy ? [seed, tostring(pool)] :
    (seed == null) ? autoseed() : seed, 3), key);

  // Use the seed to initialize an ARC4 generator.
  var arc4 = new ARC4(key);

  // This function returns a random double in [0, 1) that contains
  // randomness in every bit of the mantissa of the IEEE 754 value.
  var prng = function() {
    var n = arc4.g(chunks),             // Start with a numerator n < 2 ^ 48
        d = startdenom,                 //   and denominator d = 2 ^ 48.
        x = 0;                          //   and no 'extra last byte'.
    while (n < significance) {          // Fill up all significant digits by
      n = (n + x) * width;              //   shifting numerator and
      d *= width;                       //   denominator and generating a
      x = arc4.g(1);                    //   new least-significant-byte.
    }
    while (n >= overflow) {             // To avoid rounding up, before adding
      n /= 2;                           //   last byte, shift everything
      d /= 2;                           //   right using integer math until
      x >>>= 1;                         //   we have exactly the desired bits.
    }
    return (n + x) / d;                 // Form the number within [0, 1).
  };

  prng.int32 = function() { return arc4.g(4) | 0; }
  prng.quick = function() { return arc4.g(4) / 0x100000000; }
  prng.double = prng;

  // Mix the randomness into accumulated entropy.
  mixkey(tostring(arc4.S), pool);

  // Calling convention: what to return as a function of prng, seed, is_math.
  return (options.pass || callback ||
      function(prng, seed, is_math_call, state) {
        if (state) {
          // Load the arc4 state from the given state if it has an S array.
          if (state.S) { copy(state, arc4); }
          // Only provide the .state method if requested via options.state.
          prng.state = function() { return copy(arc4, {}); }
        }

        // If called as a method of Math (Math.seedrandom()), mutate
        // Math.random because that is how seedrandom.js has worked since v1.0.
        if (is_math_call) { math[rngname] = prng; return seed; }

        // Otherwise, it is a newer calling convention, so return the
        // prng directly.
        else return prng;
      })(
  prng,
  shortseed,
  'global' in options ? options.global : (this == math),
  options.state);
}
math['seed' + rngname] = seedrandom;

//
// ARC4
//
// An ARC4 implementation.  The constructor takes a key in the form of
// an array of at most (width) integers that should be 0 <= x < (width).
//
// The g(count) method returns a pseudorandom integer that concatenates
// the next (count) outputs from ARC4.  Its return value is a number x
// that is in the range 0 <= x < (width ^ count).
//
function ARC4(key) {
  var t, keylen = key.length,
      me = this, i = 0, j = me.i = me.j = 0, s = me.S = [];

  // The empty key [] is treated as [0].
  if (!keylen) { key = [keylen++]; }

  // Set up S using the standard key scheduling algorithm.
  while (i < width) {
    s[i] = i++;
  }
  for (i = 0; i < width; i++) {
    s[i] = s[j = mask & (j + key[i % keylen] + (t = s[i]))];
    s[j] = t;
  }

  // The "g" method returns the next (count) outputs as one number.
  (me.g = function(count) {
    // Using instance members instead of closure state nearly doubles speed.
    var t, r = 0,
        i = me.i, j = me.j, s = me.S;
    while (count--) {
      t = s[i = mask & (i + 1)];
      r = r * width + s[mask & ((s[i] = s[j = mask & (j + t)]) + (s[j] = t))];
    }
    me.i = i; me.j = j;
    return r;
    // For robust unpredictability, the function call below automatically
    // discards an initial batch of values.  This is called RC4-drop[256].
    // See http://google.com/search?q=rsa+fluhrer+response&btnI
  })(width);
}

//
// copy()
// Copies internal state of ARC4 to or from a plain object.
//
function copy(f, t) {
  t.i = f.i;
  t.j = f.j;
  t.S = f.S.slice();
  return t;
};

//
// flatten()
// Converts an object tree to nested arrays of strings.
//
function flatten(obj, depth) {
  var result = [], typ = (typeof obj), prop;
  if (depth && typ == 'object') {
    for (prop in obj) {
      try { result.push(flatten(obj[prop], depth - 1)); } catch (e) {}
    }
  }
  return (result.length ? result : typ == 'string' ? obj : obj + '\0');
}

//
// mixkey()
// Mixes a string seed into a key that is an array of integers, and
// returns a shortened string seed that is equivalent to the result key.
//
function mixkey(seed, key) {
  var stringseed = seed + '', smear, j = 0;
  while (j < stringseed.length) {
    key[mask & j] =
      mask & ((smear ^= key[mask & j] * 19) + stringseed.charCodeAt(j++));
  }
  return tostring(key);
}

//
// autoseed()
// Returns an object for autoseeding, using window.crypto and Node crypto
// module if available.
//
function autoseed() {
  try {
    var out;
    if (nodecrypto && (out = nodecrypto.randomBytes)) {
      // The use of 'out' to remember randomBytes makes tight minified code.
      out = out(width);
    } else {
      out = new Uint8Array(width);
      (global.crypto || global.msCrypto).getRandomValues(out);
    }
    return tostring(out);
  } catch (e) {
    var browser = global.navigator,
        plugins = browser && browser.plugins;
    return [+new Date, global, plugins, global.screen, tostring(pool)];
  }
}

//
// tostring()
// Converts an array of charcodes to a string
//
function tostring(a) {
  return String.fromCharCode.apply(0, a);
}

//
// When seedrandom.js is loaded, we immediately mix a few bits
// from the built-in RNG into the entropy pool.  Because we do
// not want to interfere with deterministic PRNG state later,
// seedrandom will not call math.random on its own again after
// initialization.
//
mixkey(math.random(), pool);

//
// Nodejs and AMD support: export the implementation as a module using
// either convention.
//
if ((typeof module) == 'object' && module.exports) {
  module.exports = seedrandom;
  // When in node.js, try using crypto package for autoseeding.
  try {
    nodecrypto = require('crypto');
  } catch (ex) {}
} else if ((typeof define) == 'function' && define.amd) {
  define(function() { return seedrandom; });
}

// End anonymous scope, and pass initial values.
})(
  [],     // pool: entropy pool starts empty
  Math    // math: package containing random, pow, and seedrandom
);

},{"crypto":47}],43:[function(require,module,exports){
const print = require('./utils').print;
const math = require('./math');
const seedrandom = require('seedrandom');
const RNN = require('./rnn');

let rng = seedrandom(1234);

const TRAIN_NUM = 30;  // time sequence
const TEST_NUM = 10;
const N_IN = 1;
const N_HIDDEN = 4;
const N_OUT = 1;
const TRUNCATED_TIME = 4;
const LEARNING_RATE = 0.01;
const EPOCHS = 100;

let tr_set = gen_set(TRAIN_NUM);
let te_set = gen_set(TEST_NUM).x;
let app = document.getElementById("app");
let tr_x = document.getElementById('tr_x')
let te_x = document.getElementById('te_x')
let tr_y = document.getElementById('tr_y')
let te_y = document.getElementById('te_y')
let classifier = new RNN(N_IN, N_HIDDEN, N_OUT, TRUNCATED_TIME, LEARNING_RATE, math.fn.tanh, rng);

function gen_tr() {

  tr_set = gen_set(TRAIN_NUM);

  tr_x.innerHTML = ""
  tr_y.innerHTML = ""

  tr_set.x.forEach(function (ts) {

    var a = document.createElement('a')
    a.innerHTML = " "
    a.style = "display:inline-block;height:" + (80 + 30 * ts) + "px;width:5px;background:#00c853;margin:1px;border-radius:3px;"
    tr_x.appendChild(a)

  })

  tr_set.y.forEach(function (ts) {

    var a = document.createElement('a')
    a.innerHTML = " "
    a.style = "display:inline-block;height:" + (80 + 30 * ts) + "px;width:5px;background:#00c853;margin:1px;border-radius:3px;"
    tr_y.appendChild(a)

  })


}

function gen_te() {

  te_set = gen_set(TEST_NUM).x;
  te_x.innerHTML =""
  te_set.forEach(function (ts) {
    var a = document.createElement('a')
    a.innerHTML = " "
    a.style = "display:inline-block;height:" + (80 + 30 * ts) + "px;width:5px;background:#00c853;margin:1px;border-radius:3px;"
    te_x.appendChild(a)

  })


}

function predict() {

  classifier = new RNN(N_IN, N_HIDDEN, N_OUT, TRUNCATED_TIME, LEARNING_RATE, math.fn.tanh, rng)

  for (let epoch = 0; epoch < EPOCHS; epoch++) {
    classifier.train(tr_set.x, tr_set.y);
  }

  let output = null;
  let set = te_set.map((a)=>a)
  for (let i = 0; i < 50; i++) {
    output = classifier.predict(set);
    set.push(output[output.length - 1]);
  }
  let res = []
  for (let i = TEST_NUM; i < set.length - 1; i++) {
    print(output[i][0])
    res.push(output[i][0]);
  }
  te_y.innerHTML=""
  print(te_set.length)
  res.forEach(function (ts) {
    var a = document.createElement('a')
    a.innerHTML = " "
    a.style = "display:inline-block;height:" + (80 + 30 * ts) + "px;width:5px;background:#00c853;margin:1px;border-radius:3px;"
    te_y.appendChild(a)
  })

}

function gen_set(dataNum) {
  let x = [];  // sin wave + noise [0, t]
  let y = [];  // t + 1
  const TIME_STEP = 0.1;

  let noise = () => {
    return 0.1 * math.random.uniform(-1, 1, rng);
  }

  for (let i = 0; i < dataNum + 5; i++) {
    let _t = i * TIME_STEP;
    let _sin = Math.sin(_t * Math.PI);
    x[i] = [_sin + noise()];

    if (i > 4) {
      y[i - 5] = x[i];
    }
  }
  for(let i=0;i<5;i++){
    x.pop();
  }
  
  return {
    x: x,
    y: y
  };
}



function init() {

  var tr = document.getElementById("gen_tr");
  var te = document.getElementById("gen_te");
  var prd = document.getElementById("predict");
  tr.onclick = gen_tr;
  te.onclick = gen_te;
  prd.onclick = predict;

}

init()


},{"./math":18,"./rnn":44,"./utils":45,"seedrandom":35}],44:[function(require,module,exports){
const math = require('./math');

class RNN {
  constructor(num_input, num_hidden, num_output, short_time = 3, rate = 0.1, activation = math.fn.tanh, rng = Math.random) {
    this.num_input = num_input;
    this.num_hidden = num_hidden;
    this.num_output = num_output;
    this.short_time = short_time;
    this.rate = rate;
    this.activation = activation;

    // this._activationum_outputput = (num_output === 1) ? math.fn.sigmoid : math.fn.softmax;
    this.U = math.array.uniform(-Math.sqrt(1/num_input), Math.sqrt(1/num_input), rng, [num_hidden, num_input]);  // input -> hidden
    this.V = math.array.uniform(-Math.sqrt(1/num_hidden), Math.sqrt(1/num_hidden), rng, [num_output, num_hidden]);  // hidden -> output
    this.W = math.array.uniform(-Math.sqrt(1/num_hidden), Math.sqrt(1/num_hidden), rng, [num_hidden, num_hidden]);  // hidden -> hidden

    this.b = math.array.zeros(num_hidden);  // hidden bias
    this.c = math.array.zeros(num_output);  // output bias
  }

  // x: number[][]  ( number[time][index] )
  forward_propagation(x) {
    let t_length = x.length;

    let s = math.array.zeros(t_length, this.num_hidden);
    let u = math.array.zeros(t_length, this.num_hidden);
    let y = math.array.zeros(t_length, this.num_output);
    let v = math.array.zeros(t_length, this.num_output);

    for (let t = 0; t < t_length; t++) {
      let _st = (t === 0) ? math.array.zeros(this.num_hidden) : s[t - 1];
      u[t] = math.add(math.add(math.dot(this.U, x[t]), math.dot(this.W, _st)), this.b);
      s[t] = this.activation(u[t]);

      v[t] = math.add(math.dot(this.V, s[t]), this.c)
      // y[t] = this._activationum_outputput(this.v[t]);
      y[t] = math.fn.linear(v[t]);
    }

    return {
      s: s,
      u: u,
      y: y,
      v: v
    };
  }

  back_propagation(x, label) {
    let dU = math.array.zeros(this.num_hidden, this.num_input);
    let dV = math.array.zeros(this.num_output, this.num_hidden);
    let dW = math.array.zeros(this.num_hidden, this.num_hidden);
    let db = math.array.zeros(this.num_hidden);
    let dc = math.array.zeros(this.num_output);
    let t_length = x.length;
    let units = this.forward_propagation(x);
    let s = units.s;
    let u = units.u;
    let y = units.y;
    let v = units.v;
    // let eo = math.mul(math.sub(o, label), this._activationum_outputput.grad(this.v));
    let eo = math.mul(math.sub(y, label), math.fn.linear.grad(v));
    let eh = math.array.zeros(t_length, this.num_hidden);
    for (let t = t_length - 1; t >= 0; t--) {
      dV = math.add(dV, math.outer(eo[t], s[t]));
      dc = math.add(dc, eo[t]);
      eh[t] = math.mul(math.dot(eo[t], this.V), this.activation.grad(u[t]));
      for (let z = 0; z < this.short_time; z++) {
        if (t - z < 0) {
          break;
        }
        dU = math.add(dU, math.outer(eh[t - z], x[t - z]));
        db = math.add(db, eh[t - z]);

        if (t - z - 1 >= 0) {
          dW = math.add(dW, math.outer(eh[t - z], s[t - z - 1]));
          eh[t - z - 1] = math.mul(math.dot(eh[t - z], this.W), this.activation.grad(u[t - z - 1]));
        }
      }
    }
    return {
      grad: {
        U: dU,V: dV,W: dW,b: db,c: dc
      }
    };
  }

  train(x, label, rate) {
    rate = rate || this.rate;
    let grad = this.back_propagation(x, label).grad;

    this.U = math.sub(this.U, math.mul(rate, grad.U));
    this.V = math.sub(this.V, math.mul(rate, grad.V));
    this.W = math.sub(this.W, math.mul(rate, grad.W));
    this.b = math.sub(this.b, math.mul(rate, grad.b));
    this.c = math.sub(this.c, math.mul(rate, grad.c));
  }

  predict(x) {
    let units = this.forward_propagation(x);
    return units.y;
  }
}


module.exports = RNN;

},{"./math":18}],45:[function(require,module,exports){
module.exports = {
  print: require('./print'),
  // arrayInitializer: require('./arrayInitializer')
};

},{"./print":46}],46:[function(require,module,exports){
module.exports = function(...args) {
  for (let arg of args) {
    console.log(arg);
  }
}

},{}],47:[function(require,module,exports){

},{}]},{},[43]);
