const readingService = require("../services/readingService");

/**
 * Retrieves all books for the authenticated user.
 */
async function getBooks(req, res) {
  try {
    const userId = req.user.id;
    const books = await readingService.getBooksByUserId(userId);
    res.json({ books });
  } catch (err) {
    console.error("Get books error:", err);
    res.status(500).json({ error: "Internal server error retrieving books" });
  }
}

/**
 * Creates a new book in the reading tracker for the authenticated user.
 */
async function createBook(req, res) {
  try {
    const userId = req.user.id;
    const { title, author, totalPages, currentPage, status, cover, rating, notes } = req.body;

    const newBook = await readingService.createBook({
      userId,
      title,
      author,
      totalPages,
      currentPage,
      status,
      cover,
      rating,
      notes,
    });

    res.status(201).json({ message: "Book added", book: newBook });
  } catch (err) {
    console.error("Create book error:", err);
    res.status(500).json({ error: "Internal server error adding book" });
  }
}

/**
 * Updates a book in the reading tracker for the authenticated user.
 */
async function updateBook(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const updatedBook = await readingService.updateBook(id, userId, req.body);

    if (!updatedBook) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.json({ message: "Book updated", book: updatedBook });
  } catch (err) {
    console.error("Update book error:", err);
    res.status(500).json({ error: "Internal server error updating book" });
  }
}

/**
 * Deletes a book from the reading tracker.
 */
async function deleteBook(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const deleted = await readingService.deleteBook(id, userId);

    if (!deleted) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.json({ message: "Book removed" });
  } catch (err) {
    console.error("Delete book error:", err);
    res.status(500).json({ error: "Internal server error deleting book" });
  }
}

module.exports = {
  getBooks,
  createBook,
  updateBook,
  deleteBook,
};
