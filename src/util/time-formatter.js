const formatter = (seconds) => {
  const hour = parseInt(seconds / 3600);
  const min = parseInt((seconds % 3600) / 60);
  const sec = seconds % 60;

  return (seconds == Infinity) ? `계산 중` : `${((hour == 0) ? '' : `${hour}시간`)} ${((min == 0) ? '' : `${min}분`)} ${sec}초`;
}

module.exports = formatter;