import { useState } from "react";
import {
  BookOpen,
  Plus,
  Search,
  Star,
  Trash2,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Modal } from "../../components/ui/Modal";
import {
  addBook,
  deleteBook,
  getBooks,
  updateBook,
  type Book,
} from "../../lib/readingStorage";

const STARTER_BOOKS: Omit<Book, "id" | "createdAt">[] = [
  {
    title: "Atomic Habits",
    author: "James Clear",
    cover: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80",
    status: "reading",
    currentPage: 142,
    totalPages: 320,
    rating: 5,
    whyIPickedIt: "Recommended for building positive daily systems.",
    notes: "Habits are the compound interest of self-improvement.",
    favoriteQuote: "You do not rise to the level of your goals. You fall to the level of your systems.",
  },
  {
    title: "Before the Coffee Gets Cold",
    author: "Toshikazu Kawaguchi",
    cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80",
    status: "want-to-read",
    currentPage: 0,
    totalPages: 213,
    rating: 0,
    whyIPickedIt: "A cozy Tokyo cafe that lets visitors travel back in time.",
    notes: "",
    favoriteQuote: "",
  },
];

const EMPTY_BOOK_FORM = {
  title: "",
  author: "",
  cover: "",
  status: "reading" as Book["status"],
  currentPage: 0,
  totalPages: 300,
  rating: 0,
  whyIPickedIt: "",
  notes: "",
  favoriteQuote: "",
};

