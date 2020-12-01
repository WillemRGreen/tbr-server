const xss = require('xss')

const FoldersService = {
    getAllFolders(knex, user_name) {
        return knex.raw(
            `SELECT 
                f.id, 
                f.name,
                f.user_id
            FROM tbr_folders AS f
            JOIN tbr_users AS u
            ON f.user_id = u.id
            WHERE user_name = '${user_name}'`
        )
    },

    insertFolder(knex, newFolder) {
      return knex
        .insert(newFolder)
        .into('tbr_folders')
        .returning('*')
        .then(rows => {
          return rows[0]
        })
    },

    getById(knex, id) {
      return knex
        .from('tbr_folders')
        .select('*')
        .where('id', id)
        .first()
    },

    deleteFolder(knex, id) {
      return knex('tbr_folders')
        .where({ id })
        .delete()
    },

    updateFolder(knex, id, newFolderFields) {
      return knex('tbr_folders')
        .where({ id })
        .update(newFolderFields)
    },

    serializeFolders(folder) {
      const { user } = folder
      return {
        id: folder.id,
        name: xss(folder.name),
        user_id: folder.user_id,
        user: {
          id: user.id,
          user_name: xss(user.user_name),
          full_name: xss(user.full_name),
          date_created: new Date(user.date_created),
          date_modified: new Date(user.date_modified) || null
        }
      }
    }
  }

  
  
  module.exports = FoldersService