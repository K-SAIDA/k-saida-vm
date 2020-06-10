const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const formatMessage = require('format-message');

const math = require('mathjs');
const { KNN } = require('../../lib/ml-knn');
const { KMEANS } = require('../../lib/ml-kmeans');
const { convertArrayToCSV } = require('convert-array-to-csv');

const blockIconURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAABmJLR0QA/wD/AP+gvaeTAAAEm0lEQVRIib2Wf2iVZRTHP+d57t3uvbtjzompTVg5liZRaj9UKhcMAkMixUGGyzKzkAhpahrC8Aet/FVIGSX0wxQbYpRGQSJY5soQDYwpS8Mfmy6d293u3f31vs/TH+9mbnuvGYYHDrzvc875fp/znuc954FbLJLLYBvQmcuRGVhbgeT26x+ExcrJvOE9e6Ua188lkCs2czn6BZZZvUA3LgKZS9FdEJ+dwzxY0puLZiM0/AcaP+TZ+Ytiu/6V0H5cFsp2dzUBZTdFCOeC+aGxsrC159pFNdDL6U7UYnUZVnOTOtpJZRdfN8OejaW3B5RzAojeZHZXIV1R48Kvtp7tW+h3aALYeqz2JZMR9yGFpQC4V/5EKZAhdwDgdLWg2o76hUW0ZQ1QcxWn7yGzoWwyYg7hd5AiJQTnHYD8Qm/bh7cS1EJw0nwAbCZOYmsl+elLfqRWDI8Ga88ehN4aWouIlXfFaBGjGah66jJMJkH7xokkj2xHUDiukDyynfaNE7GpbgJTakln1KBYMVpAv2PrPC4NsLJwzLNYtcjjH6iankSCnl+3UVBZS3hCNc75Y4AQfqAGVTCc7r0rcGOtpNtbEYSAGoQzygaLT6/6vuM3sXXjo07EOQmM8qkceub7UFKOsaCLRhLftw7nvFevQOkEolVLcGMXvNpeaia28yXCQSEUGFgZ2xYImYqAE+Z1rPYhAxk3HRlTSaZpH9a6IEJe+TTIZgDIK5+G23UR58LvIJr8sVXkj59B8vg3YNVA0tucpCwNYPVCPzKCIfS01zCdF8i2HMeNXSTT/BOFT67G/euUR3jnVLq/Wol1MuiiEQRG3k20agmZEwdIZlJ+pAsC4mr/Bmc0FkENGUVB1WIwhti2l+nY9AQmHQcg1bgTNbSUorlbQHk9xHS1IUaD0aTSIEYIBf7pL5Jde/8agTf8knR1iLjRIJqiFz9BDx0NQPLQDgDCU+d4flfOEftwHta44GaxmWQ/HK+mCgtrxdZVRt1g8iTW/9BIzQc48Q7ie95GRUsITa7Gpro9a6iQ1M8NmHg70RlLkUgxsa0vgB08XsJ5uq3ASoUAOKum1CDyqV+WMuIu1Pyt2FTCWwjmkzq8G4DQgzMhm+4lL6Bzy3M4LSf8YFBKni9Z88vHAt6P765+pBF4yM/ZTl+CvvdxYh8twiY6ML3kKlSAFBRTtOA90ke/I/5lvS8ZcGxYfuMkqcNcPS62rnKyAd/WZiNDUK9sQ0Jem00d9EZl6OFqz55O0Ll+Dqb7iu9+tZLHit/88QADwd26qs+wdq5fVHZkBZnocABM+3kvwxKvmZvONpxzTTmSszuGvfXDM31v/aaFyprlRgeewmc8BVtP4TrNJJ1rriotp6+N9uEiqY2sIJeXrN3fgtH1uYZqSAcJ67wbHsJCoL54w/4zOQkBVIz1GP3H/0B6pseJrxuEP3BBNn+bVkYv9xtTfRpWQSIqL6fdU7Vs9KbG5CD8wR/eE7NiVgPW+l71+iTluCQd42faXbJpzyw/Q857qTSrpynnc7Bjscp3Y2EdQFujHOv9XlaMFaWbIpF7voY919vrrZO/AWm1/5xPPIMCAAAAAElFTkSuQmCC';

class Scratch3MachineLearningBlocks {

  static get EXTESNION_NAME() {
    return 'MachineLearning';
  }

  static get EXTENSION_ID() {
    return 'machineLearning';
  }

  constructor(runtime) {
    this.runtime = runtime;

    this.knn_model = undefined;
    this.waitBlockFlag = false;
  }

