const FoldersService = {
    getAllFolders(knex, user_name) {
        return knex.raw(
            `SELECT 
                folder.id, 
                folder.name,
                folder.user_id,
            FROM tbr_folders AS folder
            JOIN tbr_users AS user
            ON folder.user_id = user.id
            WHERE user_name = ${user_name}`
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

  }
  
  module.exports = FoldersService