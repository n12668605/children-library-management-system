import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [page, setPage] = useState("landing");
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [ageRangeFilter, setAgeRangeFilter] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [userRole, setUserRole] = useState("guest");
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);

  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    isbn: "",
    category: "",
    ageRange: "",
    copies: "",
    availableCopies: "",
    description: "",
    status: "Available",
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/books")
      .then((response) => response.json())
      .then((data) => setBooks(data))
      .catch((error) => console.error("Error:", error));
  }, []);

  const handleLogin = () => {
    if (email === "admin@library.com" && password === "password123") {
      setUserRole("admin");
      setLoginError("");
      setPage("admin");
    } else if (email === "member@library.com" && password === "password123") {
      setUserRole("member");
      setLoginError("");
      setPage("member");
    } else {
      setLoginError("Invalid email or password.");
    }
  };

  const borrowBook = (book) => {
    if (userRole === "guest") {
      alert("Please log in as a member to borrow books.");
      setPage("login");
      return;
    }

    if (userRole !== "member") {
      alert("Only members can borrow books.");
      return;
    }

    if (book.availableCopies <= 0) {
      alert("This book is currently unavailable.");
      return;
    }

    setBooks(
      books.map((item) =>
        item._id === book._id
          ? { ...item, availableCopies: item.availableCopies - 1 }
          : item
      )
    );

    setBorrowedBooks([...borrowedBooks, book]);

    alert(`You have borrowed "${book.title}".`);
  };

  const deleteBook = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/books/${id}`, {
        method: "DELETE",
      });

      setBooks(books.filter((book) => book._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const addBook = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:5000/api/books", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...newBook,
        copies: Number(newBook.copies),
        availableCopies: Number(newBook.availableCopies),
      }),
    });

    const createdBook = await response.json();
    setBooks([...books, createdBook]);

    setNewBook({
      title: "",
      author: "",
      isbn: "",
      category: "",
      ageRange: "",
      copies: "",
      availableCopies: "",
      description: "",
      status: "Available",
    });
  };

  const filteredBooks = books.filter((book) => {
    const title = book.title?.toLowerCase() || "";
    const author = book.author?.toLowerCase() || "";
    const category = book.category || "";
    const ageRange = book.ageRange || "";
    const search = searchTerm.toLowerCase();

    const matchesSearch = title.includes(search) || author.includes(search);
    const matchesCategory = categoryFilter === "" || category === categoryFilter;
    const matchesAgeRange = ageRangeFilter === "" || ageRange === ageRangeFilter;

    return matchesSearch && matchesCategory && matchesAgeRange;
  });

  return (
    <div className="app">
      <nav className="navbar">
        <div className="brand">📚 Children's Library</div>

        <div className="nav-links">
          <button onClick={() => setPage("landing")}>Home</button>
          <button onClick={() => setPage("catalogue")}>Browse Catalogue</button>

          {userRole === "guest" ? (
            <button onClick={() => setPage("login")}>Login</button>
          ) : userRole === "member" ? (
            <>
              <button onClick={() => setPage("member")}>Member Dashboard</button>
              <button
                className="secondary-button"
                onClick={() => {
                  setUserRole("guest");
                  setBorrowedBooks([]);
                  setEmail("");
                  setPassword("");
                  setPage("landing");
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setPage("admin")}>Admin Dashboard</button>
              <button
                className="secondary-button"
                onClick={() => {
                  setUserRole("guest");
                  setBorrowedBooks([]);
                  setEmail("");
                  setPassword("");
                  setPage("landing");
                }}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>

      {page === "landing" && (
        <section className="hero-section">
          <h1>Children's Library Management System</h1>
          <p className="page-subtitle">
            A simple web-based system for browsing books, managing reservations,
            and supporting library administration.
          </p>

          <div className="action-row">
            <button onClick={() => setPage("catalogue")}>Browse Catalogue</button>
            <button onClick={() => setPage("login")} className="secondary-button">
              Sign In
            </button>
          </div>

          <h2>Key Features</h2>

          <div className="card-grid">
            <FeatureCard title="Book Catalogue" text="Browse and search children's books by title and author." />
            <FeatureCard title="Member Access" text="Members can view borrowing activity and reservations." />
            <FeatureCard title="Admin Tools" text="Administrators can manage books and monitor activity." />
            <FeatureCard title="Reservations" text="Supports book availability and reservation workflows." />
          </div>
        </section>
      )}

      {page === "login" && (
        <section className="form-section">
          <h1>Login</h1>
          <p className="page-subtitle">Enter demo credentials to access the system.</p>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {loginError && <p className="error-text">{loginError}</p>}

          <button onClick={handleLogin}>Login</button>

          <div className="demo-box">
            <strong>Demo Accounts</strong>
            <p>Member: member@library.com / password123</p>
            <p>Admin: admin@library.com / password123</p>
          </div>
        </section>
      )}

      {page === "catalogue" && (
        <section>
          <h1>Browse Catalogue</h1>
          <p className="page-subtitle">
            Search available children's books and view borrowing options.
          </p>

          <input
            type="text"
            placeholder="Search by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />

          <div className="filter-row">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="Chapter Books">Chapter Books</option>
              <option value="Fantasy">Fantasy</option>
              <option value="Picture Books">Picture Books</option>
              <option value="Realistic Fiction">Realistic Fiction</option>
            </select>

            <select
              value={ageRangeFilter}
              onChange={(e) => setAgeRangeFilter(e.target.value)}
            >
              <option value="">All Age Ranges</option>
              <option value="0-5 years">0-5 years</option>
              <option value="3-7 years">3-7 years</option>
              <option value="4-8 years">4-8 years</option>
              <option value="8-12 years">8-12 years</option>
            </select>

            <button
              className="secondary-button"
              onClick={() => {
                setSearchTerm("");
                setCategoryFilter("");
                setAgeRangeFilter("");
              }}
            >
              Clear Filters
            </button>
          </div>

          {filteredBooks.length === 0 && (
            <div className="dashboard-card">
              <h3>No books found</h3>
              <p>Try changing the search term, category, or age range filter.</p>
            </div>
          )}

          <div className="book-grid">
            {filteredBooks.map((book) => {
              const isAvailable = book.availableCopies > 0;

              return (
                <div key={book._id} className="book-card">
                  <span className={isAvailable ? "status available" : "status unavailable"}>
                    {isAvailable ? "Available" : "Unavailable"}
                  </span>

                  <h3>{book.title}</h3>
                  <p>by {book.author}</p>
                  <p><strong>Category:</strong> {book.category}</p>
                  <p><strong>Age Range:</strong> {book.ageRange}</p>
                  <p>{book.availableCopies} of {book.copies} available</p>

                  <div className="action-row">
                    <button onClick={() => borrowBook(book)}>
                      {userRole === "guest"
                        ? "Login to Borrow"
                        : userRole === "admin"
                          ? "Members Only"
                          : isAvailable
                            ? "Borrow Book"
                            : "Unavailable"}
                    </button>
                    <button
                      className="secondary-button"
                      onClick={() => setSelectedBook(book)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          {selectedBook && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h2>{selectedBook.title}</h2>

                <p><strong>Author:</strong> {selectedBook.author}</p>
                <p><strong>ISBN:</strong> {selectedBook.isbn}</p>
                <p><strong>Category:</strong> {selectedBook.category}</p>
                <p><strong>Age Range:</strong> {selectedBook.ageRange}</p>
                <p><strong>Description:</strong> {selectedBook.description}</p>

                <p>
                  <strong>Availability:</strong>{" "}
                  {selectedBook.availableCopies} of {selectedBook.copies} copies available
                </p>

                <button onClick={() => setSelectedBook(null)}>
                  Close
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {page === "member" && (
        <section>
          <h1>Member Dashboard</h1>
          <p className="page-subtitle">
            Welcome back. View your borrowing activity and continue browsing books.
          </p>

          <div className="card-grid">
            <div className="dashboard-card">
              <h3>Borrowed Books</h3>
              <p className="stat-number">{borrowedBooks.length}</p>
              <p>Books currently borrowed.</p>
            </div>

            <div className="dashboard-card">
              <h3>Reservations</h3>
              <p className="stat-number">1</p>
              <p>Pending reservation request.</p>
            </div>

            <div className="dashboard-card">
              <h3>Notifications</h3>
              <p className="stat-number">1</p>
              <p>Overdue reminder requires attention.</p>
            </div>
          </div>

          <div className="dashboard-card admin-task-card">
            <h3>Borrowed Book List</h3>

            {borrowedBooks.length === 0 ? (
              <p>No books borrowed yet.</p>
            ) : (
              <ul>
                {borrowedBooks.map((book, index) => (
                  <li key={`${book._id}-${index}`}>
                    {book.title} by {book.author}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button onClick={() => setPage("catalogue")}>Browse Books</button>
        </section>
      )}

      {page === "admin" && (
        <section>
          <h1>Admin Dashboard</h1>
          <p className="page-subtitle">
            Manage catalogue records, monitor availability, and support library operations.
          </p>

          <div className="card-grid">
            <div className="dashboard-card">
              <h3>Total Books</h3>
              <p className="stat-number">{books.length}</p>
              <p>Catalogue records currently stored in the system.</p>
            </div>

            <div className="dashboard-card">
              <h3>Available Books</h3>
              <p className="stat-number">
                {books.reduce((total, book) => total + Number(book.availableCopies || 0), 0)}
              </p>
              <p>Total copies currently available for borrowing.</p>
            </div>

            <div className="dashboard-card">
              <h3>Reservations</h3>
              <p className="stat-number">1</p>
              <p>Pending reservation requests requiring staff review.</p>
            </div>
          </div>

          <div className="dashboard-card admin-task-card">
            <h3>Admin Tasks</h3>
            <p>
              Use the admin tools to add new books, update catalogue information,
              remove outdated records, and review library activity.
            </p>

            <div className="action-row left-actions">
              <button onClick={() => setPage("manageBooks")}>Manage Books</button>
              <button className="secondary-button" onClick={() => setPage("catalogue")}>
                View Catalogue
              </button>
            </div>
          </div>
        </section>
      )}

      {page === "manageBooks" && (
        <section>
          <h1>Manage Books</h1>
          <p className="page-subtitle">
            Add new book records and manage existing catalogue entries.
          </p>

          <form onSubmit={addBook} className="book-form">
            <h2>Add New Book</h2>

            <input placeholder="Title" value={newBook.title} onChange={(e) => setNewBook({ ...newBook, title: e.target.value })} />
            <input placeholder="Author" value={newBook.author} onChange={(e) => setNewBook({ ...newBook, author: e.target.value })} />
            <input placeholder="ISBN" value={newBook.isbn} onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })} />
            <input placeholder="Category" value={newBook.category} onChange={(e) => setNewBook({ ...newBook, category: e.target.value })} />
            <input placeholder="Age Range" value={newBook.ageRange} onChange={(e) => setNewBook({ ...newBook, ageRange: e.target.value })} />
            <input placeholder="Total Copies" type="number" value={newBook.copies} onChange={(e) => setNewBook({ ...newBook, copies: e.target.value })} />
            <input placeholder="Available Copies" type="number" value={newBook.availableCopies} onChange={(e) => setNewBook({ ...newBook, availableCopies: e.target.value })} />

            <textarea
              placeholder="Description"
              value={newBook.description}
              onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
            />

            <button type="submit">Add Book</button>
          </form>

          <div className="book-grid">
            {books.map((book) => (
              <div key={book._id} className="book-card">
                <h3>{book.title}</h3>
                <p><strong>Author:</strong> {book.author}</p>
                <p><strong>ISBN:</strong> {book.isbn}</p>
                <p>{book.availableCopies} of {book.copies} available</p>

                <div className="action-row">
                  <button>Edit</button>
                  <button className="danger-button" onClick={() => deleteBook(book._id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
         </section>
      )}
    </div>
  );
}

function FeatureCard({ title, text }) {
  return (
    <div className="dashboard-card">
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

export default App;