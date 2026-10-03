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
    <div className="min-h-screen pb-24 text-[#403842]">
      <div className="mx-auto max-w-6xl px-5 py-6 md:px-8 md:py-8">
        {/* ═══════════════════════════════════════
            HEADER
        ═══════════════════════════════════════ */}
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#7564af]">
              My Cozy Digital Library 📚
            </p>
            <h1 className="font-caveat text-4xl font-bold tracking-tight text-[#40364a] sm:text-5xl">
              Reading & Books
            </h1>
            <p className="font-caveat text-xl text-[#766d78]">
              Track the books you're exploring, the wisdom gained & stories on your shelf.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setForm(EMPTY_BOOK_FORM);
              setShowModal(true);
            }}
            className="flex items-center gap-2 rounded-2xl bg-[#eee9f8] border border-[#dcd5ed] px-4 py-2.5 text-xs font-bold text-[#40364a] shadow-2xs transition duration-200 hover:-translate-y-0.5 hover:bg-[#e4dcfa] active:scale-95 w-fit"
          >
            <Plus size={16} />
            <span>Add a Book</span>
          </button>
        </header>

        {/* ═══════════════════════════════════════
            TOP STATS BAR
        ═══════════════════════════════════════ */}
        <section className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Card className="!bg-[#eee9f8] !border-[#dcd5ed] p-3.5 glow-lavender">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#7564af]">
              Currently Reading
            </p>
            <p className="text-2xl font-extrabold text-[#40364a] mt-0.5">
              {currentlyReadingList.length}
            </p>
            <p className="mt-1 text-[10px] font-semibold text-[#766d78]">
              Active reads
            </p>
          </Card>

          <Card className="!bg-[#deeee0] !border-[#c6dccc] p-3.5 glow-green">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#5e8668]">
              Completed Books
            </p>
            <p className="text-2xl font-extrabold text-[#304639] mt-0.5 flex items-center gap-1">
              <CheckCircle2 size={18} className="text-[#5e8668]" />
              {completedList.length}
            </p>
            <p className="mt-1 text-[10px] font-semibold text-[#766d78]">
              Finished stories
            </p>
          </Card>

          <Card className="!bg-[#f7dce7] !border-[#e8c5d5] p-3.5 glow-pink">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#b5577f]">
              Want to Read
            </p>
            <p className="text-2xl font-extrabold text-[#473640] mt-0.5">
              {wantToReadList.length}
            </p>
            <p className="mt-1 text-[10px] font-semibold text-[#766d78]">
              On reading wishlist
            </p>
          </Card>

          <Card className="!bg-[#f7e0cc] !border-[#edcfb5] p-3.5 glow-peach">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#ae6e42]">
              Total Pages Logged
            </p>
            <p className="text-2xl font-extrabold text-[#493b33] mt-0.5 flex items-center gap-1">
              <Sparkles size={18} className="text-[#ae6e42]" />
              {totalPagesRead}
            </p>
            <p className="mt-1 text-[10px] font-semibold text-[#766d78]">
              Pages absorbed
            </p>
          </Card>
        </section>

        {/* ═══════════════════════════════════════
            FEATURED CURRENT READ SPOTLIGHT
        ═══════════════════════════════════════ */}
        {featuredBook && (
          <Card className="mb-6 !bg-gradient-to-r !from-[#eee9f8] !to-[#f7e0cc] !border-[#dcd5ed] p-5 shadow-sm glow-lavender">
            <div className="flex flex-col md:flex-row items-center gap-5">
              {featuredBook.cover ? (
                <img
                  src={featuredBook.cover}
                  alt={featuredBook.title}
                  className="h-32 w-24 object-cover rounded-xl shadow-md shrink-0"
                />
              ) : (
                <div className="flex h-32 w-24 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#7c69b3] to-[#b5577f] text-xs font-bold text-white shadow-md">
                  📖 BOOK
                </div>
              )}

              <div className="min-w-0 flex-1 w-full">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-[#ded5f2] px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#7564af]">
                    Current Spotlight
                  </span>
                  {featuredBook.rating > 0 && (
                    <div className="flex items-center gap-0.5 text-[#e7b25f]">
                      {Array.from({ length: featuredBook.rating }).map((_, i) => (
                        <Star key={i} size={12} className="fill-[#e7b25f]" />
                      ))}
                    </div>
                  )}
                </div>

                <h2 className="mt-1.5 font-caveat text-3xl font-bold text-[#40364a] truncate">
                  {featuredBook.title}
                </h2>
                <p className="text-xs font-semibold text-[#766d78]">
                  by {featuredBook.author}
                </p>

                {featuredBook.favoriteQuote && (
                  <p className="mt-2 text-xs italic text-[#574c5d] bg-white/60 p-2 rounded-lg border border-white/80">
                    "{featuredBook.favoriteQuote}"
                  </p>
                )}

                {/* Live progress slider & page control */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs font-bold text-[#40364a] mb-1">
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
                      className="w-full accent-[#7c69b3] cursor-pointer"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        handleQuickUpdatePage(
                          featuredBook,
                          featuredBook.currentPage + 10
                        )
                      }
                      className="rounded-lg bg-white/90 border border-[#dcd5ed] px-2.5 py-1 text-[11px] font-bold text-[#7564af] hover:bg-white shrink-0 shadow-2xs"
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
          <div className="flex flex-wrap gap-1.5 rounded-2xl border border-[#efe8e1] bg-white/80 p-1 w-fit shadow-2xs">
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
                    ? "bg-[#eee9f8] text-[#7564af] shadow-2xs"
                    : "text-[#766d78] hover:text-[#403842]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative flex-1 sm:w-64">
            <Search size={14} className="absolute left-3 top-2.5 text-[#918793]" />
            <input
              type="text"
              placeholder="Search title or author..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-[#efe8e1] bg-white pl-8 pr-3 py-1.5 text-xs font-medium text-[#403842] shadow-2xs outline-none"
            />
          </div>
        </div>

        {/* ═══════════════════════════════════════
            BOOK CARDS GRID
        ═══════════════════════════════════════ */}
        {filteredBooks.length === 0 ? (
          <Card className="!bg-[#eee9f8] !border-[#dcd5ed] p-8 text-center glow-lavender">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-2xl shadow-2xs">
              📚
            </div>
            <h3 className="font-caveat text-2xl font-bold text-[#40364a]">
              No books found in this view
            </h3>
            <p className="mt-1 text-xs text-[#766d78]">
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
                  className="group relative flex flex-col justify-between overflow-hidden !bg-white/90 !border-[#efe8e1] p-4 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div>
                    {/* Top cover / icon banner */}
                    <div className="relative mb-3 h-36 w-full overflow-hidden rounded-xl bg-gradient-to-br from-[#eee9f8] to-[#f7dce7] flex items-center justify-center">
                      {book.cover ? (
                        <img
                          src={book.cover}
                          alt={book.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <BookOpen size={36} className="text-[#7c69b3]" />
                      )}

                      <span
                        className={`absolute left-2.5 top-2.5 rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider backdrop-blur-md ${
                          book.status === "reading"
                            ? "bg-[#eee9f8]/90 text-[#7564af]"
                            : book.status === "completed"
                            ? "bg-[#deeee0]/90 text-[#5e8668]"
                            : "bg-[#f7dce7]/90 text-[#b5577f]"
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
                        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-lg bg-white/90 text-[#918793] hover:text-red-500 hover:bg-white transition shadow-2xs opacity-0 group-hover:opacity-100"
                        title="Delete book"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    <h3 className="font-bold text-sm text-[#403842] truncate">
                      {book.title}
                    </h3>
                    <p className="text-xs text-[#766d78] truncate">
                      by {book.author}
                    </p>

                    {book.rating > 0 && (
                      <div className="mt-1.5 flex items-center gap-0.5 text-[#e7b25f]">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={11}
                            className={
                              i < book.rating
                                ? "fill-[#e7b25f]"
                                : "text-[#dcd5ed]"
                            }
                          />
                        ))}
                      </div>
                    )}

                    {book.whyIPickedIt && (
                      <p className="mt-2 text-[11px] text-[#766d78] line-clamp-2 italic bg-[#faf8f6] p-2 rounded-lg">
                        "{book.whyIPickedIt}"
                      </p>
                    )}
                  </div>

                  {/* Progress & Quick Page Counter */}
                  <div className="mt-3 pt-2.5 border-t border-[#efe8e1]">
                    <div className="flex items-center justify-between text-[11px] font-bold text-[#766d78] mb-1">
                      <span>
                        {book.currentPage} / {book.totalPages || 0} pgs
                      </span>
                      <span className="text-[#7564af]">{progress}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-[#efe8e1]">
                      <div
                        className="h-full rounded-full bg-[#7c69b3] transition-all duration-500"
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
                <label className="block text-xs font-bold text-[#403842] mb-1">
                  Book Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. The Psychology of Money"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full rounded-xl border border-[#dcd5ed] bg-[#faf8f6] px-3.5 py-2 text-xs font-medium text-[#403842] focus:border-[#7c69b3] focus:bg-white outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#403842] mb-1">
                  Author *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Morgan Housel"
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                  className="w-full rounded-xl border border-[#dcd5ed] bg-[#faf8f6] px-3.5 py-2 text-xs font-medium text-[#403842] focus:border-[#7c69b3] focus:bg-white outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#403842] mb-1">
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value as Book["status"] })
                  }
                  className="w-full rounded-xl border border-[#dcd5ed] bg-[#faf8f6] px-3 py-2 text-xs font-bold text-[#403842] focus:border-[#7c69b3] focus:bg-white outline-none"
                >
                  <option value="reading">Reading</option>
                  <option value="want-to-read">Want to Read</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#403842] mb-1">
                  Current Page
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.currentPage}
                  onChange={(e) =>
                    setForm({ ...form, currentPage: Number(e.target.value) })
                  }
                  className="w-full rounded-xl border border-[#dcd5ed] bg-[#faf8f6] px-3.5 py-2 text-xs font-medium text-[#403842] focus:border-[#7c69b3] focus:bg-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#403842] mb-1">
                  Total Pages
                </label>
                <input
                  type="number"
                  min={1}
                  value={form.totalPages}
                  onChange={(e) =>
                    setForm({ ...form, totalPages: Number(e.target.value) })
                  }
                  className="w-full rounded-xl border border-[#dcd5ed] bg-[#faf8f6] px-3.5 py-2 text-xs font-medium text-[#403842] focus:border-[#7c69b3] focus:bg-white outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#403842] mb-1">
                Cover Image URL (Optional)
              </label>
              <input
                type="text"
                placeholder="https://..."
                value={form.cover}
                onChange={(e) => setForm({ ...form, cover: e.target.value })}
                className="w-full rounded-xl border border-[#dcd5ed] bg-[#faf8f6] px-3.5 py-2 text-xs font-medium text-[#403842] focus:border-[#7c69b3] focus:bg-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#403842] mb-1">
                Why I Picked It / Notes
              </label>
              <textarea
                placeholder="What drawn you to this book..."
                value={form.whyIPickedIt}
                onChange={(e) =>
                  setForm({ ...form, whyIPickedIt: e.target.value })
                }
                rows={2}
                className="w-full rounded-xl border border-[#dcd5ed] bg-[#faf8f6] px-3.5 py-2 text-xs font-medium text-[#403842] focus:border-[#7c69b3] focus:bg-white outline-none resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-xl px-4 py-2 text-xs font-bold text-[#766d78] hover:bg-white/50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!form.title.trim() || !form.author.trim()}
                className="rounded-xl bg-[#7c69b3] px-5 py-2 text-xs font-bold text-white shadow-2xs hover:bg-[#6b58a1] disabled:opacity-50"
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