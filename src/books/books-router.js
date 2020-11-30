const path = require('path')
const express = require('express')
const xss = require('xss')
const BooksService = require('./books-service')

const booksRouter = express.Router()
const jsonParser = express.json()

const serializeBooks = book => ({
  id: book.id,
  name: xss(book.name),
  modified: book.date_created,
  folder_id: book.folder_id,
  description: book.description
})

booksRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    const user_name = req.user_name
    BooksService.getAllBooks(knexInstance, user_name)
      .then(books => {
        res.json(books.map(serializeBooks))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { name, folder_id, description, user_id } = req.body
    const newBook = { name, folder_id, description, user_id }

    for (const [key, value] of Object.entries(newBook)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
      }
    }

    BooksService.insertBook(
      req.app.get('db'),
      newBook
    )
      .then(book => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${book.id}`))
          .json(serializeBooks(book))
      })
      .catch(next)
  })

booksRouter
  .route('/:book_id')
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
    res.json(serializeBook(res.book))
  })
  .delete((req, res, next) => {
    booksService.deleteBook(
      req.app.get('db'),
      req.params.book_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { name } = req.body
    const bookToUpdate = { name }

    const numberOfValues = Object.values(bookToUpdate).filter(Boolean).length
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must contain a 'name'`
        }
      })

    booksService.updateBook(
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