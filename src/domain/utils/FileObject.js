const { attributes } = require('structure');

const FileObject = attributes({
  fieldName: {
    type: String,
    required: true
  },
  originalFilename: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  }
})(class FileObject {

  getPath() {
    return this.path;
  }
});

module.exports = FileObject;
