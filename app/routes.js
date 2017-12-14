const TodoController = require('./controllers/todo-controller')

module.exports = function (app) {

  // api ---------------------------------------------------------------------
  // get all todos
  app.get('/api/todos', function (req, res) {
    TodoController.getTodos(res)
  })

  // get todo by id
  app.get('/api/todos/:todo_id', function (req, res) {
    TodoController.getTodoById(req.params.todo_id, res)
  })

  // move task into next state, only 3 steps at the moment
  // Do not increment state if state is 2
  app.put('/api/todos/next_state/:todo_id', function(req, res) {
    TodoController.nextState(req.params.todo_id, res).catch(error => {
      console.log('error delete todo', error)
      res.send(error)
    })
  })

  // update todo
  app.put('/api/todos/:todo_id', function(req, res) {
    TodoController.updateTodo(req.params.todo_id, req.body.name, req.body.user, res)
  })

  // create todo and send back all todos after creation
  app.post('/api/todos', (req, res) => {
    TodoController.createTodo(req.body.name, req.body.user, res)
  })

  // delete a todo
  app.delete('/api/todos/:todo_id', function (req, res) {
    TodoController.deleteTodo(req.params.todo_id, res).catch(error => {
      console.log('error delete todo', error)
      res.send(error)
    })
  })

  // move task up
  app.put('/api/todos/up/:todo_id', function(req, res) {
    TodoController.moveTask(req.params.todo_id, -1, res).catch(error => {
      console.log('error move task up', error)
      res.send(error)
    })
  })

  // move task down
  app.put('/api/todos/down/:todo_id', function(req, res) {
    TodoController.moveTask(req.params.todo_id, 1, res).catch(error => {
      console.log('error move task up', error)
      res.send(error)
    })
  });

  // application -------------------------------------------------------------
  app.get('*', function (req, res) {
    res.sendFile(__dirname + '/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
  });
};
