import {
  BookOpen,
  Plus,
  Search,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";

import {
  addBook,
  deleteBook,
  getBooks,
  type Book,
} from "../../lib/readingStorage";

const EMPTY_BOOK = {
  title: "",
  author: "",
  cover: "",
  status: "want-to-read" as Book["status"],
  currentPage: 0,
  totalPages: 0,
  rating: 0,
  whyIPickedIt: "",
  notes: "",
  favoriteQuote: "",
};

export default function Reading() {
  const [books, setBooks] = useState<Book[]>(() => getBooks());

  const [showModal, setShowModal] = useState(false);

  const [search, setSearch] = useState("");

  const [form, setForm] = useState(EMPTY_BOOK);

  function openModal() {
    setForm(EMPTY_BOOK);
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setForm(EMPTY_BOOK);
  }

  function handleAddBook() {
    if (!form.title.trim() || !form.author.trim()) {
      return;
    }

    const newBook: Book = {
      id: crypto.randomUUID(),
      title: form.title.trim(),
      author: form.author.trim(),
      cover: form.cover.trim(),
      status: form.status,
      currentPage: Number(form.currentPage) || 0,
      totalPages: Number(form.totalPages) || 0,
      rating: Number(form.rating) || 0,
      whyIPickedIt: form.whyIPickedIt.trim(),
      notes: form.notes.trim(),
      favoriteQuote: form.favoriteQuote.trim(),
      createdAt: new Date().toISOString(),
    };

    addBook(newBook);

    setBooks(getBooks());

    closeModal();
  }

  function handleDeleteBook(bookId: string) {
    deleteBook(bookId);
    setBooks(getBooks());
  }

  const filteredBooks = books.filter((book) => {
    const searchText = search.toLowerCase();

    return (
      book.title.toLowerCase().includes(searchText) ||
      book.author.toLowerCase().includes(searchText)
    );
  });

  const currentlyReading = books.filter(
    (book) => book.status === "reading"
  );

  const completedBooks = books.filter(
    (book) => book.status === "completed"
  );

  const wantToRead = books.filter(
    (book) => book.status === "want-to-read"
  );

  return (
    <div className="min-h-screen bg-[#fffafd]">
      <div className="mx-auto max-w-[1400px] px-5 py-6 md:px-8 md:py-8">

        {/* HEADER */}

        <header className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-1 text-sm font-medium text-[#9a82c7]">
              My little library 📚
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-[#3f3340] md:text-4xl">
              Reading
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-[#95838e] md:text-base">
              Keep track of the stories you're reading,
              the ones waiting for you, and the ones that
              stayed with you.
            </p>
          </div>

          <button
            type="button"
            onClick={openModal}
            className="flex items-center justify-center gap-2 rounded-2xl bg-[#8d7ad9] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#7d69ca]"
          >
            <Plus size={18} />
            Add a book
          </button>
        </header>

        {/* STATS */}

        <section className="grid gap-4 sm:grid-cols-3">
          <ReadingStat
            label="Currently reading"
            value={currentlyReading.length}
            emoji="📖"
            className="bg-[#f1ecff]"
          />

          <ReadingStat
            label="Want to read"
            value={wantToRead.length}
            emoji="🌷"
            className="bg-[#fff0f7]"
          />

          <ReadingStat
            label="Completed"
            value={completedBooks.length}
            emoji="✨"
            className="bg-[#edf8ef]"
          />
        </section>

        {/* SEARCH */}

        <div className="mt-6">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a18f99]"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search your books..."
              className="w-full rounded-2xl border border-[#f0e3eb] bg-white py-3.5 pl-11 pr-4 text-sm text-[#4c3e48] outline-none transition placeholder:text-[#b6a7af] focus:border-[#cfc2ee] focus:ring-4 focus:ring-[#f1ecff]"
            />
          </div>
        </div>

        {/* BOOK GRID */}

        <section className="mt-8">
          {filteredBooks.length === 0 ? (
            <EmptyReadingState
              hasBooks={books.length > 0}
              onAddBook={openModal}
            />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredBooks.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onDelete={handleDeleteBook}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* ADD BOOK MODAL */}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#3f3340]/30 px-4 py-6 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[28px] bg-white p-6 shadow-2xl md:p-8">

            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-[#9a82c7]">
                  Add to your library
                </p>

                <h2 className="mt-1 text-2xl font-bold text-[#3f3340]">
                  Add a new book 📚
                </h2>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f8f2f6] text-[#8f7d88] transition hover:bg-[#f2e8ee]"
              >
                <X size={19} />
              </button>
            </div>

            <div className="grid gap-5 md:grid-cols-2">

              {/* TITLE */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#51434d]">
                  Book title *
                </label>

                <input
                  value={form.title}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      title: event.target.value,
                    })
                  }
                  placeholder="e.g. The Silent Patient"
                  className="w-full rounded-2xl border border-[#eee2e9] bg-[#fffafd] px-4 py-3 text-sm outline-none focus:border-[#cfc2ee] focus:ring-4 focus:ring-[#f1ecff]"
                />
              </div>

              {/* AUTHOR */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#51434d]">
                  Author *
                </label>

                <input
                  value={form.author}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      author: event.target.value,
                    })
                  }
                  placeholder="e.g. Alex Michaelides"
                  className="w-full rounded-2xl border border-[#eee2e9] bg-[#fffafd] px-4 py-3 text-sm outline-none focus:border-[#cfc2ee] focus:ring-4 focus:ring-[#f1ecff]"
                />
              </div>

              {/* COVER */}

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-[#51434d]">
                  Cover image URL
                </label>

                <input
                  value={form.cover}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      cover: event.target.value,
                    })
                  }
                  placeholder="Paste an image URL"
                  className="w-full rounded-2xl border border-[#eee2e9] bg-[#fffafd] px-4 py-3 text-sm outline-none focus:border-[#cfc2ee] focus:ring-4 focus:ring-[#f1ecff]"
                />

                <p className="mt-2 text-xs text-[#a18f99]">
                  We'll add proper image uploading later.
                </p>
              </div>

              {/* STATUS */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#51434d]">
                  Reading status
                </label>

                <select
                  value={form.status}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      status:
                        event.target.value as Book["status"],
                    })
                  }
                  className="w-full rounded-2xl border border-[#eee2e9] bg-[#fffafd] px-4 py-3 text-sm outline-none focus:border-[#cfc2ee] focus:ring-4 focus:ring-[#f1ecff]"
                >
                  <option value="want-to-read">
                    Want to read
                  </option>

                  <option value="reading">
                    Currently reading
                  </option>

                  <option value="completed">
                    Completed
                  </option>
                </select>
              </div>

              {/* TOTAL PAGES */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#51434d]">
                  Total pages
                </label>

                <input
                  type="number"
                  min="0"
                  value={form.totalPages || ""}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      totalPages: Number(
                        event.target.value
                      ),
                    })
                  }
                  placeholder="e.g. 352"
                  className="w-full rounded-2xl border border-[#eee2e9] bg-[#fffafd] px-4 py-3 text-sm outline-none focus:border-[#cfc2ee] focus:ring-4 focus:ring-[#f1ecff]"
                />
              </div>

              {/* CURRENT PAGE */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#51434d]">
                  Current page
                </label>

                <input
                  type="number"
                  min="0"
                  value={form.currentPage || ""}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      currentPage: Number(
                        event.target.value
                      ),
                    })
                  }
                  placeholder="e.g. 120"
                  className="w-full rounded-2xl border border-[#eee2e9] bg-[#fffafd] px-4 py-3 text-sm outline-none focus:border-[#cfc2ee] focus:ring-4 focus:ring-[#f1ecff]"
                />
              </div>

              {/* RATING */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#51434d]">
                  Rating
                </label>

                <select
                  value={form.rating}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      rating: Number(
                        event.target.value
                      ),
                    })
                  }
                  className="w-full rounded-2xl border border-[#eee2e9] bg-[#fffafd] px-4 py-3 text-sm outline-none focus:border-[#cfc2ee] focus:ring-4 focus:ring-[#f1ecff]"
                >
                  <option value="0">Not rated</option>
                  <option value="1">⭐ 1</option>
                  <option value="2">⭐ 2</option>
                  <option value="3">⭐ 3</option>
                  <option value="4">⭐ 4</option>
                  <option value="5">⭐ 5</option>
                </select>
              </div>

              {/* WHY */}

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-[#51434d]">
                  Why did I pick this book?
                </label>

                <textarea
                  value={form.whyIPickedIt}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      whyIPickedIt:
                        event.target.value,
                    })
                  }
                  rows={3}
                  placeholder="What made you want to read it?"
                  className="w-full resize-none rounded-2xl border border-[#eee2e9] bg-[#fffafd] px-4 py-3 text-sm outline-none focus:border-[#cfc2ee] focus:ring-4 focus:ring-[#f1ecff]"
                />
              </div>

              {/* NOTES */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#51434d]">
                  Notes
                </label>

                <textarea
                  value={form.notes}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      notes: event.target.value,
                    })
                  }
                  rows={4}
                  placeholder="Your thoughts..."
                  className="w-full resize-none rounded-2xl border border-[#eee2e9] bg-[#fffafd] px-4 py-3 text-sm outline-none focus:border-[#cfc2ee] focus:ring-4 focus:ring-[#f1ecff]"
                />
              </div>

              {/* QUOTE */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#51434d]">
                  Favourite quote
                </label>

                <textarea
                  value={form.favoriteQuote}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      favoriteQuote:
                        event.target.value,
                    })
                  }
                  rows={4}
                  placeholder="A quote you want to remember..."
                  className="w-full resize-none rounded-2xl border border-[#eee2e9] bg-[#fffafd] px-4 py-3 text-sm outline-none focus:border-[#cfc2ee] focus:ring-4 focus:ring-[#f1ecff]"
                />
              </div>
            </div>

            {/* BUTTONS */}

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeModal}
                className="rounded-2xl px-5 py-3 text-sm font-semibold text-[#8f7d88] transition hover:bg-[#f8f2f6]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleAddBook}
                disabled={
                  !form.title.trim() ||
                  !form.author.trim()
                }
                className="rounded-2xl bg-[#8d7ad9] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#7d69ca] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Add book
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ───────────────── STAT ───────────────── */

