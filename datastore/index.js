const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');
const readFilePromise = Promise.promisify(fs.readFile);

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    if (err) {
      throw ('could not create');
    } else {
      let fileName = `${exports.dataDir}/${id}.txt`;
      fs.writeFile(fileName, text, (err) => {
        if (err) {
          throw ('error writing to dataDir');
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      return callback(err);
    }
    var data = _.map(files, (file) => {
      var id = path.basename(file, '.txt');
      var filepath = path.join(exports.dataDir, file);
      return readFilePromise(filepath).then((fileData) => {
        return {
          id: id,
          text: fileData.toString()
        };
      });
    });
    Promise.all(data)
      .then((items) => {
        callback(null, items);
      });
  });
};

// exports.readAll = (callback) => {
//   // promise
//   // readdir
//   // Create an array of promises
//   // pass it to Promise.all([])
//   fs.readdir(exports.dataDir, (err, files) => {
//     if (err) {
//       callback(new Error(`No item with id: ${id}`));
//     } else {
//       var promise = new Promise((resolve, reject) => {
//         var array = [];
//         let idArray = files.map((fileName) => {
//           let removed = fileName.replace('.txt', '');
//           fs.readFile(removed, 'utf8', (err, data) => {
//             if (err) {
//               throw ('Cannot read file');
//             } else {
//               array.push({id: removed, text: data});
//             }
//           });
//         });
//         return array;
//       });
//       Promise.all(promise.then(values => {
//         callback(null, promise);
//       }));
//     }
//   });
// };

exports.readOne = (id, callback) => {
  let fileName = `${exports.dataDir}/${id}.txt`;
  fs.readFile(fileName, 'utf8', (err, data) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, { id, text: data });
    }
  });
};

exports.update = (id, text, callback) => {
  let fileName = `${exports.dataDir}/${id}.txt`;
  fs.readFile(fileName, 'utf8', (err, data) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(fileName, text, (err, data) => {
        if (err) {
          throw ('cannot write file');
        } else {
          callback(null, { id, text: data });
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  let fileName = `${exports.dataDir}/${id}.txt`;
  fs.unlink(fileName, (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback();
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};


