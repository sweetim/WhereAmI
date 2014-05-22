exports.getData = function(req, res) {
	res.json({
		title: 'hello world'
	});
} 

exports.getDataId = function(req, res) {
	var id = req.params.id;
	res.json({
		id: id
	});
}