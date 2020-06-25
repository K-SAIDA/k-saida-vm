const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const formatMessage = require('format-message');
const timeFormatter = require('../../util/time-formatter');

const { TensorModel } = require('../../extension-support/deep-learning');
const { convertArrayToCSV } = require('convert-array-to-csv');

const tf = require('@tensorflow/tfjs');
const jimp = require('jimp');
const d3 = require('d3');

require('regenerator-runtime');

// 차트 출력 함수 정의 (2축)
const drawHistory2Axies = (name, json, reject) => {
  try {

    const data = json.data.map(v => {
      return {
        name: v.name,
        values: v.values.x.map((w, i) => { return { x: w, y: v.values.y[i] } })
      }
    });

    const svg = d3.select(`.${name}`);
    const margin = {
      top: 20,
      right: 50,
      bottom: 30,
      left: 50
    }
      
    const options = {
      margin: margin,
      width: +svg.attr('width') - margin.left - margin.right,
      height: +svg.attr('height') - margin.top - margin.bottom,
      g: svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`)
    }
      
    const x = d3.scaleLinear().rangeRound([0, options.width]);
    const y = d3.scaleLinear().rangeRound([options.height, 0]);
    const z = d3.scaleLinear().rangeRound([options.height, 0]);
      
    const line = d3.line().curve(d3.curveMonotoneX).x((d) => x(d.x)).y((d) => y(d.y));
    const line2 = d3.line().curve(d3.curveMonotoneX).x((d) => x(d.x)).y((d) => z(d.y));
      
    const myColor = d3.scaleOrdinal()
          .domain(data.map(v => v.name))
          .range(d3.schemeSet2);
      
    x.domain([d3.min(d3.extent(data, (d) => d.values.map(v => v.x))[0]), d3.max(d3.extent(data, (d) => d.values.map(v => v.x))[0])]);
    y.domain([d3.min(d3.extent(data, (d) => d.values.map(v => v.y))[1]), d3.max(d3.extent(data, (d) => d.values.map(v => v.y))[1])]);
    z.domain([d3.min(d3.extent(data, (d) => d.values.map(v => v.y))[0]), d3.max(d3.extent(data, (d) => d.values.map(v => v.y))[0])]);
    

    options.g.append("g")
      .attr('class', 'axisBottom')
      .attr("transform", "translate(0," + options.height + ")")
      .call(d3.axisBottom(x))
      
    options.g.append("g")
      .attr('class', 'axisLeft')
      .call(d3.axisLeft(y))
      
    options.g.append("g")
      .attr('class', 'axisRight')
      .attr("transform", `translate(${options.width}, 0)`)
      .call(d3.axisRight(z))
      
    options.g.append("path")
      .data([data])
      .attr("fill", "none")
      .attr("stroke", (d) => myColor(d[0].name))
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 2)
      .attr("d", (d) => line(d[0].values))
      
    options.g.append("path")
      .data([data])
      .attr('class', 'path')
      .attr("fill", "none")
      .attr("stroke", (d) => myColor(d[1].name))
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 2)
      .attr("d", (d) => line2(d[1].values))
      
    data.map((v, i) => {
      
      svg.selectAll(`.axis${(i == 0) ? 'Left' : 'Right'} line`)
        .style('stroke', myColor(v.name))
      
      svg.selectAll(`.axis${(i == 0) ? 'Left' : 'Right'} path`)
        .style('stroke', myColor(v.name))
      
      svg.selectAll(`.axis${(i == 0) ? 'Left' : 'Right'} text`)
        .style('fill', myColor(v.name))
      
      svg.selectAll(`dot_${i}`)
        .data([v])
        .enter()
          .append('g')
          .style('fill', (d) => myColor(d.name))
        .selectAll(`point_${i}`)
        .data((d) => d.values)
        .enter()
        .append("circle")
          .attr("cx", (d) => x(d.x) + options.margin.left)
          .attr("cy", (d) => ((i == 0) ? y(d.y) : z(d.y)) + options.margin.top)
          .attr("r", 4)
          .attr("stroke", "white")
        
      options.g.append("circle")
        .attr("cx", options.width - 75)
        .attr("cy", (i == 0) ? options.margin.top : options.margin.top * 2 * i)
        .attr("r", 4)
        .style("fill", myColor(v.name))
      
      options.g.append("text")
        .attr("x", options.width - 50)
        .attr("y", (i == 0) ? options.margin.top : options.margin.top * 2 * i)
        .text(v.name)
        .style("font-size", "12px")
        .attr("alignment-baseline","middle")
    });
  }
  catch (e) {
    return reject({ error: true, message: e });
  }
}

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
    this.waitBlockFlag = {};

    this.model = {};
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
          opcode: 'createModel',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'deepLearning.createModel',
            default: 'create [STORAGE] feedforward neural network',
            description: 'create feedforward neural network'
          }),
          arguments: {
            STORAGE: {
              type: ArgumentType.STRING,
              defaultValue: ' '
            }
          }
        },
        {
          opcode: 'setTrainData',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'deepLearning.setTrainData',
            default: 'set [STORAGE] train data x_data [X_TRAIN] and y_data [Y_TRAIN]',
            description: 'create feedforward neural network'
          }),
          arguments: {
            STORAGE: {
              type: ArgumentType.STRING,
              defaultValue: ' '
            },
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
          opcode: 'setTrainImageData',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'deepLearning.setTrainImageData',
            default: 'set [STORAGE] train data [DATA] with width [WIDTH], height [HEIGHT], channel [CHANNEL]and axis [AXIS]',
            description: 'set train data with width, height, channel, axis'
          }),
          arguments: {
            STORAGE: {
              type: ArgumentType.STRING,
              defaultValue: ' '
            },
            DATA: {
              type: ArgumentType.STRING,
              defaultValue: ' '
            },
            WIDTH: {
              type: ArgumentType.STRING,
              defaultValue: ' '
            },
            HEIGHT: {
              type: ArgumentType.STRING,
              defaultValue: ' '
            },
            CHANNEL: {
              type: ArgumentType.STRING,
              defaultValue: ' '
            },
            AXIS: {
              type: ArgumentType.STRING,
              defaultValue: '0'
            }
          }
        },
        {
          opcode: 'setSequential',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'deepLearning.setSequential',
            default: 'set [STORAGE] sequential to model',
            description: 'set sequential to model'
          }),
          arguments: {
            STORAGE: {
              type: ArgumentType.STRING,
              defaultValue: ' '
            }
          }
        },
        {
          opcode: 'addDense',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'deepLearning.addDense',
            default: 'add [STORAGE] dense to sequential with input shape [INPUT_SHAPE] units [UNITS] use bias [USE_BIAS] activation function [ACTIVATION]',
            description: 'add dense to sequential with options'
          }),
          arguments: {
            STORAGE: {
              type: ArgumentType.STRING,
              defaultValue: ' '
            },
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
            default: 'add [STORAGE] dense to sequential with units [UNITS] use bias [USE_BIAS] activation function [ACTIVATION]',
            description: 'add dense to sequential without input shape'
          }),
          arguments: {
            STORAGE: {
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
          opcode: 'addConv2d',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'deepLearning.addConv2d',
            default: 'add [STORAGE] convolusion 2d to sequential with input shape [INPUT_SHAPE] kernal size [KERNEL_SIZE] filters [FILTERS] activation function [ACTIVATION]',
            description: 'add convolusion 2d to sequential with options'
          }),
          arguments: {
            STORAGE: {
              type: ArgumentType.STRING,
              defaultValue: ' '
            },
            INPUT_SHAPE: {
              type: ArgumentType.STRING,
              defaultValue: ' '
            },
            KERNEL_SIZE: {
              type: ArgumentType.STRING,
              defaultValue: ' ',
            },
            FILTERS: {
              type: ArgumentType.STRING,
              defaultValue: ' '
            },
            ACTIVATION: {
              type: ArgumentType.STRING,
              menu: 'ACTIVATION',
              defaultValue: ACTIVATION.RELU
            }
          }
        },
        {
          opcode: 'addConv2dNoShape',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'deepLearning.addConv2dNoShape',
            default: 'add [STORAGE] convolusion 2d to sequential with input shape [INPUT_SHAPE] kernal size [KERNEL_SIZE] filters [FILTERS] activation function [ACTIVATION]',
            description: 'add convolusion 2d to sequential with options'
          }),
          arguments: {
            STORAGE: {
              type: ArgumentType.STRING,
              defaultValue: ' '
            },
            KERNEL_SIZE: {
              type: ArgumentType.STRING,
              defaultValue: ' ',
            },
            FILTERS: {
              type: ArgumentType.STRING,
              defaultValue: ' '
            },
            ACTIVATION: {
              type: ArgumentType.STRING,
              menu: 'ACTIVATION',
              defaultValue: ACTIVATION.RELU
            }
          }
        },
        {
          opcode: 'addMaxPooling2d',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'deepLearning.addMaxPooling2d',
            default: 'add [STORAGE] max pooling 2d to sequential with pool size [POOL_SIZE] strides [STRIDES]',
            description: 'add max pooling 2d to sequential with options'
          }),
          arguments: {
            STORAGE: {
              type: ArgumentType.STRING,
              defaultValue: ' '
            },
            POOL_SIZE: {
              type: ArgumentType.STRING,
              defaultValue: ' ',
            },
            STRIDES: {
              type: ArgumentType.STRING,
              defaultValue: ' '
            }
          }
        },
        {
          opcode: 'addFlatten',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'deepLearning.addFlatten',
            default: 'add [STORAGE] flatten to sequential',
            description: 'add flatten to sequential'
          }),
          arguments: {
            STORAGE: {
              type: ArgumentType.STRING,
              defaultValue: ' '
            }
          }
        },
        {
          opcode: 'addDropout',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'deepLearning.addDropout',
            default: 'add [STORAGE] dropout with [RATES] to sequential',
            description: 'add dropout to sequential'
          }),
          arguments: {
            STORAGE: {
              type: ArgumentType.STRING,
              defaultValue: ' '
            },
            RATES: {
              type: ArgumentType.STRING,
              defaultValue: ' '
            }
          }
        },
        {
          opcode: 'setLosses',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'deepLearning.setLosses',
            default: 'set [STORAGE] losses function [LOSSES]',
            description: 'set losses function'
          }),
          arguments: {
            STORAGE: {
              type: ArgumentType.STRING,
              defaultValue: ' '
            },
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
            default: 'set [STORAGE] optimizer function [OPTIMIZER] and learning rate [LEARNING_RATE]',
            description: 'set optimizer function'
          }),
          arguments: {
            STORAGE: {
              type: ArgumentType.STRING,
              defaultValue: ' '
            },
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
            default: 'train [STORAGE] model with batch size [BATCH_SIZE] epochs [EPOCHS] shuffle [SHUFFLE]',
            description: 'train model'
          }),
          arguments: {
            STORAGE: {
              type: ArgumentType.STRING,
              defaultValue: ' '
            },
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
            default: '[STORAGE] predict y at x [X_TEST]',
            description: 'predict y at x'
          }),
          arguments: {
            STORAGE: {
              type: ArgumentType.STRING,
              defaultValue: ' '
            },
            X_TEST: {
              type: ArgumentType.STRING,
              defaultValue: ' ',
            }
          }
        },
        {
          opcode: 'getPredict',
          blockType: BlockType.REPORTER,
          text: formatMessage({
            id: 'deepLearning.getPredict',
            default: 'get [STORAGE] predicted data',
            description: 'get predicted data'
          }),
          arguments: {
            STORAGE: {
              type: ArgumentType.STRING,
              defaultValue: ' '
            }
          }
        },
        {
          opcode: 'classify',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'deepLearning.classify',
            default: '[STORAGE] classify data [DATA] with width [WIDTH], height [HEIGHT], channel [CHANNEL]and axis [AXIS]',
            description: 'classify data with width, height, cannel, axis'
          }),
          arguments: {
            STORAGE: {
              type: ArgumentType.STRING,
              defaultValue: ' '
            },
            DATA: {
              type: ArgumentType.STRING,
              defaultValue: ' ',
            },
            WIDTH: {
              type: ArgumentType.STRING,
              defaultValue: ' ',
            },
            HEIGHT: {
              type: ArgumentType.STRING,
              defaultValue: ' ',
            },
            CHANNEL: {
              type: ArgumentType.STRING,
              defaultValue: ' ',
            },
            AXIS: {
              type: ArgumentType.STRING,
              defaultValue: ' ',
            }
          }
        },
        {
          opcode: 'getClassify',
          blockType: BlockType.REPORTER,
          text: formatMessage({
            id: 'deepLearning.getClassify',
            default: 'get [STORAGE] classified data',
            description: 'get classified data'
          }),
          arguments: {
            STORAGE: {
              type: ArgumentType.STRING,
              defaultValue: ' '
            }
          }
        },
        {
          opcode: 'getClassificationAccuracy',
          blockType: BlockType.REPORTER,
          text: formatMessage({
            id: 'deepLearning.getClassificationAccuracy',
            default: 'get [STORAGE] classification accuracy',
            description: 'get classification accuracy'
          }),
          arguments: {
            STORAGE: {
              type: ArgumentType.STRING,
              defaultValue: ' '
            }
          }
        },
        {
          opcode: 'savePredict',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'deepLearning.savePredict',
            default: 'save [STORAGE] predicted data',
            description: 'save predicted data'
          }),
          arguments: {
            STORAGE: {
              type: ArgumentType.STRING,
              defaultValue: ' '
            }
          }
        },
        {
          opcode: 'importModel',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'deepLearning.importModel',
            default: 'import [STORAGE] model',
            description: 'import model'
          }),
          arguments: {
            STORAGE: {
              type: ArgumentType.STRING,
              defaultValue: ' '
            }
          }
        },
        {
          opcode: 'exportModel',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'deepLearning.exportModel',
            default: 'export [STORAGE] model to [FILE]',
            description: 'export model'
          }),
          arguments: {
            STORAGE: {
              type: ArgumentType.STRING,
              defaultValue: ' '
            },
            FILE: {
              type: ArgumentType.STRING,
              defaultValue: ' ',
            }
          }
        },
        {
          opcode: 'showTrainHistoryOnViewer',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'deepLearning.showTrainHistoryOnViewer',
            default: 'show [STORAGE] train history on viewer',
            description: 'show train history on viewer'
          }),
          arguments: {
            STORAGE: {
              type: ArgumentType.STRING,
              defaultValue: ' '
            }
          }
        },
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

  promise(storage, callback) {
    const promise = new Promise((resolve, reject) => {
      let timer = setInterval(() => {
        if(!(storage in this.waitBlockFlag) || this.waitBlockFlag[storage] == false) {
          resolve(callback((message) => {

            this.waitBlockFlag[storage] = false;
            document.body.children[4].children[0].children[3].style.display = 'none';

            clearInterval(timer);
            return reject(message);
          }));
          clearInterval(timer);
        }
      }, 1000);
    });

    return promise.then((res) => res).catch(res => res.error ? console.error(res.message) : alert(res.message));
  }

  createModel(args, util) {
    this.promise(args.STORAGE, (reject) => this._createModel(args.STORAGE, util, reject));
  }

  _createModel(storage, util, reject) {
    try {
      this.model[storage] = {
        network: new TensorModel(),
        predict: undefined
      }

      console.log('Create model:', storage, this.model[storage].network);
    }
    catch (e) {
      return reject({ error: true, message: e });
    }
  }

  setTrainData(args, util) {
    this.promise(args.STORAGE, (reject) => this._setTrainData(args.STORAGE, args.X_TRAIN, args.Y_TRAIN, util, reject));
  }

  _setTrainData(storage, x_train, y_train, util, reject) {
    try {
      if (!this.model[storage])
        return reject({ error: false, message: '오류: 모델이 존재하지 않습니다.\n블록 위치: 훈련 값 입력' });

      x_train = x_train.split(' ').map(v => v.split(',').map(w => parseFloat(w)));
      y_train = y_train.split(' ').map(v => v.split(',').map(w => parseFloat(w)));

      this.model[storage].network.setTrainData(x_train, y_train);
      
      console.log('Set train data:', storage, this.model[storage].network.x_train, this.model[storage].network.y_train);
    }
    catch (e) {
      return reject({ error: true, message: e });
    }
  }

  setTrainImageData(args, util) {
    this.promise(args.STORAGE, (reject) => this._setTrainImageData(args.STORAGE, args.DATA, args.WIDTH, args.HEIGHT, args.CHANNEL, args.AXIS, util, reject));
  }

  _setTrainImageData(storage, data, width, height, channel, axis, util, reject) {
    try {

      if (!this.model[storage])
        return reject({ error: false, message: '오류: 모델이 존재하지 않습니다.\n블록 위치: 훈련 이미지 등록' });

      this.waitBlockFlag[storage] = true;
      document.body.children[4].children[0].children[3].style.display = 'flex';
      document.body.children[4].children[0].children[3].children[0].children[1].innerText = '훈련 데이터 설정 중';

      const convertImagetoTensor = async(data) => {
        return new Promise((resolve, reject) => {
          jimp.read(data, (err, image) => {
            if (err)
              return reject({ error: true, message: err });
            
            const h = image.bitmap.height;
            const w = image.bitmap.width;
            const buffer = tf.buffer([1, h, w, parseInt(channel)], 'float32');

            image.scan(0, 0, w, h, (x, y, index) => {
              buffer.set(image.bitmap.data[index], 0, y, x, 0);
              buffer.set(image.bitmap.data[index + 1], 0, y, x, 1);
              buffer.set(image.bitmap.data[index + 2], 0, y, x, 2);
            });

            resolve(tf.tidy(() => tf.image.resizeBilinear(
              buffer.toTensor(), [parseInt(height), parseInt(width)]).div(255)));
          });
        });
      }

      (async() => {
        try {
          const json = JSON.parse(data).data;
          const labels = Object.keys(json);
  
          const oneHotEncoding = [];
          const imageTensors = [];
  
          for (const label of labels) {
  
            let count = 0;
            const startTime = new Date().getTime();
            for (const data of json[label]) {
              oneHotEncoding.push(new Array(labels.length).fill(0).map((v, i) => (i == labels.findIndex((v) => v == label)) ? 1 : v));
              imageTensors.push(await convertImagetoTensor(Buffer.from(data, 'base64')).catch((err) => reject({ error: true, message: err })));

              const percentage = Math.round(++count / json[label].length * 100);
              const remainTime = Math.round(((new Date().getTime() - startTime) / percentage) * (100 - percentage) / 1000);
              document.body.children[4].children[0].children[3].children[0].children[2].children[0].children[0].innerText = `${label}: ${percentage}%...(남은 시간: ${timeFormatter(remainTime)})`;
            }
          }
  
          this.model[storage].network.setTrainImageData(imageTensors, oneHotEncoding, parseInt(axis));
          this.model[storage].labels = labels;
  
          this.waitBlockFlag[storage] = false;
          document.body.children[4].children[0].children[3].style.display = 'none';
          document.body.children[4].children[0].children[3].children[0].children[1].innerText = '작업을 처리하는 중';
  
          console.log('Set train image data:', storage, this.model[storage].network.x_train, this.model[storage].network.y_train);
        }
        catch (e) {
          return reject({ error: true, message: e });
        }
      })();
    }
    catch (e) {
      return reject({ error: true, message: e });
    }
  }

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
    this.promise(args.STORAGE, (reject) => this._setSequential(args.STORAGE, util, reject));
  }

  _setSequential(storage, util, reject) {
    try {
      if (!this.model[storage])
        return reject({ error: false, message: '오류: 모델이 존재하지 않습니다.\n블록 위치: 시퀀셜 생성' });

      this.model[storage].network.setSequential();

      console.log('Set sequential:', storage, this.model[storage].network);
    }
    catch (e) {
      return reject({ error: true, message: e });
    }
  }

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
    this.promise(args.STORAGE, (reject) => this._addDense(args.STORAGE, args.INPUT_SHAPE, args.UNITS, args.USE_BIAS, args.ACTIVATION, util, reject));
  }

  _addDense(storage, input_shape, units, use_bias, activation, util, reject) {
    try {
      if (!this.model[storage])
        return reject({ error: false, message: '오류: 모델이 존재하지 않습니다.\n블록 위치: 일반 계층' });

      this.model[storage].network.addDense([parseInt(input_shape)], parseInt(units), use_bias == BIAS.ACTIVE, activation);
      console.log('Add dense:', storage, this.model[storage].network);
    }
    catch (e) {
      return reject({ error: true, message: e });
    }
  }

  addDenseNoShape(args, util) {
    this.promise(args.STORAGE, (reject) => this._addDenseNoShape(args.STORAGE, args.UNITS, args.USE_BIAS, args.ACTIVATION, util, reject));
  }

  _addDenseNoShape(storage, units, use_bias, activation, util, reject) {
    try {
      if (!this.model[storage])
        return reject({ error: false, message: '오류: 모델이 존재하지 않습니다.\n블록 위치: 일반 계층' });

      this.model[storage].network.addDenseNoShape(parseInt(units), use_bias == '1', activation);
      console.log('Add dense:', storage, this.model[storage].network);
    }
    catch (e) {
      return reject({ error: true, message: e });
    }
  }

  addConv2d(args, util) {
    this.promise(args.STORAGE, (reject) => this._addConv2d(args.STORAGE, args.INPUT_SHAPE, args.KERNEL_SIZE, args.FILTERS, args.ACTIVATION, util, reject));
  }

  _addConv2d(storage, input_shape, kernel_size, filters, activation, util, reject) {
    try {
      if (!this.model[storage])
        return reject({ error: false, message: '오류: 모델이 존재하지 않습니다.\n블록 위치: 이미지 계층' });

      this.model[storage].network.addConv2d(input_shape.split(',').map((v) => parseInt(v)), parseInt(kernel_size), parseInt(filters), activation);
      console.log('Add convolution 2d:', storage, this.model[storage].network);
    }
    catch (e) {
      return reject({ error: true, message: e });
    }
  }

  addConv2dNoShape(args, util) {
    this.promise(args.STORAGE, (reject) => this._addConv2dNoShape(args.STORAGE, args.KERNEL_SIZE, args.FILTERS, args.ACTIVATION, util, reject));
  }

  _addConv2dNoShape(storage, kernel_size, filters, activation, util, reject) {
    try {
      if (!this.model[storage])
        return reject({ error: false, message: '오류: 모델이 존재하지 않습니다.\n블록 위치: 이미지 계층' });

      this.model[storage].network.addConv2dNoShape(parseInt(kernel_size), parseInt(filters), activation);
      console.log('Add convolution 2d:', storage, this.model[storage].network);
    }
    catch (e) {
      return reject({ error: true, message: e });
    }
  }

  addMaxPooling2d(args, util) {
    this.promise(args.STORAGE, (reject) => this._addMaxPooling2d(args.STORAGE, args.POOL_SIZE, args.STRIDES, util, reject));
  }

  _addMaxPooling2d(storage, pool_size, strides, util, reject) {
    try {
      if (!this.model[storage])
        return reject({ error: false, message: '오류: 모델이 존재하지 않습니다.\n블록 위치: 이미지 풀링 계층' });

      this.model[storage].network.addMaxPooling2d(pool_size.split(',').map(v => parseInt(v)), strides.split(',').map(v => parseInt(v)));
      console.log('Add max pooling 2d:', storage, this.model[storage].network);
    }
    catch (e) {
      return reject({ error: true, message: e });
    }
  }

  addFlatten(args, util) {
    this.promise(args.STORAGE, (reject) => this._addFlatten(args.STORAGE, util, reject));
  }

  _addFlatten(storage, util, reject) {
    try {
      if (!this.model[storage])
        return reject({ error: false, message: '오류: 모델이 존재하지 않습니다.\n블록 위치: 평탄화 계층' });

      this.model[storage].network.addFlatten();
      console.log('Add flatten:', storage, this.model[storage].network);
    }
    catch (e) {
      return reject({ error: true, message: e });
    }
  }

  addDropout(args, util) {
    this.promise(args.STORAGE, (reject) => this._addDropout(args.STORAGE, args.RATES, util, reject));
  }

  _addDropout(storage, rates, util, reject) {
    try {
      if (!this.model[storage])
        return reject({ error: false, message: '오류: 모델이 존재하지 않습니다.\n블록 위치: 드롭아웃' });

      this.model[storage].network.addDropout(parseFloat(rates));
      console.log('Add Dropout:', storage, this.model[storage].network);
    }
    catch (e) {
      return reject({ error: true, message: e });
    }
  }

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
    this.promise(args.STORAGE, (reject) => this._setLosses(args.STORAGE, args.LOSSES, util, reject));
  }

  _setLosses(storage, losses, util, reject) {
    try {
      if (!this.model[storage])
        return reject({ error: false, message: '오류: 모델이 존재하지 않습니다.\n블록 위치: 손실 함수' });

      this.model[storage].network.setLosses(losses);
      console.log('Set losses function:', storage, this.model[storage].network.loss);
    }
    catch (e) {
      return reject({ error: true, message: e });
    }
  }

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
    this.promise(args.STORAGE, (reject) => this._setOptimizer(args.STORAGE, args.OPTIMIZER, args.LEARNING_RATE, util, reject));
  }

  _setOptimizer(storage, optimizer, learning_rate, util, reject) {
    try {
      if (!this.model[storage])
        return reject({ error: false, message: '오류: 모델이 존재하지 않습니다.\n블록 위치: 최적화 함수' });

      this.model[storage].network.setOptimizer(optimizer, parseFloat(learning_rate));
      console.log('Set optimizer function:', storage, this.model[storage].network.optimizer);
    }
    catch (e) {
      return reject({ error: true, message: e });
    }
  }

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
    return this.promise(args.STORAGE, (reject) => this._trainModel(args.STORAGE, args.BATCH_SIZE, args.EPOCHS, args.SHUFFLE, util, reject));
  }

  _trainModel(storage, batch_size, epochs, shuffle, util, reject) {
    try {

      if (!this.model[storage])
        return reject({ error: false, message: '오류: 모델이 존재하지 않습니다.\n블록 위치: 모델 학습' });

      this.waitBlockFlag[storage] = true;
      document.body.children[4].children[0].children[3].style.display = 'flex';
      document.body.children[4].children[0].children[3].children[0].children[1].innerText = '모델을 훈련하는 중';

      return this.model[storage].network.trainModel(parseInt(batch_size), parseInt(epochs), shuffle == 'active', reject)
      .then(() =>  {
        const data = [
          {
            name: '손실율',
            values: {
              x: this.model[storage].network.info.history.epoch,
              y: this.model[storage].network.info.history.history.loss
            }
          }
        ];

        console.log('Train model:', storage, this.model[storage].network.info);

        this.waitBlockFlag[storage] = false;
        document.body.children[4].children[0].children[3].style.display = 'none';
        document.body.children[4].children[0].children[3].children[0].children[1].innerText = '작업을 처리하는 중';

        return JSON.stringify({
          code: 'dl_fnn_train',
          data: data
        });
      })
      .catch((err) => reject({ error: true, message: err }));
    }
    catch (e) {
      return reject({ error: true, message: e });
    }
  }

  predict(args, util) {
    this.promise(args.STORAGE, (reject) => this._predict(args.STORAGE, args.X_TEST, util, reject));
  }

  _predict(storage, x_test, util, reject) {
    try {
      if (!this.model[storage])
        return reject({ error: false, message: '오류: 모델이 존재하지 않습니다.\n블록 위치: 예측' });

      if (!this.model[storage].network.info && !this.model[storage].network.loaded)
        return reject({ error: false, message: '오류: 모델 학습이 필요합니다.\n블록 위치: 예측' });

      this.model[storage].predict = {
        x: x_test.split(' ').map(v => v.split(',').map(w => parseFloat(w))),
        y: this.model[storage].network.predict(x_test.split(' ').map(v => v.split(',').map(w => parseFloat(w))), undefined)
      }

      console.log('Predict TensorModel:', this.model[storage].predict);
    }
    catch (e) {
      return reject({ error: true, message: e });
    }
  }

  classify(args, util) {
    this.promise(args.STORAGE, (reject) => this._classify(args.STORAGE, args.DATA, args.WIDTH, args.HEIGHT, args.CHANNEL, args.AXIS, util, reject));
  }

  _classify(storage, data, width, height, channel, axis, util, reject) {
    try {
      if (!this.model[storage])
        return reject({ error: false, message: '오류: 모델이 존재하지 않습니다.\n블록 위치: 이미지 예측' });

      if (!this.model[storage].network.info && !this.model[storage].network.loaded)
        return reject({ error: false, message: '오류: 모델 학습이 필요합니다.\n블록 위치: 이미지 예측' });

      this.waitBlockFlag[storage] = true;
      document.body.children[4].children[0].children[3].style.display = 'flex';
      document.body.children[4].children[0].children[3].children[0].children[2].children[0].children[0].innerText = '';

      const convertImagetoTensor = async(data) => {
        return new Promise((resolve, reject) => {
          jimp.read(data, (err, image) => {
            if (err) 
              return reject({ error: true, message: err });
            
            const h = image.bitmap.height;
            const w = image.bitmap.width;
            const buffer = tf.buffer([1, h, w, parseInt(channel)], 'float32');

            image.scan(0, 0, w, h, (x, y, index) => {
              buffer.set(image.bitmap.data[index], 0, y, x, 0);
              buffer.set(image.bitmap.data[index + 1], 0, y, x, 1);
              buffer.set(image.bitmap.data[index + 2], 0, y, x, 2);
            });

            resolve(tf.tidy(() => tf.image.resizeBilinear(
              buffer.toTensor(), [parseInt(height), parseInt(width)]).div(255)));
          });
        });
      }
  
      (async() => {
        try {
          const json = JSON.parse(data).data;
          const labels = Object.keys(json);
  
          const imageTensorsWithLabel = [];
          for (const label of labels) {
            for (const data of json[label]) {
              imageTensorsWithLabel.push({
                label: label,
                data: await convertImagetoTensor(Buffer.from(data, 'base64'))
              });
            }
          }
  
          this.model[storage].classify = {
            x: imageTensorsWithLabel,
            y: imageTensorsWithLabel.map(imageTensorWithlabel => [labels[this.model[storage].network.classify(imageTensorWithlabel.data, parseInt(axis))[0]]]),
          }
          this.model[storage].classify.accuracy = this.model[storage].classify.y.map((v, i) => (v[0] == this.model[storage].classify.x[i].label) ? 1 : 0).reduce((prev, cur) => prev + cur) / this.model[storage].classify.x.length * 100;
  
          this.waitBlockFlag[storage] = false;
          document.body.children[4].children[0].children[3].style.display = 'none';
  
          console.log('Classify result:', storage, this.model[storage].classify);
        }
        catch (e) {
          return reject({ error: true, message: e });
        }
      })();
    }
    catch (e) {
      return reject({ error: true, message: e });
    }
  }

  getPredict(args, util) {
    return this.promise(args.STORAGE, (reject) => this._getPredict(args.STORAGE, util, reject));
  }

  _getPredict(storage, util, reject) {
    try {
      if (!this.model[storage])
        return reject({ error: false, message: '오류: 모델이 존재하지 않습니다.\n블록 위치: 예측 값 가져오기' });

      if (!this.model[storage].predict)
        return reject({ error: false, message: '오류: 예측된 데이터가 없습니다.\n블록 위치: 예측 값 가져오기' });

      return (typeof this.model[storage].predict.y == 'number') ? String(this.model[storage].predict.y) : this.model[storage].predict.y.map(v => v.reduce((prev, cur) => String(prev) + ',' + String(cur))).reduce((prev, cur) => String(prev) + ' ' + String(cur));
    }
    catch (e) {
      return reject({ error: true, message: e });
    }
  }

  getClassify(args, util) {
    return this.promise(args.STORAGE, (reject) => this._getClassify(args.STORAGE, util, reject));
  }

  _getClassify(storage, util, reject) {
    try {
      if (!this.model[storage])
        return reject({ error: false, message: '오류: 모델이 존재하지 않습니다.\n블록 위치: 분류 값 가져오기' });

      if (!this.model[storage].classify)
        return reject({ error: false, message: '오류: 분류된 데이터가 없습니다.\n블록 위치: 분류 값 가져오기' });

      return (typeof this.model[storage].classify.y == 'number') ? String(this.model[storage].classify.y) : this.model[storage].classify.y.map(v => v.reduce((prev, cur) => String(prev) + ',' + String(cur))).reduce((prev, cur) => String(prev) + ' ' + String(cur));
    }
    catch (e) {
      return reject({ error: true, message: e });
    }
  }

  getClassificationAccuracy(args, util) {
    return this.promise(args.STORAGE, (reject) => this._getClassificationAccuracy(args.STORAGE, util, reject));
  }

  _getClassificationAccuracy(storage, util, reject) {
    try {
      if (!this.model[storage])
        return reject({ error: false, message: '오류: 모델이 존재하지 않습니다.\n블록 위치: 분류 정확도 가져오기' });

      if (!this.model[storage].classify)
        return reject({ error: false, message: '오류: 분류된 데이터가 없습니다.\n블록 위치: 분류 정확도 가져오기' });

      return this.model[storage].classify.accuracy;
    }
    catch (e) {
      return reject({ error: true, message: e });
    }
  }

  savePredict(args, util) {
    return this.promise(args.STORAGE, (reject) => this._savePredict(args.STORAGE, util, reject));
  }

  _savePredict(storage, util, reject) {
    try {
      if (!this.model[storage])
        return reject({ error: false, message: '오류: 모델이 존재하지 않습니다.\n블록 위치: 예측 값 저장' });

      if (!this.model[storage].predict)
        return reject({ error: false, message: '오류: 예측된 데이터가 없습니다.\n블록 위치: 예측 값 저장' });

      // csv 파일
      const filename = `dl_${storage}_predict_${new Date().getTime()}.csv`;
      const csvFromArrayOfObjects = convertArrayToCSV(this.model[storage].predict.y.map((v, i) => {
        return {
          '번호': i + 1,
          'X 값': this.model[storage].predict.x[i].toString(),
          'Y 값': v
        }
      }));

      // IE 10, 11, Edge Run
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      
        var blob = new Blob([decodeURIComponent('\ufeff' + csvFromArrayOfObjects)], {
            type: 'text/csv;charset=uft8'
        });
      
        window.navigator.msSaveOrOpenBlob(blob, filename);

      } else if (window.Blob && window.URL) {
        // HTML5 Blob
        var blob = new Blob(['\ufeff' + csvFromArrayOfObjects], { type: 'text/csv;charset=uft8' });
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
        var csvData = 'data:application/csv;charset=uft8,' + encodeURIComponent(csvFromArrayOfObjects);
        var blob = new Blob(['\ufeff' + csvFromArrayOfObjects], { type: 'text/csv;charset=uft8' });
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
    catch (e) {
      return reject({ error: true, message: e });
    }
  }

  importModel(args, util) {
    this.promise(args.STORAGE, (reject) => this._importModel(args.STORAGE, util, reject));
  }

  _importModel(storage, util, reject) {
    try {
      if (this.model[storage])
        if (!confirm('이미 모델이 존재합니다. 계속 진행하시겠습니까?'))
          return;

      if (!this.model[storage])
        this.model[storage] =  {
          network: new TensorModel(),
          predict: undefined,
        };

      this.waitBlockFlag[storage] = true;
      
      const file = document.createElement('input');
      file.type = 'file';
      file.accept = '.json, .bin';
      file.multiple = 'muptiple';
    
      file.onchange = (event) => {
        this.model[storage].network.import(event)
        .then((model) => {
          this.model[storage] = {
            network: new TensorModel(model),
            predict: undefined
          }

          console.log('Import Model:', model, this.model[storage]);
          this.waitBlockFlag[storage] = false;
        })
        .catch((err) => {
          this.waitBlockFlag[storage] = false;
          return reject({ error: true, err });
        })
      }
    
      file.click();
    }
    catch (e) {
      this.waitBlockFlag[storage] = false;
      return reject({ error: true, message: e });
    }
  }

  exportModel(args, util) {
    this.promise(args.STORAGE, (reject) => this._exportModel(args.STORAGE, args.FILE, util, reject));
  }

  _exportModel(storage, file, util, reject) {
    try {
      if (!this.model[storage])
        return reject({ error: false, message: '오류: 모델이 존재하지 않습니다.\n블록 위치: 모델 내보내기' });
      
      this.model[storage].network.export(storage, file, reject);
    }
    catch (e) {
      return reject({ error: true, message: e });
    }
  }

  showTrainHistoryOnViewer(args, util) {
    return this.promise(args.STORAGE, (reject) => this._showTrainHistoryOnViewer(args.STORAGE, util, reject));
  }

  _showTrainHistoryOnViewer(storage, util, reject) {
    try {
      if (!this.model[storage])
        return reject({ error: false, message: '오류: 모델이 존재하지 않습니다.\n블록 위치: 훈련 내역 시각화' });

      document.body.children[4].children[0].children[4].style.display='flex';
      document.body.children[4].children[0].children[4].children[0].children[1].innerHTML = `
      <h1>${storage} 모델 학습 결과 그래프</h1>
      <svg class="ModelTrainedHistory" width="${document.body.children[4].children[0].children[4].offsetWidth * 0.65}" height="${document.body.children[4].children[0].children[4].offsetHeight * 0.625}"></svg>`;

      return drawHistory2Axies('ModelTrainedHistory', {
        data: 
        [
          {
            name: '손실율',
            values: {
              x: this.model[storage].network.info.history.epoch,
              y: this.model[storage].network.info.history.history.loss
            }
          },
          {
            name: '정확도',
            values: {
              x: this.model[storage].network.info.history.epoch,
              y: this.model[storage].network.info.history.history.acc
            }
          }
        ]
      }, reject);
    }
    catch (e) {
      return reject({ error: true, message: e });
    }
  }
}

module.exports = Scratch3DeepLearningBlocks;