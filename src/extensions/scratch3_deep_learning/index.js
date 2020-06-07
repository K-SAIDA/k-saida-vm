const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const formatMessage = require('format-message');

const { FFNN } = require('../../extension-support/deep-learning');
const { convertArrayToCSV } = require('convert-array-to-csv');

const blockIconURI = 'data:image/png;base64,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';

const BIAS = {
  ACTIVE: 'active',
  DEACTIVE: 'deactive'
}

const ACTIVATION = {
  ELU: 'elu',
  HARD_SIGMOID: 'hardSigmoid', 
  LINEAR: 'linear', 
  RELU: 'relu', 
  RELU6: 'relu6',  
  SELU: 'selu', 
  SIGMOID: 'sigmoid', 
  SOFTMAX: 'softmax', 
  SOFTPLUS: 'softplus', 
  SOFTSIGN: 'softsign', 
  TANH: 'tanh'
}

const LOSSES = {
  ABSOLUTE_DIFERRENCE: 'absoluteDifference', 
  COMPUTE_WEIGHT_LOSS: 'computeWeightedLoss', 
  COSINE_DISTANCE: 'cosineDistance', 
  HINGE_LOSS: 'hingeLoss', 
  HUBER_LOSS: 'huberLoss', 
  LOG_LOSS: 'logLoss', 
  MEAN_SQUARED_ERROR: 'meanSquaredError', 
  SIGMOID_CROSS_ENTROPY: 'sigmoidCrossEntropy', 
  SOFTMAX_CROSS_ENTROPY: 'softmaxCrossEntropy', 
  BINARY_CROSSENTROPY: 'binaryCrossentropy', 
  CATEGORICAL_CROSSENTROPY: 'categoricalCrossentropy', 
  COSINE_PROXIMITY: 'cosineProximity', 
  MEAN_ABSOLUTE_ERROR: 'meanAbsoluteError', 
  MEAN_ABSOLUTE_PERCENTAGE_ERROR: 'meanAbsolutePercentageError'
}

const OPTIMZER = {
  SGD: 'sgd',
  RMSPROP: 'rmsprop',
  MOMENTUM: 'momentum',
  ADAMAX: 'adamax',
  ADAM: 'adam',
  ADAGRAD: 'adagrad',
  ADADELTA: 'adadelta'
}

const SHUFFLE = {
  ACTIVE: 'active',
  DEACTIVE: 'deactive'
}

class Scratch3DeepLearningBlocks {

  static get EXTESNION_NAME() {
    return 'DeepLearning';
  }

  static get EXTENSION_ID() {
    return 'deepLearning';
  }

  constructor(runtime) {
    this.runtime = runtime;

    /**
     * 유저가 선언한 모델
     */
    this.model;
    
    /**
     * 유저가 선언한 함수
     */
    this.predict;
  }

