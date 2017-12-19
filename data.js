let inputData = {}

module.exports = {
	inputData: inputData,
	addData: function (req, res, next) {
		for(var i = 0; i < req.body.keys.length; i++) {
			let key = req.body.keys[i]
			inputData[key] = req.body.values[i];
		};
		res.send({
			message: 'Data added succesfully!'
		});
	},

	getInputData: function (req, res, next) {
		res.send({
			inputData: inputData
		})
	},

	clearData: function(req, res, next) {
		inputData = {};
		res.send({
			message: 'Data cleared'
		})
	}
}