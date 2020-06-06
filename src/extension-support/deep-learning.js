const tf = require('@tensorflow/tfjs');

class FeedforwardNueralNetwork {

  constructor() {
    this.test;
  }

  setTrainData(x_train, y_train) {
    this.x_train = tf.tensor2d(x_train);
    this.y_train = tf.tensor2d(y_train);
  }
  
  setSequential() {
    if (!this.x_train || !this.y_train)
      return new Error('해당 블록은 settf.trainData(x_train, y_train, is_2d) 다음에 와야합니다.');

    this.model = tf.sequential();
  }

  addDense(input_shape, units = 1, useBias = true, activation) {
    if (!this.model)
      return new Error('해당 블록은 setSequential() 블록과 함께 사용되어야 합니다.');

    this.model.add(tf.layers.dense({ inputShape: input_shape, activation: activation, units: units, useBias: useBias }));
  }

  addDenseNoShape(units = 1, useBias = true, activation) {
    if (!this.model)
      return new Error('해당 블록은 setSequential() 블록과 함께 사용되어야 합니다.');

    this.model.add(tf.layers.dense({ activation: activation, units: units, useBias: useBias }));
  }

  setLosses(type = 'meanSquaredError') {
    if (!this.x_train || !this.y_train)
      return new Error('해당 블록은 settf.trainData(x_train, y_train, is_2d) 다음에 올 수 있습니다.');

    switch (type) {
      case 'absoluteDifference':
        this.loss = tf.losses.absoluteDifference;
        break;
      case 'computeWeightedLoss':
        this.loss = tf.losses.computeWeightedLoss;
        break;
      case 'cosineDistance':
        this.loss = tf.losses.cosineDistance;
        break;
      case 'hingeLoss':
        this.loss = tf.losses.hingeLoss;
        break;
      case 'huberLoss':
        this.loss = tf.losses.huberLoss;
        break;
      case 'logLoss':
        this.loss = tf.losses.logLoss;
        break;
      case 'meanSquaredError':
        this.loss = tf.losses.meanSquaredError;
        break;
      case 'sigmoidCrossEntropy':
        this.loss = tf.losses.sigmoidCrossEntropy;
        break;
      case 'softmaxCrossEntropy':
        this.loss = tf.losses.softmaxCrossEntropy;
        break;
      case 'binaryAccuracy':
        this.loss = tf.metrics.binaryAccuracy;
        break;
      case 'binaryCrossentropy':
        this.loss = tf.metrics.binaryCrossentropy;
        break;
      case 'categoricalAccuracy':
        this.loss = tf.metrics.categoricalAccuracy;
        break;
      case 'categoricalCrossentropy':
        this.loss = tf.metrics.categoricalCrossentropy;
        break;
      case 'cosineProximity':
        this.loss = tf.metrics.cosineProximity;
        break;
      case 'meanAbsoluteError':
        this.loss = tf.metrics.meanAbsoluteError;
        break;
      case 'meanAbsolutePercentageError':
        this.loss = tf.metrics.meanAbsolutePercentageError;
        break;
      case 'sparseCategoricalAccuracy':
        this.loss = tf.metrics.sparseCategoricalAccuracy;
        break;
    }
  }

  setOptimizer(type = 'sgd', learning_rate = 1) {
    if (!this.x_train || !this.y_train)
      return new Error('해당 블록은 settf.trainData(x_train, y_train, is_2d) 다음에 올 수 있습니다.');

    switch (type) {
      case 'sgd':
        this.optimizer = tf.train.sgd(learning_rate);
        break;
      case 'rmsprop':
        this.optimizer = tf.train.rmsprop(learning_rate);
        break;
      case 'momentum':
        this.optimizer = tf.train.momentum(learning_rate);
        break;
      case 'adamax':
        this.optimizer = tf.train.adamax(learning_rate);
        break;
      case 'adam':
        this.optimizer = tf.train.adam(learning_rate);
        break;
      case 'adagrad':
        this.optimizer = tf.train.adagrad(learning_rate);
        break;
      case 'adadelta':
          this.optimizer = tf.train.adadelta(learning_rate);
          break;
    }
  }

 trainModel(batch_size = 1, epochs = 100, shuffle = true, metrics = 'meanSquaredError') {

  if (!this.x_train || !this.y_train || !(this.model || this.customModel) || !this.optimizer || !this.loss)
    return new Error('해당 블록은 predict(x_pred) 블록 바로 전에만 올 수 있습니다.');

  this.trainFlag = true;

  switch (metrics) {
    case 'bianryAccuracy':
      this.metrics = tf.metrics.binaryAccuracy;
      break;
    case 'binaryCrossentropy':
      this.metrics = tf.metrics.binaryCrossentropy;
      break;
    case 'categoricalAccuracy':
      this.metrics = tf.metrics.categoricalAccuracy;
      break;
    case 'categoricalCrossentropy':
      this.metrics = tf.metrics.categoricalCrossentropy;
      break;
    case 'cosineProximity':
      this.metrics = tf.metrics.cosineProximity;
      break;
    case 'meanAbsoluteError':
      this.metrics = tf.metrics.meanAbsoluteError;
      break;
    case 'meanAbsolutePercentageError':
      this.metrics = tf.metrics.meanAbsolutePercentageError;
      break;
    case 'meanSquaredError':
      this.metrics = tf.metrics.meanSquaredError;
      break;
    case 'precision':
      this.metrics = tf.metrics.precision;
      break;
    case 'recall':
      this.metrics = tf.metrics.recall;
      break;
    case 'sparseCategoricalAccuracy':
      this.metrics = tf.metrics.sparseCategoricalAccuracy;
      break;
  }

  this.model.compile({
    optimizer: this.optimizer,
    loss: this.loss,
    metrics: ['accuracy']
  });

  return this.model.fit(this.x_train, this.y_train, {
    batchSize: batch_size,
    epochs: epochs,
    shuffle: shuffle,
    callbacks: [{
      onEpochBegin: (epoch) => {
        document.body.children[4].children[0].children[3].children[0].children[2].children[0].children[0].innerText = `${Math.round(epoch / epochs * 100)}%...`;
      }
    }]
  }).then(history => {
    this.info = {
      input: {
        x: this.x_train,
        y: this.y_train
      },
      loss: this.loss,
      optimizer: this.optimizer,
      batchSize: batch_size,
      epochs: epochs,
      shuffle: shuffle,
      history: history
    }
    this.trainFlag = false;
  });
 }

 predict(x_pred) {
   return x_pred.map((v) => this.model.predict(tf.tensor2d([v])).dataSync())
 }
}

module.exports = {
  FFNN: FeedforwardNueralNetwork
}