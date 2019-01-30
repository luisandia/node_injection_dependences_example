//var structure = require("structure");
const { attributes } = require('structure');
const P = require('./P');

const Empresa = attributes({
  f:{
    type: Number
  },
  pes: {
  	type : Array,
    itemType: P,
    minLength: 3
    }
})(class Empresa {
});

module.exports = Empresa;
