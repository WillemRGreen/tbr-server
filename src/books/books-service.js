const xss = require('xss')

const BooksService = {
    getAllBooks(knex, user_name) {
      return knex.raw(
            `SELECT 
                b.id, 
                b.name, 
                b.folder_id,
                b.user_id,
                b.description
            FROM tbr_books AS b
            JOIN tbr_users AS u
            ON b.user_id = u.id
            WHERE user_name = '${user_name}'`
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
      const { user } = book
      return {
        id: book.id,
        name: xss(book.name),
        modified: new Date(book.date_created),
        folder_id: book.folder_id,
        description: xss(book.description),
        user: {
          id: user.id,
          user_name: user.user_name,
          full_name: user.full_name,
          date_created: new Date(user.date_created),
          date_modified: new Date(user.date_modified) || null
        }
      }
    }
  }
  
  module.exports = BooksService