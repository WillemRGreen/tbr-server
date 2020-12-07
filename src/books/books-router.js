const path = require('path')
const express = require('express')
const xss = require('xss')
const BooksService = require('./books-service')
const { requireAuth } = require('../middleware/jwt-auth')

const booksRouter = express.Router()
const jsonParser = express.json()

booksRouter
  .route('/')
  .all(requireAuth)
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    const user_name = req.user.user_name
    BooksService.getTbrBooks(knexInstance, user_name)
      .then(books => {
        res.json(books.rows.map(BooksService.serializeBooks))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { name, folder_id, description, completed } = req.body
    const newBook = { name, folder_id, description, completed }

    for (const [key, value] of Object.entries(newBook)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
      }
    }

    newBook.user_id = req.user.id

    BooksService.insertBook(
      req.app.get('db'),
      newBook
    )
      .then(book => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${book.id}`))
          .json(BooksService.serializeBooks(book))
      })
      .catch(next)
  })


booksRouter
  .route('/completed')
  .all(requireAuth)
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    const user_name = req.user.user_name
    BooksService.getCompletedBooks(knexInstance, user_name)
      .then(books => {
        res.json(books.rows.map(BooksService.serializeBooks))
      })
      .catch(next)
  })

booksRouter
  .route('/:book_id')
  .all(requireAuth)
  .all((req, res, next) => {
    BooksService.getById(
      req.app.get('db'),
      req.params.book_id
    )
      .then(book => {
        if (!book) {
          return res.status(404).json({
            error: { message: `Book doesn't exist` }
          })
        }
        res.book = book
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(BooksService.serializeBook(res.book))
  })
  .delete((req, res, next) => {
    BooksService.deleteBook(
      req.app.get('db'),
      req.params.book_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { completed, description, folder_id, id, name, user_id } = req.body
    const bookToUpdate = { completed, description, folder_id, id, name, user_id }

    const numberOfValues = Object.values(bookToUpdate).filter(Boolean).length
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must contain a 'name'`
        }
      })

    BooksService.updateBook(
      req.app.get('db'),
      req.params.book_id,
      bookToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = booksRouter