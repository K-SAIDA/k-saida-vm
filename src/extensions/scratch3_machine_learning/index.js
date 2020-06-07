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
    this.kmeans_flag = false;
    this.kmeans_value = undefined;
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
          opcode: 'getNumberOfArrayAtIndex',
          blockType: BlockType.REPORTER,
          text: formatMessage({
            id: 'machineLearning.getNumberOfArrayAtIndex',
            default: 'Array [ARRAY] at index [INDEX]',
            description: 'sum of list'
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
      ],
      menus: {}
    };
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

  getNumberOfArrayAtIndex(args, util) {
    return this._getNumberOfArrayAtIndex(args.ARRAY, args.INDEX, util);
  }

  _getNumberOfArrayAtIndex(array, index, util) {
    try {
      const Array = (typeof array == 'string') ? array.split(' ').map(v => v.split(',').map(w => parseFloat(w))) : array;
      return String((Array.length == 1 && Array[0].length == 1) ? Array[0][0] : Array.map(v => v.reduce((prev, cur) => String(prev) + ',' + String(cur)))[parseInt(index) - 1]);
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
    this._predictKNN(args.X_TEST, util);
  }

  _predictKNN(x_test, util) {
    try {

      x_test = x_test.split(' ').map(v => v.split(',').map(w => parseFloat(w)));

      // csv 파일
      const filename = `ml_k_means_predict_${new Date().getTime()}.csv`;
      const csvFromArrayOfObjects = convertArrayToCSV((this.knn_model.predict(x_test).map(v => 1 - v)).map((v, i) => {
        return {
          '번호': i + 1,
          'X 값': x_test[i],
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
    } catch (e) {
      console.error(e);
      return alert('입력 값이 잘못되었습니다.');
    }
  }

  classifyKMeans(args, util) {
    return this._classifyKMeans(args.DATA, args.GROUP_SIZE, util);
  }

  _classifyKMeans(data, group_size, util) {
    try {
      this.kmeans_flag = true;
      new KMEANS(data.split(' ').map(v => v.split(',').map(w => parseFloat(w))), { k: parseInt(group_size) }, (err, res) => {

        if (err) { 
          console.log(err);
          return alert('입력 값이 잘못되었습니다.');
        }

        this.kmeans_flag = false;
        this.kmeans_value = res.map((v, i) => 'Group_' + String(i) + ': [' + v.centroid.map(v => v.toFixed(2)).reduce((prev, cur) => prev + ', ' + cur) + ']').reduce((prev, cur) => prev + '<br />' + cur);
      });

      const promise = new Promise(resolve => {
        let timer = setInterval(() => {
          if(this.kmeans_flag == false) {
            resolve();
            clearInterval(timer);
          }
        }, 1000);
      });

      return promise.then(() => { 
        return JSON.stringify({
          code: 'ml_k_means',
          data: this.kmeans_value
        });
      })

    } catch (e) {
      console.error(e);
      return alert('입력 값이 잘못되었습니다.');
    }
  }
}

module.exports = Scratch3MachineLearningBlocks;