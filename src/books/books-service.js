const xss = require('xss')

const BooksService = {
    getTbrBooks(knex, user_name) {
      return knex.raw(
            `SELECT 
                b.id, 
                b.name, 
                b.folder_id,
                b.user_id,
                b.description,
                b.completed
            FROM tbr_books AS b
            JOIN tbr_users AS u
            ON b.user_id = u.id
            WHERE user_name = '${user_name}'
            AND completed = false`
        )
    },

    getCompletedBooks(knex, user_name) {
      return knex.raw(
        `SELECT 
                b.id, 
                b.name, 
                b.folder_id,
                b.user_id,
                b.description,
                b.completed
            FROM tbr_books AS b
            JOIN tbr_users AS u
            ON b.user_id = u.id
            WHERE user_name = '${user_name}'
            AND completed = true`
      )
    },
  
    insertBook(knex, newBook) {
      return knex
        .insert(newBook)
        .into('tbr_books')
        .returning('*')
        .then(rows => {
          return rows[0]
        })
    },
  
    getById(knex, id) {
      return knex
        .from('tbr_books')
        .select('*')
        .where('id', id)
        .first()
    },
  
    deleteBook(knex, id) {
      return knex('tbr_books')
        .where({ id })
        .delete()
    },
  
    updateBook(knex, id, newBookFields) {
      return knex('tbr_books')
        .where({ id })
        .update(newBookFields)
    },

    serializeBooks(book) {
      return {
        id: book.id,
        name: xss(book.name),
        modified: new Date(book.date_created),
        folder_id: book.folder_id,
        user_id: book.user_id,
        description: xss(book.description),
        completed: book.completed,
      }
    }
  }
  
  module.exports = BooksService