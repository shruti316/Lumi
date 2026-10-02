export interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  status: "want-to-read" | "reading" | "completed";
  currentPage: number;
  totalPages: number;
  rating: number;
  whyIPickedIt: string;
  notes: string;
  favoriteQuote: string;
  createdAt: string;
}

const BOOKS_KEY = "lumi_books";

export function getBooks(): Book[] {
  const storedBooks = localStorage.getItem(BOOKS_KEY);

  if (!storedBooks) {
    return [];
  }

  try {
    return JSON.parse(storedBooks) as Book[];
  } catch {
    return [];
  }
}

export function saveBooks(books: Book[]) {
  localStorage.setItem(BOOKS_KEY, JSON.stringify(books));
}

export function addBook(book: Book) {
  const books = getBooks();

  saveBooks([book, ...books]);
}

export function updateBook(updatedBook: Book) {
  const books = getBooks();

  saveBooks(
    books.map((book) =>
      book.id === updatedBook.id
        ? updatedBook
        : book
    )
  );
}

export function deleteBook(bookId: string) {
  const books = getBooks();

  saveBooks(
    books.filter((book) => book.id !== bookId)
  );
}