var Todo = require('./models/todo');

function getTodos(res) {
    Todo.find(function (err, todos) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            res.send(err);
        }
        var mappedTodos = [[],[],[]];
        for (var i in todos) {
            mappedTodos[todos[i].state].push(todos[i]);
        }
        res.json(mappedTodos); // return all todos in JSON format
        //res.json(todos); // return all todos in JSON format
    });
}

module.exports = function (app) {

    // api ---------------------------------------------------------------------
    // get all todos
    app.get('/api/todos', function (req, res) {
        // use mongoose to get all todos in the database
        getTodos(res);
    });

    // get todo by id
    app.get('/api/todos/:todo_id', function (req, res) {
        Todo.findById(req.params.todo_id, function(error, todo) {
            if (error) {
                console.log('error getting todo by id');
                res.send(error);
            }
            res.json(todo);
        });
    });

    app.put('/api/todos/next_state/:todo_id', function(req, res) {
      Todo.findOneAndUpdate({_id: req.params.todo_id}, {$inc: {'state' : 1}}, function(error) {
        if (error) {
          console.log('error');
          res.send(error);
        }
        getTodos(res);
      });
    });

    app.put('/api/todos/:todo_id', function(req, res) {
        console.log('PUT: api/todos:' + req.body.text + ' ' + req.body.user + ' '+req.params.todo_id);
        Todo.findById(req.params.todo_id, function(error, todo) {
            if (error) {
                console.log('error update');
                res.send(error);
            }
            todo.text = req.body.name;
            todo.user = req.body.user;
            todo.save(function (error, updatedTask) {
                if (error) {
                    console.log('Error save task');
                    res.send(error);
                }
                getTodos(res);
            });
        });
    });

    // create todo and send back all todos after creation
    app.post('/api/todos', function (req, res) {

        // create a todo, information comes from AJAX request from Angular
        console.log('api/todos:' + req.body.name + ' ' + req.body.user);
        Todo.create({
            text: req.body.name,
            user: req.body.user,
            done: false
        }, function (err, todo) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            getTodos(res);
        });

    });

    // delete a todo
    app.delete('/api/todos/:todo_id', function (req, res) {
        Todo.remove({
            _id: req.params.todo_id
        }, function (err, todo) {
            if (err)
                res.send(err);

            getTodos(res);
        });
    });

    // application -------------------------------------------------------------
    app.get('*', function (req, res) {
        res.sendFile(__dirname + '/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
};
