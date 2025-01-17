const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();

const booksRoutes = require('./routes/books');
const authorsRoutes = require('./routes/authors');
const membersRoutes = require('./routes/members');
const borrowRoutes = require('./routes/borrow');

const app = express();
app.use(bodyParser.json());

app.use('/books', booksRoutes);
app.use('/authors', authorsRoutes);
app.use('/members', membersRoutes);
app.use('/borrow', borrowRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
