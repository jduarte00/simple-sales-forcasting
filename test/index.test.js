const simpleSalesForcasting = require("../index");

const asnwerOne = simpleSalesForcasting(
  [
    4.8,
    4.1,
    6.0,
    6.5,
    5.8,
    5.2,
    6.8,
    7.4,
    6.0,
    5.6,
    7.5,
    7.8,
    6.3,
    5.9,
    8.0,
    8.4
  ],
  1,
  4
);

console.log("Starting test...");
//Check that the procedure is working with the correct mathemathical rules and is producing accurate forecasting

if (Math.floor(asnwerOne.predictions[0]) !== 7) {
  throw new Error("Module is not producint accurate results");
}

//Check that the result contains two arrays with at least one result
if (
  typeof asnwerOne !== "object" ||
  asnwerOne.predictions.length < 1 ||
  asnwerOne.time.length < 1
) {
  throw new Error(
    "Module is not returning an array with the forecasted values"
  );
}

//Check if all the results in an array are numbers
asnwerOne.predictions.forEach(item => {
  if (isNaN(item)) {
    throw new Error("Predicitions are not numbers");
  }
});

// Check if error handling is working correctly...

//...if given a value different from an array
let ranWithoutError = false;

try {
  simpleSalesForcasting("string");
  simpleSalesForcasting({});
  simpleSalesForcasting([1]);
  simpleSalesForcasting([]);
  ranWithoutError = true;
} catch (err) {
  if (err.__proto__.name !== "Error") {
    throw new Error("Error handling is not working correctly");
  }
}

if (ranWithoutError) {
  throw new Error("Error handling not triggered");
}

console.log("Test passed succesfully :)");
