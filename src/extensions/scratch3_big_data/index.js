const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const formatMessage = require('format-message');

const nj = require('@aas395/numjs');

const blockIconURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAC4jAAAuIwF4pT92AAAGWWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgNzkuMTY0MzYwLCAyMDIwLzAyLzEzLTAxOjA3OjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTA2LTA5VDExOjU3OjU2KzA5OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0wNi0wOVQxMjoxMDo0NiswOTowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMC0wNi0wOVQxMjoxMDo0NiswOTowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpjMGNiZDdhNy0wYTc0LWExNGEtYThkNC0yYjRiYmQ4MzUyZGQiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDpmZjM0MGJlMi0xZWQ5LTQwNDktYTdhYi04YWUxZjM1YjZkNTEiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpjMzMyYjE3NS03MGVlLWQwNDYtOTFlYy1mMTBhNzk3NGNiZTYiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmMzMzJiMTc1LTcwZWUtZDA0Ni05MWVjLWYxMGE3OTc0Y2JlNiIgc3RFdnQ6d2hlbj0iMjAyMC0wNi0wOVQxMTo1Nzo1NiswOTowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjEgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjb252ZXJ0ZWQiIHN0RXZ0OnBhcmFtZXRlcnM9ImZyb20gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCB0byBpbWFnZS9wbmciLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmMwY2JkN2E3LTBhNzQtYTE0YS1hOGQ0LTJiNGJiZDgzNTJkZCIgc3RFdnQ6d2hlbj0iMjAyMC0wNi0wOVQxMjoxMDo0NiswOTowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjEgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PtT5YRgAAAXfSURBVHja7ZvPaxVXFMefqT9i6yISa0htjJofGy0iUiUJSWgirrQiiggBF/4BsUJSYi22IlS6qWm7kBQ3BjcqtIsEwWKhKv4gGCrtIiYBKdQ2C6sVTIy/8j7dfIeeXmbezEsmk5e8HLgkc+6Zc8983517zzn3TApI5XObqYGXAoeAy2ofiZc3ADQBV/iPfhIvLwCoJZhq5zoAC4C+DAD0SWbOAlBAOBXMZQB2RwBgz1wEYC3QRXTq0j2zHoBC4Bgwbh7uB+Cxz0M/Vp9H48Bx6ZiVAOwDhs0D3dUqvxF46gPAU/XVAr8Z/rB0zRoA3gd6zAP8DbSa/vviXwdG1K6Ld9/Itepejy5Jd84C8A5wxvlVTwMrjczn4j8ANgH/qG0SD8l48iuB7xydZzRWTgHQCjwxRv4I1DkyJUBa/TvF8yglHpIpce6tk06PnjizasYA+BDoN4YNaKvzk+01Mh4gHnkPPKDr3gAde4Ehc1+/bJhWAMqAVQ5vo3kg71c7BiwO0NFgZOvFqza8avHqDe+DAF1LNFbayPbKJtfusqkA0KggBWBCUdt24KjzTnYDVSEDebvBBcOrNDoqDf+CeEMhOqs0tqWjsvGyE2g1ZwtATQRn5YJjeFA7LPkRx81dbnQtd9zlEfHbIuivBM5HsLc+KgB7gZshyr7USrwYWA1U+LQ1wBbgue7pBFaob63CX4+axKuQTKf4r6RjTcAYq2VDKXAyxOZ+oCUKAN2a8kH0CvhdfzPRc+d6PAtXeDxE12RsSgPn4gAAYBR4mKHfvf8l2dPLEJ2WHsomQmw6GwWAfcDtEGW/ALuAt4BivYfValWasoOSvWz4nkwlsM3o2+ajo9osZoPS6eoolg27ZFMmuuXnUmdaBNMBU82jR8ARYKHP/TuNXHnAGEVGpihAptzI7PTpXygbHgXYaKku222wHvjZAeIF8Jmmkn0d2kwmp9BEeydCVm+/bdBtJ0y0WGgyS23OtO8GPnXWi7SeoWGyjlCREB0FrknpVfXtN9Mc4Fftwd/q+k9gUQwALJIupHu7xrLe537JXhXvJjAm24um4gm+q8VjHHjPGPKx2bM7gGc+U25LhP07CgAp6XJpTGN7M++I+H8AG2TzhJ5h0gCsNatvCthhDCh13tVvHAO/zvD+ZwNAuXRZ6nTc3FLTt8sEWhNhmaVsAHhbvHu67nFktwbs558EZHrLQxbKBbrXz3/YGhBoDep6xXQAUOnjJjeK96aJ57+S723f03vAAUd3sekvdvpaDNDe+tIs3V4+Yak5ZPGoxsQJsQOwzvAvOgFLu9kal5n1od1Jf91Q1LbZLFjewrpZfTecNFm7iSGWmS2vQzxvIf7e2LduugEo0ZboZXD/0v8HAzJFp3zcUkJ4pwIyPwdNcNVl9v6SJAFI6RewdCdE1wYzczLRRclm0nXHJwxOJQ1AyhxzjQPrI4SubwRsmR49k0yYnvVmcezz6Z8HIN9egY6kAXAXwZEZXgRfJL0IXnQcj44Z3AaHktoG/RyhJlPyEqcjdCALR6gxKUfIdYV7I7jCo07Akq0r3BGQ6XFd4Z4kXOFMwVCZSWTaYKgshmCoLMtgaEecwZAbDnvT/IjzK43NYDhc4ITDD2RrLOFwWEJkICQhsiSBhMigT0LkmmyeUkKkIYaU2BcJpsTOyrYXPimx+mwBqMuQf88mKZrOkaRo2uwQkdLit+ZgWvx21LT42Tl8MNIdBYBzAa7qbD8aiwxAi1P04EcntfdO9+Ho8xgPR2/q4DfSIlgf4Vc6n8Dx+OEYj8drst0Gm02BBCEFEhXTUCAxHKKzIqRAYsIUSDQyxRIZ16XdyP9LZF4Tf4lM0HHWYo312sj6lcisYoolMrlYJLXb8T4TKZKaL5OL2KarUPK0ozMnCyXdUtlLxuC4SmV7yPFS2TiLpe8a/qwrlnbL5Y8z+XL5Y8zicvn5DyZ82p4ID787SZvmP5pKGIC8/2wu7z+cDPp09gp59Oms38fTh8izj6dzpv0LiBTIneRM48oAAAAASUVORK5CYII=';

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
    this.oArray;
    this.nArray;
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
        //컬럼필터
        {
          opcode: 'columnfilter',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'bigData.columnfilter',
            default: 'select column [COLUMN]',
            description: 'select column'
          }),
          arguments: {//수정
            COLUMN: {
              type: ArgumentType.STRING,
              defaultValue: '원하는 열 리스트'
            }
          }
        },
        //로컬 저장
        {
          opcode: 'saveLocal',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'bigData.saveLocal',
            default: 'save [FILE] on local PC',
            description: 'save file on local PC'
          }),
          arguments: {//수정
            FILE: {
              type: ArgumentType.STRING,
              defaultValue: '전처리 완료된 파일 명'
            }
          }
        },
        //지정행을 추출하여 리스트에 저장
        {
          opcode: 'selectrow',
          blockType: BlockType.REPORTER,
          text: formatMessage({
            id: 'bigData.selectrow',
            default: '[ROW] row of data',
            description: '[ROW] row of data'
          }),
          arguments: {//데이터 행 
            ROW: {
              type: ArgumentType.NUMBER,
              defaultValue: '행 번호'
            }
          }
        },

       
        //행 갯수
        {
          opcode: 'rowlength',
          blockType: BlockType.REPORTER,
          text: formatMessage({
            id: 'bigData.rowlength',
            default: 'rowlength',
            description: 'rowlength'
          }),
          // arguments: {//데이터 행 

          // }
        },
        //열 갯수
        {
          opcode: 'collength',
          blockType: BlockType.REPORTER,
          text: formatMessage({
            id: 'bigData.collength',
            default: 'collength',
            description: 'collength'
          }),
          // arguments: {//데이터 행 

          // }
        },
        //컬럼명
        {
          opcode: 'colname',
          blockType: BlockType.REPORTER,
          text: formatMessage({
            id: 'bigData.colname',
            default: 'colname',
            description: 'colname'
          }),
          // arguments: {//데이터 행 
          // }
        },
        //헤더 삭제
        {
          opcode: 'deleteheader',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'bigData.deleteheader',
            default: 'deleteheader',
            description: 'deleteheader'
          }),
          // arguments: {//데이터 행 
          // }
        },
        //행삭제
        {
          opcode: 'deleterow',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'bigData.deleterow',
            default: 'delete [ROW]',
            description: 'delete [ROW]'
          }),
          arguments: {//데이터 행 
            ROW: {
              type: ArgumentType.NUMBER,
              defaultValue: '행 번호'
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
    this._missingValue(args.MISSINGVALUE, util);
  }

  _missingValue(type, util) {
    try {

      if (!this.oArray)
        return alert('loadCSV로 데이터를 먼저 불러와주세요.');

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
      alert(e)
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
    this._scale(args.SCALINGTYPE, util);
  }

  _scale(type, util) {
    try {

      if (!this.oArray)
        return alert('loadCSV로 데이터를 먼저 불러와주세요.');

      if (!this.nArray && this.oArray.filter(row => row.filter(value => value == '')[0] == '').length != 0)
        return alert('누락된 데이터값을 먼저 처리해주세요.');

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
      alert(e)
    }
  }

  columnfilter(args, util) {
    console.log("columnfilter입성")
    try {

      // waitBlockFlag가 내려갈 때까지 계속 대기한다.
      return new Promise(resolve => {
        console.log(1);
        let timer = setInterval(() => {

          // if문 만족할 때까지 반복하며 로깅
          console.log(2, this.waitBlockFlag);
          if (this.waitBlockFlag === false) {

            console.log(3);
            resolve();
            clearInterval(timer);

            // waitBlockFlag가 내려갔으므로, 해당 블록의 작업을 진행한다.
            // 해당 부분에 처리하고자 하는 이후 작업 명시
            console.log('waitBlock 작업이 완료되어서 해당 블록 작업을 진행합니다.')
            //리스트로 받은 컬럼 리스틀를 각배열에 저장
            let columns = [];
            let csvstring;

            columns = args.COLUMN.split(' ').map(v => v.split(','));
            console.log(columns);

            console.log(columns.length);

            //컬럼 리스트 항목을 각 인덱스로 저장하여 배열에 재저장
            // let colindex = [];
            for (let index = 0; index < columns.length; index++) {
              for (let a = 0; a < this.array[0].length; a++) {
                // const element = array[index];

                if (columns[index] == this.array[0][a]) {
                  console.log("헤더확인 : " + this.array[0][a]);
                  if (index == ((columns.length) - 1)) {
                    //마지막 쉼표 안붙이기 
                    csvstring = csvstring + this.array[0][a];
                  }
                  else if (index == 0) {
                    //첫번째 값의 경우
                    csvstring = this.array[0][a];
                    csvstring = csvstring + ',';
                  }
                  else {
                    //중간값들
                    let s = this.array[0][a];
                    s = s + ',';
                    csvstring = csvstring + s;
                  }


                  // colindex.push(a);
                  columns[index] = a;
                }
              }
            }
            csvstring = csvstring + '\n'
            columns.sort(function (a, b) { return a - b; });
            console.log("컬럼 인덱스" + columns);
            console.log("csv형태 : " + csvstring);

            console.log(this.array);
            for (let index = 1; index < this.array.length; index++) {
              for (let s = 0; s < columns.length; s++) {
                if (s == (columns.length - 1)) {
                  //마지막 쉼표 붙이기 용
                  csvstring = csvstring + this.array[index][columns[s]];
                  console.log(this.array[index][columns[s]]);

                  console.log(csvstring);
                }
                else {
                  //값들
                  let str = this.array[index][columns[s]];
                  console.log(this.array[index][columns[s]]);

                  str = str + ',';
                  csvstring = csvstring + str;
                  console.log(csvstring);
                }
              }

              csvstring = csvstring + '\n'
            }
            // this.array = newdata;
            // console.log("컬럼필터완료 : " + this.array);
            console.log("최종 csv : " + csvstring);

            csvstring = csvstring.replace(/\r/g, ''); //data인 문자열에서 \r을 찾아 지움(개행문자 제거하기)
            let row;
            row = csvstring.split('\n'); //data를 \n를 기준으로 자름
            //배열에 넣기 
            // this.array = [];
            let array = [];
            for (var i = 0; i < row.length - 1; i++) {
              let col = [];
              col = row[i].split(",");
              array.push(col);
            }
            console.log("csv를 배열로 변환 : " + array);
            this.array = array;

            console.log(this.array.length);
            console.log(this.array[0].length);

          }
        }, 1000);
      });

    }
    catch (e) {
      alert(e)
    }

  }

  saveLocal(args, util) {


    console.log("saveLocal입성")
    try {

      // waitBlockFlag가 내려갈 때까지 계속 대기한다.
      return new Promise(resolve => {
        console.log(1);
        let timer = setInterval(() => {

          // if문 만족할 때까지 반복하며 로깅
          console.log(2, this.waitBlockFlag);
          if (this.waitBlockFlag === false) {

            console.log(3);
            resolve();
            clearInterval(timer);

            // waitBlockFlag가 내려갔으므로, 해당 블록의 작업을 진행한다.
            // 해당 부분에 처리하고자 하는 이후 작업 명시
            console.log('waitBlock 작업이 완료되어서 해당 블록 작업을 진행합니다.')
            console.log(this.array);
            // let a_txt = this.array.join("\n"); //join : 배열의 원소를 연결해 문자열로 생성
            let filename = args.FILE;
            filename = filename + '.csv';
            // console.log(a_txt);
            console.log(filename);
            let csvContent = this.array.map(e => e.join(",")).join("\n");
            console.log(csvContent);

            (function () {
              const BLOB = new Blob(
                ['\ufeff' + csvContent],
                { type: 'text/csv;charset=EUC-KR;' }
              );
              const ENCODED_URL = URL.createObjectURL(BLOB);
              const link = document.createElement("a");
              link.setAttribute("href", ENCODED_URL);
              link.setAttribute("download", filename);
              // document.body.appendChild(link); // Required for FF

              link.click(); // This will download the data file named "my_data.csv".
            })();

            // var encodedUri = encodeURI(csvContent);


          }
        }, 1000);
      });

    }
    catch (e) {
      alert(e)
    }

  }

  getNumberOfArrayAtIndex(args, util) {

  }

  graph(args, util) {
    console.log("LOADIMAG입성")
    try {

      // waitBlockFlag가 내려갈 때까지 계속 대기한다.
      return new Promise(resolve => {
        console.log(1);
        let timer = setInterval(() => {

          // if문 만족할 때까지 반복하며 로깅
          console.log(2, this.waitBlockFlag);
          if (this.waitBlockFlag === false) {

            console.log(3);
            resolve();
            clearInterval(timer);

            // waitBlockFlag가 내려갔으므로, 해당 블록의 작업을 진행한다.
            // 해당 부분에 처리하고자 하는 이후 작업 명시
            console.log('waitBlock 작업이 완료되어서 해당 블록 작업을 진행합니다.')
            console.log(this.data);


          }
        }, 1000);
      });

    }
    catch (e) {
      alert(e)
    }

  }




  selectrow(args, util) {
    console.log("selectrow입성")

    try {

      // waitBlockFlag가 내려갈 때까지 계속 대기한다.
      if (this.waitBlockFlag === true) {
        return new Promise(resolve => {
          console.log(1);
          let timer = setInterval(() => {

            // if문 만족할 때까지 반복하며 로깅
            console.log(2, this.waitBlockFlag);
            if (this.waitBlockFlag === false) {

              // console.log(3);
              resolve();
              clearInterval(timer);

            }
          }, 1000);
        });
      }

      let datarow = [];

      //행에 해당하는 데이터를 저장
      for (var i = 0; i < this.array.length; i++) {
        for (var j = 0; j < this.array[0].length; j++) {
          if ((args.ROW - 1) == i) {
            datarow.push(this.array[i][j]);
            // this.send.push(this.array[i][j]);
          }
        }
      }
  
      String(datarow);
    
      return String(datarow);
    }



    catch (e) {
      alert(e)
    }

  }




  rowlength(args, util) {
    console.log("rowlength입성")

    try {

      // waitBlockFlag가 내려갈 때까지 계속 대기한다.
      if (this.waitBlockFlag === true) {
        return new Promise(resolve => {
          console.log(1);
          let timer = setInterval(() => {

            // if문 만족할 때까지 반복하며 로깅
            console.log(2, this.waitBlockFlag);
            if (this.waitBlockFlag === false) {

              // console.log(3);
              resolve();
              clearInterval(timer);

            }
          }, 1000);
        });
      }

      return this.array.length;
    }



    catch (e) {
      alert(e)
    }


  }


  collength(args, util) {
    console.log("collength입성")

    try {
      let collength = 0;
      // waitBlockFlag가 내려갈 때까지 계속 대기한다.
      if (this.waitBlockFlag === true) {

        return new Promise(resolve => {
          console.log(1);
          let timer = setInterval(() => {

            // if문 만족할 때까지 반복하며 로깅
            console.log(2, this.waitBlockFlag);
            if (this.waitBlockFlag === false) {

              // console.log(3);
              resolve();
              clearInterval(timer);

            }
          }, 1000);
        });
      }
      else if (this.array != 0) {
        collength = this.array[0].length;

      }
      return collength;
    }



    catch (e) {
      alert(e)
    }


  }



  colname(args, util) {
    console.log("colname입성")

    try {
      let colname = [];
      let string = "";
      // waitBlockFlag가 내려갈 때까지 계속 대기한다.
      if (this.waitBlockFlag === true) {

        return new Promise(resolve => {
          console.log(1);
          let timer = setInterval(() => {

            // if문 만족할 때까지 반복하며 로깅
            console.log(2, this.waitBlockFlag);
            if (this.waitBlockFlag === false) {

              // console.log(3);
              resolve();
              clearInterval(timer);

            }
          }, 1000);
        });
      }






      else if (this.array != 0) {

        //헤더를 저장
        for (var j = 0; j < this.array[0].length; j++) {
          colname.push(this.array[0][j]);
        }

        string = String(colname);


      }

      return string;
    }



    catch (e) {
      alert(e)
    }


  }



  deleteheader(args, util) {
    console.log("deleteheader입성")
    // this.flag ;

    try {

      // waitBlockFlag가 내려갈 때까지 계속 대기한다.
     
        return new Promise(resolve => {
          console.log(1);
          let timer = setInterval(() => {

            // if문 만족할 때까지 반복하며 로깅
            console.log(2, this.waitBlockFlag);
            if (this.waitBlockFlag === false) {

              // console.log(3);
              resolve();
              clearInterval(timer);




              
              this.array.splice(0, 1);
              console.log(this.array);



            }
          }, 1000);
        });
      
     



    }
    catch (e) {
      alert(e)
    }


  }

  deleterow(args, util) {

    console.log("deleterow입성")

    try {

      // waitBlockFlag가 내려갈 때까지 계속 대기한다.
      
        return new Promise(resolve => {
          console.log(1);
          let timer = setInterval(() => {

            // if문 만족할 때까지 반복하며 로깅
            console.log(2, this.waitBlockFlag);
            if (this.waitBlockFlag === false) {

              // console.log(3);
              resolve();
              clearInterval(timer);



              let rownumber;
              rownumber = args.ROW-1;
              this.array.splice(rownumber, 1);
              console.log(this.array);




            }
          }, 1000);
        });
      





    }



    catch (e) {
      alert(e)
    }


  }





}






module.exports = Scratch3BigDataBlocks; 