const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const formatMessage = require('format-message');

const { convertArrayToCSV } = require('convert-array-to-csv');

const blockIconURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAC4jAAAuIwF4pT92AAAHwmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgNzkuMTY0MzYwLCAyMDIwLzAyLzEzLTAxOjA3OjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTA2LTEwVDA4OjQ2OjI0KzA5OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0wNi0xMFQwODo0Njo1OCswOTowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMC0wNi0xMFQwODo0Njo1OCswOTowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpmNjEzYTdhOS1lMmRiLWIxNDktYTUzYS01ZjM2ODQ1YjgxZjgiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDoxZGRjOTE1Yy02ZjYyLWIzNDktYWI1MS0wZTVmZmE3YmVlY2MiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDplMjY2ODBhYy00MjlkLWYzNDYtYTM0My1lODQ3ZmRhMmFjMjciPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDplMjY2ODBhYy00MjlkLWYzNDYtYTM0My1lODQ3ZmRhMmFjMjciIHN0RXZ0OndoZW49IjIwMjAtMDYtMTBUMDg6NDY6NTgrMDk6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMS4xIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY29udmVydGVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJmcm9tIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3AgdG8gaW1hZ2UvcG5nIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJkZXJpdmVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJjb252ZXJ0ZWQgZnJvbSBhcHBsaWNhdGlvbi92bmQuYWRvYmUucGhvdG9zaG9wIHRvIGltYWdlL3BuZyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ZjYxM2E3YTktZTJkYi1iMTQ5LWE1M2EtNWYzNjg0NWI4MWY4IiBzdEV2dDp3aGVuPSIyMDIwLTA2LTEwVDA4OjQ2OjU4KzA5OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjEuMSAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOmUyNjY4MGFjLTQyOWQtZjM0Ni1hMzQzLWU4NDdmZGEyYWMyNyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDplMjY2ODBhYy00MjlkLWYzNDYtYTM0My1lODQ3ZmRhMmFjMjciIHN0UmVmOm9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDplMjY2ODBhYy00MjlkLWYzNDYtYTM0My1lODQ3ZmRhMmFjMjciLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5BMx9UAAADGklEQVRo3u2aT0gUURzHLahDRy/dkrx16A+tVphYCUJmVhtd+4OxEFSHjiLFqlS7yeZqrLl5iqIoOnXwIEISruKtDiaFdsxt3VIk8Pjt92N+S8PsbDs783b2LazwgfG98b3vxzdv/ryZOgB1Z58qpZ14T6wSW8IPKWtX2Rdnr1MosJuYJlCEadlXK4Gwg+BWwjoIdBBpF+FzpKUN3wX4EJjyENzKlJvDyo3ALmJAYXArA9JHWQRiZQxuJaZS4AKx7mP4HOvSt2uBPcRcBYJbmZMsJQn0aRDcSp9TgVENw+cYLSYQ8trJuXHgeAxofgQcHTLgbS7jOgUSoUICDV4b7yLOjAHXXwI33wA3XhvwNpdxXZeakWiwCtQT97w2fDoBnBgGVtaQ98NlXMf7KBDgrPVmgSDxUYlAHPiezRfgMq5TJMBZg2aBXrnl9SzQRv/lZZsR4LI2dSPAWXvNAoMqLlb/E+BD6CSNwBGa0IcjxsRulu2W0ic4Zx00C/CtbbasI5ABWiloD03mO++A228NeDv0CuhMlDTBOWvYV4GvP4FDD4Evq/l1S2njNNuZ0F3gQZULHCSBRRsBlmqpCdQEagL+CfBFp/Ux0BT9d8fZRBelY0PGxWpFdwHuqOcFcMtyx3nluSGm9QhwJ3zOXioQhENyWP0F0vZB+GqrvQB3ZndFXayWEdBRgFfEflWRwG/ObBbgR7S1KhLIEHfNAteIz1Uk8Im4ahZoJEacCvC5/lvG/rY4EC38UM91dmcvbovbLEGAszZal1UCjpZOxoCOJ0B4EkjOAvEPBuOzRtmpEaB/0vjdXNcvdWFLXVL+jtvkth0KBAotbEWK/XE3cT5p3Ebso6fS/fcNeJvLgs/c1XGb3c7CR4otLaY0XlpMOVkb3U7MaBh+RrI5Xl6/LK9IKx18S7K4esGxk5ioYPgJyeD5FdMBn+dGSvpU/pJvLzFfxuDz0kfZX7NeJDYUBt+QNn190b2NiCsIPyxtVexTAx7yBRfBF0o5XPz42OMSsekg+Kbsq93XKswOIkosy0PHHyErZVHZR9nnNn8BiZ32ezGmlfkAAAAASUVORK5CYII=';

