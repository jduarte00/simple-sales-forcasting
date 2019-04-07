# Simple-Sales-Forecasting

## What it does

A simple and lightweight library to forecast sales that represent a time series.

## How to use it

Just import the module and run the imported function passing three arguments:

- An array with all the sales figures.
- The number of predicted values that you want.
- The number of items that a cycle last (in the case of sales monthly figures, a cycle last 4 months).

The function will return an object with two arrays, _time_, that contains the number of the month of the forecasted values, and _predictions_, that contains the forecasted values.

## Typical Example

```javascript
const forecastedValuesObject =
  simple -
  sales -
  forecasting(
    [13409, 29389, 128940, 490059, 290394, 1928904, 3892019, 2903945],
    2,
    4
  );

/* forecastedValuesObject will contain the following object
{time: [9,10],
predictions: [1119417.565906914, 5144032.282721207]
This means that the 9 month have a forecasted sales figure of $1,119,417 and the 10 month have a forecasted sales figure fo $5,144,032
} */
```
