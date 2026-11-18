
const express = require('express');
const fs = require('fs');

const app = express();

app.use(express.json());

// Read all books
function getBooks() {
    return JSON.parse(fs.readFileSync('books.json', 'utf8'));
}

// 1. Get all books
app.get('/books', (req, res) => {
    const books = getBooks();
    res.json(books);
});

// 2. Get book by ID
app.get('/books/:id', (req, res) => {
    const books = getBooks();

    const book = books.find(b => b.id === parseInt(req.params.id));

    if (!book) {
        return res.status(404).json({ message: 'Book not found' });
    }

    res.json(book);
});

// 3. Add a new book
app.post('/books', (req, res) => {
    const books = getBooks();

    const newBook = {
        id: books.length ? Math.max(...books.map(b => b.id)) + 1 : 1,
        title: req.body.title,
        author: req.body.author,
        category: req.body.category
    };

    books.push(newBook);

    fs.writeFileSync('books.json', JSON.stringify(books, null, 2));

    res.status(201).json(newBook);
});

// 4. Update a book
app.put('/books/:id', (req, res) => {
    const books = getBooks();

    const book = books.find(b => b.id === parseInt(req.params.id));

    if (!book) {
        return res.status(404).json({ message: 'Book not found' });
    }

    book.title = req.body.title;
    book.author = req.body.author;
    book.category = req.body.category;

    fs.writeFileSync('books.json', JSON.stringify(books, null, 2));

    res.json(book);
});

// 5. Delete a book
app.delete('/books/:id', (req, res) => {
    let books = getBooks();

    const bookExists = books.some(b => b.id === parseInt(req.params.id));

    if (!bookExists) {
        return res.status(404).json({ message: 'Book not found' });
    }

    books = books.filter(b => b.id !== parseInt(req.params.id));

    fs.writeFileSync('books.json', JSON.stringify(books, null, 2));

    res.json({ message: 'Book deleted successfully' });
});

// Start server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