  getInfo() {
    return {
      id: Scratch3DeepLearningBlocks.EXTENSION_ID,
      text: Scratch3DeepLearningBlocks.EXTESNION_NAME,
      blockIconURI: blockIconURI,
      showStatusButton: false,
      name: formatMessage({
        id: 'deepLearning.categoryName',
        default: 'Deep Learning',
        description: 'Label for the Deep Learning extension category'
      }),
      blocks: [
        {
          opcode: 'createFFNN',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'deepLearning.createFFNN',
            default: 'create feedforward neural network',
            description: 'create feedforward neural network'
          })
        },
        {
          opcode: 'setTrainData',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'deepLearning.setTrainData',
            default: 'set train data x_data [X_TRAIN] and y_data [Y_TRAIN]',
            description: 'create feedforward neural network'
          }),
          arguments: {
            X_TRAIN: {
              type: ArgumentType.STRING,
              defaultValue: ' ',
            },
            Y_TRAIN: {
              type: ArgumentType.STRING,
              defaultValue: ' ',
            }
          }
        },
        {
          opcode: 'setSequential',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'deepLearning.setSequential',
            default: 'set sequential to model',
            description: 'set sequential to model'
          })
        },
        {
          opcode: 'addDense',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'deepLearning.addDense',
            default: 'add dense to sequential with input shape [INPUT_SHAPE] units [UNITS] use bias [USE_BIAS] activation function [ACTIVATION]',
            description: 'add dense to sequential with options'
          }),
          arguments: {
            INPUT_SHAPE: {
              type: ArgumentType.STRING,
              defaultValue: ' '
            },
            UNITS: {
              type: ArgumentType.STRING,
              defaultValue: ' ',
            },
            USE_BIAS: {
              type: ArgumentType.STRING,
              menu: 'USE_BIAS',
              defaultValue: BIAS.ACTIVE
            },
            ACTIVATION: {
              type: ArgumentType.STRING,
              menu: 'ACTIVATION',
              defaultValue: ACTIVATION.LINEAR
            }
          }
        },
        {
          opcode: 'addDenseNoShape',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'deepLearning.addDenseNoShape',
            default: 'add dense to sequential with units [UNITS] use bias [USE_BIAS] activation function [ACTIVATION]',
            description: 'add dense to sequential without input shape'
          }),
          arguments: {
            UNITS: {
              type: ArgumentType.STRING,
              defaultValue: ' ',
            },
            USE_BIAS: {
              type: ArgumentType.STRING,
              menu: 'USE_BIAS',
              defaultValue: BIAS.ACTIVE
            },
            ACTIVATION: {
              type: ArgumentType.STRING,
              menu: 'ACTIVATION',
              defaultValue: ACTIVATION.LINEAR
            }
          }
        },
        {
          opcode: 'setLosses',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'deepLearning.setLosses',
            default: 'set losses function [LOSSES]',
            description: 'set losses function'
          }),
          arguments: {
            LOSSES: {
              type: ArgumentType.STRING,
              menu: 'LOSSES',
              defaultValue: LOSSES.MEAN_SQUARED_ERROR
            },
          }
        },
        {
          opcode: 'setOptimizer',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'deepLearning.setOptimizer',
            default: 'set optimizer function [OPTIMIZER] and learning rate [LEARNING_RATE]',
            description: 'set optimizer function'
          }),
          arguments: {
            OPTIMIZER: {
              type: ArgumentType.STRING,
              menu: 'OPTIMIZER',
              defaultValue: OPTIMZER.SGD
            },
            LEARNING_RATE: {
              type: ArgumentType.STRING,
              defaultValue: ' ',
            }
          }
        },
        {
          opcode: 'trainModel',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'deepLearning.trainModel',
            default: 'train model with batch size [BATCH_SIZE] epochs [EPOCHS] shuffle [SHUFFLE]',
            description: 'train model'
          }),
          arguments: {
            BATCH_SIZE: {
              type: ArgumentType.STRING,
              defaultValue: ' ',
            },
            EPOCHS: {
              type: ArgumentType.STRING,
              defaultValue: ' ',
            },
            SHUFFLE: {
              type: ArgumentType.STRING,
              menu: 'SHUFFLE',
              defaultValue: SHUFFLE.ACTIVE
            }
          }
        },
        {
          opcode: 'predict',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'deepLearning.predict',
            default: 'predict y at x [X_TEST]',
            description: 'predict y at x'
          }),
          arguments: {
            X_TEST: {
              type: ArgumentType.STRING,
              defaultValue: ' ',
            }
          }
        }
      ],
      menus: {
        ACTIVATION: this.ACTIVATION_MENU,
        OPTIMIZER: this.OPTIMIZER_MENU,
        LOSSES: this.LOSSES_MENU,
        USE_BIAS: this.BIAS_MENU,
        SHUFFLE: this.SHUFFLE_MENU,
      }
    };
  }

  createFFNN(args, util) {
    this._createFFNN(util);
  }

  _createFFNN(util) {
    this.model = new FFNN();
  }

  setTrainData(args, util) {
    this._setTrainData(args.X_TRAIN, args.Y_TRAIN, util);
  }

  _setTrainData(x_train, y_train, util) {
    try {
      x_train = x_train.split(' ').map(v => v.split(',').map(w => parseFloat(w)))
      y_train = y_train.split(' ').map(v => v.split(',').map(w => parseFloat(w)))
      this.model.setTrainData(x_train, y_train);
    }
    catch (e) {
      alert(e)
    }
  }

  /**
   * An array of info about each activation function.
   * @type {object[]}
   * @param {string} name
   */
  get ACTIVATION_MENU() {
    return [
      {
        text: formatMessage({
          id: 'deepLearning.activation.elu',
          default: '(1) Elu',
          description: 'Using elu activation function'
        }),
        value: ACTIVATION.ELU
      },
      {
        text: formatMessage({
          id: 'deepLearning.activation.hardSigmoid',
          default: '(2) Hard Sigmoid',
          description: 'Using hard sigmoid activation function'
        }),
        value: ACTIVATION.HARD_SIGMOID
      },
      {
        text: formatMessage({
          id: 'deepLearning.activation.linear',
          default: '(3) Linear',
          description: 'Using linear activation function'
        }),
        value: ACTIVATION.LINEAR
      },
      {
        text: formatMessage({
          id: 'deepLearning.activation.relu',
          default: '(4) Relu',
          description: 'Using relu activation function'
        }),
        value: ACTIVATION.RELU
      },
      {
        text: formatMessage({
          id: 'deepLearning.activation.relu6',
          default: '(5) Relu6',
          description: 'Using relu6 activation function'
        }),
        value: ACTIVATION.RELU6
      },
      {
        text: formatMessage({
          id: 'deepLearning.activation.selu',
          default: '(6) Selu',
          description: 'Using selu activation function'
        }),
        value: ACTIVATION.SELU
      }, 
      {
        text: formatMessage({
          id: 'deepLearning.activation.sigmoid',
          default: '(7) Sigmoid',
          description: 'Using sigmoid activation function'
        }),
        value: ACTIVATION.SIGMOID
      }, 
      {
        text: formatMessage({
          id: 'deepLearning.activation.softmax',
          default: '(8) Softmax',
          description: 'Using softmax activation function'
        }),
        value: ACTIVATION.SOFTMAX
      }, 
      {
        text: formatMessage({
          id: 'deepLearning.activation.softplus',
          default: '(9) Softplus',
          description: 'Using softplus activation function'
        }),
        value: ACTIVATION.SOFTPLUS
      },
      {
        text: formatMessage({
          id: 'deepLearning.activation.softsign',
          default: '(10) Softsign',
          description: 'Using softsign activation function'
        }),
        value: ACTIVATION.SOFTSIGN
      },
      {
        text: formatMessage({
          id: 'deepLearning.activation.tanh',
          default: '(11) Tanh',
          description: 'Using tanh activation function'
        }),
        value: ACTIVATION.TANH
      },
    ];
  }

  setSequential(args, util) {
    this._setSequential(util);
  }

  _setSequential(util) {
    try {
      this.model.setSequential();
    }
    catch (e) {
      alert(e)
    }
  }

  /**
   * An array of info about each optimizer function.
   * @type {object[]}
   * @param {string} name
   */
  get BIAS_MENU() {
    return [
      {
        text: formatMessage({
          id: 'deepLearning.bias.active',
          default: 'Active',
          description: 'active bias'
        }),
        value: BIAS.ACTIVE
      },
      {
        text: formatMessage({
          id: 'deepLearning.bias.deactive',
          default: 'Deactive',
          description: 'deactive bias'
        }),
        value: BIAS.DEACTIVE
      },
    ];
  }

  addDense(args, util) {
    this._addDense(args.INPUT_SHAPE, args.UNITS, args.USE_BIAS, args.ACTIVATION, util);
  }

  _addDense(input_shape, units, use_bias, activation, util) {
    try {
      this.model.addDense([parseInt(input_shape)], parseInt(units), use_bias == BIAS.ACTIVE, activation);
    }
    catch (e) {
      alert(e)
    }
  }

  addDenseNoShape(args, util) {
    this._addDenseNoShape(args.UNITS, args.USE_BIAS, args.ACTIVATION, util);
  }

  _addDenseNoShape(units, use_bias, activation, util) {
    try {
      this.model.addDenseNoShape(parseInt(units), use_bias == '1', activation);
    }
    catch (e) {
      alert(e)
    }
  }

  /**
   * An array of info about each losses function.
   * @type {object[]}
   * @param {string} name
   */
  get LOSSES_MENU() {
    return [
      {
        text: formatMessage({
          id: 'deepLearning.losses.absoluteDifference',
          default: '(1) Absolute Difference',
          description: 'Using absolute difference losses function'
        }),
        value: LOSSES.ABSOLUTE_DIFERRENCE
      },
      {
        text: formatMessage({
          id: 'deepLearning.losses.computeWeightedLoss',
          default: '(2) Compute Weighted Loss',
          description: 'Using compute weighted loss losses function'
        }),
        value: LOSSES.COMPUTE_WEIGHT_LOSS
      },
      {
        text: formatMessage({
          id: 'deepLearning.losses.cosineDistance',
          default: '(3) Cosine Distance',
          description: 'Using cosine distance losses function'
        }),
        value: LOSSES.COSINE_DISTANCE
      },
      {
        text: formatMessage({
          id: 'deepLearning.losses.hingeLoss',
          default: '(4) Hinge Loss',
          description: 'Using hinge loss losses function'
        }),
        value: LOSSES.HINGE_LOSS
      },
      {
        text: formatMessage({
          id: 'deepLearning.losses.huberLoss',
          default: '(5) Huber Loss',
          description: 'Using huber loss losses function'
        }),
        value: LOSSES.HUBER_LOSS
      },
      {
        text: formatMessage({
          id: 'deepLearning.losses.logLoss',
          default: '(6) Log Loss',
          description: 'Using log loss losses function'
        }),
        value: LOSSES.LOG_LOSS
      }, 
      {
        text: formatMessage({
          id: 'deepLearning.losses.meanSquaredError',
          default: '(7) Mean Squared Error',
          description: 'Using mean squared error losses function'
        }),
        value: LOSSES.MEAN_SQUARED_ERROR
      },
      {
        text: formatMessage({
          id: 'deepLearning.losses.sigmoidCrossEntropy',
          default: '(8) Sigmoid Cross Entropy',
          description: 'Using sigmoid cross entropy losses function'
        }),
        value: LOSSES.SIGMOID_CROSS_ENTROPY
      }, 
      {
        text: formatMessage({
          id: 'deepLearning.losses.softmaxCrossEntropy',
          default: '(9) Softmax Cross Entropy',
          description: 'Using softmax cross entropy losses function'
        }),
        value: LOSSES.SOFTMAX_CROSS_ENTROPY
      },
      {
        text: formatMessage({
          id: 'deepLearning.losses.binaryCrossentropy',
          default: '(10) Binary Crossentropy',
          description: 'Using binary cross entropy losses function'
        }),
        value: LOSSES.BINARY_CROSSENTROPY
      },
      {
        text: formatMessage({
          id: 'deepLearning.losses.categoricalCrossentropy',
          default: '(11) Categorical Crossentropy',
          description: 'Using categorical crossentropy losses function'
        }),
        value: LOSSES.CATEGORICAL_CROSSENTROPY
      },
      {
        text: formatMessage({
          id: 'deepLearning.losses.cosineProximity',
          default: '(12) Cosine Proximity',
          description: 'Using cosine proximity losses function'
        }),
        value: LOSSES.COSINE_PROXIMITY
      },
      {
        text: formatMessage({
          id: 'deepLearning.losses.meanAbsoluteError',
          default: '(13) Mean Absolute Error',
          description: 'Using mean absolute error losses function'
        }),
        value: LOSSES.MEAN_ABSOLUTE_ERROR
      },
      {
        text: formatMessage({
          id: 'deepLearning.losses.meanAbsolutePercentageError',
          default: '(14) Mean Absolute Percentage Error',
          description: 'Using mean absolute percentage error losses function'
        }),
        value: LOSSES.MEAN_ABSOLUTE_PERCENTAGE_ERROR
      }
    ];
  }

  setLosses(args, util) {
    this._setLosses(args.LOSSES, util);
  }

  _setLosses(losses, util) {
    try {
      this.model.setLosses(losses)
    }
    catch (e) {
      alert(e)
    }
  }

  /**
   * An array of info about each optimizer function.
   * @type {object[]}
   * @param {string} name
   */
  get OPTIMIZER_MENU() {
    return [
      {
        text: formatMessage({
          id: 'deepLearning.optimizer.sgd',
          default: '(1) SGD',
          description: 'Using sgd optimizer function'
        }),
        value: OPTIMZER.SGD
      },
      {
        text: formatMessage({
          id: 'deepLearning.optimizer.rmsprop',
          default: '(2) Rmsprop',
          description: 'Using hard rmsprop optimizer function'
        }),
        value: OPTIMZER.RMSPROP
      },
      {
        text: formatMessage({
          id: 'deepLearning.optimizer.momentum',
          default: '(3) Momentum',
          description: 'Using momentum optimizer function'
        }),
        value: OPTIMZER.MOMENTUM
      },
      {
        text: formatMessage({
          id: 'deepLearning.optimizer.adamax',
          default: '(4) Ada Max',
          description: 'Using adamax optimizer function'
        }),
        value: OPTIMZER.ADAMAX
      },
      {
        text: formatMessage({
          id: 'deepLearning.optimizer.adam',
          default: '(5) Adam',
          description: 'Using adam optimizer function'
        }),
        value: OPTIMZER.ADAM
      },
      {
        text: formatMessage({
          id: 'deepLearning.optimizer.adagrad',
          default: '(6) Ada Grad',
          description: 'Using adagrad optimizer function'
        }),
        value: OPTIMZER.ADAGRAD
      }, 
      {
        text: formatMessage({
          id: 'deepLearning.optimizer.adadelta',
          default: '(7) Ada Delta',
          description: 'Using adadelta optimizer function'
        }),
        value: OPTIMZER.ADADELTA
      }
    ];
  }

  setOptimizer(args, util) {
    this._setOptimizer(args.OPTIMIZER, args.LEARNING_RATE, util);
  }

  _setOptimizer(optimizer, learning_rate, util) {
    try {
      this.model.setOptimizer(optimizer, parseFloat(learning_rate));
    }
    catch (e) {
      alert(e)
    }
  }

  /**
   * An array of info about each activation function.
   * @type {object[]}
   * @param {string} name
   */
  get SHUFFLE_MENU() {
    return [
      {
        text: formatMessage({
          id: 'deepLearning.shuffle.active',
          default: 'Active',
          description: 'active shuffle'
        }),
        value: SHUFFLE.ACTIVE
      },
      {
        text: formatMessage({
          id: 'deepLearning.shuffle.deactive',
          default: 'Deactive',
          description: 'deactive shuffle'
        }),
        value: SHUFFLE.DEACTIVE
      },
    ];
  }

  trainModel(args, util) {
    return this._trainModel(args.BATCH_SIZE, args.EPOCHS, args.SHUFFLE, util);
  }

  _trainModel(batch_size, epochs, shuffle, util) {

    try {
      document.body.children[4].children[0].children[3].style.display = 'flex';
      return this.model.trainModel(parseInt(batch_size), parseInt(epochs), shuffle == 'active')
      .then(() =>  {
        document.body.children[4].children[0].children[3].style.display = 'none';
        return JSON.stringify({
          code: 'dl_fnn_train',
          data: [
            {
              name: '손실율',
              values: {
                x: this.model.info.history.epoch,
                y: this.model.info.history.history.loss
              }
            },
            {
              name: '정확도',
              values: {
                x: this.model.info.history.epoch,
                y: this.model.info.history.history.acc
              }
            }
          ]
        })
      });
    }
    catch (e) {
      document.body.children[4].children[0].children[3].style.display = 'none';
      alert(e)
    }

  }

  predict(args, util) {
    this._predict(args.X_TEST, util);
  }

  _predict(x_test, util) {
    try {
      x_test = x_test.split(' ').map(v => v.split(',').map(w => parseFloat(w)));
      return new Promise(resolve => {
        let timer = setInterval(() => {
          if(this.model.trainFlag == false) {
            resolve();
            clearInterval(timer);

            // csv 파일
            const filename = `dl_fnn_predict_${new Date().getTime()}.csv`;
            const csvFromArrayOfObjects = convertArrayToCSV(this.model.predict(x_test).map((v, i) => {
              return {
                '번호': i + 1,
                'X 값': x_test[i].toString(),
                'Y 값': v
              }
            }));

            // IE 10, 11, Edge Run
            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            
              var blob = new Blob([decodeURIComponent(csvFromArrayOfObjects)], {
                  type: 'text/csv;charset=utf8'
              });
            
              window.navigator.msSaveOrOpenBlob(blob, filename);

            } else if (window.Blob && window.URL) {
                // HTML5 Blob
                var blob = new Blob([csvFromArrayOfObjects], { type: 'text/csv;charset=utf8' });
                var csvUrl = URL.createObjectURL(blob);
                var a = document.createElement('a');
                a.setAttribute('style', 'display:none');
                a.setAttribute('href', csvUrl);
                a.setAttribute('download', filename);
                document.body.appendChild(a);
            
                a.click()
                a.remove();
            } else {
                // Data URI
                var csvData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csvFromArrayOfObjects);
                var blob = new Blob([csvFromArrayOfObjects], { type: 'text/csv;charset=utf8' });
                var csvUrl = URL.createObjectURL(blob);
                var a = document.createElement('a');
                a.setAttribute('style', 'display:none');
                a.setAttribute('target', '_blank');
                a.setAttribute('href', csvData);
                a.setAttribute('download', filename);
                document.body.appendChild(a);
                a.click()
                a.remove();
            }
          }
        }, 1000);
      });
    }
    catch (e) {
      alert(e)
    }
  }
}

module.exports = Scratch3DeepLearningBlocks;