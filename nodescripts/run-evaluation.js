const constants = require('../common/constants');
const utils = require('../common/utils');

const KNN = require('../common/classifiers/knn.js');

const fs = require('fs');

console.log('Running classification...');

const {samples: trainingSamples} = JSON.parse(fs.readFileSync(constants.TRAINING));
const kNN = new KNN(trainingSamples, 50);

const {samples: testingSamples} = JSON.parse(fs.readFileSync(constants.TESTING));

let totalCount = 0, correctCount = 0;
for (const sample of testingSamples) {
  const {label: predicatedLabel} = kNN.predict(sample.point);
  correctCount += predicatedLabel === sample.label ? 1 : 0;
  totalCount++;
}

console.log(`Accuracy: 
${correctCount}/${totalCount} (${utils.formatPercent(correctCount / totalCount)})`);

console.log('Generating Decision Boundary...');

const {createCanvas} = require('canvas');
const canvas = createCanvas(100, 100);
const ctx = canvas.getContext('2d');

for (let x = 0; x < canvas.width; ++x) {
  for (let y = 0; y < canvas.height; ++y) {
    const point = [
      x / canvas.width,
      1 - y / canvas.height
    ];
    const {label} = kNN.predict(point);
    const color = utils.styles[label].color;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 1, 1);
  }
}

const buffer = canvas.toBuffer("image/png");
fs.writeFileSync(constants.DECISION_BOUNDARY, buffer);

console.log('Done');
