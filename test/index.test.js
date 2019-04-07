const simpleSalesForcasting = require("../index");

const asnwerOne = simpleSalesForcasting([1, 2, 3, 4, 5, 6], 1, 2);

//Check that the result contains two arrays with at least one result
if (
  typeof asnwerOne !== "object" ||
  asnwerOne.predictions.length < 1 ||
  asnwerOne.time.length < 1
) {
  throw new Error(
    "Package is not returning an array with the forecasted values"
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
