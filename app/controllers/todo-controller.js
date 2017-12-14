const Todo = require('../models/todo');
const StateOrder = require('../models/state-order')

async function findById(id) {
  if (id == '') return null
  let todo = await Todo.findById(id)
  return todo
}

getTodos = async function(res) {
  Todo.find(async function (err, todos) {

    // if there is an error retrieving, send the error. nothing after res.send(err) will execute
    if (err) {
      res.send(err)
    }
    let mappedTodos = [[],[],[]]
    for (let i in todos) {
      mappedTodos[todos[i].state].push(todos[i])
    }
    let stateOrders = await StateOrder.find()
    console.log('stateOrders', stateOrders.length);
    for (let i in mappedTodos) {
      let sortedArray = []
      let idOrderForState = stateOrders.find(stateOrder => stateOrder.state == i).orderIds
      for (let id of idOrderForState) {
        sortedArray.push(mappedTodos[i].find(item => item.id == id))
      }
      mappedTodos[i] = sortedArray
    }
    res.json(mappedTodos); // return all todos in JSON format
    //res.json(todos); // return all todos in JSON format
  });
}

getTodoById = function(todo_id, res) {
  Todo.findById(todo_id, function(error, todo) {
    if (error) {
      console.log('error getting todo by id');
      res.send(error);
    }
    res.json(todo);
  })
}

nextState = async function(todo_id, res) {
  let todo = await findById(todo_id)
  if (todo.state < 2) {
    let currentStateOrder = await StateOrder.findOne({state: {$eq: todo.state}})
    let nextStateOrder = await StateOrder.findOne({state: {$eq: todo.state+1}})
    let idIndex = currentStateOrder.orderIds.indexOf(todo.id)

    currentStateOrder.orderIds.splice(idIndex, 1)
    nextStateOrder.orderIds.unshift(todo.id)
    todo.state++
    await todo.save()
    await currentStateOrder.save()
    await nextStateOrder.save()
    getTodos(res)
  } else {
    getTodos(res)
  }
}

updateTodo = function(todo_id, text, user, res) {
  console.log('Update todo:', todo_id, text, user)
  Todo.findById(todo_id, function(error, todo) {
    if (error) {
      console.log('error update')
      res.send(error)
    }
    todo.text = text
    todo.user = user
    todo.save(function (error, updatedTask) {
      if (error) {
        console.log('Error save task')
        res.send(error)
      }
      getTodos(res)
    })
  })
}

createTodo = function(text, user, res) {
  StateOrder.findOne({state: {$eq: 0}}, (error, firstStateOrder) => {
    if (error) return res.send(error)
    Todo.create({
      text: text,
      user: user,
      next: '',
      prev: '',
      done: false
    }, (error, createdTodo) => {
      if (error) {
        res.send(error)
      } else {
        firstStateOrder.orderIds.unshift(createdTodo.id)
        firstStateOrder.save((error, savedStateOrder) => {
          if (error) {
            res.send(error)
          } else {
            getTodos(res)
          }
        })
      }
    })
  })
}

deleteTodo = async function(todo_id, res) {
  let todo = await findById(todo_id)
  let stateOrder = await StateOrder.findOne({state: {$eq: todo.state}})
  let idIndex = stateOrder.orderIds.indexOf(todo.id)

  stateOrder.orderIds.splice(idIndex, 1)

  await stateOrder.save()
  await Todo.remove(todo)
  getTodos(res)
}

moveTask = async function(todo_id, steps, res) {
  let todo = await findById(todo_id)
  let stateOrder = await StateOrder.findOne({state: {$eq: todo.state}})
  let orderIds = stateOrder.orderIds
  let todoIndex = orderIds.indexOf(todo.id)
  let newIndex = todoIndex + steps

  if (newIndex >= 0 && newIndex < orderIds.length) {
    orderIds.splice(todoIndex, 0, orderIds.splice(todoIndex+steps, 1)[0])
    await stateOrder.save()
  }
  getTodos(res)
}

module.exports = {
  getTodos: getTodos,
  getTodoById: getTodoById,
  nextState: nextState,
  updateTodo: updateTodo,
  createTodo: createTodo,
  deleteTodo: deleteTodo,
  moveTask: moveTask
}
