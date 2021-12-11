function returnCode(type, code = undefined) {
  // returncode formatter
  return {
    type: type,
    code: code,
  };
}

module.exports = {
  returnCode,
};
