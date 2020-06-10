const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const formatMessage = require('format-message');

const nj = require('@aas395/numjs');
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
            default: 'load csv file',
            description: 'load your csv file'
          }),
        },
        {
          opcode: 'missingValue',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'bigData.missingValue',
            default: 'fill with [MISSINGVALUE]',
            description: 'fill missing value with value'
          }),
          arguments: {
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
            default: 'change scale by using [SCALINGTYPE]',
            description: 'change scale'
          }),
          arguments: {
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
            default: 'delete column header',
            description: 'delete column header'
          })
        },
        {
          opcode: 'deleteRow',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'bigData.deleteRow',
            default: 'delete row at [INDEX]',
            description: 'delete row at index'
          }),
          arguments: {
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
            default: 'delete column at [INDEX]',
            description: 'delete column at index'
          }),
          arguments: {
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
            default: '[INDEX] row of data',
            description: 'row of data'
          }),
          arguments: {
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
            default: 'select column [HEADER]',
            description: 'select column'
          }),
          arguments: {
            HEADER: {
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
            default: '[INDEX] row and [HEADER] column of data',
            description: 'row and column of data'
          }),
          arguments: {
            HEADER: {
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
          opcode: 'getHeaders',
          blockType: BlockType.REPORTER,
          text: formatMessage({
            id: 'bigData.getHeaders',
            default: 'column headers',
            description: 'column headers'
          })
        },
        {
          opcode: 'getRowLength',
          blockType: BlockType.REPORTER,
          text: formatMessage({
            id: 'bigData.getRowLength',
            default: 'size of rows',
            description: 'size of rows'
          })
        },
        {
          opcode: 'getColumnLength',
          blockType: BlockType.REPORTER,
          text: formatMessage({
            id: 'bigData.getColumnLength',
            default: 'size of columns',
            description: 'size of columns'
          })
        },
        {
          opcode: 'saveLocal',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'bigData.saveLocal',
            default: 'save on local PC',
            description: 'save file on local PC'
          }),
          arguments: {
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

  loadCSV(args, util) {
    this._loadCSV(args, util);
  }

  _loadCSV(args, util) {
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
          this.oArray = data.replace(/\r/g, '').split('\n').map((row) => row.split(',')).slice(0, -1);

          // 플래그 해제
          this.waitBlockFlag = false;
          console.log('loadCSV:', this.oArray);
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
    this.promise((reject) => this._missingValue(args.MISSINGVALUE, util, reject));
  }

  _missingValue(type, util, reject) {
    try {

      if (!this.oArray)
        return reject({ error: false, message: 'CSV 파일을 먼저 불러와주세요.' });

      const header = this.oArray.slice(0, 1);
      const tArray = nj.array(this.oArray.slice(1, Infinity).map(row => row.map(value => value == '' ? Infinity : parseFloat(value)))).T.tolist();
      const nArray = tArray.map(row => row.map(value => value == Infinity ? 1 : 0).reduce((prev, cur) => prev + cur));

      switch (type) {
        case 'zero':
          this.nArray = this.oArray.map(row => row.map(value => value == '' ? '0' : value));
          break;
        case 'mean':
          const meanArray = tArray.map((row, i) => (Math.max.apply(null, row.filter(value => value != Infinity)) + Math.min.apply(null, row.filter(value => value != Infinity))) / 2);
          this.nArray = header.concat(nj.array(tArray.map((row, i) => row.map(value => value == Infinity ? meanArray[i] : value))).T.tolist().map(row => row.map(value => String(value))));
          break;
        case 'min':
          const minArray = tArray.map(row => Math.min.apply(null, row.filter(value => value != Infinity)));
          this.nArray = header.concat(nj.array(tArray.map((row, i) => row.map(value => value == Infinity ? minArray[i] : value))).T.tolist().map(row => row.map(value => String(value))));
          break;
        case 'max':
          const maxArray = tArray.map(row => Math.max.apply(null, row.filter(value => value != Infinity)));
          this.nArray = header.concat(nj.array(tArray.map((row, i) => row.map(value => value == Infinity ? maxArray[i] : value))).T.tolist().map(row => row.map(value => String(value))));
          break;
        case 'average':
          const avgArray = tArray.map((row, i) => row.filter(value => value != Infinity).reduce((prev, cur) => prev + cur) / (row.length - nArray[i]));
          this.nArray = header.concat(nj.array(tArray.map((row, i) => row.map(value => value == Infinity ? avgArray[i] : value))).T.tolist().map(row => row.map(value => String(value))));
          break;
        case 'delete':
          this.nArray = header.concat(this.oArray.slice(1, Infinity).filter(row => row.filter(value => value == '')[0] != ''));
          break;
      }

      console.log('Missing Value:', this.nArray);
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
    this.promise((reject) => this._scale(args.SCALINGTYPE, util, reject));
  }

  _scale(type, util, reject) {
    try {

      if (!this.oArray)
        return reject({ error: false, message: 'CSV 파일을 먼저 불러와주세요.' });

      if (!this.nArray && this.oArray.filter(row => row.filter(value => value == '')[0] == '').length != 0)
        return reject({ error: false, message: '누락된 데이터값을 먼저 처리해주세요.' });

      const header = this.nArray.slice(0, 1);
      const tArray = nj.array(this.nArray.slice(1, Infinity).map(row => row.map(value => parseFloat(value)))).T.tolist();

      switch (type) {
        case 'normalization':
          this.sArray = header.concat(nj.array(tArray.map(row => row.map(value => (value - Math.min.apply(null, row)) / (Math.max.apply(null, row) - Math.min.apply(null, row))))).T.tolist().map(row => row.map(value => value.toFixed(5))));
          break;
        case 'standardization':
          const avg = tArray.map(row => (row.reduce((prev, cur) => prev + cur) / row.length));
          const standard_deviation = tArray.map((row, i) => Math.sqrt(row.map(value => Math.pow(value - avg[i], 2)).reduce((prev, cur) => prev + cur) / row.length));
          this.sArray = header.concat(nj.array(tArray.map((row, i) => row.map(value => (value - avg[i]) / standard_deviation[i]))).T.tolist().map(row => row.map(value => value.toFixed(5))));
          break;
        }

      console.log('Scaling:', this.sArray);
    }
    catch (e) {
      return reject({ error: true, message: e });
    }
  }

  getColumnList(args, util) {
    return this.promise((reject) => this._getColumnList(args.HEADER, util, reject));
  }

  _getColumnList(header, util, reject) {
    try {

      if (!this.oArray)
        return reject({ error: false, message: 'CSV 파일을 먼저 불러와주세요.' });

      if (!this.nArray && this.oArray.filter(row => row.filter(value => value == '')[0] == '').length != 0)
        return reject({ error: false, message: '누락된 데이터값을 먼저 처리해주세요.' });

      const tempArray = (this.dArray) ? this.dArray : ((this.sArray) ? this.sArray : (this.nArray ? this.nArray : this.oArray));

      const headers = tempArray.slice(0, 1)[0];
      const tArray = nj.array(tempArray.slice(1, Infinity).map(row => row.map(value => parseFloat(value)))).T.tolist();
      const rArray = nj.array([headers.map((h, i) => h == header ? tArray[i] : null).filter(row => row != null)[0]]).T.tolist();

      console.log('Get column list:', header, rArray);

      if (!rArray[0])
        return alert(`올바르지 않은 헤더입니다. (값: ${header})`);
      
      return (typeof rArray == 'number') ? String(rArray) : rArray.map(v => v.reduce((prev, cur) => String(prev) + ',' + String(cur))).reduce((prev, cur) => String(prev) + ' ' + String(cur));
    }
    catch (e) {
      return reject({ error: true, message: e });
    }
  }

  getRowList(args, util) {
    return this.promise((reject) => this._getRowList(args.INDEX, util, reject));
  }

  _getRowList(index, util, reject) {
    try {

      if (!this.oArray)
        return reject({ error: false, message: 'CSV 파일을 먼저 불러와주세요.' });

      if (!this.nArray && this.oArray.filter(row => row.filter(value => value == '')[0] == '').length != 0)
        return reject({ error: false, message: '누락된 데이터값을 먼저 처리해주세요.' });

      const tArray = (this.dArray) ? this.dArray : ((this.sArray) ? this.sArray : (this.nArray ? this.nArray : this.oArray));
      const rArray = [tArray[parseInt(index) - 1]];

      if (rArray == [])
        return reject({ error: false, message: `올바르지 않은 행 번호입니다. (값: ${index})` });

      console.log('Get row list:', rArray[0]);
      return (typeof rArray == 'number') ? String(rArray) : rArray.map(v => v.reduce((prev, cur) => String(prev) + ',' + String(cur))).reduce((prev, cur) => String(prev) + ' ' + String(cur));
    }
    catch (e) {
      return reject({ error: true, message: e });
    }
  }

  getValue(args, util) {
    return this.promise((reject) => this._getValue(args.HEADER, args.INDEX, util, reject));
  }

  _getValue(header, index, util, reject) {
    try {

      if (!this.oArray)
        return reject({ error: false, message: 'CSV 파일을 먼저 불러와주세요.' });

      if (!this.nArray && this.oArray.filter(row => row.filter(value => value == '')[0] == '').length != 0)
        return reject({ error: false, message: '누락된 데이터값을 먼저 처리해주세요.' });

      const tArray = (this.dArray) ? this.dArray : ((this.sArray) ? this.sArray : (this.nArray ? this.nArray : this.oArray));
      const result = tArray.slice(0, 1)[0].map((h, i) => h == header ? tArray.slice(1, Infinity).map((row, j) => j == (parseInt(index) - 1) ? row[i] : null) : null).filter(row => row != null)[0].filter(value => value != null)[0];
      
      if (!result)
        return reject({ error: false, message: `열 이름 또는 행 번호가 잘못되었습니다.` });

      console.log('Get value:', result);
      return String(result);
    }
    catch (e) {
      return reject({ error: true, message: e });
    }
  }

  getRowLength(args, util) {
    return this.promise((reject) => this._getRowLength(util, reject));
  }

  _getRowLength(util, reject) {
    try {

      if (!this.oArray)
        return reject({ error: false, message: 'CSV 파일을 먼저 불러와주세요.' });

      if (!this.nArray && this.oArray.filter(row => row.filter(value => value == '')[0] == '').length != 0)
        return reject({ error: false, message: '누락된 데이터값을 먼저 처리해주세요.' });

      const tArray = (this.dArray) ? this.dArray : ((this.sArray) ? this.sArray : (this.nArray ? this.nArray : this.oArray));
      return String(tArray.length);
    }
    catch (e) {
      return reject({ error: true, message: e });
    }
  }

  getColumnLength(args, util) {
    return this.promise((reject) => this._getColumnLength(util, reject));
  }

  _getColumnLength(util, reject) {
    try {

      if (!this.oArray)
        return reject({ error: false, message: 'CSV 파일을 먼저 불러와주세요.' });

      if (!this.nArray && this.oArray.filter(row => row.filter(value => value == '')[0] == '').length != 0)
        return reject({ error: false, message: '누락된 데이터값을 먼저 처리해주세요.' });

      const tArray = (this.dArray) ? this.dArray : ((this.sArray) ? this.sArray : (this.nArray ? this.nArray : this.oArray));
      return String(tArray[0].length);
    }
    catch (e) {
      return reject({ error: true, message: e });
    }
  }

  getHeaders(args, util) {
    return this.promise((reject) => this._getHeaders(util, reject));
  }

  _getHeaders(util, reject) {
    try {

      if (!this.oArray)
        return reject({ error: false, message: 'CSV 파일을 먼저 불러와주세요.' });

      if (!this.nArray && this.oArray.filter(row => row.filter(value => value == '')[0] == '').length != 0)
        return reject({ error: false, message: '누락된 데이터값을 먼저 처리해주세요.' });

      if (this.dArray)
        return reject({ error: false, message: '헤더를 찾을 수 없습니다.' });

      const tArray = (this.dArray) ? this.dArray : ((this.sArray) ? this.sArray : (this.nArray ? this.nArray : this.oArray));
      return [tArray[0]].map(v => v.reduce((prev, cur) => String(prev) + ',' + String(cur))).reduce((prev, cur) => String(prev) + ' ' + String(cur));
    }
    catch (e) {
      return reject({ error: true, message: e });
    }
  }

  deleteHeader(args, util) {
    this.promise((reject) => this._deleteHeader(util, reject));
  }

  _deleteHeader(util, reject) {
    try {

      if (!this.oArray)
        return reject({ error: false, message: 'CSV 파일을 먼저 불러와주세요.' });

      if (!this.nArray && this.oArray.filter(row => row.filter(value => value == '')[0] == '').length != 0)
        return reject({ error: false, message: '누락된 데이터값을 먼저 처리해주세요.' });

      if (this.dArray)
        return reject({ error: false, message: '헤더를 찾을 수 없습니다.' });

      const tArray = (this.dArray) ? this.dArray : ((this.sArray) ? this.sArray : (this.nArray ? this.nArray : this.oArray));
      this.dArray = tArray.slice(1, Infinity);

      console.log('Delete header:', this.dArray);
    }
    catch (e) {
      return reject({ error: true, message: e });
    }
  }

  deleteRow(args, util) {
    this.promise((reject) => this._deleteRow(args.INDEX, util, reject));
  }

  _deleteRow(index, util, reject) {
    try {

      if (!this.oArray)
        return reject({ error: false, message: 'CSV 파일을 먼저 불러와주세요.' });

      if (!this.nArray && this.oArray.filter(row => row.filter(value => value == '')[0] == '').length != 0)
        return reject({ error: false, message: '누락된 데이터값을 먼저 처리해주세요.' });

      const tArray = (this.dArray) ? this.dArray : ((this.sArray) ? this.sArray : (this.nArray ? this.nArray : this.oArray));

      if (this.dArray)
        this.sArray = tArray.filter((row, i) => i != (parseInt(index) - 1));
      else
        this.dArray = tArray.filter((row, i) => i != (parseInt(index) - 1));

      console.log('Delete row:', (headers) ? this.sArray : this.dArray);
    }
    catch (e) {
      return reject({ error: true, message: e });
    }
  }

  deleteColumn(args, util) {
    this.promise((reject) => this._deleteColumn(args.INDEX, util, reject));
  }

  _deleteColumn(index, util, reject) {
    try {

      if (!this.oArray)
        return reject({ error: false, message: 'CSV 파일을 먼저 불러와주세요.' });

      if (!this.nArray && this.oArray.filter(row => row.filter(value => value == '')[0] == '').length != 0)
        return reject({ error: false, message: '누락된 데이터값을 먼저 처리해주세요.' });

      const tempArray = (this.dArray) ? this.dArray : ((this.sArray) ? this.sArray : (this.nArray ? this.nArray : this.oArray));
      const headers = (this.dArray) ? undefined: [tempArray.slice(0, 1)[0].filter((header, i) => i != (parseInt(index) - 1))];

      const rArray = nj.array(nj.array((!headers) ? tempArray.map(row => row.map(value => parseFloat(value))) : tempArray.slice(1, Infinity).map(row => row.map(value => parseFloat(value)))).T.tolist().filter((row, i) => i != (parseInt(index) - 1))).T.tolist();
      
      if (headers)
        this.sArray = headers.concat(rArray).map(row => row.map(value => String(value)));
      else
        this.dArray = rArray.map(row => row.map(value => String(value)));

      console.log('Delete column:', (headers) ? this.sArray : this.dArray);
    }
    catch (e) {
      return reject({ error: true, message: e });
    }
  }

  saveLocal(args, util) {
    this.promise((reject) => this._saveLocal(args.FILE, util, reject));
  }

  _saveLocal(file, util, reject) {
    try {

      if (!this.oArray)
        return reject({ error: false, message: '저장할 데이터가 없습니다.' });

      // csv 파일
      const filename = `big_data_${new Date().getTime()}.csv`;
      const tempArray = (this.dArray) ? this.dArray : ((this.sArray) ? this.sArray : (this.nArray ? this.nArray : this.oArray));
      const csvFromArrayOfArrays  = convertArrayToCSV(tempArray);

      console.log(csvFromArrayOfArrays);

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