var express = require('express');
var router = express.Router();
var _ = require('lodash');
var items = [
	{
		id: 1,
		task: "Task 1",
		status: 'open'
	},
	{
		id: 2,
		task: "Task 2",
		status: 'complete'
	},
	{
		id: 3,
		task: "Task 3",
		status: 'open'
	}

];
router.get('/', function(req, res) {
	res.status(200).send(items);
});
router.post('/item', function(req, res) {
	var item = req.body;
	item.id = items.length + 1;
	items.push(item);
	res.status(200).send(item);
});
router.put('/item/:id', function(req,res) {
	console.log("Received body", req.body);
	var updated = req.body;
	var item = _.find(items, {id: updated.id }) || {};
	item.task = updated.task;
	item.status = updated.status;
	
	res.status(200).send({ message: 'updated', todo: req.body });
});
router.delete('/item/:id', function(req,res) {
	console.log("Received body to delete", req.body);
	res.status(200).send({ message: 'deleted', todo: req.body });
});
/* GET users listing. */
router.get('/item/:id', function(req, res) {
	console.log("Request query = ", req.params);
	var item = items.find((item) => {
		return item.id == req.params.id;
	})
	if (item) {
  		res.status(200).send(item);
	} else {
		res.status(404).end();
	}
});

module.exports = router;
