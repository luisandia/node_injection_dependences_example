const { attributes } = require('structure');

const P = attributes({
   nombre: String,
   edad: Number
})(class P {
});

module.exports = P;