const MISSINGVALUE = {
  ZERO: 'zero',
  MEAN: 'mean', 
  MIN: 'min', 
  MAX: 'max', 
  AVERAGE: 'average',  
  DELETE: 'delete', 
}

const SCALINGTYPE = {
  NORMALIZATION: 'normalization',
  STANDARDIZATION: 'standardization', 
}

const T = (a) => {

  // Calculate the width and height of the Array
  var w = a.length || 0;
  var h = a[0] instanceof Array ? a[0].length : 0;

  // In case it is a zero matrix, no transpose routine needed.
  if(h === 0 || w === 0) { return []; }

  /**
   * @var {Number} i Counter
   * @var {Number} j Counter
   * @var {Array} t Transposed data is stored in this array.
   */
  var i, j, t = [];

  // Loop through every item in the outer array (height)
  for(i=0; i<h; i++) {

    // Insert a new row (array)
    t[i] = [];

    // Loop through every item per item in outer array (width)
    for(j=0; j<w; j++) {

      // Save transposed data.
      t[i][j] = a[j][i];
    }
  }

  return t;
}

class Scratch3BigDataBlocks {

  static get EXTESNION_NAME() {
    return 'BigData';
  }


  static get EXTENSION_ID() {
    return 'bigData';
  }

  constructor(runtime) {
    this.runtime = runtime;
    this.waitBlockFlag = false;

    this.data = {};
  }

