const constants = require('../common/constants')
const featuresFunctions = require('../common/featuresFunctions')
const utils = require('../common/utils')
const fs = require('fs')

const samples = JSON.parse(fs.readFileSync(constants.SAMPLES))

for (const sample of samples) {
  const paths = JSON.parse(fs.readFileSync(`${constants.JSON_DIR}/${sample.id}.json`))

  const functions = featuresFunctions.inUse.map(f => f.function);
  sample.point = functions.map(f => f(paths));
}

const featureNames = featuresFunctions.inUse.map(f => f.name);

const trainingAmount = samples.length * 0.5;
const training = [];
const testing = [];
for (let i = 0; i < samples.length; ++i) {
  if (i < trainingAmount) {
    training.push(samples[i]);
  } else {
    testing.push(samples[i]);
  }
}

const minMax = utils.normalizePoints(training.map(s => s.point));

utils.normalizePoints(testing.map(s => s.point), minMax);

fs.writeFileSync(
  constants.FEATURES,
  JSON.stringify({
    featureNames, samples: samples.map(s => {
      return {point: s.point, label: s.label}
    })
  })
);

fs.writeFileSync(
  constants.FEATURES_JS,
  `const features = ${JSON.stringify({featureNames, samples})}`
);


fs.writeFileSync(
  constants.TRAINING,
  JSON.stringify({
    featureNames, samples: training.map(s => {
      return {point: s.point, label: s.label}
    })
  })
);

fs.writeFileSync(
  constants.TRAINING_JS,
  `const training = ${JSON.stringify({featureNames, samples: training})}`
);

fs.writeFileSync(
  constants.TESTING,
  JSON.stringify({
    featureNames, samples: testing.map(s => {
      return {point: s.point, label: s.label}
    })
  })
);

fs.writeFileSync(
  constants.TESTING_JS,
  `const testing = ${JSON.stringify({featureNames, samples: testing})}`
);


fs.writeFileSync(constants.MIN_MAX_JS, `const minMax = ${JSON.stringify(minMax)}`);

