const BooksService = {
    getAllBooks(knex, user_name) {
      return knex.raw(
            `SELECT 
                books.id, 
                books.name, 
                books.folder_id,
                books.user_id,
                books.description
            FROM tbr_books AS books
            JOIN tbr_users AS user
            ON books.user_id = user.id
            WHERE user_name = ${user_name}`
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
  }
  
  module.exports = BooksService