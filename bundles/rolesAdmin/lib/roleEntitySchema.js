var
  Validity = require('piton-validity'),
  validation = Validity.validation;

module.exports = {
  _id: {
  },
  name: {
    validators: {
      all: [validation.required]
    }
  },
  grants: {
    validators: {
      all: [validation.required]
    }
  },
  created: {
    defaultValue: function() { return new Date(); }
  }
};