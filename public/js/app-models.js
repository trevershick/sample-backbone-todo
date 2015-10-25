(function() {
	var exports = window.Todo = window.Todo || {};

	var TodoItem = Backbone.Model.extend({
		urlRoot: '/items/item',
		defaults: {
			status: 'open',
			task: 'A new task...'
		},
		toggleStatus: function() {
			this.set('status', this.isDone() ? 'open' : 'complete');
			this.save();
		},
		isDone: function() {
			var done = this.get('status') === 'complete';
			return done;
		}
	});

	var TodoItems = Backbone.Collection.extend({
		url: '/items',
		model: TodoItem,
		comparator: 'status'
	});

	exports.TodoItems = TodoItems;
	exports.TodoItem = TodoItem;
})();
