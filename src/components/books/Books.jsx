import { useState, useEffect } from "react"
import "./Books.css"
import Modal from  "../modal/Modal"

const BookTable = () => {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [booksPerPage] = useState(10)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [bookToDelete, setBookToDelete] = useState(null)
  const [bookToEdit, setBookToEdit] = useState(null)
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    genre: "",
    ISBN: "",
    publicationYear: "",
    isAvailable: true,
  })

  useEffect(() => {
    fetchBooks()
  }, [])

  const fetchBooks = () => {
    fetch("https://librarytracker-rb8z.onrender.com/getallbook")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return response.json()
      })
      .then((data) => {
        if (data && Array.isArray(data.data)) {
          setBooks(data.data)
          setError(null)
        } else {
          throw new Error("Unexpected data format: books array not found")
        }
      })
      .catch((error) => {
        console.error("Error fetching books:", error)
        setError(`An error occurred while fetching books: ${error.message}`)
        setBooks([])
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const handleAddBook = (e) => {
    e.preventDefault()
    fetch("https://librarytracker-rb8z.onrender.com/createBulk", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([newBook]),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return response.json()
      })
      .then((addedBooks) => {
        if (Array.isArray(addedBooks) && addedBooks.length > 0) {
          setBooks([...books, addedBooks[0]])
          setIsAddModalOpen(false)
          setNewBook({
            title: "",
            author: "",
            genre: "",
            ISBN: "",
            publicationYear: "",
            isAvailable: true,
          })
          alert("Book added successfully")
        }
         else {
          throw new Error("Unexpected response format from API")
        }
      })
      .catch((error) => {
        console.error("Error adding book:", error)
        alert("Failed to add book. Please try again.")
      })
  }

  const handleEditBook = (e) => {
    e.preventDefault()
    fetch(`https://librarytracker-rb8z.onrender.com/updateBook/${bookToEdit.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookToEdit),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update book")
        }
        return response.json()
      })
      .then((updatedBook) => {
        setBooks(books.map((book) => (book.id === updatedBook.id ? updatedBook : book)))
        setIsEditModalOpen(false)
        setBookToEdit(null)
        alert("Book updated successfully")
      })
      .catch((error) => {
        console.error("Error updating book:", error)
        alert("Failed to update book. Please try again.")
      })
  }

  const handleDeleteClick = (book) => {
    setBookToDelete(book)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (bookToDelete) {
      fetch(`https://librarytracker-rb8z.onrender.com/deleteBook/${bookToDelete.id}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to delete book: ${response.status}`)
          }
          return response.json()
        })
        .then(() => {
          setBooks(books.filter((book) => book.id !== bookToDelete.id))
          setIsDeleteDialogOpen(false)
          setBookToDelete(null)
          alert("Book deleted successfully")
        })
        .catch((error) => {
          console.error("Error deleting book:", error)
          alert("Failed to delete book. Please try again.")
        })
    }
  }

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false)
    setBookToDelete(null)
  }

  const handleEditClick = (book) => {
    setBookToEdit({ ...book })
    setIsEditModalOpen(true)
  }

  const handleAddClick = () => {
    setIsAddModalOpen(true)
  }

  // Pagination logic
  const indexOfLastBook = currentPage * booksPerPage
  const indexOfFirstBook = indexOfLastBook - booksPerPage
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook)
  const totalPages = Math.ceil(books.length / booksPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  if (loading) {
    return <div className="loading">Loading books...</div>
  }

  if (error) {
    return <div className="error">{error}</div>
  }

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Book Catalog</h2>
          <div className="search-container">
            <input type="text" placeholder="Search books..." className="search-input" />
            <span className="search-icon">🔍</span>
          </div>
          <button className="btn btn-primary" onClick={handleAddClick}>
            Add Book
          </button>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Genre</th>
                <th>ISBN</th>
                <th>Year</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentBooks.map((book) => (
                <tr key={book.id}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.genre}</td>
                  <td>{book.ISBN}</td>
                  <td>{book.publicationYear}</td>
                  <td>{book.isAvailable ? "Available" : "Unavailable"}</td>
                  <td>
                    <button className="btn btn-outline" onClick={() => handleEditClick(book)}>
                      Edit
                    </button>
                    <button className="btn btn-danger" onClick={() => handleDeleteClick(book)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pagination">
          <span>
            Showing {indexOfFirstBook + 1} to {Math.min(indexOfLastBook, books.length)} of {books.length} entries
          </span>
          <div>
            <button className="btn btn-outline" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={`btn ${currentPage === i + 1 ? "btn-primary" : "btn-outline"}`}
                onClick={() => paginate(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="btn btn-outline"
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Add Book Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <h3 className="modal-title">Add New Book</h3>
        <form onSubmit={handleAddBook}>
          <div className="form-group">
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              value={newBook.title}
              onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="author">Author:</label>
            <input
              type="text"
              id="author"
              value={newBook.author}
              onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="genre">Genre:</label>
            <input
              type="text"
              id="genre"
              value={newBook.genre}
              onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="isbn">ISBN:</label>
            <input
              type="text"
              id="isbn"
              value={newBook.ISBN}
              onChange={(e) => setNewBook({ ...newBook, ISBN: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="year">Publication Year:</label>
            <input
              type="date"
              id="year"
              value={newBook.publicationYear}
              onChange={(e) => setNewBook({ ...newBook, publicationYear: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="availability">Status:</label>
            <select
              id="availability"
              value={newBook.isAvailable}
              onChange={(e) => setNewBook({ ...newBook, isAvailable: e.target.value === "true" })}
            >
              <option value="true">Available</option>
              <option value="false">Unavailable</option>
            </select>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add Book
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Book Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <h3 className="modal-title">Edit Book</h3>
        <form onSubmit={handleEditBook}>
          <div className="form-group">
            <label htmlFor="edit-title">Title:</label>
            <input
              type="text"
              id="edit-title"
              value={bookToEdit?.title || ""}
              onChange={(e) => setBookToEdit({ ...bookToEdit, title: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="edit-author">Author:</label>
            <input
              type="text"
              id="edit-author"
              value={bookToEdit?.author || ""}
              onChange={(e) => setBookToEdit({ ...bookToEdit, author: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="edit-genre">Genre:</label>
            <input
              type="text"
              id="edit-genre"
              value={bookToEdit?.genre || ""}
              onChange={(e) => setBookToEdit({ ...bookToEdit, genre: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="edit-isbn">ISBN:</label>
            <input
              type="text"
              id="edit-isbn"
              value={bookToEdit?.ISBN || ""}
              onChange={(e) => setBookToEdit({ ...bookToEdit, ISBN: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="edit-year">Publication Year:</label>
            <input
              type="number"
              id="edit-year"
              value={bookToEdit?.publicationYear || ""}
              onChange={(e) => setBookToEdit({ ...bookToEdit, publicationYear: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="edit-availability">Availability:</label>
            <select
              id="edit-availability"
              value={bookToEdit?.isAvailable}
              onChange={(e) => setBookToEdit({ ...bookToEdit, isAvailable: e.target.value === "true" })}
            >
              <option value="true">Available</option>
              <option value="false">Unavailable</option>
            </select>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && (
        <div className="dialog">
          <div className="dialog-header">
            <h3 className="dialog-title">Confirm Deletion</h3>
            <p className="dialog-description">Are you sure you want to delete the book "{bookToDelete?.title}"?</p>
          </div>
          <div className="dialog-footer">
            <button className="btn btn-outline" onClick={handleDeleteCancel}>
              Cancel
            </button>
            <button className="btn btn-danger" onClick={handleDeleteConfirm}>
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default BookTable

