const db = require('../db/connection');

// Get overdue books for a specific member
exports.getOverdueBooks = async (req, res) => {
    const { memberId } = req.params;
    const query = `
        SELECT bh.*, b.title
        FROM borrow_history bh
        JOIN books b ON bh.book_id = b.id
        WHERE bh.member_id = ? AND bh.return_deadline < CURDATE() AND bh.returned = FALSE
    `;
    try {
        const [results] = await db.query(query, [memberId]);
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// Add a borrow record
exports.addBorrowRecord = async (req, res) => {
    const { member_id, book_id, borrow_date, return_deadline } = req.body;

    const addBorrowQuery = `
        INSERT INTO borrow_history (member_id, book_id, borrow_date, return_deadline, returned)
        VALUES (?, ?, ?, ?, FALSE)
    `;

    const updateBookAvailabilityQuery = `
        UPDATE books SET availability = FALSE WHERE id = ?
    `;

    try {
        // Add the borrow record
        await db.query(addBorrowQuery, [member_id, book_id, borrow_date, return_deadline]);

        // Update the book's availability
        await db.query(updateBookAvailabilityQuery, [book_id]);

        res.status(201).json({ message: 'Borrow record added successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// Mark a book as returned
exports.markAsReturned = (req, res) => {
    const { id } = req.params;
    const query = `
        UPDATE borrow_history
        SET returned = TRUE
        WHERE id = ?
    `;
    db.query(query, [id], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Book marked as returned' });
    });
};