  getInfo() {
    return {
      id: Scratch3MachineLearningBlocks.EXTENSION_ID,
      text: Scratch3MachineLearningBlocks.EXTESNION_NAME,
      blockIconURI: blockIconURI,
      showStatusButton: false,
      name: formatMessage({
        id: 'machineLearning.categoryName',
        default: 'Machine Learning',
        description: 'Label for the Machine Learning extension category'
      }),
      blocks: [
        {
          opcode: 'operatorAdd',
          blockType: BlockType.REPORTER,
          text: formatMessage({
            id: 'machineLearning.operatorAdd',
            default: '[A] + [B]',
            description: 'a + b'
          }),
          arguments: {
            A: {
              type: ArgumentType.STRING,
              defaultValue: ' ',
            },
            B: {
              type: ArgumentType.STRING,
              defaultValue: ' ',
            }
          }
        },
        {
          opcode: 'operatorSub',
          blockType: BlockType.REPORTER,
          text: formatMessage({
            id: 'machineLearning.operatorSub',
            default: '[A] - [B]',
            description: 'a - b'
          }),
          arguments: {
            A: {
              type: ArgumentType.STRING,
              defaultValue: ' ',
            },
            B: {
              type: ArgumentType.STRING,
              defaultValue: ' ',
            }
          }
        },
        {
          opcode: 'operatorMul',
          blockType: BlockType.REPORTER,
          text: formatMessage({
            id: 'machineLearning.operatorMul',
            default: '[A] x [B]',
            description: 'a x b'
          }),
          arguments: {
            A: {
              type: ArgumentType.STRING,
              defaultValue: ' ',
            },
            B: {
              type: ArgumentType.STRING,
              defaultValue: ' ',
            }
          }
        },
        {
          opcode: 'operatorDiv',
          blockType: BlockType.REPORTER,
          text: formatMessage({
            id: 'machineLearning.operatorDiv',
            default: '[A] ÷ [B]',
            description: 'a ÷ b'
          }),
          arguments: {
            A: {
              type: ArgumentType.STRING,
              defaultValue: ' ',
            },
            B: {
              type: ArgumentType.STRING,
              defaultValue: ' ',
            }
          }
        },
        {
          opcode: 'operatorSum',
          blockType: BlockType.REPORTER,
          text: formatMessage({
            id: 'machineLearning.operatorSum',
            default: 'sum [X]',
            description: 'sum of list'
          }),
          arguments: {
            X: {
              type: ArgumentType.STRING,
              defaultValue: ' ',
            }
          }
        },
        {
          opcode: 'operatorMean',
          blockType: BlockType.REPORTER,
          text: formatMessage({
            id: 'machineLearning.operatorMean',
            default: 'mean [X]',
            description: 'mean of list'
          }),
          arguments: {
            X: {
              type: ArgumentType.STRING,
              defaultValue: ' ',
            }
          }
        },
        {
          opcode: 'getRowOfArrayAtIndex',
          blockType: BlockType.REPORTER,
          text: formatMessage({
            id: 'machineLearning.getRowOfArrayAtIndex',
            default: 'row of array [ARRAY] at index [INDEX]',
            description: 'row of array at index'
          }),
          arguments: {
            ARRAY: {
              type: ArgumentType.STRING,
              defaultValue: ' ',
            },
            INDEX: {
              type: ArgumentType.STRING,
              defaultValue: ' '
            }
          }
        },
        {
          opcode: 'getRowSizeOfArray',
          blockType: BlockType.REPORTER,
          text: formatMessage({
            id: 'machineLearning.getRowSizeOfArray',
            default: 'row size of array [ARRAY]',
            description: 'row size of array'
          }),
          arguments: {
            ARRAY: {
              type: ArgumentType.STRING,
              defaultValue: ' ',
            },
          }
        },
        {
          opcode: 'createKNN',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'machineLearning.createKNN',
            default: 'create KNN model with [X_TRAIN] and y_train [Y_TRAIN]',
            description: 'create KNN with x_train and y_train'
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
          opcode: 'predictKNN',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'machineLearning.predictKNN',
            default: 'predict x_test [X_TEST]',
            description: 'prediction using KNN'
          }),
          arguments: {
            X_TEST: {
              type: ArgumentType.STRING,
              defaultValue: ' ',
            }
          }
        },
        {
          opcode: 'getPredictKNN',
          blockType: BlockType.REPORTER,
          text: formatMessage({
            id: 'machineLearning.getPredictKNN',
            default: 'get predicted data using knn',
            description: 'get predicted data using knn'
          })
        },
        {
          opcode: 'classifyKMeans',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'machineLearning.classifyKMeans',
            default: 'classify k-means with data [DATA] and group size [GROUP_SIZE]',
            description: 'calssify using k-means'
          }),
          arguments: {
            DATA: {
              type: ArgumentType.STRING,
              defaultValue: ' ',
            },
            GROUP_SIZE: {
              type: ArgumentType.STRING,
              defaultValue: ' ',
            }
          }
        },
        {
          opcode: 'getClassifyKMeans',
          blockType: BlockType.REPORTER,
          text: formatMessage({
            id: 'machineLearning.getClassifyKMeans',
            default: 'get classified data using k-means',
            description: 'get classified data using k-means'
          })
        },
      ],
      menus: {}
    };
  }

  promise(callback) {
    const promise = new Promise((resolve, reject) => {
      let timer = setInterval(() => {
        if(this.waitBlockFlag == false) {
          resolve(callback(reject));
          clearInterval(timer);
        }
      }, 1000);
    });

    return promise.then((res) => res).catch(res => res.error ? console.error(res.message) : alert(res.message));
  }

  operatorAdd(args, util) {
    return this._operatorAdd(args.A, args.B, util);
  }

  _operatorAdd(a, b, util) {
    try {
      const A = a.split(' ').map(v => v.split(',').map(w => parseFloat(w)));
      const B = b.split(' ').map(v => v.split(',').map(w => parseFloat(w)));
      const R = math.add((A.length == 1 && A[0].length == 1) ? A[0][0] : A, (B.length == 1 && B[0].length == 1) ? B[0][0] : B);
      return (typeof R == 'number') ? String(R) : R.map(v => v.reduce((prev, cur) => String(prev) + ',' + String(cur))).reduce((prev, cur) => String(prev) + ' ' + String(cur));
    } catch (e) {
      console.error(e);
      return alert('입력 값이 잘못되었습니다.');
    }
  }

  operatorSub(args, util) {
    return this._operatorSub(args.A, args.B, util);
  }

  _operatorSub(a, b, util) {
    try {
      const A = a.split(' ').map(v => v.split(',').map(w => parseFloat(w)));
      const B = b.split(' ').map(v => v.split(',').map(w => parseFloat(w)));
      const R = math.subtract((A.length == 1 && A[0].length == 1) ? A[0][0] : A, (B.length == 1 && B[0].length == 1) ? B[0][0] : B);
      return (typeof R == 'number') ? String(R) : R.map(v => v.reduce((prev, cur) => String(prev) + ',' + String(cur))).reduce((prev, cur) => String(prev) + ' ' + String(cur));
    } catch (e) {
      console.error(e);
      return alert('입력 값이 잘못되었습니다.');
    }
  }

  operatorMul(args, util) {
    return this._operatorMul(args.A, args.B, util);
  }

  _operatorMul(a, b, util) {
    try {
      const A = a.split(' ').map(v => v.split(',').map(w => parseFloat(w)));
      const B = b.split(' ').map(v => v.split(',').map(w => parseFloat(w)));

      let R = NaN;
      if ((A.length != 1) && (B.length != 1) && (A.length == B.length && A[0].length == B[0].length)) {
        R = A.map((v, i) => v.map((w, j) => w * B[i][j]));
      }
      else {
        R = math.multiply((A.length == 1 && A[0].length == 1) ? A[0][0] : A, (B.length == 1 && B[0].length == 1) ? B[0][0] : B);
      }

      return (typeof R == 'number') ? String(R) : R.map(v => v.reduce((prev, cur) => String(prev) + ',' + String(cur))).reduce((prev, cur) => String(prev) + ' ' + String(cur));
    } catch (e) {
      console.error(e);
      return alert('입력 값이 잘못되었습니다.');
    }
  }

  operatorDiv(args, util) {
    return this._operatorDiv(args.A, args.B, util);
  }

  _operatorDiv(a, b, util) {
    try {
      const A = a.split(' ').map(v => v.split(',').map(w => parseFloat(w)));
      const B = b.split(' ').map(v => v.split(',').map(w => parseFloat(w)));

      let R = NaN;
      if ((A.length != 1) && (B.length != 1) && (A.length == B.length && A[0].length == B[0].length)) {
        R = A.map((v, i) => v.map((w, j) => w / B[i][j]));
      }
      else {
        R = math.divide((A.length == 1 && A[0].length == 1) ? A[0][0] : A, (B.length == 1 && B[0].length == 1) ? B[0][0] : B);
      }

      return (typeof R == 'number') ? String(R) : R.map(v => v.reduce((prev, cur) => String(prev) + ',' + String(cur))).reduce((prev, cur) => String(prev) + ' ' + String(cur));
    } catch (e) {
      console.error(e);
      return alert('입력 값이 잘못되었습니다.');
    }
  }

  operatorSum(args, util) {
    return this._operatorSum(args.X, util);
  }

  _operatorSum(x, util) {
    try {
      const X = (typeof x == 'string') ? x.split(' ').map(v => v.split(',').map(w => parseFloat(w))) : x;
      return String(math.sum((X.length == 1 && X[0].length == 1) ? X[0][0] : X));
    } catch (e) {
      console.error(e);
      return alert('입력 값이 잘못되었습니다.');
    }
  }

  operatorMean(args, util) {
    return this._operatorMean(args.X, util);
  }

  _operatorMean(x, util) {
    try {
      const X = (typeof x == 'string') ? x.split(' ').map(v => v.split(',').map(w => parseFloat(w))) : x;
      return String(math.mean((X.length == 1 && X[0].length == 1) ? X[0][0] : X));
    } catch (e) {
      console.error(e);
      return alert('입력 값이 잘못되었습니다.');
    }
  }

  getRowOfArrayAtIndex(args, util) {
    return this._getRowOfArrayAtIndex(args.ARRAY, args.INDEX, util);
  }

  _getRowOfArrayAtIndex(array, index, util) {
    try {
      const Array = (typeof array == 'string') ? array.split(' ').map(v => v.split(',').map(w => parseFloat(w))) : array;
      return String((Array.length == 1 && Array[0].length == 1) ? Array[0][0] : Array.map(v => v.reduce((prev, cur) => String(prev) + ',' + String(cur)))[parseInt(index) - 1]);
    } catch (e) {
      console.error(e);
      return alert('입력 값이 잘못되었습니다.');
    }
  }

  getRowSizeOfArray(args, util) {
    return this._getRowSizeOfArray(args.ARRAY, util);
  }

  _getRowSizeOfArray(array, util) {
    try {
      const Array = (typeof array == 'string') ? array.split(' ').map(v => v.split(',').map(w => parseFloat(w))) : array;
      return String((Array.length == 1 && Array[0].length == 1) ? 1 : Array.map(v => v.reduce((prev, cur) => String(prev) + ',' + String(cur))).length);
    } catch (e) {
      console.error(e);
      return alert('입력 값이 잘못되었습니다.');
    }
  }

  createKNN(args, util) {
    this._createKNN(args.X_TRAIN, args.Y_TRAIN, util);
  }

  _createKNN(x_train, y_train, util) {
    try {
      this.knn_model = new KNN(x_train.split(' ').map(v => v.split(',').map(w => parseFloat(w))), y_train.split(' ').map(v => v.split(',').map(w => parseFloat(w))));
    } catch (e) {
      console.error(e);
      return alert('입력 값이 잘못되었습니다.');
    }
  }

  predictKNN(args, util) {
    return this._predictKNN(args.X_TEST, util);
  }

  _predictKNN(x_test, util) {
    try {
      this.knn_value = [this.knn_model.predict(x_test.split(' ').map(v => v.split(',').map(w => parseFloat(w)))).map(v => 1 - v)];

      console.log('Predict KNN:', this.knn_value);
    } catch (e) {
      console.error(e);
      return alert('입력 값이 잘못되었습니다.');
    }
  }

  getPredictKNN(args, util) {
    return this._getPredictKNN(util);
  }

  _getPredictKNN(util) {
    try {
      if (!this.knn_value)
        return alert('예측된 KNN 데이터가 없습니다.');

      return (typeof this.knn_value == 'number') ? String(this.knn_value) : this.knn_value.map(v => v.reduce((prev, cur) => String(prev) + ',' + String(cur))).reduce((prev, cur) => String(prev) + ' ' + String(cur));
    }
    catch (e) {
      console.error(e);
    }
  }

  classifyKMeans(args, util) {
    return this._classifyKMeans(args.DATA, args.GROUP_SIZE, util);
  }

  _classifyKMeans(data, group_size, util) {
    try {
      this.waitBlockFlag = true;
      new KMEANS(data.split(' ').map(v => v.split(',').map(w => parseFloat(w))), { k: parseInt(group_size) }, (err, res) => {
        if (err) { 
          console.log(err);
          return alert('입력 값이 잘못되었습니다.');
        }

        this.waitBlockFlag = false;
        this.kmeans_value = res.map((v) => v.centroid);

        console.log('Classify K-Means:', this.kmeans_value);
      });
    } catch (e) {
      console.error(e);
      return alert('입력 값이 잘못되었습니다.');
    }
  }

  getClassifyKMeans(args, util) {
    return this.promise((reject) => this._getClassifyKMeans(util, reject));
  }

  _getClassifyKMeans(util, reject) {
    try {
      if (!this.kmeans_value)
        return reject({ error: false, message: '분류된 K-Means 데이터가 없습니다.' });

      return (typeof this.kmeans_value == 'number') ? String(this.kmeans_value) : this.kmeans_value.map(v => v.reduce((prev, cur) => String(prev) + ',' + String(cur))).reduce((prev, cur) => String(prev) + ' ' + String(cur));
    }
    catch (e) {
      return reject({ error: true, message: e });
    }
  }
}

module.exports = Scratch3MachineLearningBlocks;