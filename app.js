const express = require('express');
const connectDB = require('./config/dbConnection');
const errorHandler = require('./app/middlewares/errorHandler');
const authRoutes = require('./app/components/author/author.routes');
const bookRoutes = require('./app/components/book/book.routes');
require('dotenv').config();

const app = express();
app.use(express.json());

connectDB();
app.use('/api/auth', authRoutes);
app.use('/api/book', bookRoutes);

app.use(errorHandler);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`\nServer is listening on port ${PORT}`);
});
