const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const formatMessage = require('format-message');
const timeFormatter = require('../../util/time-formatter');

const { convertArrayToCSV } = require('convert-array-to-csv');
const jimp = require('jimp');
const cheerio = require('cheerio');
const axios = require('axios');

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

const CRAWLINGSITE = {
  MELON:'melon',
  INSTAGRAM:'instagram',
  DAUM:'daum'
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

const downloadCSV = (data) => {
  const filename = `big_data_${new Date().getTime()}.csv`;
  const csvFromArrayOfArrays  = convertArrayToCSV(data);

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

class Scratch3BigDataBlocks {

  static get EXTESNION_NAME() {
    return 'BigData';
  }


  static get EXTENSION_ID() {
    return 'bigData';
  }

  constructor(runtime) {
    this.runtime = runtime;
    this.waitBlockFlag = {};

    this.data = {};
    this.type = {};
    this.crawling = {};
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
          opcode: 'autoLabelAtAll',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'bigData.autoLabelAtAll',
            default: 'auto labeling [STORAGE] at all',
            description: 'auto labeling at all'
          }),
          arguments: {
            STORAGE: {
              type: ArgumentType.STRING,
              defaultValue: ' '
            }
          }
        },
        {
          opcode: 'autoLabelAtIndex',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'bigData.autoLabelAtIndex',
            default: 'auto labeling [STORAGE] at [INDEX]',
            description: 'auto labeling at index'
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
          opcode: 'remainRow',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'bigData.remainRow',
            default: 'remain [STORAGE] row at [INDEX]',
            description: 'remain row at index'
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
          opcode: 'remainColumn',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'bigData.remainColumn',
            default: 'remain [STORAGE] column at [INDEX]',
            description: 'remain column at index'
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
          opcode: 'getAllList',
          blockType: BlockType.REPORTER,
          text: formatMessage({
            id: 'bigData.getAllList',
            default: 'get [STORAGE] data',
            description: 'get list data'
          }),
          arguments: {
            STORAGE: {
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
        {
          opcode: 'loadImage',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'bigData.loadImage',
            default: 'save [STORAGE] from image file',
            description: 'save data from your image file'
          }),
          arguments: {
            STORAGE: {
              type: ArgumentType.STRING,
              defaultValue: ' '
            }
          }
        },
        {
          opcode: 'resizeImage',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'bigData.resizeImage',
            default: 'resize [STORAGE] image width [WIDTH] height [HEIGHT]',
            description: 'resize image width height'
          }),
          arguments: {
            STORAGE: {
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
            }
          }
        },
        {
          opcode: 'modifierGreyscale',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'bigData.modifierGreyscale',
            default: 'modifier [STORAGE] image to greyscale with amount [AMOUNT]',
            description: 'resize image width height'
          }),
          arguments: {
            STORAGE: {
              type: ArgumentType.STRING,
              defaultValue: ' '
            },
            AMOUNT: {
              type: ArgumentType.STRING,
              defaultValue: ' '
            },
          }
        },
        {
          opcode: 'getImageList',
          blockType: BlockType.REPORTER,
          text: formatMessage({
            id: 'bigData.getImageList',
            default: 'get [STORAGE] list',
            description: 'get list'
          }),
          arguments: {
            STORAGE: {
              type: ArgumentType.STRING,
              defaultValue: ' '
            }
          }
        },
        {
          opcode: 'getSizeImageLabel',
          blockType: BlockType.REPORTER,
          text: formatMessage({
            id: 'bigData.getSizeImageLabel',
            default: 'get [STORAGE] size of label',
            description: 'get size of list'
          }),
          arguments: {
            STORAGE: {
              type: ArgumentType.STRING,
              defaultValue: ' '
            }
          }
        },
        {
          opcode: 'saveImageLocal',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'bigData.saveImageLocal',
            default: 'save [STORAGE]at label [LABEL], index [INDEX]on local PC',
            description: 'get size of list'
          }),
          arguments: {
            STORAGE: {
              type: ArgumentType.STRING,
              defaultValue: ' '
            },
            LABEL: {
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
          opcode: 'showViewer',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'bigData.showViewer',
            default: 'show [STORAGE] on viewer',
            description: 'show on viewer'
          }),
          arguments: {
            STORAGE: {
              type: ArgumentType.STRING,
              defaultValue: ' '
            }
          }
        },
        {
          opcode: 'crawlingURL',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'bigData.crawlingURL',
            default: 'set choose [CRAWLINGSITE]',
            description: 'set choose url'
          }),
          arguments: {
            CRAWLINGSITE: {
              type: ArgumentType.STRING,
              menu: 'CRAWLINGSITE',
              defaultValue: CRAWLINGSITE.MELON
            },
          }
        },
        {
          opcode: 'crawlingLogin',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'bigData.crawlingLogin',
            default: 'enter [IDENTITY] [PASSWORD]',
            description: 'enter id, pw'
          }),
          arguments: {
            IDENTITY: {
              type: ArgumentType.STRING,
              defaultValue: ' '
            },
            PASSWORD: {
              type: ArgumentType.STRING,
              defaultValue: ' '
            }
          }
        },
        {
          opcode: 'crawlingWord',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'bigData.crawlingWord',
            default: 'search [WORD]',
            description: 'search word'
          }),
          arguments: {
            WORD: {
              type: ArgumentType.STRING,
              defaultValue: ' '
            }
          }
        },
        {
          opcode: 'crawlingExecute',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'bigData.crawlingExecute',
            default: '[NUMBER] Execute crawling and save csv',
            description: 'Execution crawling and save csv'
          }),
          arguments: {
            NUMBER: {
              type: ArgumentType.STRING,
              defaultValue:' '
            }
          }
        },
      ],
      menus: {
        MISSINGVALUE: this.MISSINGVALUE_MENU,
        SCALINGTYPE: this.SCALINGTYPE_MENU,
        CRAWLINGSITE:this.CRAWLINGSITE_MENU
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
            document.body.children[4].children[0].children[3].children[0].children[1].innerText = '작업을 처리하는 중';

            clearInterval(timer);
            return reject(message);
          }));
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
      this.waitBlockFlag[storage] = true;

      const file = document.createElement('input');
      file.type = 'file';
      file.accept = '.csv';

      file.onchange = (event) => {

        const reader = new FileReader();
        reader.readAsText(event.target.files[0], 'utf-8');
        reader.onload = (e) => {

          const data = e.target.result;
          this.data[storage] = data.replace(/\r/g, '').split('\n').map((row) => row.split(',').map((v) => v.trim())).slice(0, -1);
          this.type[storage] = 'csv';

          // 플래그 해제
          this.waitBlockFlag[storage] = false;
          console.log('Load CSV:', storage, this.data[storage]);
        }
      };

      file.click();
    } catch (e) {
      return console.error(e);
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
    this.promise(args.STORAGE, (reject) => this._missingValue(args.STORAGE, args.MISSINGVALUE, util, reject));
  }

  _missingValue(storage, type, util, reject) {
    try {

      if (!this.data[storage] || (this.type[storage] != 'csv'))
        return reject({ error: false, message: '오류: CSV 파일을 먼저 불러와주세요.\n블록 위치: 누락 데이터 처리' });

      const getRandomInt = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
      }

      const tArray = (this.hasHeader(this.data[storage])) ? T(this.data[storage].slice(1, Infinity).map(row => row.map(value => value == '' ? Infinity : (isNaN(parseFloat(value)) ? value : parseInt(value))))) : T(this.data[storage].map(row => row.map(value => value == '' ? Infinity : (isNaN(parseFloat(value)) ? value : parseInt(value)))));
      const nArray = tArray.map(row => row.map(value => value == Infinity ? 1 : 0).reduce((prev, cur) => prev + cur));
      let rArray;

      switch (type) {
        case 'zero':
          this.data[storage] = this.data[storage].map(row => row.map(value => value == '' ? '0' : value));
          break;

        case 'mean':
          const meanArray = tArray.map((row, i) => (Math.max.apply(null, row.filter(value => value != Infinity)) + Math.min.apply(null, row.filter(value => value != Infinity))) / 2);
          rArray = T(tArray.map((row, i) => row.map(value => value == Infinity ? meanArray[i] : value))).map(row => row.map(value => isNaN(parseFloat(value)) ? ((typeof value == 'number') ? '' : value) : value.toFixed(8)));

          this.data[storage] = (this.hasHeader(this.data[storage])) ? this.data[storage].slice(0, 1).concat(rArray) : rArray;
          break;

        case 'min':
          const minArray = tArray.map(row => Math.min.apply(null, row.filter(value => value != Infinity)));
          rArray = T(tArray.map((row, i) => row.map(value => value == Infinity ? minArray[i] : value))).map(row => row.map(value => isNaN(parseFloat(value)) ? ((typeof value == 'number') ? '' : value) : value.toFixed(8)));

          this.data[storage] = (this.hasHeader(this.data[storage])) ? this.data[storage].slice(0, 1).concat(rArray) : rArray;
          break;

        case 'max':
          const maxArray = tArray.map(row => Math.max.apply(null, row.filter(value => value != Infinity)));
          rArray = T(tArray.map((row, i) => row.map(value => value == Infinity ? maxArray[i] : value))).map(row => row.map(value => isNaN(parseFloat(value)) ? ((typeof value == 'number') ? '' : value) : value.toFixed(8)));

          this.data[storage] = (this.hasHeader(this.data[storage])) ? this.data[storage].slice(0, 1).concat(rArray) : rArray;
          break;

        case 'average':
          const avgArray = tArray.map((row, i) => row.filter(value => value != Infinity).reduce((prev, cur) => prev + cur) / (row.length - nArray[i]));
          rArray = T(tArray.map((row, i) => row.map(value => value == Infinity ? avgArray[i] : value))).map(row => row.map(value => isNaN(parseFloat(value)) ? ((typeof value == 'number') ? '' : value) : value.toFixed(8)));

          this.data[storage] = (this.hasHeader(this.data[storage])) ? this.data[storage].slice(0, 1).concat(rArray) : rArray;
          break;

        case 'delete':
          this.data[storage] = (this.hasHeader(this.data[storage])) ? this.data[storage].slice(0, 1).concat(this.data[storage].slice(1, Infinity).filter(row => row.filter(value => value == '')[0] != '')) : this.data[storage].filter(row => row.filter(value => value == '')[0] != '');
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
    this.promise(args.STORAGE, (reject) => this._scale(args.STORAGE, args.SCALINGTYPE, util, reject));
  }

  _scale(storage, type, util, reject) {
    try {

      if (!this.data[storage] || (this.type[storage] != 'csv'))
        return reject({ error: false, message: '오류: CSV 파일을 먼저 불러와주세요.\n블록 위치: 스케일링' });

      if (this.data[storage].slice(1, Infinity).filter(row => row.filter(value => value == '')[0] == '').length != 0)
        return reject({ error: false, message: '오류: 누락된 데이터값을 먼저 처리해주세요.\n블록 위치: 스케일링' });

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

  autoLabelAtAll(args, util) {
    this.promise(args.STORAGE, (reject) => this._autoLabelAtAll(args.STORAGE, util, reject));
  }

  _autoLabelAtAll(storage, util, reject) {
    try {

      if (!this.data[storage] || (this.type[storage] != 'csv'))
        return reject({ error: false, message: '오류: CSV 파일을 먼저 불러와주세요.\n블록 위치: 스케일링' });

      if (this.data[storage].slice(1, Infinity).filter(row => row.filter(value => value == '')[0] == '').length != 0)
        return reject({ error: false, message: '오류: 누락된 데이터값을 먼저 처리해주세요.\n블록 위치: 스케일링' });

      let tArray = (this.hasHeader(this.data[storage])) ? T(this.data[storage].slice(1, Infinity)) : T(this.data[storage]);
      tArray = tArray.map((row, i) => {
        const token = Array.from(new Set(row)).sort();

        if (token.map((v) => (isNaN(parseFloat(v))) ? 1 : 0).reduce((prev, cur) => prev + cur) == 0)
          return row;
        
        return row.map(v => token.findIndex((w) => v == w).toFixed(8));
      });

      this.data[storage] = (this.hasHeader(this.data[storage])) ? this.data[storage].slice(0, 1).concat(T(tArray)) : T(tArray);
      console.log('Auto label at all:', storage, this.data[storage]);
    }
    catch (e) {
      return reject({ error: true, message: e });
    }
  }

  autoLabelAtIndex(args, util) {
    this.promise(args.STORAGE, (reject) => this._autoLabelAtIndex(args.STORAGE, args.INDEX, util, reject));
  }

  _autoLabelAtIndex(storage, index, util, reject) {
    try {

      if (!this.data[storage] || (this.type[storage] != 'csv'))
        return reject({ error: false, message: '오류: CSV 파일을 먼저 불러와주세요.\n블록 위치: 스케일링' });

      if (this.data[storage].slice(1, Infinity).filter(row => row.filter(value => value == '')[0] == '').length != 0)
        return reject({ error: false, message: '오류: 누락된 데이터값을 먼저 처리해주세요.\n블록 위치: 스케일링' });

      let tArray = (this.hasHeader(this.data[storage])) ? T(this.data[storage].slice(1, Infinity)) : T(this.data[storage]);
      String(index).trim().split(',').map(i => {
        const token = Array.from(new Set(tArray[parseInt(i) - 1])).sort();

        if (token.filter((v) => (isNaN(parseFloat(v))) ? 1 : 0).reduce((prev, cur) => prev + cur) > 0)
          return;

        tArray = tArray.map((row, j) => (j == parseInt(i) - 1) ? (row.map(v => token.findIndex((w) => v == w).toFixed(8))) : row);
      });

      this.data[storage] = (this.hasHeader(this.data[storage])) ? this.data[storage].slice(0, 1).concat(T(tArray)) : T(tArray);
      console.log('Auto label:', storage, this.data[storage]);
    }
    catch (e) {
      return reject({ error: true, message: e });
    }
  }

  getAllList(args, util) {
    return this.promise(args.STORAGE, (reject) => this._getAllList(args.STORAGE, util, reject));
  }

  _getAllList(storage, util, reject) {
    try {

      if (!this.data[storage] || (this.type[storage] != 'csv'))
        return reject({ error: false, message: '오류: CSV 파일을 먼저 불러와주세요.\n블록 위치: 열 가져오기' });

      if (this.data[storage].slice(1, Infinity).filter(row => row.filter(value => value == '')[0] == '').length != 0)
        return reject({ error: false, message: '오류: 누락된 데이터값을 먼저 처리해주세요.\n블록 위치: 열 가져오기' });

      console.log('Get list:', storage, this.data[storage]);
      return (typeof this.data[storage] == 'number') ? this.data[storage].toFixed(8) : this.data[storage].map(v => v.reduce((prev, cur) => ((typeof prev == 'string') ? prev : prev.toFixed(8)) + ',' + ((typeof cur == 'string') ? cur: cur.toFixed(8)))).reduce((prev, cur) => ((typeof prev == 'string') ? prev : prev.toFixed(8)) + ' ' + ((typeof cur == 'string') ? cur: cur.toFixed(8)))
    }
    catch (e) {
      return reject({ error: true, message: e });
    }
  }

  getColumnList(args, util) {
    return this.promise(args.STORAGE, (reject) => this._getColumnList(args.STORAGE, args.INDEX, util, reject));
  }

  _getColumnList(storage, index, util, reject) {
    try {

      if (!this.data[storage] || (this.type[storage] != 'csv'))
        return reject({ error: false, message: '오류: CSV 파일을 먼저 불러와주세요.\n블록 위치: 열 가져오기' });

      if (this.data[storage].slice(1, Infinity).filter(row => row.filter(value => value == '')[0] == '').length != 0)
        return reject({ error: false, message: '오류: 누락된 데이터값을 먼저 처리해주세요.\n블록 위치: 열 가져오기' });

      const tArray = (this.hasHeader(this.data[storage])) ? T(this.data[storage].slice(1, Infinity).map(row => row.map(value => parseFloat(value)))) : T(this.data[storage].map(row => row.map(value => parseFloat(value))));

      if (parseInt(index) - 1 >= tArray.length)
        return alert(`오류: 배열의 참조 범위를 초과했습니다. (값: ${index}})\n블록 위치: 열 가져오기`);
      
      const nArray = [];
      String(index).trim().split(',').map(i => {
        nArray.push(tArray[parseInt(i) - 1]);
      });
    
      const rArray = T(nArray);
      console.log('Get column list:', storage, rArray);
      return (typeof rArray == 'number') ? rArray.toFixed(8) : rArray.map(v => v.reduce((prev, cur) => ((typeof prev == 'string') ? prev : prev.toFixed(8)) + ',' + ((typeof cur == 'string') ? cur: cur.toFixed(8)))).reduce((prev, cur) => ((typeof prev == 'string') ? prev : prev.toFixed(8)) + ' ' + ((typeof cur == 'string') ? cur: cur.toFixed(8)))
    }
    catch (e) {
      return reject({ error: true, message: e });
    }
  }

  getRowList(args, util) {
    return this.promise(args.STORAGE, (reject) => this._getRowList(args.STORAGE, args.INDEX, util, reject));
  }

  _getRowList(storage, index, util, reject) {
    try {

      if (!this.data[storage] || (this.type[storage] != 'csv'))
        return reject({ error: false, message: '오류: CSV 파일을 먼저 불러와주세요.\n블록 위치: 행 가져오기' });

      if (this.data[storage].slice(1, Infinity).filter(row => row.filter(value => value == '')[0] == '').length != 0)
        return reject({ error: false, message: '오류: 누락된 데이터값을 먼저 처리해주세요.\n블록 위치: 행 가져오기' });

      const rArray = [];
      String(index).trim().split(',').map(i => {
        rArray.push(this.data[storage][parseInt(i) - 1]);
      });

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
    return this.promise(args.STORAGE, (reject) => this._getValue(args.STORAGE, args.ROWINDEX, args.COLUMNINDEX, util, reject));
  }

  _getValue(storage, row_index, column_index, util, reject) {
    try {

      if (!this.data[storage] || (this.type[storage] != 'csv'))
        return reject({ error: false, message: '오류: CSV 파일을 먼저 불러와주세요.\n블록 위치: 값 가져오기' });

      if (this.data[storage].slice(1, Infinity).filter(row => row.filter(value => value == '')[0] == '').length != 0)
        return reject({ error: false, message: '오류: 누락된 데이터값을 먼저 처리해주세요.\n블록 위치: 값 가져오기' });

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
    return this.promise(args.STORAGE, (reject) => this._getRowLength(args.STORAGE, util, reject));
  }

  _getRowLength(storage, util, reject) {
    try {

      if (!this.data[storage] || (this.type[storage] != 'csv'))
        return reject({ error: false, message: '오류: CSV 파일을 먼저 불러와주세요.\n블록 위치: 행 크기' });

      if (this.data[storage].slice(1, Infinity).filter(row => row.filter(value => value == '')[0] == '').length != 0)
        return reject({ error: false, message: '오류: 누락된 데이터값을 먼저 처리해주세요.\n블록 위치: 행 크기' });

      return String(this.data[storage].length);
    }
    catch (e) {
      return reject({ error: true, message: e });
    }
  }

  getColumnLength(args, util) {
    return this.promise(args.STORAGE, (reject) => this._getColumnLength(args.STORAGE, util, reject));
  }

  _getColumnLength(storage, util, reject) {
    try {

      if (!this.data[storage] || (this.type[storage] != 'csv'))
        return reject({ error: false, message: '오류: CSV 파일을 먼저 불러와주세요.\n블록 위치: 열 크기' });

      if (this.data[storage].slice(1, Infinity).filter(row => row.filter(value => value == '')[0] == '').length != 0)
        return reject({ error: false, message: '오류: 누락된 데이터값을 먼저 처리해주세요.\n블록 위치: 열 크기' });

      return String(this.data[storage][0].length);
    }
    catch (e) {
      return reject({ error: true, message: e });
    }
  }

  getHeaders(args, util) {
    return this.promise(args.STORAGE, (reject) => this._getHeaders(args.STORAGE, util, reject));
  }

  _getHeaders(storage, util, reject) {
    try {

      if (!this.data[storage] || (this.type[storage] != 'csv'))
        return reject({ error: false, message: '오류: CSV 파일을 먼저 불러와주세요.\n블록 위치: 헤더 가져오기' });

      if (this.data[storage].slice(1, Infinity).filter(row => row.filter(value => value == '')[0] == '').length != 0)
        return reject({ error: false, message: '오류: 누락된 데이터값을 먼저 처리해주세요.\n블록 위치: 헤더 가져오기' });

      if (!this.hasHeader(this.data[storage]))
        return reject({ error: false, message: '오류: 헤더를 찾을 수 없습니다.\n블록 위치: 헤더 가져오기' });

      return [this.data[storage][0]].map(v => v.reduce((prev, cur) => ((typeof prev == 'string') ? prev : prev.toFixed(8)) + ',' + ((typeof cur == 'string') ? cur: cur.toFixed(8)))).reduce((prev, cur) => ((typeof prev == 'string') ? prev : prev.toFixed(8)) + ' ' + ((typeof cur == 'string') ? cur: cur.toFixed(8)))
    }
    catch (e) {
      return reject({ error: true, message: e });
    }
  }

  deleteHeader(args, util) {
    this.promise(args.STORAGE, (reject) => this._deleteHeader(args.STORAGE, util, reject));
  }

  _deleteHeader(storage, util, reject) {
    try {

      if (!this.data[storage] || (this.type[storage] != 'csv'))
        return reject({ error: false, message: '오류: CSV 파일을 먼저 불러와주세요.\n블록 위치: 헤더 삭제' });

      if (this.data[storage].slice(1, Infinity).filter(row => row.filter(value => value == '')[0] == '').length != 0)
        return reject({ error: false, message: '오류: 누락된 데이터값을 먼저 처리해주세요.\n블록 위치: 헤더 삭제' });

      if (!this.hasHeader(this.data[storage]))
        return reject({ error: false, message: '오류: 헤더를 찾을 수 없습니다.\n블록 위치: 헤더 삭제' });

      this.data[storage] = this.data[storage].slice(1, Infinity);
      console.log('Delete header:', storage, this.data[storage]);
    }
    catch (e) {
      return reject({ error: true, message: e });
    }
  }

  deleteRow(args, util) {
    this.promise(args.STORAGE, (reject) => this._deleteRow(args.STORAGE, args.INDEX, util, reject));
  }

  _deleteRow(storage, index, util, reject) {
    try {

      if (!this.data[storage] || (this.type[storage] != 'csv'))
        return reject({ error: false, message: '오류: CSV 파일을 먼저 불러와주세요.\n블록 위치: 행 삭제' });

      if (this.data[storage].slice(1, Infinity).filter(row => row.filter(value => value == '')[0] == '').length != 0)
        return reject({ error: false, message: '오류: 누락된 데이터값을 먼저 처리해주세요.\n블록 위치: 행 삭제' });

      this.data[storage] = this.data[storage].filter((row, i) => i != (parseInt(index) - 1));
      console.log('Delete row:', storage, this.data[storage]);
    }
    catch (e) {
      return reject({ error: true, message: e });
    }
  }

  deleteColumn(args, util) {
    this.promise(args.STORAGE, (reject) => this._deleteColumn(args.STORAGE, args.INDEX, util, reject));
  }

  _deleteColumn(storage, index, util, reject) {
    try {

      if (!this.data[storage] || (this.type[storage] != 'csv'))
        return reject({ error: false, message: '오류: CSV 파일을 먼저 불러와주세요.\n블록 위치: 열 삭제' });

      if (this.data[storage].slice(1, Infinity).filter(row => row.filter(value => value == '')[0] == '').length != 0)
        return reject({ error: false, message: '오류: 누락된 데이터값을 먼저 처리해주세요.\n블록 위치: 열 삭제' });

      const headers = (this.hasHeader(this.data[storage])) ? [this.data[storage].slice(0, 1)[0].filter((header, i) => i != (parseInt(index) - 1))] : undefined;
      const rArray = T(T((!headers) ? this.data[storage].map(row => row.map(value => parseFloat(value))) : this.data[storage].slice(1, Infinity).map(row => row.map(value => parseFloat(value)))).filter((row, i) => i != (parseInt(index) - 1)));
      
      this.data[storage] = (headers) ? headers.concat(rArray).map(row => row.map(value => (typeof value == 'string') ? value : value.toFixed(8))) : rArray.map(row => row.map(value => (typeof value == 'string') ? value : value.toFixed(8)));
      console.log('Delete column:', storage, this.data[storage]);
    }
    catch (e) {
      return reject({ error: true, message: e });
    }
  }

  remainRow(args, util) {
    this.promise(args.STORAGE, (reject) => this._remainRow(args.STORAGE, args.INDEX, util, reject));
  }

  _remainRow(storage, index, util, reject) {
    try {

      if (!this.data[storage] || (this.type[storage] != 'csv'))
        return reject({ error: false, message: '오류: CSV 파일을 먼저 불러와주세요.\n블록 위치: 행 삭제' });

      if (this.data[storage].slice(1, Infinity).filter(row => row.filter(value => value == '')[0] == '').length != 0)
        return reject({ error: false, message: '오류: 누락된 데이터값을 먼저 처리해주세요.\n블록 위치: 행 삭제' });

      this.data[storage] = this.data[storage].filter((row, i) => i == (parseInt(index) - 1));
      console.log('Delete row:', storage, this.data[storage]);
    }
    catch (e) {
      return reject({ error: true, message: e });
    }
  }

  remainColumn(args, util) {
    this.promise(args.STORAGE, (reject) => this._remainColumn(args.STORAGE, args.INDEX, util, reject));
  }

  _remainColumn(storage, index, util, reject) {
    try {

      if (!this.data[storage] || (this.type[storage] != 'csv'))
        return reject({ error: false, message: '오류: CSV 파일을 먼저 불러와주세요.\n블록 위치: 열 삭제' });

      if (this.data[storage].slice(1, Infinity).filter(row => row.filter(value => value == '')[0] == '').length != 0)
        return reject({ error: false, message: '오류: 누락된 데이터값을 먼저 처리해주세요.\n블록 위치: 열 삭제' });

      const headers = (this.hasHeader(this.data[storage])) ? [this.data[storage].slice(0, 1)[0].filter((header, i) => i == (parseInt(index) - 1))] : undefined;
      const rArray = T(T((!headers) ? this.data[storage].map(row => row.map(value => parseFloat(value))) : this.data[storage].slice(1, Infinity).map(row => row.map(value => parseFloat(value)))).filter((row, i) => i == (parseInt(index) - 1)));
      
      this.data[storage] = (headers) ? headers.concat(rArray).map(row => row.map(value => (typeof value == 'string') ? value : value.toFixed(8))) : rArray.map(row => row.map(value => (typeof value == 'string') ? value : value.toFixed(8)));
      console.log('Delete column:', storage, this.data[storage]);
    }
    catch (e) {
      return reject({ error: true, message: e });
    }
  }

  saveLocal(args, util) {
    this.promise(args.STORAGE, (reject) => this._saveLocal(args.STORAGE, args.FILE, util, reject));
  }

  _saveLocal(storage, file, util, reject) {
    try {

      if (!this.data[storage] || (this.type[storage] != 'csv'))
        return reject({ error: false, message: '오류: 저장할 데이터가 없습니다.\n블록 위치: CSV 저장' });

      downloadCSV(this.data[storage]);
    }
    catch (e) {
      return reject({ error: true, message: e });
    }
  }

  loadImage(args, util) {
    this._loadImage(args.STORAGE, util);
  }

  _loadImage(storage, util) {
    try {

      this.waitBlockFlag[storage] = true;

      const picker = document.createElement('input');
      picker.type = 'file';
      picker.accept = '.jpg, .jpeg, .png';
      picker.webkitdirectory = 'webkitdirectory';
      picker.multiple = true;

      picker.addEventListener('change', (e) => {
        this.data[storage] = {};
        for (var i = 0; i < picker.files.length; i++) {

          // 파일 & 라벨
          const file = picker.files[i];
          const label = file.webkitRelativePath.split('/')[1];

          // 라벨링을 위한 공간 생성
          if (!this.data[storage][label])
              this.data[storage][label] = [];

          // 파일 읽어오기
          const reader = new FileReader();
          reader.readAsArrayBuffer(file);
          reader.onload = (e) => this.data[storage][label].push(e.target?.result);
          this.type[storage] = 'image';
        }

        // 플래그 해제
        this.waitBlockFlag[storage] = false;

        console.log('Load images:', storage, this.data[storage]);
      });

      picker.click();
    } catch (e) {
      this.waitBlockFlag[storage] = false;
      return console.error(e);
    }
  }

  resizeImage(args, util) {
    this.promise(args.STORAGE, (reject) => this._resizeImage(args.STORAGE, args.WIDTH, args.HEIGHT, util, reject));
  }

  _resizeImage(storage, width, height, util, reject) {
    try {
      if (!this.data[storage] || (this.type[storage] != 'image'))
        return reject({ error: false, message: '오류: 이미지 파일을 먼저 불러와주세요.\n블록 위치: 크기 조절' });

      (async() => {
        try {

          this.waitBlockFlag[storage] = true;
          document.body.children[4].children[0].children[3].style.display = 'flex';
          document.body.children[4].children[0].children[3].children[0].children[1].innerText = '이미지 크기 조절 중';

          const labels = Object.keys(this.data[storage]);
          for (const label of labels) {

            let images = [];
            const startTime = new Date().getTime();
            for (const data of this.data[storage][label]) {
              const image = await jimp.read(data);
              const resizedImage = await image.resize((width == 'auto') ? jimp.auto : parseInt(width), (height == 'auto') ? jimp.auto : parseInt(height));
              const buffer = await resizedImage.getBufferAsync(jimp.AUTO);
              images.push(buffer);

              const percentage = Math.round(images.length / this.data[storage][label].length * 100);
              const remainTime = Math.round(((new Date().getTime() - startTime) / percentage) * (100 - percentage) / 1000);
              document.body.children[4].children[0].children[3].children[0].children[2].children[0].children[0].innerText = `${label}: ${percentage}%...(남은 시간: ${timeFormatter(remainTime)})`;
            }

            this.data[storage][label] = images;
          }
          
          this.waitBlockFlag[storage] = false;
          document.body.children[4].children[0].children[3].style.display = 'none';
          document.body.children[4].children[0].children[3].children[0].children[1].innerText = '작업을 처리하는 중';

          console.log('Resize image:', storage, this.data[storage]);
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

  modifierGreyscale(args, util) {
    this.promise(args.STORAGE, (reject) => this._modifierGreyscale(args.STORAGE, args.AMOUNT, util, reject));
  }

  _modifierGreyscale(storage, amount, util, reject) {
    try {
      if (!this.data[storage] || (this.type[storage] != 'image'))
        return reject({ error: false, message: '오류: 이미지 파일을 먼저 불러와주세요.\n블록 위치: 회색조 변환' });

      (async() => {
        try {

          this.waitBlockFlag[storage] = true;
          document.body.children[4].children[0].children[3].style.display = 'flex';
          document.body.children[4].children[0].children[3].children[0].children[1].innerText = '회색조 필터 적용 중';

          const labels = Object.keys(this.data[storage]);
          for (const label of labels) {

            let images = [];
            const startTime = new Date().getTime();
            for (const data of this.data[storage][label]) {
              const image = await jimp.read(data);
              const greyImage = await image.color([{ apply: 'greyscale', params: [parseInt(amount)] }]);
              const buffer = await greyImage.getBufferAsync(jimp.AUTO);
              images.push(buffer);

              const percentage = Math.round(images.length / this.data[storage][label].length * 100);
              const remainTime = Math.round(((new Date().getTime() - startTime) / percentage) * (100 - percentage) / 1000);
              document.body.children[4].children[0].children[3].children[0].children[2].children[0].children[0].innerText = `${label}: ${percentage}%...(남은 시간: ${timeFormatter(remainTime)})`;
            }

            this.data[storage][label] = images;
          }
          
          this.waitBlockFlag[storage] = false;
          document.body.children[4].children[0].children[3].style.display = 'none';
          document.body.children[4].children[0].children[3].children[0].children[1].innerText = '작업을 처리하는 중';

          console.log('Modifier greyscale:', storage, this.data[storage]);
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

  getImageList(args, util) {
    return this.promise(args.STORAGE, (reject) => this._getImageList(args.STORAGE, util, reject));
  }

  _getImageList(storage, util, reject) {
    try {
      if (!this.data[storage] || (this.type[storage] != 'image'))
        return reject({ error: false, message: '오류: 이미지 파일을 먼저 불러와주세요.\n블록 위치: 텐서 변환' });

      const labels = Object.keys(this.data[storage]);
      const newData = {};

      for (const label of labels) {
        newData[label] = this.data[storage][label].map((data) => new Buffer(data).toString('base64'));
      }

      console.log('Convert to tensor:', storage, newData);
      return JSON.stringify({
        code: 'getImageList',
        data: newData
      });
    }
    catch (e) {
      return reject({ error: true, message: e });
    }
  }

  getSizeImageLabel(args, util) {
    return this.promise(args.STORAGE, (reject) => this._getSizeImageLabel(args.STORAGE, util, reject));
  }

  _getSizeImageLabel(storage, util, reject) {
    try {
      if (!this.data[storage] || (this.type[storage] != 'image'))
        return reject({ error: false, message: '오류: 이미지 파일을 먼저 불러와주세요.\n블록 위치: 라벨 갯수' });

      return String(Object.keys(this.data[storage]).length);
    }
    catch (e) {
      return reject({ error: true, message: e });
    }
  }

  saveImageLocal(args, util) {
    this.promise(args.STORAGE, (reject) => this._saveImageLocal(args.STORAGE, args.LABEL, args.INDEX, util, reject));
  }

  _saveImageLocal(storage, label, index, util, reject) {
    try {

      if (!this.data[storage] || (this.type[storage] != 'image'))
        return reject({ error: false, message: '오류: 이미지 파일을 먼저 불러와주세요.\n블록 위치: 이미지 저장' });

      // image 파일
      const filename = `${label}_${index}.png`;
      const imgData = new Buffer(this.data[storage][label][parseInt(index) - 1]).toString('base64');
      const imgView = new Uint8Array(new ArrayBuffer(imgData.length));

      imgData.split('').map((v, i) => {
        imgView[i] = imgData.charCodeAt(i) & 0xff;
      });

      // IE 10, 11, Edge Run
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        var blob = new Blob([imgView], {
            type: 'application/octet-stream'
        });
      
        window.navigator.msSaveOrOpenBlob(blob, filename);
      } else if (window.Blob && window.URL) {
        // HTML5 Blob
        var a = document.createElement('a');
        a.setAttribute('style', 'display:none');
        a.setAttribute('href', `data:application/octet-stream;base64,${imgData}`);
        a.setAttribute('download', filename);
        document.body.appendChild(a);
      
        a.click()
        a.remove();
      } else {
        // Data URI
        var a = document.createElement('a');
        a.setAttribute('style', 'display:none');
        a.setAttribute('target', '_blank');
        a.setAttribute('href', `data:application/octet-stream;base64,${imgData}`);
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

  showViewer(args, util) {
    return this.promise(args.STORAGE, (reject) => this._showViewer(args.STORAGE, util, reject));
  }

  _showViewer(storage, util, reject) {
    try {
      if (!this.data[storage] || (this.type[storage] != 'csv'))
        return reject({ error: false, message: '오류: 시각화할 대상이 존재하지 않습니다.\n블록 위치: 시각화' });

      document.body.children[4].children[0].children[4].style.display='flex';
      document.body.children[4].children[0].children[4].children[0].children[1].innerHTML = 
      `
        <h1>
          ${storage} 데이터 테이블
        </h1>
        <div>
          <table>
            ${this.data[storage].map(v => `<tr>${v.map(w => `<td>${w}</td>`).reduce((prev, cur) => prev + cur)}</tr>`).reduce((prev, cur) => prev + cur)}
          </table>
        </div>
      `;

    }
    catch (e) {
      return reject({ error: true, message: e });
    }
  }

  get CRAWLINGSITE_MENU() {
    return [
      {
        text: formatMessage({
          id: 'bigData.crawlingURL.melon',
          default: '(1) Melon chart',
          description: 'choose url by using Melon chart'
        }),
        value: CRAWLINGSITE.MELON
      },
      {
        text: formatMessage({
          id: 'bigData.crawlingURL.instagram',
          default: '(2) Instagram',
          description: 'choose url by using instagram'
        }),
        value: CRAWLINGSITE.INSTAGRAM
      },
      {
        text: formatMessage({
          id: 'bigData.crawlingURL.daum',
          default: '(3) Daum',
          description: 'choose url by using daum'
        }),
        value: CRAWLINGSITE.DAUM
      }
    ];
  }

  crawlingURL(args, util) {
    this._crawlingURL(args.CRAWLINGSITE, util);
  }

  _crawlingURL(url, util) {
    this.crawling.url = url;
  }

  crawlingLogin(args, util) {
    this._crawlingLogin(args.IDENTITY, args.PASSWORD, util);
  }

  _crawlingLogin(id, pwd, util) {
    this.crawling.id = id;
    this.crawling.pwd = pwd;
  }

  crawlingWord(args, util) {
    this._crawlingWord(args.WORD, util);
  }

  _crawlingWord(word, util) {
    this.crawling.word = word;
  }

  crawlingExecute(args, util) {
    this._crawlingExecute(args.NUMBER, util);
  }

  _crawlingExecute(number, util) {
    if ((this.crawling.url == undefined)) 
      return alert('오류: 크롤링을 수행하기 위한 URL 정보가 설정되지 않았습니다.\n블록 위치: 크롤링 수행');

    try {

      const data = [];
      switch (this.crawling.url) {
        case 'melon':
          (async () => {
            const info = {};
            const rank = parseInt(number);

            const response = await axios('https://cors-anywhere.herokuapp.com/www.melon.com/chart/', {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With'
              }
            });
            const $ = cheerio.load(response.data);

            info.rank_change = [];
            $('td > div.wrap > span.rank_wrap').map((i, e) => {
              if (i < rank)
                info.rank_change.push(e.attribs.title);
            });
          
            info.title = [];
            $('.ellipsis.rank01 > span > a').map((i, e) => {
              if (i < rank)
                info.title.push(e.firstChild.data);
            });
          
            info.artist = [];
            $('.checkEllipsis > a').map((i, e) => {
              if (i < rank)
                info.artist.push(e.firstChild.data);
            });
          
            info.album = [];
            $('.ellipsis.rank03> a').map((i, e) => {
              if (i < rank)
                info.album.push(e.firstChild.data);
            });
          
            let up_to_date;
            $('.year').map((i, e) => {
              up_to_date = e.firstChild.data;
            });
          
            let up_to_time;
            $('.hhmm > span').map((i, e) => {
              up_to_time = e.firstChild.data;
            });
          
            data.push(['순위', '제목', '아티스트', '앨범', '순위변동', '날짜', '시간'])
            for (let i = 0; i < rank; i++) {
              data.push([i + 1, info.title[i], info.artist[i], info.album[i], info.rank_change[i].replace(/(\s*)/g, ''), up_to_date, up_to_time]);
            }

            downloadCSV(data);
          })();
          break;
        case 'instagram':
        case 'daum':
      }
    }
    catch (e) {
      return console.error(e);
    }
  }
}

module.exports = Scratch3BigDataBlocks; 