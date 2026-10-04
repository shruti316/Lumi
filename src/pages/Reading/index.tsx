import { useState, useEffect } from "react";
import {
  BookOpen,
  Plus,
  Search,
  Star,
  Trash2,
  Sparkles,
  CheckCircle2,
  Clock,
  Play,
  Pause,
  RotateCcw,
  BookMarked,
  Quote,
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
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<
    "all" | "reading" | "want-to-read" | "completed"
  >("all");

  const [form, setForm] = useState(EMPTY_BOOK_FORM);

  // Mini Reading Session Timer
  const [sessionMinutes, setSessionMinutes] = useState(20);
  const [sessionSecondsLeft, setSessionSecondsLeft] = useState(20 * 60);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [showReadingTimer, setShowReadingTimer] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isSessionActive && sessionSecondsLeft > 0) {
      timer = setInterval(() => {
        setSessionSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (isSessionActive && sessionSecondsLeft === 0) {
      setIsSessionActive(false);
    }
    return () => clearInterval(timer);
  }, [isSessionActive, sessionSecondsLeft]);

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
    if (selectedBook?.id === book.id) {
      setSelectedBook(updated);
    }
  }

  function handleDelete(id: string) {
    deleteBook(id);
    setBooks(getBooks());
    if (selectedBook?.id === id) {
      setSelectedBook(null);
    }
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

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen pb-28 text-[#17151C] lumi-animate-fade-up">
      <div className="mx-auto max-w-6xl px-5 py-6 md:px-8 md:py-8">
        {/* ═══════════════════════════════════════
            HEADER
        ═══════════════════════════════════════ */}
        <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#B8B3E8]" />
              <p className="text-xs font-semibold uppercase tracking-wider text-[#8D8792]">
                Curated Digital Library
              </p>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#17151C]">
              Reading & <span className="font-editorial-italic font-normal text-[#9E96D8]">Literature</span>
            </h1>
            <p className="mt-1 text-sm md:text-base font-normal text-[#5F5965]">
              Track the books you explore, quotes that resonate, and wisdom for your shelf.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={() => setShowReadingTimer(!showReadingTimer)}
              className="flex items-center gap-2 rounded-xl bg-white border border-[#E8E3F0] px-4 py-2.5 text-xs font-semibold text-[#5F5965] hover:bg-[#EEEAFE] hover:text-[#17151C] shadow-2xs transition cursor-pointer"
            >
              <Clock size={15} className="text-[#9E96D8]" />
              <span>{showReadingTimer ? "Hide Timer" : "Reading Session"}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setForm(EMPTY_BOOK_FORM);
                setShowModal(true);
              }}
              className="flex items-center gap-2 rounded-xl bg-[#17151C] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[#2D263B] active:scale-95 cursor-pointer"
            >
              <Plus size={16} />
              <span>Add a Book</span>
            </button>
          </div>
        </header>

        {/* ═══════════════════════════════════════
            READING SESSION TIMER (EXPANDABLE)
        ═══════════════════════════════════════ */}
        {showReadingTimer && (
          <Card variant="pearl" className="mb-6 p-5 border-[#DDD8F2] shadow-sm animate-lumi-fade-up">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEEAFE] text-[#9E96D8] border border-[#DDD8F2]">
                  <BookMarked size={18} />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#17151C]">
                    Mindful Reading Sprint
                  </h3>
                  <p className="text-xs text-[#5F5965]">
                    {isSessionActive ? "Immersed in peaceful reading flow..." : "Set an uninterrupted block for quiet reading."}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="font-serif text-2xl sm:text-3xl font-bold text-[#17151C]">
                  {formatTimer(sessionSecondsLeft)}
                </div>

                <div className="flex gap-1.5">
                  {[15, 20, 30].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => {
                        setSessionMinutes(mins);
                        setSessionSecondsLeft(mins * 60);
                        setIsSessionActive(false);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                        sessionMinutes === mins
                          ? "bg-[#17151C] text-white"
                          : "bg-white text-[#5F5965] border border-[#E8E3F0] hover:bg-[#EEEAFE]"
                      }`}
                    >
                      {mins}m
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setIsSessionActive(!isSessionActive)}
                  className="flex h-9 items-center gap-1.5 px-3.5 rounded-xl bg-[#17151C] text-xs font-semibold text-white hover:bg-[#2D263B] transition cursor-pointer"
                >
                  {isSessionActive ? <Pause size={14} /> : <Play size={14} />}
                  <span>{isSessionActive ? "Pause" : "Start"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsSessionActive(false);
                    setSessionSecondsLeft(sessionMinutes * 60);
                  }}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-[#E8E3F0] text-[#5F5965] hover:bg-[#EEEAFE] transition cursor-pointer"
                  title="Reset session"
                >
                  <RotateCcw size={14} />
                </button>
              </div>
            </div>
          </Card>
        )}

        {/* ═══════════════════════════════════════
            TOP STATS BAR
        ═══════════════════════════════════════ */}
        <section className="mb-6 grid grid-cols-2 gap-3.5 sm:grid-cols-4">
          <Card variant="lavender" hoverEffect className="p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#5F5965]">
              Currently Reading
            </p>
            <p className="text-2xl font-bold text-[#17151C] mt-1">
              {currentlyReadingList.length}
            </p>
            <p className="mt-1 text-[11px] font-medium text-[#5F5965]">
              Active titles
            </p>
          </Card>

          <Card variant="default" hoverEffect className="p-4 border-[#CCE5DC] bg-gradient-to-br from-[#EEF8F4] to-white">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#4A7D63]">
              Completed Books
            </p>
            <p className="text-2xl font-bold text-[#17151C] mt-1 flex items-center gap-1.5">
              <CheckCircle2 size={18} className="text-[#528D6F]" />
              {completedList.length}
            </p>
            <p className="mt-1 text-[11px] font-medium text-[#4A7D63]">
              Finished reads
            </p>
          </Card>

          <Card variant="pink" hoverEffect className="p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#5F5965]">
              Want to Read
            </p>
            <p className="text-2xl font-bold text-[#17151C] mt-1">
              {wantToReadList.length}
            </p>
            <p className="mt-1 text-[11px] font-medium text-[#5F5965]">
              On reading wishlist
            </p>
          </Card>

          <Card variant="peach" hoverEffect className="p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#5F5965]">
              Total Pages Logged
            </p>
            <p className="text-2xl font-bold text-[#17151C] mt-1 flex items-center gap-1.5">
              <Sparkles size={18} className="text-[#D99BB8]" />
              {totalPagesRead}
            </p>
            <p className="mt-1 text-[11px] font-medium text-[#5F5965]">
              Pages absorbed
            </p>
          </Card>
        </section>

        {/* ═══════════════════════════════════════
            FEATURED CURRENT READ SPOTLIGHT
        ═══════════════════════════════════════ */}
        {featuredBook && (
          <Card
            variant="mixed"
            hoverEffect
            className="mb-7 p-6 border-[#DDD8F2] shadow-sm"
          >
            <div className="flex flex-col md:flex-row items-center gap-6">
              {featuredBook.cover ? (
                <img
                  src={featuredBook.cover}
                  alt={featuredBook.title}
                  className="h-36 w-26 object-cover rounded-xl shadow-md shrink-0 border border-white/80 cursor-pointer"
                  onClick={() => setSelectedBook(featuredBook)}
                />
              ) : (
                <div
                  onClick={() => setSelectedBook(featuredBook)}
                  className="flex h-36 w-26 shrink-0 items-center justify-center rounded-xl bg-[#17151C] text-xs font-bold text-white shadow-md border border-white/30 cursor-pointer"
                >
                  📖 BOOK
                </div>
              )}

              <div className="min-w-0 flex-1 w-full">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#17151C] border border-[#E8E3F0] shadow-2xs">
                    Current Spotlight
                  </span>
                  {featuredBook.rating > 0 && (
                    <div className="flex items-center gap-0.5 text-[#D99BB8]">
                      {Array.from({ length: featuredBook.rating }).map((_, i) => (
                        <Star key={i} size={12} className="fill-[#D99BB8]" />
                      ))}
                    </div>
                  )}
                </div>

                <h2
                  onClick={() => setSelectedBook(featuredBook)}
                  className="mt-2 font-serif text-2xl md:text-3xl font-bold text-[#17151C] truncate tracking-tight hover:text-[#9E96D8] transition-colors cursor-pointer"
                >
                  {featuredBook.title}
                </h2>
                <p className="text-xs font-medium text-[#5F5965]">
                  by {featuredBook.author}
                </p>

                {featuredBook.favoriteQuote && (
                  <p className="mt-2.5 text-xs italic text-[#17151C] bg-white/70 p-2.5 rounded-xl border border-white/80 leading-relaxed font-serif flex items-start gap-1.5">
                    <Quote size={13} className="text-[#9E96D8] shrink-0 mt-0.5" />
                    <span>“{featuredBook.favoriteQuote}”</span>
                  </p>
                )}

                {/* Live progress slider & page control */}
                <div className="mt-3.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#17151C] mb-1.5">
                    <span>
                      Page {featuredBook.currentPage} of {featuredBook.totalPages || 300}
                    </span>
                    <span className="text-[#9E96D8] font-bold">
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
                      className="w-full accent-[#17151C] cursor-pointer"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        handleQuickUpdatePage(
                          featuredBook,
                          featuredBook.currentPage + 10
                        )
                      }
                      className="rounded-xl bg-white border border-[#E8E3F0] px-3 py-1 text-[11px] font-semibold text-[#17151C] hover:bg-[#EEEAFE] shrink-0 shadow-2xs cursor-pointer transition"
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
          <div className="flex flex-wrap gap-1.5 rounded-xl border border-[#E8E3F0] bg-white/90 p-1 w-fit shadow-2xs">
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
                className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                  activeFilter === tab.id
                    ? "bg-[#EEEAFE] text-[#17151C] shadow-2xs border border-[#DDD8F2]"
                    : "text-[#5F5965] hover:text-[#17151C]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative flex-1 sm:w-64">
            <Search size={14} className="absolute left-3.5 top-3 text-[#8D8792]" />
            <input
              type="text"
              placeholder="Search title or author..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-[#E8E3F0] bg-white pl-9 pr-3.5 py-2 text-xs font-medium text-[#17151C] shadow-2xs outline-none focus:border-[#9E96D8] focus:ring-2 focus:ring-[#B8B3E8]/30"
            />
          </div>
        </div>

        {/* ═══════════════════════════════════════
            BOOK CARDS GRID
        ═══════════════════════════════════════ */}
        {filteredBooks.length === 0 ? (
          <Card variant="lavender" className="p-10 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#9E96D8] text-2xl shadow-2xs border border-white">
              📚
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#17151C]">
              No books found in this view
            </h3>
            <p className="mt-1 text-xs text-[#5F5965]">
              Add new books to your shelf or adjust the filter above.
            </p>
          </Card>
        ) : (
          <div className="grid gap-4.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredBooks.map((book, idx) => {
              const progress =
                book.totalPages > 0
                  ? Math.min(
                      100,
                      Math.round((book.currentPage / book.totalPages) * 100)
                    )
                  : 0;

              const pastelSurfaces: ("default" | "lavender" | "pink" | "blue" | "peach")[] = [
                "lavender",
                "pink",
                "blue",
                "peach",
                "default",
              ];
              const cardVariant = pastelSurfaces[idx % pastelSurfaces.length];

              return (
                <Card
                  key={book.id}
                  variant={cardVariant}
                  hoverEffect
                  className="group relative flex flex-col justify-between overflow-hidden p-4.5 border-[#E8E3F0] cursor-pointer"
                  onClick={() => setSelectedBook(book)}
                >
                  <div>
                    {/* Top cover / icon banner */}
                    <div className="relative mb-3 h-40 w-full overflow-hidden rounded-xl bg-gradient-to-br from-[#EEEAFE] to-[#F8E8F0] flex items-center justify-center border border-white/60">
                      {book.cover ? (
                        <img
                          src={book.cover}
                          alt={book.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <BookOpen size={36} className="text-[#9E96D8]" />
                      )}

                      <span
                        className={`absolute left-2.5 top-2.5 rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider backdrop-blur-md shadow-2xs border ${
                          book.status === "reading"
                            ? "bg-white/90 text-[#17151C] border-[#DDD8F2]"
                            : book.status === "completed"
                            ? "bg-[#EEF8F4]/90 text-[#3E7D5C] border-[#CCE5DC]"
                            : "bg-[#FDF0F6]/90 text-[#9A4E70] border-[#F2D8E4]"
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
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(book.id);
                        }}
                        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-lg bg-white/90 text-[#8D8792] hover:text-[#D99BB8] hover:bg-white transition shadow-2xs opacity-0 group-hover:opacity-100 cursor-pointer"
                        title="Delete book"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    <h3 className="font-serif font-bold text-base text-[#17151C] truncate tracking-tight group-hover:text-[#9E96D8] transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-xs text-[#5F5965] truncate font-medium">
                      by {book.author}
                    </p>

                    {book.rating > 0 && (
                      <div className="mt-2 flex items-center gap-0.5 text-[#D99BB8]">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={11}
                            className={
                              i < book.rating
                                ? "fill-[#D99BB8]"
                                : "text-[#E8E3F0]"
                            }
                          />
                        ))}
                      </div>
                    )}

                    {book.whyIPickedIt && (
                      <p className="mt-2 text-xs text-[#5F5965] line-clamp-2 italic bg-white/70 border border-white/80 p-2 rounded-lg">
                        "{book.whyIPickedIt}"
                      </p>
                    )}
                  </div>

                  {/* Progress & Quick Page Counter */}
                  <div className="mt-3.5 pt-2.5 border-t border-black/5">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-[#5F5965] mb-1.5">
                      <span>
                        {book.currentPage} / {book.totalPages || 0} pgs
                      </span>
                      <span className="text-[#17151C] font-bold">{progress}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-white/80">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#9E96D8] to-[#E8B9CD] transition-all duration-500"
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
            BOOK DETAIL MODAL
        ═══════════════════════════════════════ */}
        {selectedBook && (
          <Modal
            isOpen={!!selectedBook}
            onClose={() => setSelectedBook(null)}
            title={selectedBook.title}
            subtitle={`by ${selectedBook.author}`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#E8E3F0] pb-3">
                <span className="rounded-full bg-[#EEEAFE] border border-[#DDD8F2] px-3 py-1 text-xs font-semibold text-[#6B5BA5] capitalize">
                  Status: {selectedBook.status.replace("-", " ")}
                </span>

                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => {
                        const updated = { ...selectedBook, rating: star };
                        updateBook(updated);
                        setBooks(getBooks());
                        setSelectedBook(updated);
                      }}
                      className="p-1 hover:scale-110 transition cursor-pointer"
                    >
                      <Star
                        size={16}
                        className={
                          star <= (selectedBook.rating || 0)
                            ? "fill-[#D99BB8] text-[#D99BB8]"
                            : "text-[#E8E3F0]"
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Progress updater */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-[#17151C] mb-1.5">
                  <span>Reading Progress</span>
                  <span className="text-[#9E96D8] font-bold">
                    {selectedBook.currentPage} / {selectedBook.totalPages || 0} pages (
                    {selectedBook.totalPages > 0
                      ? Math.round(
                          (selectedBook.currentPage / selectedBook.totalPages) * 100
                        )
                      : 0}
                    %)
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={0}
                    max={selectedBook.totalPages || 300}
                    value={selectedBook.currentPage}
                    onChange={(e) =>
                      handleQuickUpdatePage(selectedBook, Number(e.target.value))
                    }
                    className="w-full accent-[#17151C] cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      handleQuickUpdatePage(
                        selectedBook,
                        selectedBook.currentPage + 10
                      )
                    }
                    className="rounded-xl bg-white border border-[#E8E3F0] px-3 py-1.5 text-xs font-semibold text-[#17151C] hover:bg-[#EEEAFE] shrink-0 shadow-2xs cursor-pointer transition"
                  >
                    +10 pgs
                  </button>
                </div>
              </div>

              {/* Quotes and Notes */}
              {selectedBook.favoriteQuote && (
                <div className="rounded-xl bg-[#FAF8FC] border border-[#E8E3F0] p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#8D8792] mb-1">
                    Favorite Quote
                  </p>
                  <p className="font-serif italic text-xs text-[#17151C]">
                    “{selectedBook.favoriteQuote}”
                  </p>
                </div>
              )}

              {selectedBook.whyIPickedIt && (
                <div className="rounded-xl bg-[#FAF8FC] border border-[#E8E3F0] p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#8D8792] mb-1">
                    Why I Picked It
                  </p>
                  <p className="text-xs text-[#5F5965] leading-relaxed">
                    {selectedBook.whyIPickedIt}
                  </p>
                </div>
              )}

              <div className="flex justify-between items-center pt-2 border-t border-[#E8E3F0]">
                <button
                  type="button"
                  onClick={() => handleDelete(selectedBook.id)}
                  className="text-xs font-semibold text-[#D99BB8] hover:underline cursor-pointer"
                >
                  Remove Book
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedBook(null)}
                  className="rounded-xl bg-[#17151C] px-5 py-2 text-xs font-semibold text-white hover:bg-[#2D263B] cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </Modal>
        )}

        {/* ═══════════════════════════════════════
            NEW BOOK MODAL
        ═══════════════════════════════════════ */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Add a Book to Library"
          subtitle="Track, reflect, and capture wisdom on what you read."
        >
          <form onSubmit={handleSaveBook} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#17151C] mb-1">
                  Book Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. The Psychology of Money"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full rounded-xl border border-[#E8E3F0] bg-white px-3.5 py-2 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] focus:ring-2 focus:ring-[#B8B3E8]/30 outline-none shadow-2xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#17151C] mb-1">
                  Author *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Morgan Housel"
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                  className="w-full rounded-xl border border-[#E8E3F0] bg-white px-3.5 py-2 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] focus:ring-2 focus:ring-[#B8B3E8]/30 outline-none shadow-2xs"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#17151C] mb-1">
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value as Book["status"] })
                  }
                  className="w-full rounded-xl border border-[#E8E3F0] bg-white px-3 py-2 text-xs font-semibold text-[#17151C] focus:border-[#9E96D8] outline-none shadow-2xs"
                >
                  <option value="reading">Reading</option>
                  <option value="want-to-read">Want to Read</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#17151C] mb-1">
                  Current Page
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.currentPage}
                  onChange={(e) =>
                    setForm({ ...form, currentPage: Number(e.target.value) })
                  }
                  className="w-full rounded-xl border border-[#E8E3F0] bg-white px-3.5 py-2 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] outline-none shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#17151C] mb-1">
                  Total Pages
                </label>
                <input
                  type="number"
                  min={1}
                  value={form.totalPages}
                  onChange={(e) =>
                    setForm({ ...form, totalPages: Number(e.target.value) })
                  }
                  className="w-full rounded-xl border border-[#E8E3F0] bg-white px-3.5 py-2 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] outline-none shadow-2xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17151C] mb-1">
                Cover Image URL (Optional)
              </label>
              <input
                type="text"
                placeholder="https://images.unsplash.com/..."
                value={form.cover}
                onChange={(e) => setForm({ ...form, cover: e.target.value })}
                className="w-full rounded-xl border border-[#E8E3F0] bg-white px-3.5 py-2 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] outline-none shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17151C] mb-1">
                Favorite Quote (Optional)
              </label>
              <input
                type="text"
                placeholder="“A memorable sentence from the book...”"
                value={form.favoriteQuote}
                onChange={(e) =>
                  setForm({ ...form, favoriteQuote: e.target.value })
                }
                className="w-full rounded-xl border border-[#E8E3F0] bg-white px-3.5 py-2 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] outline-none shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17151C] mb-1">
                Why I Picked It / Reflections
              </label>
              <textarea
                placeholder="What drew you to this book..."
                value={form.whyIPickedIt}
                onChange={(e) =>
                  setForm({ ...form, whyIPickedIt: e.target.value })
                }
                rows={2}
                className="w-full rounded-xl border border-[#E8E3F0] bg-white px-3.5 py-2 text-xs font-medium text-[#17151C] focus:border-[#9E96D8] outline-none resize-none shadow-2xs"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-[#5F5965] hover:bg-[#EEEAFE] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!form.title.trim() || !form.author.trim()}
                className="rounded-xl bg-[#17151C] px-5 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-[#2D263B] disabled:opacity-50 cursor-pointer"
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