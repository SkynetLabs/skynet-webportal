// return the time between start and now in milliseconds
function getTimeDiff(start) {
  const diff = process.hrtime(start);

  return Math.round((diff[0] * 1e9 + diff[1]) / 1e6); // msec
}

module.exports = { getTimeDiff };
