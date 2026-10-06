const crypto = require("crypto");
const pool = require("../config/db");

function formatBook(row) {
  if (!row) return null;
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    author: row.author || "Unknown Author",
    cover: row.cover || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80",
    status: row.status || "want_to_read",
    totalPages: Number(row.total_pages) || 300,
    currentPage: Number(row.current_page) || 0,
    rating: Number(row.rating) || 0,
    notes: row.notes || "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function getBooksByUserId(userId) {
  const [rows] = await pool.query(
    "SELECT id, user_id, title, author, cover, status, total_pages, current_page, rating, notes, created_at, updated_at FROM books WHERE user_id = ? ORDER BY updated_at DESC",
    [userId]
  );
  return rows.map(formatBook);
}

async function getBookById(id, userId) {
  const [rows] = await pool.query(
    "SELECT id, user_id, title, author, cover, status, total_pages, current_page, rating, notes, created_at, updated_at FROM books WHERE id = ? AND user_id = ? LIMIT 1",
    [id, userId]
  );
  if (rows.length === 0) return null;
  return formatBook(rows[0]);
}

async function createBook({ id, userId, title, author, totalPages, currentPage, status, cover, rating, notes }) {
  const bookId = id || crypto.randomUUID();
  const bookTitle = title || "Untitled Book";
  const bookAuthor = author || "Unknown Author";
  const bookCover = cover || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80";
  const bookStatus = status || "want_to_read";
  const total = Number(totalPages) || 300;
  const current = Number(currentPage) || 0;
  const bookRating = Number(rating) || 0;
  const bookNotes = notes || "";

  await pool.query(
    "INSERT INTO books (id, user_id, title, author, cover, status, total_pages, current_page, rating, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [bookId, userId, bookTitle, bookAuthor, bookCover, bookStatus, total, current, bookRating, bookNotes]
  );

  return getBookById(bookId, userId);
}

async function updateBook(id, userId, updates = {}) {
  const fieldMap = {
    title: "title",
    author: "author",
    cover: "cover",
    status: "status",
    totalPages: "total_pages",
    currentPage: "current_page",
    rating: "rating",
    notes: "notes",
  };

  const setClauses = [];
  const values = [];

  for (const [key, col] of Object.entries(fieldMap)) {
    if (updates[key] !== undefined) {
      setClauses.push(`${col} = ?`);
      values.push(updates[key]);
    }
  }

  if (setClauses.length === 0) {
    return getBookById(id, userId);
  }

  values.push(id, userId);
  const sql = `UPDATE books SET ${setClauses.join(", ")} WHERE id = ? AND user_id = ?`;

  const [result] = await pool.query(sql, values);
  if (result.affectedRows === 0) return null;

  return getBookById(id, userId);
}

async function deleteBook(id, userId) {
  const [result] = await pool.query("DELETE FROM books WHERE id = ? AND user_id = ?", [id, userId]);
  return result.affectedRows > 0;
}

module.exports = {
  getBooksByUserId,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
};
