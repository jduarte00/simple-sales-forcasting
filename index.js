let SimpleLinearRegression = require("ml-regression-simple-linear");

//Function to sum the numbers in an array in function of a given number

function sumTheNumbers(data, top, start) {
  let sum = 0;
  for (let i = start; i <= top; i++) {
    sum += data[i];
  }
  return sum;
}

//Function to get an array with the moving averages
function getMovingAverages(data, sizeOfGroup) {
  let arrayOfMovingAverages = [];
  //Handle even groups
  let startingPoint = sizeOfGroup - 1;
  for (let i = startingPoint; i < data.length; i++) {
    /* const sumOfElements = (data[i-3] + data[i-2] + data[i-1] + data[i]); */
    /* arrayOfMovingAverages.push(sumOfElements/sizeOfGroup); */
    arrayOfMovingAverages.push(
      sumTheNumbers(data, i, i - (sizeOfGroup - 1)) / sizeOfGroup
    );
  }

  if (sizeOfGroup % 2 === 0) {
    let oldArray = [...arrayOfMovingAverages];
    arrayOfMovingAverages = [];
    for (let i = 1; i < oldArray.length; i++) {
      const sumOfElements = oldArray[i - 1] + oldArray[i];
      arrayOfMovingAverages.push(sumOfElements / 2);
    }
  }

  return arrayOfMovingAverages;
}

//Function to get the seasonality and irregularity of a series
function getSeasonalityAndIrregularity(data, sizeOfGroup, movingAverages) {
  let startingPoint;
  if (sizeOfGroup % 2 === 0) {
    startingPoint = sizeOfGroup / 2;
  } else {
    startingPoint = Math.floor(sizeOfGroup / 2);
  }

  let seasonalityAndIrregularityArray = movingAverages.map((item, index) => {
    return data[startingPoint + index] / item;
  });

  return seasonalityAndIrregularityArray;
}

//Function to get only the seasonality of a series
function getOnlySeasonality(seasonalityPlusIrregularity, sizeOfGroup) {
  let seasonality = {};
  let seasonalityFinal = {};
  let sumReducer = (total, sum) => {
    return total + sum;
  };
  let startingPoint = sizeOfGroup - 1;
  for (let i = 0; i < seasonalityPlusIrregularity.length; i++) {
    let indexToPoint = (startingPoint + i) % sizeOfGroup;

    if (seasonality[indexToPoint]) {
      seasonality[indexToPoint].push(seasonalityPlusIrregularity[i]);
    } else {
      seasonality[indexToPoint] = [];
      seasonality[indexToPoint].push(seasonalityPlusIrregularity[i]);
    }
  }

  for (let i = 0; i < Object.keys(seasonality).length; i++) {
    if (i === 0) {
      seasonalityFinal[sizeOfGroup] =
        seasonality[i].reduce(sumReducer) / seasonality[i].length;
    } else {
      seasonalityFinal[i] =
        seasonality[i].reduce(sumReducer) / seasonality[i].length;
    }
  }
  return seasonalityFinal;
}

//Function to deseasonlize a serie
function deseasonalizeSeries(data, seasonality) {
  const seasonalityValues = Object.values(seasonality);

  const deseasonalizedSeries = data.map((item, index) => {
    const correspondingPeriod = index % seasonalityValues.length;
    return item / seasonality[(index % seasonalityValues.length) + 1];
  });
  return deseasonalizedSeries;
}

//Function to get the time stamps of the predictions on an Array
function getArrayToPredict(actualLength, numberOfPredictions) {
  const arrayOfResults = [];
  for (let i = 1; i <= numberOfPredictions; i++) {
    arrayOfResults.push(actualLength + i);
  }
  return arrayOfResults;
}

//Function to get the predictions in an array
function getPredictionArray(
  numberOfPredictions,
  sesonality,
  regression,
  currentLength
) {
  const numberOfGroups = Object.values(sesonality).length;
  const predictionArray = [];
  for (let i = 1; i <= numberOfPredictions; i++) {
    const numberPredicted = currentLength + i;
    let regressionPrediction = regression.predict(numberPredicted);
    let assignedGroup = 0;
    if (numberPredicted % numberOfGroups === 0) {
      assignedGroup = 4;
    } else {
      assignedGroup = numberPredicted % numberOfGroups;
    }
    predictionArray.push(regressionPrediction * sesonality[assignedGroup]);
  }
  return predictionArray;
}

// Final exposed function

module.exports = function makePrediction(
  data,
  numberOfPredictions = 1,
  sizeOfGroup = 4
) {
  //Simple and minimal error handling

  if (typeof data !== "object" || !data.length) {
    throw new Error("data should be an array");
  } else if (data.length <= 2) {
    throw new Error(
      "You should provide at least two values in your data to be able to forecast new data"
    );
  } else if (data.length < sizeOfGroup) {
    throw new Error(
      "Your data should at least be equal to the size of the group"
    );
  }

  //Get an array of the moving averages of the data
  //If the number of observartions is even, this function will calculate te Central Moving Average too.
  const movingAveragesArray = getMovingAverages(data, sizeOfGroup);

  //Get an array with the seasonality and the irregularity together (St + It)
  const seasonalityAndIrregularityArray = getSeasonalityAndIrregularity(
    data,
    sizeOfGroup,
    movingAveragesArray
  );

  //Isolate the seasonality and get an object with the specific seasonality for each period
  const seasonalityOnly = getOnlySeasonality(
    seasonalityAndIrregularityArray,
    sizeOfGroup
  );

  //Get the "clean" data set with the seasonality component removed
  const deseaosonalizedSeries = deseasonalizeSeries(data, seasonalityOnly);

  // Get the time labels
  const timeLabels = data.map((item, index) => {
    return index + 1;
  });

  // Use the "ml-regression-simple-linear" module to make a simple linear regression on the deseaosonalized Series

  const regression = new SimpleLinearRegression(
    timeLabels,
    deseaosonalizedSeries
  );

  //get an Array with the Time Labels for the prediction series
  const arrayOfTimeToPredict = getArrayToPredict(
    timeLabels.length,
    numberOfPredictions
  );

  const predictedArray = getPredictionArray(
    numberOfPredictions,
    seasonalityOnly,
    regression,
    timeLabels.length
  );

  const response = {
    time: arrayOfTimeToPredict,
    predictions: predictedArray
  };

  return response;
};
