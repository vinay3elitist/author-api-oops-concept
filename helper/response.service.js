const { codes } = require("./responseCodes");

class ResponseService {
    static send(options, res){
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

    static getCode(code){
        return codes[code];
    }
}

module.exports = ResponseService;