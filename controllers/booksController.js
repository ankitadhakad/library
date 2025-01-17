const db = require('../db/connection');

exports.getAllBooks = async (req, res) => {
    try {
        // Directly run the query; no need for db.connect()
        const [books] = await db.query('SELECT * FROM books');
        res.json(books);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addBook = async (req, res) => {
    const { title, author_id, genre } = req.body;
    try {
        await db.query('INSERT INTO books (title, author_id, genre) VALUES (?, ?, ?)', [title, author_id, genre]);
        res.status(201).json({ message: 'Book added successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateBook = async (req, res) => {
    const { id } = req.params;
    const { title, author_id, genre, availability } = req.body;
    try {
        await db.query('UPDATE books SET title = ?, author_id = ?, genre = ?, availability = ? WHERE id = ?', [title, author_id, genre, availability, id]);
        res.json({ message: 'Book updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteBook = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM books WHERE id = ?', [id]);
        res.json({ message: 'Book deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
