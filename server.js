const connectToMongo = require('./db');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
// const Location = require('./models/Location');
require('dotenv').config(); // Load environment variables
connectToMongo();
const app = express();
app.use(cors());
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use("/api", require("./routes/auth"));

// app.post('/api/location', async (req, res) => {
//     const { userId, latitude, longitude } = req.body;
//     const location = new Location({ userId, latitude, longitude });
//     await location.save();
//     res.status(201).send('Location updated');
// });

// app.get('/api/location/:userId', async (req, res) => {
//     const userId = req.params.userId;
//     const location = await Location.findOne({ userId }).sort({ timestamp: -1 });
//     res.status(200).json(location || {});
// });

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
