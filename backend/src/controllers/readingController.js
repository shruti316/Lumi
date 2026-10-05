const { readDB, writeDB } = require("../services/store");

function getBooks(req, res) {
  const db = readDB();
  const userId = req.user?.id || "u-demo";
  const userBooks = db.books.filter((b) => b.userId === userId || !b.userId);
  res.json({ books: userBooks });
}

function createBook(req, res) {
  const db = readDB();
  const userId = req.user?.id || "u-demo";
  const { title, author, totalPages, currentPage, status, cover } = req.body;

  const newBook = {
    id: "b-" + Date.now(),
    userId,
    title: title || "Untitled Book",
    author: author || "Unknown Author",
    totalPages: Number(totalPages) || 300,
    currentPage: Number(currentPage) || 0,
    status: status || "want_to_read",
    cover: cover || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80",
    createdAt: new Date().toISOString(),
  };

  db.books.unshift(newBook);
  writeDB(db);
  res.status(201).json({ message: "Book added", book: newBook });
}

function updateBook(req, res) {
  const { id } = req.params;
  const db = readDB();
  const bookIndex = db.books.findIndex((b) => b.id === id);

  if (bookIndex === -1) {
    return res.status(404).json({ error: "Book not found" });
  }

  db.books[bookIndex] = {
    ...db.books[bookIndex],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  writeDB(db);
  res.json({ message: "Book updated", book: db.books[bookIndex] });
}

function deleteBook(req, res) {
  const { id } = req.params;
  const db = readDB();
  db.books = db.books.filter((b) => b.id !== id);
  writeDB(db);
  res.json({ message: "Book removed" });
}

module.exports = {
  getBooks,
  createBook,
  updateBook,
  deleteBook,
};
