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
    this.waitBlockFlag = {};

    this.knn = {};
    this.kmeans = {};
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
          opcode: 'getColumnOfArrayAtIndex',
          blockType: BlockType.REPORTER,
          text: formatMessage({
            id: 'machineLearning.getColumnOfArrayAtIndex',
            default: 'column of array [ARRAY] at index [INDEX]',
            description: 'column of array at index'
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
          opcode: 'getColumnSizeOfArray',
          blockType: BlockType.REPORTER,
          text: formatMessage({
            id: 'machineLearning.getColumnSizeOfArray',
            default: 'column size of array [ARRAY]',
            description: 'column size of array'
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
            default: 'create [STORAGE] KNN model with [X_TRAIN] and y_train [Y_TRAIN]',
            description: 'create KNN with x_train and y_train'
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
          opcode: 'predictKNN',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'machineLearning.predictKNN',
            default: 'predict [STORAGE] x_test [X_TEST]',
            description: 'prediction using KNN'
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
          opcode: 'getPredictKNN',
          blockType: BlockType.REPORTER,
          text: formatMessage({
            id: 'machineLearning.getPredictKNN',
            default: 'get predicted [STORAGE] data using knn',
            description: 'get predicted data using knn'
          }),
          arguments: {
            STORAGE: {
              type: ArgumentType.STRING,
              defaultValue: ' '
            }
          }
        },
        {
          opcode: 'savePredictKNN',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'machineLearning.savePredictKNN',
            default: 'save predicted [STORAGE] data using knn',
            description: 'save predicted data using knn'
          }),
          arguments: {
            STORAGE: {
              type: ArgumentType.STRING,
              defaultValue: ' '
            }
          }
        },
        {
          opcode: 'classifyKMeans',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'machineLearning.classifyKMeans',
            default: 'classify k-means [STORAGE] with data [DATA] and group size [GROUP_SIZE]',
            description: 'calssify using k-means'
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
            default: 'get classified [STORAGE] data using k-means',
            description: 'get classified data using k-means'
          }),
          arguments: {
            STORAGE: {
              type: ArgumentType.STRING,
              defaultValue: ' '
            }
          }
        },
      ],
      menus: {}
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
      return alert('오류: 입력 값이 잘못되었습니다.\n블록 위치: 덧셈');
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
      return alert('오류: 입력 값이 잘못되었습니다.\n블록 위치: 뺄셈');
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
      return alert('오류: 입력 값이 잘못되었습니다.\n블록 위치: 곱셈');
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
      return alert('오류: 입력 값이 잘못되었습니다.\n블록 위치: 나눗셈');
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
      return alert('오류: 입력 값이 잘못되었습니다.\n블록 위치: 총 합계');
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
      return alert('오류: 입력 값이 잘못되었습니다.\n블록 위치: 평균');
    }
  }

  getRowOfArrayAtIndex(args, util) {
    return this._getRowOfArrayAtIndex(args.ARRAY, args.INDEX, util);
  }

  _getRowOfArrayAtIndex(array, index, util) {
    try {
      const Array = (typeof array == 'string') ? array.split(' ').map(v => v.split(',').map(w => isNaN(parseFloat(w)) ? w : parseFloat(w))) : array;
      return String((Array.length == 1 && Array[0].length == 1) ? Array[0][0] : Array.map(v => v.reduce((prev, cur) => String(prev) + ',' + String(cur)))[parseInt(index) - 1]);
    } catch (e) {
      console.error(e);
      return alert('오류: 입력 값이 잘못되었습니다.\n블록 위치: 행 가져오기');
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
      return alert('오류: 입력 값이 잘못되었습니다.\n블록 위치: 행 크기');
    }
  }

  getColumnOfArrayAtIndex(args, util) {
    return this._getColumnOfArrayAtIndex(args.ARRAY, args.INDEX, util);
  }

  _getColumnOfArrayAtIndex(array, index, util) {
    try {
      const Array = (typeof array == 'string') ? array.split(' ').map(v => v.split(',').map(w => isNaN(parseFloat(w)) ? w : parseFloat(w))) : array;
      return String((Array.length == 1 && Array[0].length == 1) ? Array[0][0] : Array[0][parseInt(index) - 1]);
    } catch (e) {
      console.error(e);
      return alert('오류: 입력 값이 잘못되었습니다.\n블록 위치: 열 가져오기');
    }
  }

  getColumnSizeOfArray(args, util) {
    return this._getColumnSizeOfArray(args.ARRAY, util);
  }

  _getColumnSizeOfArray(array, util) {
    try {
      const Array = (typeof array == 'string') ? array.split(' ').map(v => v.split(',').map(w => parseFloat(w))) : array;
      return String((Array.length == 1 && Array[0].length == 1) ? 1 : Array[0].length);
    } catch (e) {
      console.error(e);
      return alert('오류: 입력 값이 잘못되었습니다.\n블록 위치: 열 크기');
    }
  }

  createKNN(args, util) {
    this._createKNN(args.STORAGE, args.X_TRAIN, args.Y_TRAIN, util);
  }

  _createKNN(storage, x_train, y_train, util) {
    try {
      this.knn[storage] = {
        model: new KNN(x_train.split(' ').map(v => v.split(',').map(w => parseFloat(w))), y_train.split(' ').map(v => v.split(',').map(w => parseFloat(w)))),
        predict: undefined
      };

    } catch (e) {
      console.error(e);
      return alert('오류: 입력 값이 잘못되었습니다.\n블록 위치: KNN 모델 생성');
    }
  }

  predictKNN(args, util) {
    return this._predictKNN(args.STORAGE, args.X_TEST, util);
  }

  _predictKNN(storage, x_test, util) {
    try {
      this.knn[storage].predict = {
        x: x_test.split(' ').map(v => v.split(',').map(w => parseFloat(w))),
        y: this.knn[storage].model.predict(x_test.split(' ').map(v => v.split(',').map(w => parseFloat(w)))).map(v => [1 - v])
      }

      console.log('Predict KNN:', this.knn[storage].predict.y);
    } catch (e) {
      console.error(e);
      return alert('오류: 입력 값이 잘못되었습니다.\n블록 위치: KNN 예측');
    }
  }

  getPredictKNN(args, util) {
    return this._getPredictKNN(args.STORAGE, util);
  }

  _getPredictKNN(storage, util) {
    try {
      if (!this.knn[storage].predict)
        return alert('오류: 예측된 KNN 데이터가 없습니다.\n블록 위치: KNN 예측 값 가져오기');

      return (typeof this.knn[storage].predict.y == 'number') ? String(this.knn[storage].predict.y) : this.knn[storage].predict.y.map(v => v.reduce((prev, cur) => String(prev) + ',' + String(cur))).reduce((prev, cur) => String(prev) + ' ' + String(cur));
    }
    catch (e) {
      return console.error(e);
    }
  }

  savePredictKNN(args, util) {
    return this._savePredictKNN(args.STORAGE, util);
  }

  _savePredictKNN(storage, util) {
    try {
      if (!this.knn[storage].predict)
        return alert('오류: 예측된 KNN 데이터가 없습니다.\n블록 위치: KNN 예측 값 CSV 저장');

      // csv 파일
      const filename = `ml_${storage}_predict_${new Date().getTime()}.csv`;
      const csvFromArrayOfObjects = convertArrayToCSV(this.knn[storage].predict.y.map((v, i) => {
        return {
          '번호': i + 1,
          'X 값': this.knn[storage].predict.x[i].toString(),
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

  classifyKMeans(args, util) {
    return this._classifyKMeans(args.STORAGE, args.DATA, args.GROUP_SIZE, util);
  }

  _classifyKMeans(storage, data, group_size, util) {
    try {
      this.waitBlockFlag[storage] = true;
      new KMEANS(data.split(' ').map(v => v.split(',').map(w => parseFloat(w))), { k: parseInt(group_size) }, (err, res) => {

        if (err) { 
          console.log(err);
          return alert('오류: 입력 값이 잘못되었습니다.\n블록 위치: KMeans 분류');
        }

        this.waitBlockFlag[storage] = false;
        this.kmeans[storage] = res.map((v) => v.centroid);

        console.log('Classify K-Means:', this.kmeans[storage]);
      });
    } catch (e) {
      return console.error(e);
    }
  }

  getClassifyKMeans(args, util) {
    return this.promise(args.STORAGE, (reject) => this._getClassifyKMeans(args.STORAGE, util, reject));
  }

  _getClassifyKMeans(storage, util, reject) {
    try {
      if (!this.kmeans[storage])
        return reject({ error: false, message: '오류: 분류된 K-Means 데이터가 없습니다.\n블록 위치: KMeans 값 가져오기' });

      return (typeof this.kmeans[storage] == 'number') ? String(this.kmeans[storage]) : this.kmeans[storage].map(v => v.reduce((prev, cur) => String(prev) + ',' + String(cur))).reduce((prev, cur) => String(prev) + ' ' + String(cur));
    }
    catch (e) {
      return reject({ error: true, message: e });
    }
  }
}

module.exports = Scratch3MachineLearningBlocks;