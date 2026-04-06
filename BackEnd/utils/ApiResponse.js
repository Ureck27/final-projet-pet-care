class ApiResponse {
  constructor(statusCode, data, message = 'Success', metadata = null) {
    this.success = statusCode < 400;
    this.message = message;
    this.data = data;
    if (metadata) {
      this.meta = metadata;
    }
  }
}

module.exports = ApiResponse;
