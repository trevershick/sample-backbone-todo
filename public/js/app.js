(function() {
    var exports = window.Todo = window.Todo || {};
    var TodoRouter = Backbone.Router.extend({
        routes: {
                '': 'index',
                '*filter' : 'index',
                '*path': 'error404'
        },
        initialize: function(options) {
            this.mainView = options.mainView;
            this.mainView.render();
            this.listenTo(this.mainView, 'onItemSelected', this.onItemSelected, this);
            this.route(/items\/(\d)+/, 'display');
        },
        error404: function() {
            alert("unkonwn url");
        },
        index: function(filter) {
            this.mainView.index(filter);
        },
        setFilter: function(params) {
                console.log(params);
        },
        pending: function() {
            this.index('pending');
        },
        done: function() {
            this.index('done');
        },
        display: function(id) {
            this.mainView.display(id);
        },
        onItemSelected: function(model,event) {
            this.navigate('items/'+ model.id, {trigger: true, replace: true});
        }
    });
    var appView = new Todo.TodoAppView({ el: '#mainview' });
    var app = new TodoRouter({ mainView: appView });
    Backbone.history.start();
	// $("a[data-attr]").click(function(e) {
	// 	e.preventDefault();
	// 	Backbone.history.navigate(e.target.pathname, {trigger:true});
	// });

    exports.TodoRouter = TodoRouter;
    exports.app = app;
})();
