import { useEffect, useState } from "react";

function App() {
  const [page, setPage] = useState("landing");
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
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
      setLoginError("");
      setPage("admin");
    } else if (email === "member@library.com" && password === "password123") {
      setLoginError("");
      setPage("member");
    } else {
      setLoginError("Invalid email or password.");
    }
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
    const search = searchTerm.toLowerCase();

    return title.includes(search) || author.includes(search);
  }
  );

  return (
    <div style={{ padding: "30px", fontFamily: "Arial, sans-serif" }}>
      <nav style={{ marginBottom: "30px" }}>
        <button onClick={() => setPage("landing")}>Home</button>
        <button onClick={() => setPage("login")} style={{ marginLeft: "10px" }}>
          Login
        </button>
        <button onClick={() => setPage("catalogue")} style={{ marginLeft: "10px" }}>
          Browse Catalogue
        </button>
      </nav>

      {page === "landing" && (
        <section style={{ textAlign: "center" }}>
          <h1>📚 Children's Library</h1>
          <p>Discover a magical world of stories, learning, and adventure.</p>

          <button onClick={() => setPage("login")}>Get Started</button>
          <button onClick={() => setPage("catalogue")} style={{ marginLeft: "10px" }}>
            Browse Catalogue
          </button>
          <button onClick={() => setPage("login")} style={{ marginLeft: "10px" }}>
            Sign In
          </button>

          <h2 style={{ marginTop: "50px" }}>Why Choose Our Library?</h2>

          <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap", marginTop: "20px" }}>
            <FeatureCard title="Vast Collection" text="Books for all ages" />
            <FeatureCard title="Easy Borrowing" text="Simple borrowing and returns" />
            <FeatureCard title="24/7 Access" text="Browse and reserve anytime" />
            <FeatureCard title="Quality Content" text="Curated books for children" />
          </div>
        </section>
      )}

      {page === "login" && (
        <section style={{ maxWidth: "400px", margin: "0 auto" }}>
          <h1>Login</h1>
          <p>Enter demo credentials to continue.</p>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          />

          {loginError && <p style={{ color: "tomato" }}>{loginError}</p>}

          <button onClick={handleLogin}>Login</button>

          <p style={{ marginTop: "20px", fontSize: "14px" }}>
            Demo Accounts:
            <br />
            Member: member@library.com / password123
            <br />
            Admin: admin@library.com / password123
          </p>
        </section>
      )}

      {page === "catalogue" && (
        <section>
          <h1>Browse Catalogue</h1>

          <input
            type="text"
            placeholder="Search by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: "10px", width: "300px", marginBottom: "20px" }}
          />

          <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
            {filteredBooks.map((book) => {
              const isAvailable = book.availableCopies > 0;

              return (
                <div
                  key={book._id}
                  style={{
                    border: "1px solid #444",
                    borderRadius: "12px",
                    padding: "20px",
                    width: "280px",
                    backgroundColor: "#1a1a1a",
                  }}
                >
                  <strong style={{ color: isAvailable ? "lightgreen" : "tomato" }}>
                    {isAvailable ? "✅ Available" : "❌ Unavailable"}
                  </strong>

                  <h3>{book.title}</h3>
                  <p>by {book.author}</p>
                  <p><strong>Category:</strong> {book.category}</p>
                  <p><strong>Age Range:</strong> {book.ageRange}</p>
                  <p>{book.availableCopies} of {book.copies} available</p>

                  <button>{isAvailable ? "Borrow Book" : "Reserve Book"}</button>
                  <button style={{ marginLeft: "8px" }}>View Details</button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {page === "member" && (
        <section>
          <h1>Member Dashboard</h1>
          <p>Welcome, Member.</p>
          <ul>
            <li>Borrowed Books: 2</li>
            <li>Reservations: 1 pending</li>
            <li>Notifications: 1 overdue reminder</li>
          </ul>
          <button onClick={() => setPage("catalogue")}>Browse Books</button>
        </section>
      )}

      {page === "admin" && (
        <section>
          <h1>Admin Dashboard</h1>

          <p>Welcome, Admin.</p>

          <ul>
            <li>Total Books: {books.length}</li>
            <li>Manage books, members, reservations and reports</li>
          </ul>

          <button onClick={() => setPage("catalogue")}>
            View Catalogue
          </button>

          <button
            onClick={() => setPage("manageBooks")}
            style={{ marginLeft: "10px" }}
          >
            Manage Books
          </button>
        </section>
      )}

      {page === "manageBooks" && (
        <section>
          <h1>Manage Books</h1>
          <p>Admin can add, edit and delete book records.</p>

          <form
            onSubmit={addBook}
            style={{
              border: "1px solid #444",
              padding: "20px",
              borderRadius: "12px",
              marginBottom: "30px",
              maxWidth: "600px",
            }}
          >
            <h2>Add New Book</h2>

            <input
              placeholder="Title"
              value={newBook.title}
              onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
              style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
            />

            <input
              placeholder="Author"
              value={newBook.author}
              onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
              style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
            />

            <input
              placeholder="ISBN"
              value={newBook.isbn}
              onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
              style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
            />

            <input
              placeholder="Category"
              value={newBook.category}
              onChange={(e) => setNewBook({ ...newBook, category: e.target.value })}
              style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
            />

            <input
              placeholder="Age Range"
              value={newBook.ageRange}
              onChange={(e) => setNewBook({ ...newBook, ageRange: e.target.value })}
              style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
            />

            <input
              placeholder="Total Copies"
              type="number"
              value={newBook.copies}
              onChange={(e) => setNewBook({ ...newBook, copies: e.target.value })}
              style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
            />

            <input
              placeholder="Available Copies"
              type="number"
              value={newBook.availableCopies}
              onChange={(e) =>
                setNewBook({ ...newBook, availableCopies: e.target.value })
              }
              style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
            />

            <textarea
              placeholder="Description"
              value={newBook.description}
              onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
              style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
            />

            <button type="submit">Add Book</button>
          </form>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
            {books.map((book) => (
              <div
                key={book._id}
                style={{
                  border: "1px solid #444",
                  borderRadius: "12px",
                  padding: "20px",
                  width: "280px",
                  backgroundColor: "#1a1a1a",
                }}
              >
                <h3>{book.title}</h3>
                <p>Author: {book.author}</p>
                <p>ISBN: {book.isbn}</p>
                <p>{book.availableCopies} of {book.copies} available</p>

                <button>Edit</button>
                <button
                  style={{ marginLeft: "8px" }}
                  onClick={() => deleteBook(book._id)}
                >
                  Delete
                </button>
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
    <div style={{ border: "1px solid #444", borderRadius: "12px", padding: "20px", width: "220px", backgroundColor: "#1a1a1a" }}>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

export default App;