const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;

var counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

const readCounter = (callback) => {
  fs.readFile(exports.counterFile, (err, fileData) => {
    if (err) {
      // If nothing exists on the hard drive, we'll assume that the value is 0.
      callback(null, 0);
    } else {
      // Otherwise, get the number in fileData.
      callback(null, Number(fileData));
    }
  });
};

const writeCounter = (count, callback) => {
  var counterString = zeroPaddedNumber(count);
  fs.writeFile(exports.counterFile, counterString, (err) => {
    if (err) {
      throw ('error writing counter');
    } else {
      callback(null, counterString);
    }
  });
};

// Public API - Fix this function //////////////////////////////////////////////

exports.getNextUniqueId = (callback) => {
  // // Sync version:
  // // Fetch the old counter from the hard drive.
  // let counter = readCounter();
  // // Increment the counter.
  // counter += 1;
  // // Write the new counter back to the hard drive.
  // writeCounter(counter);
  // return zeroPaddedNumber(counter);

  // Why not the above sync version? Because writeCounter and readCounter are not synchronous functions, we cannot guarantee they return the actual counter value. So we need to turn this into asynchronous code:
  readCounter((err, currentCount) => {
    writeCounter(currentCount + 1, (err, uniqueId) => {
      // In writeCounter, we have zeroPaddedNumber(count)
      callback(err, uniqueId);
      // No need to handle err here because readCounter and writeCounter already did that.
    });
  });
};

// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');
