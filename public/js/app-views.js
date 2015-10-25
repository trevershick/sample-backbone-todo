(function() {
	var exports = window.Todo = window.Todo || {};


    var TodoAppView = Backbone.View.extend({
		filters : {
			'pending': {status:'open'},
			'done': {status:'complete'}
		},
        index: function(filterName) {
            this.resetView();
            this.view = new Todo.TodoItemsView({ collection: this.todoItems, where: this.filters[filterName] });
            this.listenTo(this.view, 'onItemSelected', this.onItemSelected, this);
            this.$view.html(this.view.render().el);
			this.addForm.setModel(null);
        },
        resetView: function() {
			this.$toolbar.hide();
            if (this.view) this.view.remove();
        },
        display: function(id) {
            this.resetView();
			this.$toolbar.show();
            var todoItem = this.todoItems.get(id);
            if (!todoItem) {
                todoItem = new Todo.TodoItem({
                    urlRoot: '/items/item',
                    id: id
                });
                todoItem.fetch();
            }
            this.view = new Todo.TodoItemView({model: todoItem});
            this.$view.html(this.view.render().el);
			this.addForm.setModel(todoItem);

        },
        initialize: function() {
            this.todoItems = new Todo.TodoItems();
            this.todoItems.fetch();
			this.addForm = new TodoForm({el: '#itemform'});
			this.listenTo(this.addForm, 'saved', this.onSaved, this);
        },
		onSaved: function(model) {
			this.todoItems.add(model);
		},
		render: function() {
			this.$toolbar = $("<div class='toolbar'><a href='#/'>Full List</a></div>");
			this.$filterbar = $("<div class='filterbar'>"
			 + "<a href='#/'>all</a>"
			 + "<a href='#/pending'>pending</a>"
			 + "<a href='#/done'>done</a>"
			+ "</div>");
			this.$view = $("<div class='view'/>");
			this.$el.append(this.$toolbar);
			this.$el.append(this.$view);
			this.$el.append(this.$filterbar);
		},
		onItemSelected: function(model,event) {
			this.trigger('onItemSelected', model, event);
			this.addForm.setModel(model);
		}
    });

	var TodoItemView = Backbone.View.extend({
		template: _.template("<i class='fa <%if (done !== true) { %>fa-circle-o<% } else { %>fa-check-circle<% } %>'></i><span class='<%-status%>'> <%- task %></span><i class='fa fa-trash'></i>"),
		tagName: 'li',
		className: 'task',
		events: {
			"click span" : "chooseItem",
			"click i" : "onCheckboxChange",
			'click .fa-trash': 'onDelete'
		},
		initialize: function() {
			_.bindAll(this, 'render', 'onCheckboxChange', 'remove');
			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'destroy', this.remove);
		},
		onDelete: function() {
			this.model.destroy();
		},
		remove: function() {
			this.$el.remove();
		},
		render: function() {
			var data = this.model.toJSON();
			data.done = this.model.isDone();
			var html = this.template(data);
			this.$el.html(html);
			return this;
		},
		onCheckboxChange: function(event) {
			this.model.toggleStatus();
		},
		chooseItem: function(event) {
			this.trigger("onItemSelected", this.model, event);
		}
	});


	var TodoItemsView = Backbone.View.extend({
		tagName: "ul",
		className: 'tasks',
		initialize: function(options) {
			this.listenTo(this.collection, 'update', this.render, this);
			this.where = options.where;
		},
		render: function() {
			if (this.collection.length === 0) {
				this.$el.html(null);
				return this;
			}
			var els = this.collection.where(this.where).map(function(item) {
				return this.addItem(item);
			}.bind(this));
			this.$el.html(els);
			return this;
		},
		addItem: function(item) {
			var v = new TodoItemView({model: item});
			this.listenTo(v, 'onItemSelected', this.chooseItem, this);
			return v.render().el;
		},
		chooseItem: function(model, event) {
			this.trigger("onItemSelected", model, event);
		}
	});
	var TodoForm = Backbone.View.extend({
		el: '#itemform',
		events: {
			'change #task':'onTextChange',
			'click button': 'onSubmit'
		},
		initialize: function() {
			if (!this.model) {
				this.model = new Todo.TodoItem();
			}
			this.updateUiFromModel();
		},
		onTextChange: function() {
			var text = this.$el.find('input#task').val();
			this.model.set("task", text);
		},
		onSubmit: function() {
			var newModel = this.model.isNew();
			this.model.save();
			this.trigger("saved", this.model);
			this.setModel(null);
		},
		updateUiFromModel: function() {
			if (this.model.isNew()) {
				this.$el.find('input#task').val("").attr("placeholder", this.model.get("task"));
			} else {
				this.$el.find('input#task').val(this.model.get("task"));
			}
		},
		setModel: function(model) {
			this.stopListening(this.model);
			this.model = model || new Todo.TodoItem();
			if (model) {
				this.listenTo(this.model, 'sync', this.updateUiFromModel, this);
			}
			this.updateUiFromModel();
		}
	});
	exports.TodoForm = TodoForm;
	exports.TodoItemView = TodoItemView;
	exports.TodoItemsView = TodoItemsView;
	exports.TodoAppView = TodoAppView;
})();
