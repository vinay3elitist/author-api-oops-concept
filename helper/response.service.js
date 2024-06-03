const { codes } = require("./responseCodes");

class ResponseService {
  /**
   * Sends a response to the client with the provided options.
   *
   * @param {Object} options - The options for the response.
   * @param {Array} options.status - The HTTP status code and text.
   * @param {string} [options.message] - The message to include in the response.
   * @param {Object} [options.data] - The data to include in the response.
   * @param {Object} res - The Express response object.
   *
   * @returns {void}
   */
  static send(options, res) {
    const statusCode = options.status[0];
    const statusText = options.status[1];
    const message = options.message || null;
    const response = {};

    response.code = statusCode;
    response.message = message;
    response.data = options.data || "No Data Available";
    response.status = statusText;

    res.status(statusCode).send(response);
  }

  /**
   * Retrieves the corresponding status code and text from the provided code.
   *
   * @param {string} code - The code to retrieve the status for.
   * @returns {Array} - An array containing the HTTP status code and text.
   *
   * @example
   * const statusCodeAndText = ResponseService.getCode('SUCCESS');
   * console.log(statusCodeAndText); // Output: [200, 'Success']
   */
  static getCode(code) {
    return codes[code];
  }
}

module.exports = ResponseService;
