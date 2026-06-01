import { useEffect, useState } from "react";
import "./App.css";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

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
  const [editingBook, setEditingBook] = useState(null);
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerMessage, setRegisterMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);


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
    fetch(`${API_BASE_URL}/api/books`)
      .then((response) => response.json())
      .then((data) => setBooks(data))
      .catch((error) => console.error("Error:", error));
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      setUserRole(user.role || "member");
      setPage(user.role === "admin" ? "admin" : "member");
    }
  }, []);

  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setLoginError(data.message || "Invalid email or password.");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));
      setCurrentUser(data);

      setUserRole(data.role || "member");
      setLoginError("");
      setPage(data.role === "admin" ? "admin" : "member");
    } catch (error) {
      console.error(error);
      setLoginError("Unable to connect to server.");
    }
  };

  const handleRegister = async () => {
    if (!registerName || !registerEmail || !registerPassword) {
      setRegisterMessage("Please complete all registration fields.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: registerName,
          email: registerEmail,
          password: registerPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setRegisterMessage(data.message || "Registration failed.");
        return;
      }

      setRegisterMessage("Registration successful. You can now sign in.");
      setEmail(registerEmail);
      setPassword("");

      setRegisterName("");
      setRegisterEmail("");
      setRegisterPassword("");

      setTimeout(() => {
        setPage("login");
        setRegisterMessage("");
      }, 1500);
    } catch (error) {
      console.error(error);
      setRegisterMessage("Unable to connect to server.");
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

   const returnBook = (bookToReturn, borrowedIndex) => {
  setBorrowedBooks(
    borrowedBooks.filter((_, index) => index !== borrowedIndex)
  );

  setBooks(
    books.map((book) =>
      book._id === bookToReturn._id
        ? { ...book, availableCopies: book.availableCopies + 1 }
        : book
    )
  );

  alert(`You have returned "${bookToReturn.title}".`);
};

  const deleteBook = async (id) => {
    try {
      await fetch(`${API_BASE_URL}/api/books/${id}`, {
        method: "DELETE",
      });

      setBooks(books.filter((book) => book._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const addBook = async (e) => {
    e.preventDefault();

    const response = await fetch(`${API_BASE_URL}/api/books`, {
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

const saveBookChanges = async () => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/books/${editingBook._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...editingBook,
          copies: Number(editingBook.copies),
          availableCopies: Number(editingBook.availableCopies),
        }),
      }
    );

    const updatedBook = await response.json();

    setBooks(
      books.map((book) =>
        book._id === updatedBook._id
          ? updatedBook
          : book
      )
    );

    setEditingBook(null);

    alert("Book updated successfully.");
  } catch (error) {
    console.error(error);
    alert("Error updating book.");
  }
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
      {page !== "landing" && (
        <nav className="top-bar">
          <button className="back-link" onClick={() => setPage("landing")}>
            ← Back to Home
          </button>

          <h2 className="page-nav-title">
            {page === "catalogue" && "Browse Our Collection"}
            {page === "login" && "Sign In"}
            {page === "register" && "Register"}
            {page === "member" && "Member Dashboard"}
            {page === "admin" && "Admin Dashboard"}
            {page === "manageBooks" && "Manage Books"}
          </h2>

          <div className="top-bar-actions">
            {userRole === "guest" ? (
              <>
                <button className="outline-button" onClick={() => setPage("login")}>
                  Sign In
                </button>
                <button onClick={() => setPage("register")}>
                  Register
                </button>
              </>
            ) : userRole === "member" ? (
              <>
                <button className="outline-button" onClick={() => setPage("member")}>
                  Dashboard
                </button>
                <button
                  onClick={() => {
                      setCurrentUser(null);
                      localStorage.removeItem("user");
                      localStorage.removeItem("token");

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
                <button className="outline-button" onClick={() => setPage("admin")}>
                  Admin Dashboard
                </button>
                <button
                  onClick={() => {
                        setCurrentUser(null);
                        localStorage.removeItem("user");
                        localStorage.removeItem("token");

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
      )}

      {page === "landing" && (
        <section className="landing-page">
          <div className="hero-icon">📚</div>

          <h1 className="hero-title">Children's Library</h1>

          <p className="hero-subtitle">
            Discover a magical world of stories, learning, and adventure
          </p>

          <div className="hero-actions">
            <button onClick={() => setPage("catalogue")}>Get Started →</button>
            <button className="outline-button" onClick={() => setPage("catalogue")}>
              Browse Catalogue
            </button>
            <button className="link-button" onClick={() => setPage("login")}>
              Sign In
            </button>
          </div>

          <h2 className="section-title">Why Choose Our Library?</h2>

          <div className="feature-grid">
            <FeatureCard title="Vast Collection" text="A growing catalogue of books for all ages." />
            <FeatureCard title="Easy Management" text="Simple borrowing, returns, and book management." />
            <FeatureCard title="24/7 Access" text="Browse the catalogue and manage activity anytime." />
            <FeatureCard title="Quality Content" text="Curated children’s books with useful details." />
          </div>

          <div className="cta-panel">
            <h2>Ready to Start Reading?</h2>
            <p>Join our community of young readers today</p>
            <button onClick={() => setPage("login")}>Create Free Account</button>
          </div>
        </section>
      )}

      {page === "login" && (
        <section className="login-page">
          <div className="login-card">
            <div className="hero-icon">📚</div>

            <h1>Welcome Back</h1>
            <p className="page-subtitle">Sign in to your library account</p>

            <div className="demo-box">
              <strong>Demo Credentials:</strong>
              <p>Member: member@library.com / password123</p>
              <p>Admin: admin@library.com / password123</p>
            </div>

            <label>Email Address *</label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label>Password *</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {loginError && <p className="error-text">{loginError}</p>}

            <button className="gradient-button" onClick={handleLogin}>
              Sign In
            </button>

            <p className="register-text">
              Don't have an account? <span
                style={{ cursor: "pointer" }}
                onClick={() => setPage("register")}
              >
                Register here
              </span>
            </p>
          </div>
        </section>
      )}

      {page === "register" && (
        <section className="login-page">
          <div className="login-card">
            <div className="hero-icon">📚</div>

            <h1>Create Account</h1>
            <p className="page-subtitle">Register as a library member</p>

            <label>Full Name *</label>
            <input
              type="text"
              placeholder="Full Name"
              value={registerName}
              onChange={(e) => setRegisterName(e.target.value)}
            />

            <label>Email Address *</label>
            <input
              type="email"
              placeholder="Email"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
            />

            <label>Password *</label>
            <input
              type="password"
              placeholder="Password"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
            />

            {registerMessage && (
              <p className="success-text">{registerMessage}</p>
            )}

            <button
              className="gradient-button"
              onClick={handleRegister}
            >
              Create Account
            </button>

            <p className="register-text">
              Already have an account?{" "}
              <span
                style={{ cursor: "pointer" }}
                onClick={() => setPage("login")}
              >
                Sign In
              </span>
            </p>
          </div>
        </section>
      )}

      {page === "catalogue" && (
        <section>
          <h1>Browse Catalogue</h1>
          <p className="page-subtitle">
            Search available children's books and view borrowing options.
          </p>

          <div className="filter-row">
            <input
              type="text"
              placeholder="Search by title or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
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
                <div key={book._id} className="book-card manage-books-card">
                  <div className="book-image">
                    📖
                  </div>
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
        <section className="member-layout">
          <aside className="member-sidebar">
            <h2>📚 Kids Library</h2>
            <p>Member Portal</p>

            <button>Dashboard</button>
            <button onClick={() => setPage("catalogue")}>Browse Books</button>
            <button>My Books</button>
            <button>Reservations</button>
            <button>Notifications</button>

            <div className="member-profile">
              <strong>{currentUser?.name || "Member User"}</strong>
              <p>{currentUser?.email || "member@library.com"}</p>
            </div>

            <button
              className="logout-button"
              onClick={() => {
                setCurrentUser(null);
                localStorage.removeItem("user");
                localStorage.removeItem("token");

                setUserRole("guest");
                setBorrowedBooks([]);
                setPage("landing");
              }}
            >
              Logout
            </button>
          </aside>

          <main className="member-main">
            <div className="member-topline">
              <h3>Welcome, {currentUser?.name || "Member User"}!</h3>
              <p>Today: Sunday, May 31, 2026</p>
            </div>

            <h1>Dashboard</h1>
            <p className="page-subtitle">Welcome to your library portal</p>

            <div className="member-stats">
              <div className="stat-card">
                <div>
                  <p>Books Borrowed</p>
                  <h2>{borrowedBooks.length}</h2>
                </div>
                <span>📖</span>
              </div>

              <div className="stat-card">
                <div>
                  <p>Active Reservations</p>
                  <h2>1</h2>
                </div>
                <span>📅</span>
              </div>

              <div className="stat-card">
                <div>
                  <p>Overdue Books</p>
                  <h2>0</h2>
                </div>
                <span>⚠️</span>
              </div>

              <div className="stat-card">
                <div>
                  <p>Unread Notifications</p>
                  <h2>1</h2>
                </div>
                <span>🔔</span>
              </div>
            </div>

            <div className="member-panels">
              <div className="dashboard-card">
                <h3>Currently Borrowed</h3>

                {borrowedBooks.length === 0 ? (
                  <p>No books borrowed yet.</p>
                ) : (
                  borrowedBooks.map((book, index) => (
                    <div className="borrowed-row" key={`${book._id}-${index}`}>
                      <div className="mini-cover">📖</div>
                      <div>
                        <h4>{book.title}</h4>
                        <p>by {book.author}</p>
                        <button
                          className="secondary-button"
                          onClick={() => returnBook(book, index)}
                        >
                          Return Book
                        </button>
                      </div>
                    </div>
                  ))
                )}

                <button className="wide-button" onClick={() => setPage("catalogue")}>
                  View All
                </button>
              </div>

              <div className="dashboard-card">
                <h3>Active Reservations</h3>

                <div className="borrowed-row">
                  <div className="mini-cover">📚</div>
                  <div>
                    <h4>Harry Potter and the Philosopher's Stone</h4>
                    <p>Reserved: Demo data</p>
                    <span className="small-badge">Pending</span>
                  </div>
                </div>

                <button className="wide-button">View All</button>
              </div>
            </div>

            <div className="dashboard-card quick-actions">
              <h3>Quick Actions</h3>
              <button onClick={() => setPage("catalogue")}>Browse Books</button>
              <button className="outline-button">My Reservations</button>
              <button className="outline-button">Edit Profile</button>
            </div>
          </main>
        </section>
      )}

      {page === "admin" && (
        <section className="admin-layout">
          <aside className="admin-sidebar">
            <h2>🛡️ Kids Library</h2>
            <p>Admin Panel</p>

            <button>Dashboard</button>
            <button onClick={() => setPage("manageBooks")}>Manage Books</button>
            <button>Manage Members</button>
            <button>Reservations</button>
            <button>Reports</button>

            <div className="member-profile">
              <strong>Admin User</strong>
              <p>Administrator</p>
            </div>

            <button
              className="logout-button"
              onClick={() => {
                setCurrentUser(null);
                localStorage.removeItem("user");
                localStorage.removeItem("token");

                setUserRole("guest");
                setEmail("");
                setPassword("");
                setPage("landing");
              }}
            >
              Logout
            </button>
          </aside>

          <main className="admin-main">
            <div className="member-topline">
              <h3>Admin Dashboard</h3>
              <p>Sunday, May 31, 2026</p>
            </div>

            <h1>Admin Dashboard</h1>
            <p className="page-subtitle">Overview of library operations</p>

            <div className="member-stats">
              <div className="stat-card">
                <div>
                  <p>Total Books</p>
                  <h2>{books.length}</h2>
                </div>
                <span>📘</span>
              </div>

              <div className="stat-card">
                <div>
                  <p>Available Copies</p>
                  <h2>{books.reduce((total, book) => total + Number(book.availableCopies || 0), 0)}</h2>
                </div>
                <span>✅</span>
              </div>

              <div className="stat-card">
                <div>
                  <p>Reservations</p>
                  <h2>1</h2>
                </div>
                <span>📅</span>
              </div>

              <div className="stat-card">
                <div>
                  <p>Books Borrowed</p>
                  <h2>{borrowedBooks.length}</h2>
                </div>
                <span>📖</span>
              </div>
            </div>

            <div className="admin-panels">
              <div className="dashboard-card">
                <h3>Borrowing Overview</h3>
                <div className="chart-placeholder">
                  <p>Borrowing and return trends are monitored here.</p>
                  <div className="fake-line"></div>
                </div>
              </div>

              <div className="dashboard-card">
                <h3>Books by Category</h3>
                <div className="category-list">
                  <p>Picture Books: 35%</p>
                  <p>Chapter Books: 25%</p>
                  <p>Fantasy: 20%</p>
                  <p>Realistic Fiction: 12%</p>
                </div>
              </div>

              <div className="dashboard-card">
                <h3>Recent Activity</h3>
                <div className="activity-row">📘 Member borrowed The Very Hungry Caterpillar</div>
                <div className="activity-row">✏️ Admin updated catalogue details</div>
                <div className="activity-row">📚 New book added to collection</div>
              </div>

              <div className="dashboard-card">
                <h3>Alerts & Issues</h3>
                <div className="alert-row danger">⚠️ Low stock: Harry Potter series</div>
                <div className="alert-row warning">🔔 Pending reservation requires review</div>
                <div className="alert-row info">ℹ️ Catalogue recently updated</div>
              </div>
            </div>

            <div className="dashboard-card quick-actions">
              <h3>Quick Actions</h3>
              <button onClick={() => setPage("manageBooks")}>Manage Books</button>
              <button className="outline-button" onClick={() => setPage("catalogue")}>
                View Catalogue
              </button>
            </div>
          </main>
        </section>
      )}

      {page === "manageBooks" && (
        <section>
          <h1>Manage Books</h1>
          <p className="page-subtitle">
            Add new book records and manage existing catalogue entries.
          </p>

          <form onSubmit={addBook} className="book-form manage-form-card">
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

          {editingBook && (
            <div className="manage-form-card">
              <h2>Edit Book</h2>

              <input
                placeholder="Title"
                value={editingBook.title}
                onChange={(e) =>
                  setEditingBook({
                    ...editingBook,
                    title: e.target.value,
                  })
                }
              />

              <input
                placeholder="Author"
                value={editingBook.author}
                onChange={(e) =>
                  setEditingBook({
                    ...editingBook,
                    author: e.target.value,
                  })
                }
              />

              <input
                placeholder="ISBN"
                value={editingBook.isbn}
                onChange={(e) => setEditingBook({ ...editingBook, isbn: e.target.value })}
              />

              <input
                placeholder="Category"
                value={editingBook.category}
                onChange={(e) => setEditingBook({ ...editingBook, category: e.target.value })}
              />

              <input
                placeholder="Age Range"
                value={editingBook.ageRange}
                onChange={(e) => setEditingBook({ ...editingBook, ageRange: e.target.value })}
              />

              <input
                placeholder="Total Copies"
                type="number"
                value={editingBook.copies}
                onChange={(e) =>
                  setEditingBook({ ...editingBook, copies: Number(e.target.value) })
                }
              />

              <input
                placeholder="Available Copies"
                type="number"
                value={editingBook.availableCopies}
                onChange={(e) =>
                  setEditingBook({ ...editingBook, availableCopies: Number(e.target.value) })
                }
              />

              <textarea
                placeholder="Description"
                value={editingBook.description}
                onChange={(e) =>
                  setEditingBook({
                    ...editingBook,
                    description: e.target.value,
                  })
                }
              />

              <div className="edit-actions">
                <button onClick={saveBookChanges}>
                  Save Changes
                </button>

                <button
                  className="secondary-button"
                  onClick={() => setEditingBook(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="book-grid">
            {books.map((book) => (
              <div key={book._id} className="book-card">
                <h3>{book.title}</h3>
                <p><strong>Author:</strong> {book.author}</p>
                <p><strong>ISBN:</strong> {book.isbn}</p>
                <p>{book.availableCopies} of {book.copies} available</p>

                <div className="action-row">
                  <button onClick={() => setEditingBook(book)}>
                    Edit
                  </button>
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