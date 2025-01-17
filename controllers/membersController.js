const db = require('../db/connection');

// Get all members
exports.getAllMembers = async (req, res) => {
    try {
        // Using async/await with the promise version of mysql2
        const [members] = await db.query('SELECT * FROM members');
        res.json(members);  // Respond with the members data
    } catch (err) {
        res.status(500).json({ error: err.message });  // Error handling
    }
};

// Add a new member
exports.addMember = async (req, res) => {
    const { name, contact_info } = req.body;

    if (!name || !contact_info) {
        return res.status(400).json({ error: 'Name and contact information are required' });
    }

    try {
        // Perform the insert query
        const [result] = await db.query('INSERT INTO members (name, contact_info) VALUES (?, ?)', [name, contact_info]);

        // Check if the query result has an insert ID (this indicates success)
        if (result.insertId) {
            res.status(201).json({ message: 'Member added successfully', memberId: result.insertId });
        } else {
            res.status(400).json({ error: 'Failed to add member' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update a member
exports.updateMember = async (req, res) => {
    const { id } = req.params;
    const { name, contact_info } = req.body;

    if (!contact_info) {
        return res.status(400).json({ error: 'Contact info is required to update.' });
    }

    try {
        // First, fetch the current member data to retain the name
        const [existingMember] = await db.query('SELECT name FROM members WHERE id = ?', [id]);
        if (existingMember.length === 0) {
            return res.status(404).json({ error: 'Member not found' });
        }

        // If 'name' is not provided in the request, use the existing name
        const updatedName = name || existingMember[0].name;

        // Now, update only the fields that are passed in the request
        const [result] = await db.query(
            'UPDATE members SET name = ?, contact_info = ? WHERE id = ?',
            [updatedName, contact_info, id]
        );

        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Member updated successfully' });
        } else {
            res.status(400).json({ error: 'Failed to update member' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// Delete a member
exports.deleteMember = async (req, res) => {
    const { id } = req.params;

    try {
        // Delete the member by ID
        const [result] = await db.query('DELETE FROM members WHERE id = ?', [id]);

        // Check if any row was deleted
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Member deleted successfully' });
        } else {
            res.status(404).json({ error: 'Member not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
