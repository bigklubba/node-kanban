angular.module('todoService', [])

	// super simple service
	// each function returns a promise object
	.factory('Todos', ['$http',function($http) {
		return {
			get : function() {
				return $http.get('/api/todos');
			},
			getById : function (id) {
				console.log('getById');
				return $http.get('/api/todos/' + id);
            },
			create : function(todoData) {
				return $http.post('/api/todos', todoData);
			},
			delete : function(id) {
				return $http.delete('/api/todos/' + id);
			},
			put : function(id, todoData) {
				console.log('put');
				return $http.put('/api/todos/' + id, todoData);
			},
			nextState : function(id) {
				console.log('nextState '+id);
				return $http.put('/api/todos/next_state/' + id);
			},
			up : function(id) {
				console.log('up:', id)
				return $http.put('api/todos/up/' + id)
			},
			down : function(id) {
				console.log('up:', id)
				return $http.put('api/todos/down/' + id)
			}
		}
	}]);
