var path = require('path');
var rootPath = path.normalize(__dirname + '/../../');

module.exports = {
  development: {
    db: 'mongodb://localhost/test', //TODO substitute for real DB
    rootPath: rootPath,
    port: 3000
  }
}
