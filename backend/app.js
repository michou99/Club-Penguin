const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const PORT = 3000;

// allow body parsing via both json and urlencoded middleware:
app.use(express.json({ type: ['text/*', '*/json'] }));
app.use(express.urlencoded({ extended: true }));

app.use(cors());

// Enable CORS for ExpressJS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS')
    res.header('Access-Control-Allow-Credentials', true)
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Methods, Credentials')
    next()
})

// mongodb connection
mongoose
    .connect('mongodb://localhost/clubPenguinDB')
    .then(() => {
        mongoose.connection.syncIndexes()
        app.listen(PORT, listener);
        console.log(`DB connected and running on port ${PORT}`)
    })
    .catch((err) => console.log("no connection"));

// controllers
const userController = require('./controllers/userController');
app.use('/user', userController);

const inventoryController = require('./controllers/inventoryController');
app.use('/inventory', inventoryController);

// establish default route for requests:
app.get('/', (req, res) => {
    res.json({ message: "Club Penguin API works!" });
})

// error-handling for non-existent routes
app.use((req, res) => {
    res.status(404).json({ error: "Page not found!" });
});

const listener = () => {
    console.log(`Listening on port ${PORT}`);
};
