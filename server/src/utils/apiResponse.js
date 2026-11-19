function success(data) {
  return { success: true, data, error: null };
}

function failure(code, message) {
  return { success: false, data: null, error: { code, message } };
}

module.exports = { success, failure };