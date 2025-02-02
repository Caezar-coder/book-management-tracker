import { useState, useEffect } from "react"
import "./Books.css"
import Modal from "../modal/Modal"

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
        } else {
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
          <div className="card-title">Book Catalog</div>
          <div className="search-container">
            <div className="search-input-wrapper">
              <input type="text" placeholder="Search books..." className="search-input" />
            </div>
            <div className="search-icon">🔍</div>
          </div>
          <div className="add-book-button" onClick={handleAddClick}>
            Add Book
          </div>
        </div>
        <div className="table-container">
          <div className="table">
            <div className="table-header">
              <div className="table-row">
                <div className="table-cell">Title</div>
                <div className="table-cell">Author</div>
                <div className="table-cell">Genre</div>
                <div className="table-cell">ISBN</div>
                <div className="table-cell">Year</div>
                <div className="table-cell">Status</div>
                <div className="table-cell">Actions</div>
              </div>
            </div>
            <div className="table-body">
              {currentBooks.map((book) => (
                <div className="table-row" key={book.id}>
                  <div className="table-cell">{book.title}</div>
                  <div className="table-cell">{book.author}</div>
                  <div className="table-cell">{book.genre}</div>
                  <div className="table-cell">{book.ISBN}</div>
                  <div className="table-cell">{book.publicationYear}</div>
                  <div className="table-cell">{book.isAvailable ? "Available" : "Unavailable"}</div>
                  <div className="table-cell">
                    <div className="btn btn-outline" onClick={() => handleEditClick(book)}>
                      Edit
                    </div>
                    <div className="btn btn-danger" onClick={() => handleDeleteClick(book)}>
                      Delete
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="pagination">
          <div className="pagination-info">
            Showing {indexOfFirstBook + 1} to {Math.min(indexOfLastBook, books.length)} of {books.length} entries
          </div>
          <div className="pagination-controls">
            <div
              className={`btn btn-outline ${currentPage === 1 ? "disabled" : ""}`}
              onClick={() => paginate(currentPage - 1)}
            >
              Previous
            </div>
            {Array.from({ length: totalPages }, (_, i) => (
              <div
                key={i + 1}
                className={`btn ${currentPage === i + 1 ? "btn-primary" : "btn-outline"}`}
                onClick={() => paginate(i + 1)}
              >
                {i + 1}
              </div>
            ))}
            <div
              className={`btn btn-outline ${currentPage === totalPages ? "disabled" : ""}`}
              onClick={() => paginate(currentPage + 1)}
            >
              Next
            </div>
          </div>
        </div>
      </div>

      {/* Add Book Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <div className="modal-content">
          <div className="modal-title">Add New Book</div>
          <div className="modal-form">
            <div className="form-group">
              <div className="form-label">Title:</div>
              <div className="form-input">
                <input
                  type="text"
                  value={newBook.title}
                  onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <div className="form-label">Author:</div>
              <div className="form-input">
                <input
                  type="text"
                  value={newBook.author}
                  onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <div className="form-label">Genre:</div>
              <div className="form-input">
                <input
                  type="text"
                  value={newBook.genre}
                  onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <div className="form-label">ISBN:</div>
              <div className="form-input">
                <input
                  type="text"
                  value={newBook.ISBN}
                  onChange={(e) => setNewBook({ ...newBook, ISBN: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <div className="form-label">Publication Year:</div>
              <div className="form-input">
                <input
                  type="date"
                  value={newBook.publicationYear}
                  onChange={(e) => setNewBook({ ...newBook, publicationYear: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <div className="form-label">Status:</div>
              <div className="form-input">
                <select
                  value={newBook.isAvailable}
                  onChange={(e) => setNewBook({ ...newBook, isAvailable: e.target.value === "true" })}
                >
                  <option value="true">Available</option>
                  <option value="false">Unavailable</option>
                </select>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <div className="btn btn-outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </div>
            <div className="btn btn-primary" onClick={handleAddBook}>
              Add Book
            </div>
          </div>
        </div>
      </Modal>

      {/* Edit Book Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <div className="modal-content">
          <div className="modal-title">Edit Book</div>
          <div className="modal-form">
            <div className="form-group">
              <div className="form-label">Title:</div>
              <div className="form-input">
                <input
                  type="text"
                  value={bookToEdit?.title || ""}
                  onChange={(e) => setBookToEdit({ ...bookToEdit, title: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <div className="form-label">Author:</div>
              <div className="form-input">
                <input
                  type="text"
                  value={bookToEdit?.author || ""}
                  onChange={(e) => setBookToEdit({ ...bookToEdit, author: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <div className="form-label">Genre:</div>
              <div className="form-input">
                <input
                  type="text"
                  value={bookToEdit?.genre || ""}
                  onChange={(e) => setBookToEdit({ ...bookToEdit, genre: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <div className="form-label">ISBN:</div>
              <div className="form-input">
                <input
                  type="text"
                  value={bookToEdit?.ISBN || ""}
                  onChange={(e) => setBookToEdit({ ...bookToEdit, ISBN: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <div className="form-label">Publication Year:</div>
              <div className="form-input">
                <input
                  type="number"
                  value={bookToEdit?.publicationYear || ""}
                  onChange={(e) => setBookToEdit({ ...bookToEdit, publicationYear: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <div className="form-label">Availability:</div>
              <div className="form-input">
                <select
                  value={bookToEdit?.isAvailable}
                  onChange={(e) => setBookToEdit({ ...bookToEdit, isAvailable: e.target.value === "true" })}
                >
                  <option value="true">Available</option>
                  <option value="false">Unavailable</option>
                </select>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <div className="btn btn-outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </div>
            <div className="btn btn-primary" onClick={handleEditBook}>
              Save Changes
            </div>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && (
        <div className="dialog">
          <div className="dialog-content">
            <div className="dialog-header">
              <div className="dialog-title">Confirm Deletion</div>
              <div className="dialog-description">
                Are you sure you want to delete the book "{bookToDelete?.title}"?
              </div>
            </div>
            <div className="dialog-footer">
              <div className="btn btn-outline" onClick={handleDeleteCancel}>
                Cancel
              </div>
              <div className="btn btn-danger" onClick={handleDeleteConfirm}>
                Delete
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BookTable

