// const logger = require('./logger');

export const handler = {
	handleResponse: ({
		res,
		statusCode = 200,
		msg = 'Success',
		data = {},
        token,
		result = 1,
	}) => {
		res.status(statusCode).send({ result, msg, data, token })
	},

	handleError: ({
		res,
		statusCode = 500,
		err_msg = 'Error',
		err = 'error',
		data = {},
		result = 0,
	}) => {
		res.status(statusCode).send({
			result,
			err_msg,
			msg: err instanceof Error ? err.message : err.msg || err,
			data,
		})
	},

	handleHeaderResponse: ({
		res,
		headerName,
		headerData,
		statusCode = 200,
		data = {},
	}) => {
		res.setHeader('Access-Control-Expose-Headers', headerName)
		res.header(headerName, headerData).status(statusCode).send(data)
	},

	unAuthorized: (res) => {
		res.status(401).send({
			msg: "Unauthorized! you're not authorized for this route!",
		})
	},
}
