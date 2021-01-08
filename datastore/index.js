const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

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
      throw ('error reading dataDir');
    } else {
      let idArray = files.map((fileName) => {
        let removed = fileName.replace('.txt', '');
        return ({id: removed, text: removed});
      });
      callback(null, idArray);
    }
  });
};

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
