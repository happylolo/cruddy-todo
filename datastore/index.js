const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

// Create: saving new todos on the hard drive
exports.create = (text, callback) => {
  // Old sync code:
  // var id = counter.getNextUniqueId();
  // items[id] = text;
  // callback(null, { id, text });

  // Async Code:
  counter.getNextUniqueId((err, id) => {
    let filePath = path.join(exports.dataDir, `${id}.txt`);
    // fs.writeFile(file, data[, options], callback)
    // Reference: https://nodejs.org/api/fs.html#fs_fs_writefile_file_data_options_callback
    fs.writeFile(filePath, text, (err) => {
      if (err) {
        callback(err);
      } else {
        // {id, text} is an ES6 syntax to make an object.
        callback(null, { id, text });
      }
    });
  });
};

exports.readAll = (callback) => {
  // Old sync code:
  // var data = _.map(items, (text, id) => {
  //   return { id, text };
  // });
  // callback(null, data);

  // Async Code:
  // fs.readdir(path[, options], callback)
  // Reference: https://nodejs.org/api/fs.html#fs_fs_readdir_path_options_callback
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      return callback(err, null);
    }

    let data = _.map(files, (file) => {
      // The file may looks like /Users/Miaozhen.Zhang@ibm.com/Documents/Github/Projects/cruddy-todo/test/testData/00001.txt. And the last piece: 00001.txt is called "base file name". All the things in front of it is called "path" to that file.
      // Reference: https://nodejs.org/api/path.html#path_path_basename_path_ext
      // If we pass ".txt" as the second parameter, path.basename will extract the piece in front of ".txt"
      let id = path.basename(file, '.txt');

      // According to the learning app, use the message's id (that you identified from the filename) for both the id field and the text field for now.
      return {
        id: id,
        text: id,
      };

      callback(err, data);
    });
  });
};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
