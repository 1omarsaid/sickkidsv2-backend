const functions = require('firebase-functions');
const app = require('express')();

// ADD THIS
var cors = require('cors');
app.use(cors({origin: true }));

const {
    getAllTodos,
    postOneTodo,
    deleteTodo,
    editTodo,
    getOneTodo
} = require('./APIs/todos')

const {
    loginUser,
    signUpUser,
    uploadProfilePhoto,
    getUserDetail,
    updateUserDetails,
    resetUserPassword
} = require('./APIs/users')

const auth = require('./util/auth');

// Todos
app.get('/todos', auth, getAllTodos);
app.post('/todo', auth, postOneTodo);
app.delete('/todo/:todoId',auth,  deleteTodo);
app.put('/todo/:todoId', auth, editTodo);
app.get('/todo/:hsc',auth, getOneTodo);


// Users
app.post('/login', loginUser);
app.post('/signup', signUpUser);
app.post('/user/image', auth, uploadProfilePhoto);
app.get('/user', auth, getUserDetail);
app.post('/user', auth, updateUserDetails);
app.post('/passwordReset', resetUserPassword);

exports.api = functions.https.onRequest(app);