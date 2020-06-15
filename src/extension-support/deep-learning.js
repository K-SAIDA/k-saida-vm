const timeFormatter = require('../util/time-formatter');

const tf = require('@tensorflow/tfjs');
require('regenerator-runtime');

class TensorModel {

  constructor(model) {
    this.model = model;
    this.loaded = (model != undefined);
  }

  import(event) {
    return tf.loadLayersModel(
      tf.io.browserFiles(
      [
        (event.target.files[0].name.split('.json').length == 2) ? event.target.files[0] : event.target.files[1], 
        (event.target.files[1].name.split('.bin').length == 2) ? event.target.files[1] : event.target.files[0],
      ]
    ));
  }

  export(storage, file, reject) {
    return this.model.save(`downloads://${file}`).then((result) => console.log('Export model:', storage, result))
  }

  setTrainData(x_train, y_train) {
    this.x_train = tf.tensor2d(x_train);
    this.y_train = tf.tensor2d(y_train);
  }

  setTrainImageData(x_train, y_train, axis) {
    this.x_train = tf.concat(x_train, axis);
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

  addConv2d(input_shape, kernel_size, filters, activation) {
    if (!this.model)
      return new Error('해당 블록은 setSequential() 블록과 함께 사용되어야 합니다.');

    this.model.add(tf.layers.conv2d({ inputShape: input_shape, kernelSize: kernel_size, filters: filters, activation: activation }));
  }

  addConv2dNoShape(kernel_size, filters, activation) {
    if (!this.model)
      return new Error('해당 블록은 setSequential() 블록과 함께 사용되어야 합니다.');

    this.model.add(tf.layers.conv2d({ kernelSize: kernel_size, filters: filters, activation: activation }));
  }

  addMaxPooling2d(pool_size, strides) {
    if (!this.model)
      return new Error('해당 블록은 setSequential() 블록과 함께 사용되어야 합니다.');

    this.model.add(tf.layers.maxPooling2d({poolSize: pool_size, strides: strides}));
  }

  addFlatten() {
    if (!this.model)
      return new Error('해당 블록은 setSequential() 블록과 함께 사용되어야 합니다.');

    this.model.add(tf.layers.flatten());
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

 trainModel(batch_size = 1, epochs = 100, shuffle = true, metrics = 'meanSquaredError', reject) {

  if (!this.x_train || !this.y_train || !(this.model || this.customModel) || !this.optimizer || !this.loss)
    return reject({ error: false, message: '오류: 학습을 위한 선행 작업이 완료되지 않았습니다.\n블록 위치: 모델 학습' });

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

  const startTime = new Date().getTime();
  return this.model.fit(this.x_train, this.y_train, {
    batchSize: batch_size,
    epochs: epochs,
    shuffle: shuffle,
    callbacks: [{
      onEpochBegin: (epoch) => {
        const percentage = Math.round(epoch / epochs * 100);
        const remainTime = Math.round(((new Date().getTime() - startTime) / percentage) * (100 - percentage) / 1000);
        document.body.children[4].children[0].children[3].children[0].children[2].children[0].children[0].innerText = `진행률: ${percentage}%...(남은 시간: ${timeFormatter(remainTime)})`;
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
  })
  .catch((e) => reject({ error: true, message: e }));
 }

  predict(x_pred) {
    return x_pred.map((v) => this.model.predict(tf.tensor2d([v])).dataSync())
  }

  classify(data, axis) {
    return tf.tidy(() => Array.from(this.model.predict(data).argMax(axis).dataSync()));
  }
}

module.exports = {
  TensorModel: TensorModel
}