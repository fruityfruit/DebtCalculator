var path = require('path');
var rootPath = path.normalize(__dirname + '/../../');

module.exports = {
  development: {
    db: 'mongodb://localhost/debtDB',
    rootPath: rootPath,
    port: 3000
  }
}
