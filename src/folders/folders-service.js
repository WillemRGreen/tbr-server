const FoldersService = {
    getAllFolders(knex, user_id) {
      return knex.select('*').from('tbr_folders').where('user_id', user_id)
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