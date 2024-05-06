const mongoose = require('mongoose');
const Inventory = require('./models/inventory');

mongoose
    .connect('mongodb://localhost/clubPenguinDB')
    .then(() => {
        console.log(`connection open`);
    })
    .catch((err) => console.log("no connection"));

const seedItems = [
    {
        itemName: "flyer"
    },
    {
        itemName: "garlic-bread"
    },
    {
        itemName: "puffle-treats"
    },
    {
        itemName: "autograph"
    },
    {
        itemName: "medal"
    },
];

const seedDB = async () => {
    await Inventory.deleteMany({});
    await Inventory.insertMany(seedItems);
};

seedDB().then(() => {
    mongoose.connection.close();
});