export default function Reading() {
  const [books, setBooks] = useState<Book[]>(() => {
    const existing = getBooks();
    if (existing.length === 0) {
      // Initialize with starter books so library is never a barren void
      const starters = STARTER_BOOKS.map((b) => ({
        ...b,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      }));
      starters.forEach((b) => addBook(b));
      return starters;
    }
    return existing;
  });

  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<
    "all" | "reading" | "want-to-read" | "completed"
  >("all");

  const [form, setForm] = useState(EMPTY_BOOK_FORM);

  function handleSaveBook(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.author.trim()) return;

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
    setForm(EMPTY_BOOK_FORM);
    setShowModal(false);
  }

  function handleQuickUpdatePage(book: Book, newPage: number) {
    const clampedPage = Math.max(0, Math.min(book.totalPages || 9999, newPage));
    const isNowComplete = clampedPage >= book.totalPages && book.totalPages > 0;
    const updated: Book = {
      ...book,
      currentPage: clampedPage,
      status: isNowComplete ? "completed" : book.status,
    };
    updateBook(updated);
    setBooks(getBooks());
  }

  function handleDelete(id: string) {
    deleteBook(id);
    setBooks(getBooks());
  }

  const currentlyReadingList = books.filter((b) => b.status === "reading");
  const wantToReadList = books.filter((b) => b.status === "want-to-read");
  const completedList = books.filter((b) => b.status === "completed");

  const totalPagesRead = books.reduce((acc, b) => acc + (b.currentPage || 0), 0);

  const featuredBook = currentlyReadingList.length > 0 ? currentlyReadingList[0] : null;

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;

    if (activeFilter === "all") return true;
    return book.status === activeFilter;
  });

  return (
    <div className="min-h-screen pb-24 text-[#16131F]">
      <div className="mx-auto max-w-6xl px-5 py-6 md:px-8 md:py-8">
        {/* ═══════════════════════════════════════
            HEADER
        ═══════════════════════════════════════ */}
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#806C79]">
              My Cozy Digital Library 📚
            </p>
            <h1 className="font-caveat text-4xl font-bold tracking-tight text-[#16131F] sm:text-5xl">
              Reading & Books
            </h1>
            <p className="font-caveat text-xl text-[#806C79]">
              Track the books you're exploring, the wisdom gained & stories on your shelf.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setForm(EMPTY_BOOK_FORM);
              setShowModal(true);
            }}
            className="flex items-center gap-2 rounded-2xl bg-[#DAD4DF] border border-[#BAB0C8] px-4 py-2.5 text-xs font-bold text-[#16131F] shadow-2xs transition duration-200 hover:-translate-y-0.5 hover:bg-[#C1A0AC] active:scale-95 w-fit"
          >
            <Plus size={16} />
            <span>Add a Book</span>
          </button>
        </header>

        {/* ═══════════════════════════════════════
            TOP STATS BAR
        ═══════════════════════════════════════ */}
        <section className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Card className="!bg-[#DAD4DF] !border-[#BAB0C8] p-3.5 glow-lavender">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#4A3F4B]">
              Currently Reading
            </p>
            <p className="text-2xl font-extrabold text-[#16131F] mt-0.5">
              {currentlyReadingList.length}
            </p>
            <p className="mt-1 text-[10px] font-semibold text-[#806C79]">
              Active reads
            </p>
          </Card>

          <Card className="!bg-[#DCE8E0] !border-[#BAB0C8] p-3.5 glow-green">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#4A6E53]">
              Completed Books
            </p>
            <p className="text-2xl font-extrabold text-[#16131F] mt-0.5 flex items-center gap-1">
              <CheckCircle2 size={18} className="text-[#4A6E53]" />
              {completedList.length}
            </p>
            <p className="mt-1 text-[10px] font-semibold text-[#806C79]">
              Finished stories
            </p>
          </Card>

          <Card className="!bg-[#F0D9E4] !border-[#C1A0AC] p-3.5 glow-pink">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#806C79]">
              Want to Read
            </p>
            <p className="text-2xl font-extrabold text-[#16131F] mt-0.5">
              {wantToReadList.length}
            </p>
            <p className="mt-1 text-[10px] font-semibold text-[#806C79]">
              On reading wishlist
            </p>
          </Card>

          <Card className="!bg-[#F2DFD0] !border-[#BAB0C8] p-3.5 glow-peach">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#806C79]">
              Total Pages Logged
            </p>
            <p className="text-2xl font-extrabold text-[#16131F] mt-0.5 flex items-center gap-1">
              <Sparkles size={18} className="text-[#806C79]" />
              {totalPagesRead}
            </p>
            <p className="mt-1 text-[10px] font-semibold text-[#806C79]">
              Pages absorbed
            </p>
          </Card>
        </section>

        {/* ═══════════════════════════════════════
            FEATURED CURRENT READ SPOTLIGHT
        ═══════════════════════════════════════ */}
        {featuredBook && (
          <Card className="mb-6 !bg-gradient-to-r !from-[#DAD4DF] !to-[#F2DFD0] !border-[#BAB0C8] p-5 shadow-sm glow-lavender">
            <div className="flex flex-col md:flex-row items-center gap-5">
              {featuredBook.cover ? (
                <img
                  src={featuredBook.cover}
                  alt={featuredBook.title}
                  className="h-32 w-24 object-cover rounded-xl shadow-md shrink-0"
                />
              ) : (
                <div className="flex h-32 w-24 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#16131F] to-[#806C79] text-xs font-bold text-[#F4F0EB] shadow-md">
                  📖 BOOK
                </div>
              )}

              <div className="min-w-0 flex-1 w-full">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-[#DAD4DF] px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#312A44] border border-[#BAB0C8]">
                    Current Spotlight
                  </span>
                  {featuredBook.rating > 0 && (
                    <div className="flex items-center gap-0.5 text-[#806C79]">
                      {Array.from({ length: featuredBook.rating }).map((_, i) => (
                        <Star key={i} size={12} className="fill-[#806C79]" />
                      ))}
                    </div>
                  )}
                </div>

                <h2 className="mt-1.5 font-caveat text-3xl font-bold text-[#16131F] truncate">
                  {featuredBook.title}
                </h2>
                <p className="text-xs font-semibold text-[#806C79]">
                  by {featuredBook.author}
                </p>

                {featuredBook.favoriteQuote && (
                  <p className="mt-2 text-xs italic text-[#4A3F4B] bg-[#F4F0EB]/70 p-2 rounded-lg border border-[#DAD4DF]">
                    "{featuredBook.favoriteQuote}"
                  </p>
                )}

                {/* Live progress slider & page control */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs font-bold text-[#16131F] mb-1">
                    <span>
                      Page {featuredBook.currentPage} of {featuredBook.totalPages || 300}
                    </span>
                    <span>
                      {featuredBook.totalPages > 0
                        ? Math.round(
                            (featuredBook.currentPage / featuredBook.totalPages) * 100
                          )
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={0}
                      max={featuredBook.totalPages || 300}
                      value={featuredBook.currentPage}
                      onChange={(e) =>
                        handleQuickUpdatePage(featuredBook, Number(e.target.value))
                      }
                      className="w-full accent-[#312A44] cursor-pointer"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        handleQuickUpdatePage(
                          featuredBook,
                          featuredBook.currentPage + 10
                        )
                      }
                      className="rounded-lg bg-[#F4F0EB] border border-[#BAB0C8] px-2.5 py-1 text-[11px] font-bold text-[#16131F] hover:bg-[#DAD4DF] shrink-0 shadow-2xs"
                    >
                      +10 pgs
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* ═══════════════════════════════════════
            FILTERS & SEARCH
        ═══════════════════════════════════════ */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-1.5 rounded-2xl border border-[#DAD4DF] bg-[#F4F0EB] p-1 w-fit shadow-2xs">
            {(
              [
                { id: "all", label: "All Books" },
                { id: "reading", label: "Reading" },
                { id: "want-to-read", label: "Want to Read" },
                { id: "completed", label: "Completed" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id)}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                  activeFilter === tab.id
                    ? "bg-[#DAD4DF] text-[#16131F] shadow-2xs"
                    : "text-[#806C79] hover:text-[#16131F]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative flex-1 sm:w-64">
            <Search size={14} className="absolute left-3 top-2.5 text-[#806C79]" />
            <input
              type="text"
              placeholder="Search title or author..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-[#DAD4DF] bg-[#F4F0EB] pl-8 pr-3 py-1.5 text-xs font-medium text-[#16131F] shadow-2xs outline-none focus:border-[#BAB0C8]"
            />
          </div>
        </div>

        {/* ═══════════════════════════════════════
            BOOK CARDS GRID
        ═══════════════════════════════════════ */}
        {filteredBooks.length === 0 ? (
          <Card className="!bg-[#DAD4DF] !border-[#BAB0C8] p-8 text-center glow-lavender">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F4F0EB] text-2xl shadow-2xs border border-[#BAB0C8]">
              📚
            </div>
            <h3 className="font-caveat text-2xl font-bold text-[#16131F]">
              No books found in this view
            </h3>
            <p className="mt-1 text-xs text-[#806C79]">
              Add new books to your shelf or adjust the filter above.
            </p>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredBooks.map((book) => {
              const progress =
                book.totalPages > 0
                  ? Math.min(
                      100,
                      Math.round((book.currentPage / book.totalPages) * 100)
                    )
                  : 0;

              return (
                <Card
                  key={book.id}
                  className="group relative flex flex-col justify-between overflow-hidden !bg-[#F4F0EB] !border-[#DAD4DF] p-4 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div>
                    {/* Top cover / icon banner */}
                    <div className="relative mb-3 h-36 w-full overflow-hidden rounded-xl bg-gradient-to-br from-[#DAD4DF] to-[#F0D9E4] flex items-center justify-center">
                      {book.cover ? (
                        <img
                          src={book.cover}
                          alt={book.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <BookOpen size={36} className="text-[#312A44]" />
                      )}

                      <span
                        className={`absolute left-2.5 top-2.5 rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider backdrop-blur-md ${
                          book.status === "reading"
                            ? "bg-[#DAD4DF]/90 text-[#312A44]"
                            : book.status === "completed"
                            ? "bg-[#DCE8E0]/90 text-[#4A6E53]"
                            : "bg-[#F0D9E4]/90 text-[#806C79]"
                        }`}
                      >
                        {book.status === "reading"
                          ? "Reading"
                          : book.status === "completed"
                          ? "Finished"
                          : "Wishlist"}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleDelete(book.id)}
                        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-lg bg-[#F4F0EB]/90 text-[#806C79] hover:text-[#C1A0AC] hover:bg-[#F0D9E4] transition shadow-2xs opacity-0 group-hover:opacity-100"
                        title="Delete book"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    <h3 className="font-bold text-sm text-[#16131F] truncate">
                      {book.title}
                    </h3>
                    <p className="text-xs text-[#806C79] truncate">
                      by {book.author}
                    </p>

                    {book.rating > 0 && (
                      <div className="mt-1.5 flex items-center gap-0.5 text-[#806C79]">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={11}
                            className={
                              i < book.rating
                                ? "fill-[#806C79]"
                                : "text-[#BAB0C8]"
                            }
                          />
                        ))}
                      </div>
                    )}

                    {book.whyIPickedIt && (
                      <p className="mt-2 text-[11px] text-[#806C79] line-clamp-2 italic bg-[#F4F0EB] border border-[#DAD4DF] p-2 rounded-lg">
                        "{book.whyIPickedIt}"
                      </p>
                    )}
                  </div>

                  {/* Progress & Quick Page Counter */}
                  <div className="mt-3 pt-2.5 border-t border-[#DAD4DF]">
                    <div className="flex items-center justify-between text-[11px] font-bold text-[#806C79] mb-1">
                      <span>
                        {book.currentPage} / {book.totalPages || 0} pgs
                      </span>
                      <span className="text-[#312A44]">{progress}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-[#DAD4DF]">
                      <div
                        className="h-full rounded-full bg-[#806C79] transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* ═══════════════════════════════════════
            NEW BOOK MODAL
        ═══════════════════════════════════════ */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Add a Book to Library"
          subtitle="Track and reflect on what you read."
        >
          <form onSubmit={handleSaveBook} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#16131F] mb-1">
                  Book Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. The Psychology of Money"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full rounded-xl border border-[#BAB0C8] bg-[#F4F0EB] px-3.5 py-2 text-xs font-medium text-[#16131F] focus:border-[#312A44] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#16131F] mb-1">
                  Author *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Morgan Housel"
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                  className="w-full rounded-xl border border-[#BAB0C8] bg-[#F4F0EB] px-3.5 py-2 text-xs font-medium text-[#16131F] focus:border-[#312A44] outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#16131F] mb-1">
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value as Book["status"] })
                  }
                  className="w-full rounded-xl border border-[#BAB0C8] bg-[#F4F0EB] px-3 py-2 text-xs font-bold text-[#16131F] focus:border-[#312A44] outline-none"
                >
                  <option value="reading">Reading</option>
                  <option value="want-to-read">Want to Read</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#16131F] mb-1">
                  Current Page
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.currentPage}
                  onChange={(e) =>
                    setForm({ ...form, currentPage: Number(e.target.value) })
                  }
                  className="w-full rounded-xl border border-[#BAB0C8] bg-[#F4F0EB] px-3.5 py-2 text-xs font-medium text-[#16131F] focus:border-[#312A44] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#16131F] mb-1">
                  Total Pages
                </label>
                <input
                  type="number"
                  min={1}
                  value={form.totalPages}
                  onChange={(e) =>
                    setForm({ ...form, totalPages: Number(e.target.value) })
                  }
                  className="w-full rounded-xl border border-[#BAB0C8] bg-[#F4F0EB] px-3.5 py-2 text-xs font-medium text-[#16131F] focus:border-[#312A44] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#16131F] mb-1">
                Cover Image URL (Optional)
              </label>
              <input
                type="text"
                placeholder="https://..."
                value={form.cover}
                onChange={(e) => setForm({ ...form, cover: e.target.value })}
                className="w-full rounded-xl border border-[#BAB0C8] bg-[#F4F0EB] px-3.5 py-2 text-xs font-medium text-[#16131F] focus:border-[#312A44] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#16131F] mb-1">
                Why I Picked It / Notes
              </label>
              <textarea
                placeholder="What drawn you to this book..."
                value={form.whyIPickedIt}
                onChange={(e) =>
                  setForm({ ...form, whyIPickedIt: e.target.value })
                }
                rows={2}
                className="w-full rounded-xl border border-[#BAB0C8] bg-[#F4F0EB] px-3.5 py-2 text-xs font-medium text-[#16131F] focus:border-[#312A44] outline-none resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-xl px-4 py-2 text-xs font-bold text-[#806C79] hover:bg-[#DAD4DF]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!form.title.trim() || !form.author.trim()}
                className="rounded-xl bg-[#312A44] px-5 py-2 text-xs font-bold text-[#F4F0EB] shadow-2xs hover:bg-[#4A3F4B] disabled:opacity-50"
              >
                Add to Library
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}