  getInfo() {
    return {
      id: Scratch3BigDataBlocks.EXTENSION_ID,
      name: Scratch3BigDataBlocks.EXTESNION_NAME,
      blockIconURI: blockIconURI,
      showStatusButton: false,
      name: formatMessage({
        id: 'bigData.categoryName',
        default: 'Big Data',
        description: 'Label for the Big Data extension category'
      }),
      blocks: [
        {
          opcode: 'loadCSV',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'bigData.loadCSV',
            default: 'save [STORAGE] from csv file',
            description: 'save data from your csv file'
          }),
          arguments: {
            STORAGE: {
              type: ArgumentType.STRING,
              defaultValue: ' '
            }
          }
        },
        {
          opcode: 'missingValue',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'bigData.missingValue',
            default: 'fill [STORAGE] with [MISSINGVALUE]',
            description: 'fill missing value with value'
          }),
          arguments: {
            STORAGE: {
              type: ArgumentType.STRING,
              defaultValue: ' '
            },
            MISSINGVALUE: {
              type: ArgumentType.STRING,
              menu: 'MISSINGVALUE',
              defaultValue: MISSINGVALUE.MEAN
            }
          }
        },
        {
          opcode: 'scale',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'bigData.scale',
            default: 'change [STORAGE] scale by using [SCALINGTYPE]',
            description: 'change scale'
          }),
          arguments: {
            STORAGE: {
              type: ArgumentType.STRING,
              defaultValue: ' '
            },
            SCALINGTYPE: {
              type: ArgumentType.STRING,
              menu: 'SCALINGTYPE',
              defaultValue: SCALINGTYPE.NORMALIZATION
            }
          }
        },
        {
          opcode: 'deleteHeader',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'bigData.deleteHeader',
            default: 'delete [STORAGE] column header',
            description: 'delete column header'
          }),
          arguments: {
            STORAGE: {
              type: ArgumentType.STRING,
              defaultValue: ' '
            },
          }
        },
        {
          opcode: 'deleteRow',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'bigData.deleteRow',
            default: 'delete [STORAGE] row at [INDEX]',
            description: 'delete row at index'
          }),
          arguments: {
            STORAGE: {
              type: ArgumentType.STRING,
              defaultValue: ' '
            },
            INDEX: {
              type: ArgumentType.STRING,
              defaultValue: ' '
            }
          }
        },
        {
          opcode: 'deleteColumn',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'bigData.deleteColumn',
            default: 'delete [STORAGE] column at [INDEX]',
            description: 'delete column at index'
          }),
          arguments: {
            STORAGE: {
              type: ArgumentType.STRING,
              defaultValue: ' '
            },
            INDEX: {
              type: ArgumentType.STRING,
              defaultValue: ' '
            }
          }
        },
        {
          opcode: 'getRowList',
          blockType: BlockType.REPORTER,
          text: formatMessage({
            id: 'bigData.getRowList',
            default: '[INDEX] row of [STORAGE] data',
            description: 'row of data'
          }),
          arguments: {
            STORAGE: {
              type: ArgumentType.STRING,
              defaultValue: ' '
            },
            INDEX: {
              type: ArgumentType.STRING,
              defaultValue: ' '
            }
          }
        },
        {
          opcode: 'getColumnList',
          blockType: BlockType.REPORTER,
          text: formatMessage({
            id: 'bigData.getColumnList',
            default: '[INDEX] column of [STORAGE] data',
            description: 'column of data'
          }),
          arguments: {
            STORAGE: {
              type: ArgumentType.STRING,
              defaultValue: ' '
            },
            INDEX: {
              type: ArgumentType.STRING,
              defaultValue: ' '
            }
          }
        },
        {
          opcode: 'getValue',
          blockType: BlockType.REPORTER,
          text: formatMessage({
            id: 'bigData.getValue',
            default: '[ROWINDEX] row and [COLUMNINDEX] column of [STORAGE] data',
            description: 'row and column of data'
          }),
          arguments: {
            STORAGE: {
              type: ArgumentType.STRING,
              defaultValue: ' '
            },
            ROWINDEX: {
              type: ArgumentType.STRING,
              defaultValue: ' '
            },
            COLUMNINDEX: {
              type: ArgumentType.STRING,
              defaultValue: ' '
            }
          }
        },
        {
          opcode: 'getHeaders',
          blockType: BlockType.REPORTER,
          text: formatMessage({
            id: 'bigData.getHeaders',
            default: 'column headers of [STORAGE]',
            description: 'column headers'
          }),
          arguments: {
            STORAGE: {
              type: ArgumentType.STRING,
              defaultValue: ' '
            },
          }
        },
        {
          opcode: 'getRowLength',
          blockType: BlockType.REPORTER,
          text: formatMessage({
            id: 'bigData.getRowLength',
            default: 'rows size of [STORAGE]',
            description: 'size of rows'
          }),
          arguments: {
            STORAGE: {
              type: ArgumentType.STRING,
              defaultValue: ' '
            },
          }
        },
        {
          opcode: 'getColumnLength',
          blockType: BlockType.REPORTER,
          text: formatMessage({
            id: 'bigData.getColumnLength',
            default: 'columns size of [STORAGE]',
            description: 'size of columns'
          }),
          arguments: {
            STORAGE: {
              type: ArgumentType.STRING,
              defaultValue: ' '
            },
          }
        },
        {
          opcode: 'saveLocal',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'bigData.saveLocal',
            default: 'save [STORAGE] on local PC',
            description: 'save file on local PC'
          }),
          arguments: {
            STORAGE: {
              type: ArgumentType.STRING,
              defaultValue: ' '
            },
            FILE: {
              type: ArgumentType.STRING,
              defaultValue: ' '
            }
          }
        },
      ],
      menus: {
        MISSINGVALUE: this.MISSINGVALUE_MENU,
        SCALINGTYPE: this.SCALINGTYPE_MENU,
      }
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

  hasHeader(data) {
    return isNaN(parseInt(data[0][0]));
  }

  loadCSV(args, util) {
    this._loadCSV(args.STORAGE, util);
  }

  _loadCSV(storage, util) {
    try {
      this.waitBlockFlag = true;

      const file = document.createElement('input');
      file.type = 'file';
      file.accept = '.csv';

      file.onchange = (event) => {

        const reader = new FileReader();
        reader.readAsText(event.target.files[0], 'utf-8');
        reader.onload = (e) => {

          const data = e.target.result;
          this.data[storage] = data.replace(/\r/g, '').split('\n').map((row) => row.split(',')).slice(0, -1);

          // 플래그 해제
          this.waitBlockFlag = false;
          console.log('loadCSV:', storage, this.data[storage]);
        }
      };

      file.click();
    } catch (e) {
      alert(e);
    }
  }

  /**
   * 누락 데이터 처리 방식
   */
  get MISSINGVALUE_MENU() {
    return [
      {
        text: formatMessage({
          id: 'bigData.missingValue.zero',
          default: '(1) Zero',
          description: 'Fill zero at null data'
        }),
        value: MISSINGVALUE.ZERO
      },
      {
        text: formatMessage({
          id: 'bigData.missingValue.mean',
          default: '(2) Mean',
          description: 'Fill mean value at null data'
        }),
        value: MISSINGVALUE.MEAN
      },
      {
        text: formatMessage({
          id: 'bigData.missingValue.min',
          default: '(3) Min',
          description: 'Fill min value at null data'
        }),
        value: MISSINGVALUE.MIN
      },
      {
        text: formatMessage({
          id: 'bigData.missingValue.max',
          default: '(4) Max',
          description: 'Fill max value at null data'
        }),
        value: MISSINGVALUE.MAX
      },
      {
        text: formatMessage({
          id: 'bigData.missingValue.average',
          default: '(5) Average',
          description: 'Fill average value at null data'
        }),
        value: MISSINGVALUE.AVERAGE
      },
      {
        text: formatMessage({
          id: 'bigData.missingValue.delete',
          default: '(6) Delete',
          description: 'Delete row on null data'
        }),
        value: MISSINGVALUE.DELETE
      },
    ];
  }

  missingValue(args, util) {
    this.promise((reject) => this._missingValue(args.STORAGE, args.MISSINGVALUE, util, reject));
  }

  _missingValue(storage, type, util, reject) {
    try {

      if (!this.data[storage])
        return reject({ error: false, message: 'CSV 파일을 먼저 불러와주세요.' });

      const tArray = (this.hasHeader(this.data[storage])) ? T(this.data[storage].slice(1, Infinity).map(row => row.map(value => value == '' ? Infinity : parseFloat(value)))) : T(this.data[storage].map(row => row.map(value => value == '' ? Infinity : parseFloat(value))));
      const nArray = tArray.map(row => row.map(value => value == Infinity ? 1 : 0).reduce((prev, cur) => prev + cur));
      let rArray;

      switch (type) {
        case 'zero':
          this.data[storage] = this.data[storage].map(row => row.map(value => value == '' ? '0' : value));
          break;
        case 'mean':
          const meanArray = tArray.map((row, i) => (Math.max.apply(null, row.filter(value => value != Infinity)) + Math.min.apply(null, row.filter(value => value != Infinity))) / 2);
          rArray = T(tArray.map((row, i) => row.map(value => value == Infinity ? meanArray[i] : value))).map(row => row.map(value => value.toFixed(8)));

          this.data[storage] = (this.hasHeader(this.data[storage])) ? this.data[storage].slice(0, 1).concat(rArray) : rArray;
          break;
        case 'min':
          const minArray = tArray.map(row => Math.min.apply(null, row.filter(value => value != Infinity)));
          rArray = T(tArray.map((row, i) => row.map(value => value == Infinity ? minArray[i] : value))).map(row => row.map(value => value.toFixed(8)));

          this.data[storage] = (this.hasHeader(this.data[storage])) ? this.data[storage].slice(0, 1).concat(rArray) : rArray;
          break;
        case 'max':
          const maxArray = tArray.map(row => Math.max.apply(null, row.filter(value => value != Infinity)));
          rArray = T(tArray.map((row, i) => row.map(value => value == Infinity ? maxArray[i] : value))).map(row => row.map(value => value.toFixed(8)));

          this.data[storage] = (this.hasHeader(this.data[storage])) ? this.data[storage].slice(0, 1).concat(rArray) : rArray;
          break;
        case 'average':
          const avgArray = tArray.map((row, i) => row.filter(value => value != Infinity).reduce((prev, cur) => prev + cur) / (row.length - nArray[i]));
          rArray = T(tArray.map((row, i) => row.map(value => value == Infinity ? avgArray[i] : value))).map(row => row.map(value => value.toFixed(8)));

          this.data[storage] = (this.hasHeader(this.data[storage])) ? this.data[storage].slice(0, 1).concat(rArray) : rArray;
          break;
        case 'delete':
          this.data[storage] = (this.hasHeader(this.data[storage])) ? this.data[storage].slice(1, Infinity).filter(row => row.filter(value => value == '')[0] != '') : this.data[storage].filter(row => row.filter(value => value == '')[0] != '');
          break;
      }

      console.log('Missing Value:', storage, this.data[storage]);
    }
    catch (e) {
      return reject({ error: true, message: e });
    }
  }
  
  /**
   * 스케일링 방식
   */
  get SCALINGTYPE_MENU() {
    return [
      {
        text: formatMessage({
          id: 'bigData.scale.normalization',
          default: '(1) Normalization',
          description: 'Change scale by using Normalization'
        }),
        value: SCALINGTYPE.NORMALIZATION
      },
      {
        text: formatMessage({
          id: 'bigData.scale.standardization',
          default: '(2) Standardization',
          description: 'Change scale by using Normalization'
        }),
        value: SCALINGTYPE.STANDARDIZATION
      }
    ];
  }

  scale(args, util) {
    this.promise((reject) => this._scale(args.STORAGE, args.SCALINGTYPE, util, reject));
  }

  _scale(storage, type, util, reject) {
    try {

      if (!this.data[storage])
        return reject({ error: false, message: 'CSV 파일을 먼저 불러와주세요.' });

      if (this.data[storage].slice(1, Infinity).filter(row => row.filter(value => value == '')[0] == '').length != 0)
        return reject({ error: false, message: '누락된 데이터값을 먼저 처리해주세요.' });

      const tArray = (this.hasHeader(this.data[storage])) ? T(this.data[storage].slice(1, Infinity).map(row => row.map(value => parseFloat(value)))) : T(this.data[storage].map(row => row.map(value => parseFloat(value))));
      let rArray;

      switch (type) {
        case 'normalization':
          rArray = T(tArray.map(row => row.map(value => (value - Math.min.apply(null, row)) / (Math.max.apply(null, row) - Math.min.apply(null, row))))).map(row => row.map(value => value.toFixed(5)));
          
          this.data[storage] = (this.hasHeader(this.data[storage])) ? this.data[storage].slice(0, 1).concat(rArray) : rArray;
          break;
        case 'standardization':
          const avg = tArray.map(row => (row.reduce((prev, cur) => prev + cur) / row.length));
          const standard_deviation = tArray.map((row, i) => Math.sqrt(row.map(value => Math.pow(value - avg[i], 2)).reduce((prev, cur) => prev + cur) / row.length));
          rArray = T(tArray.map((row, i) => row.map(value => (value - avg[i]) / standard_deviation[i]))).map(row => row.map(value => value.toFixed(5)));

          this.data[storage] = (this.hasHeader(this.data[storage])) ? this.data[storage].slice(0, 1).concat(rArray) : rArray;
          break;
        }

      console.log('Scaling:', storage, this.data[storage]);
    }
    catch (e) {
      return reject({ error: true, message: e });
    }
  }

  getColumnList(args, util) {
    return this.promise((reject) => this._getColumnList(args.STORAGE, args.INDEX, util, reject));
  }

  _getColumnList(storage, index, util, reject) {
    try {

      if (!this.data[storage])
        return reject({ error: false, message: 'CSV 파일을 먼저 불러와주세요.' });

      if (this.data[storage].slice(1, Infinity).filter(row => row.filter(value => value == '')[0] == '').length != 0)
        return reject({ error: false, message: '누락된 데이터값을 먼저 처리해주세요.' });

      const tArray = (this.hasHeader(this.data[storage])) ? T(this.data[storage].slice(1, Infinity).map(row => row.map(value => parseFloat(value)))) : T(this.data[storage].map(row => row.map(value => parseFloat(value))));

      if (parseInt(index) - 1 >= tArray.length)
        return alert(`오류: 배열의 참조 범위를 초과했습니다. (값: ${index}})\n블록 위치: 열 가져오기`);
      
      const rArray = T([tArray[parseInt(index) - 1]]);

      console.log('Get column list:', storage, rArray);
      return (typeof rArray == 'number') ? rArray.toFixed(8) : rArray.map(v => v.reduce((prev, cur) => ((typeof prev == 'string') ? prev : prev.toFixed(8)) + ',' + ((typeof cur == 'string') ? cur: cur.toFixed(8)))).reduce((prev, cur) => ((typeof prev == 'string') ? prev : prev.toFixed(8)) + ' ' + ((typeof cur == 'string') ? cur: cur.toFixed(8)))
    }
    catch (e) {
      return reject({ error: true, message: e });
    }
  }

  getRowList(args, util) {
    return this.promise((reject) => this._getRowList(args.STORAGE, args.INDEX, util, reject));
  }

  _getRowList(storage, index, util, reject) {
    try {

      if (!this.data[storage])
        return reject({ error: false, message: 'CSV 파일을 먼저 불러와주세요.' });

      if (this.data[storage].slice(1, Infinity).filter(row => row.filter(value => value == '')[0] == '').length != 0)
        return reject({ error: false, message: '누락된 데이터값을 먼저 처리해주세요.' });

      const rArray = [this.data[storage][parseInt(index) - 1]];

      if (rArray == [])
        return reject({ error: false, message: `오류: 올바르지 않은 행 번호입니다. (값: ${index})\n블록 위치: 행 가져오기` });

      console.log('Get row list:', storage, rArray[0]);
      return (typeof rArray == 'number') ? rArray.toFixed(8) : rArray.map(v => v.reduce((prev, cur) => ((typeof prev == 'string') ? prev : prev.toFixed(8)) + ',' + ((typeof cur == 'string') ? cur: cur.toFixed(8)))).reduce((prev, cur) => ((typeof prev == 'string') ? prev : prev.toFixed(8)) + ' ' + ((typeof cur == 'string') ? cur: cur.toFixed(8)))
    }
    catch (e) {
      return reject({ error: true, message: e });
    }
  }

  getValue(args, util) {
    return this.promise((reject) => this._getValue(args.STORAGE, args.ROWINDEX, args.COLUMNINDEX, util, reject));
  }

  _getValue(storage, row_index, column_index, util, reject) {
    try {

      if (!this.data[storage])
        return reject({ error: false, message: 'CSV 파일을 먼저 불러와주세요.' });

      if (this.data[storage].slice(1, Infinity).filter(row => row.filter(value => value == '')[0] == '').length != 0)
        return reject({ error: false, message: '누락된 데이터값을 먼저 처리해주세요.' });

      const result = this.data[storage].map((row, i) => (i == parseInt(row_index) - 1) ? row.map((column, j) => (j == parseInt(column_index) - 1) ? column : null) : null).filter(row => row != null)[0].filter(value => value != null)[0];
      
      if (!result)
        return reject({ error: false, message: `오류: 열 이름 또는 행 번호가 잘못되었습니다.\n블록 위치: 값 가져오기` });

      console.log('Get value:', storage, result);
      return (typeof result == 'string') ? result : result.toFixed(8);
    }
    catch (e) {
      return reject({ error: true, message: e });
    }
  }

  getRowLength(args, util) {
    return this.promise((reject) => this._getRowLength(args.STORAGE, util, reject));
  }

  _getRowLength(storage, util, reject) {
    try {

      if (!this.data[storage])
        return reject({ error: false, message: 'CSV 파일을 먼저 불러와주세요.' });

      if (this.data[storage].slice(1, Infinity).filter(row => row.filter(value => value == '')[0] == '').length != 0)
        return reject({ error: false, message: '누락된 데이터값을 먼저 처리해주세요.' });

      return String(this.data[storage].length);
    }
    catch (e) {
      return reject({ error: true, message: e });
    }
  }

  getColumnLength(args, util) {
    return this.promise((reject) => this._getColumnLength(args.STORAGE, util, reject));
  }

  _getColumnLength(storage, util, reject) {
    try {

      if (!this.data[storage])
        return reject({ error: false, message: 'CSV 파일을 먼저 불러와주세요.' });

      if (this.data[storage].slice(1, Infinity).filter(row => row.filter(value => value == '')[0] == '').length != 0)
        return reject({ error: false, message: '누락된 데이터값을 먼저 처리해주세요.' });

      return String(this.data[storage][0].length);
    }
    catch (e) {
      return reject({ error: true, message: e });
    }
  }

  getHeaders(args, util) {
    return this.promise((reject) => this._getHeaders(args.STORAGE, util, reject));
  }

  _getHeaders(storage, util, reject) {
    try {

      if (!this.data[storage])
        return reject({ error: false, message: 'CSV 파일을 먼저 불러와주세요.' });

      if (this.data[storage].slice(1, Infinity).filter(row => row.filter(value => value == '')[0] == '').length != 0)
        return reject({ error: false, message: '누락된 데이터값을 먼저 처리해주세요.' });

      if (!this.hasHeader(this.data[storage]))
        return reject({ error: false, message: '헤더를 찾을 수 없습니다.' });

      return [this.data[storage][0]].map(v => v.reduce((prev, cur) => ((typeof prev == 'string') ? prev : prev.toFixed(8)) + ',' + ((typeof cur == 'string') ? cur: cur.toFixed(8)))).reduce((prev, cur) => ((typeof prev == 'string') ? prev : prev.toFixed(8)) + ' ' + ((typeof cur == 'string') ? cur: cur.toFixed(8)))
    }
    catch (e) {
      return reject({ error: true, message: e });
    }
  }

  deleteHeader(args, util) {
    this.promise((reject) => this._deleteHeader(args.STORAGE, util, reject));
  }

  _deleteHeader(storage, util, reject) {
    try {

      if (!this.data[storage])
        return reject({ error: false, message: 'CSV 파일을 먼저 불러와주세요.' });

      if (this.data[storage].slice(1, Infinity).filter(row => row.filter(value => value == '')[0] == '').length != 0)
        return reject({ error: false, message: '누락된 데이터값을 먼저 처리해주세요.' });

      if (!this.hasHeader(this.data[storage]))
        return reject({ error: false, message: '헤더를 찾을 수 없습니다.' });

      this.data[storage] = this.data[storage].slice(1, Infinity);
      console.log('Delete header:', storage, this.data[storage]);
    }
    catch (e) {
      return reject({ error: true, message: e });
    }
  }

  deleteRow(args, util) {
    this.promise((reject) => this._deleteRow(args.STORAGE, args.INDEX, util, reject));
  }

  _deleteRow(storage, index, util, reject) {
    try {

      if (!this.data[storage])
        return reject({ error: false, message: 'CSV 파일을 먼저 불러와주세요.' });

      if (this.data[storage].slice(1, Infinity).filter(row => row.filter(value => value == '')[0] == '').length != 0)
        return reject({ error: false, message: '누락된 데이터값을 먼저 처리해주세요.' });

      this.data[storage] = this.data[storage].filter((row, i) => i != (parseInt(index) - 1));
      console.log('Delete row:', storage, this.data[storage]);
    }
    catch (e) {
      return reject({ error: true, message: e });
    }
  }

  deleteColumn(args, util) {
    this.promise((reject) => this._deleteColumn(args.STORAGE, args.INDEX, util, reject));
  }

  _deleteColumn(storage, index, util, reject) {
    try {

      if (!this.data[storage])
        return reject({ error: false, message: 'CSV 파일을 먼저 불러와주세요.' });

      if (this.data[storage].slice(1, Infinity).filter(row => row.filter(value => value == '')[0] == '').length != 0)
        return reject({ error: false, message: '누락된 데이터값을 먼저 처리해주세요.' });

      const headers = (this.hasHeader(this.data[storage])) ? [this.data[storage].slice(0, 1)[0].filter((header, i) => i != (parseInt(index) - 1))] : undefined;
      const rArray = T(T((!headers) ? this.data[storage].map(row => row.map(value => parseFloat(value))) : this.data[storage].slice(1, Infinity).map(row => row.map(value => parseFloat(value)))).filter((row, i) => i != (parseInt(index) - 1)));
      
      this.data[storage] = (headers) ? headers.concat(rArray).map(row => row.map(value => (typeof value == 'string') ? value : value.toFixed(8))) : rArray.map(row => row.map(value => (typeof value == 'string') ? value : value.toFixed(8)));
      console.log('Delete column:', storage, this.data[storage]);
    }
    catch (e) {
      return reject({ error: true, message: e });
    }
  }

  saveLocal(args, util) {
    this.promise((reject) => this._saveLocal(args.STORAGE, args.FILE, util, reject));
  }

  _saveLocal(storage, file, util, reject) {
    try {

      if (!this.data[storage])
        return reject({ error: false, message: '저장할 데이터가 없습니다.' });

      // csv 파일
      const filename = `big_data_${new Date().getTime()}.csv`;
      const csvFromArrayOfArrays  = convertArrayToCSV(this.data[storage]);

      // IE 10, 11, Edge Run
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      
        var blob = new Blob([decodeURIComponent('\ufeff' + csvFromArrayOfArrays)], {
            type: 'text/csv;charset=uft8'
        });
      
        window.navigator.msSaveOrOpenBlob(blob, filename);

      } else if (window.Blob && window.URL) {
          // HTML5 Blob
          var blob = new Blob(['\ufeff' + csvFromArrayOfArrays], { type: 'text/csv;charset=uft8' });
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
          var csvData = 'data:application/csv;charset=uft8,' + encodeURIComponent(csvFromArrayOfArrays);
          var blob = new Blob(['\ufeff' + csvFromArrayOfArrays], { type: 'text/csv;charset=uft8' });
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
}

module.exports = Scratch3BigDataBlocks; 