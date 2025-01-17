const db = require('../db/connection');

// Get all authors
exports.getAllAuthors = async (req, res) => {
    try {
        // Using async/await
        const [authors] = await db.query('SELECT * FROM authors');
        res.json(authors);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Add a new author
exports.addAuthor = async (req, res) => {
    const { name, bio } = req.body;

    try {
        // Use promise-based query (since you are using mysql2/promise)
        await db.query('INSERT INTO authors (name, bio) VALUES (?, ?)', [name, bio]);
        
        // Send a success response
        res.status(201).json({ message: 'Author added successfully' });
    } catch (err) {
        // Send an error response
        console.error(err);  // Log error for debugging
        res.status(500).json({ error: err.message });
    }
};


// Update an author
exports.updateAuthor = async (req, res) => {
    const { id } = req.params;  // Get the author id from the URL params
    const { name, bio } = req.body;  // Get the updated name and bio from the request body

    try {
        // Execute the update query
        const [result] = await db.query(
            'UPDATE authors SET name = ?, bio = ? WHERE id = ?',
            [name, bio, id]
        );

        // If no rows were updated, send a message indicating that the author was not found
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Author not found' });
        }

        // If the update was successful, send a success response
        res.status(200).json({ message: 'Author updated successfully' });
    } catch (err) {
        // If an error occurs, send an error response
        console.error(err);  // Log error for debugging
        res.status(500).json({ error: err.message });
    }
};


// Delete an author
exports.deleteAuthor = async (req, res) => {
    const { id } = req.params;  // Get the author id from the URL params

    try {
        // Execute the delete query
        const [result] = await db.query('DELETE FROM authors WHERE id = ?', [id]);

        // If no rows were affected (i.e., author not found), send a message indicating that the author was not found
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Author not found' });
        }

        // If the deletion was successful, send a success response
        res.status(200).json({ message: 'Author deleted successfully' });
    } catch (err) {
        // If an error occurs, send an error response
        console.error(err);  // Log the error for debugging
        res.status(500).json({ error: err.message });
    }
};

