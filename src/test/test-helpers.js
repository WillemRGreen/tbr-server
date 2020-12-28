function makeUsersArray() {
    return [
        {
            id:1,
            user_name: 'test-user1',
            full_name: 'user 1',
            password: 'password',
            date_created: '2029-01-22T16:28:32.615Z'
        },
        {
            id:2,
            user_name: 'test-user2',
            full_name: 'user 2',
            password: 'password',
            date_created: '2029-01-22T16:28:32.615Z'
        },
        {
            id:3,
            user_name: 'test-user3',
            full_name: 'user 3',
            password: 'password',
            date_created: '2029-01-22T16:28:32.615Z'
        },
        {
            id:4,
            user_name: 'test-user4',
            full_name: 'user 4',
            password: 'password',
            date_created: '2029-01-22T16:28:32.615Z'
        },
    ]
}

function makeFoldersArray(users) {
    return [
        {
            id: 1,
            name: 'test folder',
            user_id: users[0].id,
            date_created: '2029-01-22T16:28:32.615Z'
        },
        {
            id: 2,
            name: 'test folder 2',
            user_id: users[1].id,
            date_created: '2029-01-22T16:28:32.615Z'
        },
        {
            id: 3,
            name: 'test folder 3',
            user_id: users[2].id,
            date_created: '2029-01-22T16:28:32.615Z'
        },
        {
            id: 4,
            name: 'test folder 4',
            user_id: users[3].id,
            date_created: '2029-01-22T16:28:32.615Z'
        },
    ]
}

function makeBooksArray(users, folders) {
    return [
        {
            id: 1,
            name: 'test book',
            user_id: users[0].id,
            folder_id: folders[0].id,
            modified: '2029-01-22T16:28:32.615Z',
            description: 'test description numero uno',
            completed: false

        },
        {
            id: 2,
            name: 'test book 2',
            user_id: users[1].id,
            folder_id: folders[1].id,
            modified: '2029-01-22T16:28:32.615Z',
            description: 'test description numero uno',
            completed: false

        },
        {
            id: 3,
            name: 'test book 3',
            user_id: users[2].id,
            folder_id: folders[1].id,
            modified: '2029-01-22T16:28:32.615Z',
            description: 'test description numero uno',
            completed: false

        },
        {
            id: 4,
            name: 'test book 4',
            user_id: users[3].id,
            folder_id: folders[1].id,
            modified: '2029-01-22T16:28:32.615Z',
            description: 'test description numero uno',
            completed: false

        },
    ]
}

function serializeFolders() {
    return {
        id: folder.id,
        name: xss(folder.name),
        user_id: folder.user_id
      }
}

function serializeBooks(book) {
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

function makeAllItems() {
    const testUsers = makeUsersArray()
    const testFolders = makeFoldersArray(testUsers)
    const testBooks = makeBooksArray(testUsers, testFolders)
    return { testUsers, testThings, testBooks }
}

function cleanTables(db) {
    return db.raw(
        `TRUNCATE
            tbr_books,
            tbr_folders,
            tbr_users
            RESTART IDENTITY CASCADE`
    )
}

function seedTables(db, users, folders, books) {
    return db
        .into('tbr_users')
        .insert(users)
        .then(() => 
            db
                .into('tbr_folders')
                .insert(folders)
        )
        .then(() =>
            db 
                .into('tbr_books')
                .inser(books))
}

module.exports = {
    makeBooksArray,
    makeUsersArray,
    makeFoldersArray,
    serializeFolders,
    serializeBooks,
    makeAllItems,
    cleanTables,
    seedTables
}