function ReadingStat({
  label,
  value,
  emoji,
  className,
}: {
  label: string;
  value: number;
  emoji: string;
  className: string;
}) {
  return (
    <div
      className={`rounded-[24px] p-5 ${className}`}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-[#756671]">
          {label}
        </p>

        <span className="text-xl">{emoji}</span>
      </div>

      <p className="mt-3 text-3xl font-bold text-[#3f3340]">
        {value}
      </p>
    </div>
  );
}

/* ───────────────── BOOK CARD ───────────────── */

function BookCard({
  book,
  onDelete,
}: {
  book: Book;
  onDelete: (bookId: string) => void;
}) {
  const progress =
    book.totalPages > 0
      ? Math.min(
          100,
          Math.round(
            (book.currentPage /
              book.totalPages) *
              100
          )
        )
      : 0;

  const statusLabel = {
    "want-to-read": "Want to read",
    reading: "Currently reading",
    completed: "Completed",
  };

  return (
    <article className="group overflow-hidden rounded-[26px] border border-[#f1e5eb] bg-white shadow-[0_8px_30px_rgba(80,50,70,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_35px_rgba(80,50,70,0.09)]">

      {/* COVER */}

      <div className="relative h-64 overflow-hidden bg-gradient-to-br from-[#eee9ff] via-[#fceaf3] to-[#fff0e3]">
        {book.cover ? (
          <img
            src={book.cover}
            alt={book.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center">
            <BookOpen
              size={38}
              className="text-[#9a82c7]"
            />

            <p className="mt-4 max-w-[170px] text-sm font-semibold text-[#756671]">
              {book.title}
            </p>

            <p className="mt-1 text-xs text-[#a18f99]">
              {book.author}
            </p>
          </div>
        )}

        {/* STATUS */}

        <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-[#66576a] shadow-sm backdrop-blur">
          {statusLabel[book.status]}
        </div>

        {/* DELETE */}

        <button
          type="button"
          onClick={() => onDelete(book.id)}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-xl bg-white/90 text-[#b28f9e] opacity-0 shadow-sm backdrop-blur transition group-hover:opacity-100 hover:bg-[#fff0f4] hover:text-[#d85d91]"
          title="Delete book"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* CONTENT */}

      <div className="p-5">
        <h3 className="truncate font-bold text-[#3f3340]">
          {book.title}
        </h3>

        <p className="mt-1 truncate text-sm text-[#95838e]">
          {book.author}
        </p>

        {/* RATING */}

        {book.rating > 0 && (
          <div className="mt-3 flex items-center gap-1">
            {Array.from({ length: 5 }).map(
              (_, index) => (
                <Star
                  key={index}
                  size={14}
                  className={
                    index < book.rating
                      ? "fill-[#e7b25f] text-[#e7b25f]"
                      : "text-[#ddd2d8]"
                  }
                />
              )
            )}
          </div>
        )}

        {/* PROGRESS */}

        {book.totalPages > 0 && (
          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="text-[#95838e]">
                {book.currentPage} /{" "}
                {book.totalPages} pages
              </span>

              <span className="font-semibold text-[#8d7ad9]">
                {progress}%
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-[#f2edf5]">
              <div
                className="h-full rounded-full bg-[#9a87df] transition-all"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* WHY I PICKED IT */}

        {book.whyIPickedIt && (
          <div className="mt-5 rounded-2xl bg-[#faf7ff] p-3">
            <p className="text-xs leading-5 text-[#756671]">
              <span className="font-semibold">
                Why I picked it:
              </span>{" "}
              {book.whyIPickedIt}
            </p>
          </div>
        )}
      </div>
    </article>
  );
}

/* ───────────────── EMPTY STATE ───────────────── */

function EmptyReadingState({
  hasBooks,
  onAddBook,
}: {
  hasBooks: boolean;
  onAddBook: () => void;
}) {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center rounded-[28px] border border-dashed border-[#e9dce5] bg-white px-6 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#f1ecff] text-4xl">
        📚
      </div>

      <h2 className="mt-5 text-xl font-bold text-[#3f3340]">
        {hasBooks
          ? "No books found"
          : "Your library is waiting"}
      </h2>

      <p className="mt-2 max-w-md text-sm leading-6 text-[#95838e]">
        {hasBooks
          ? "Try searching with another title or author."
          : "Add your first book and start building your little digital library."}
      </p>

      {!hasBooks && (
        <button
          type="button"
          onClick={onAddBook}
          className="mt-6 flex items-center gap-2 rounded-2xl bg-[#8d7ad9] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#7d69ca]"
        >
          <Plus size={18} />
          Add your first book
        </button>
      )}
    </div>
  );
}