const { expect } = require('chai')
const knex = require('knex')
const supertest = require('supertest')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Books Endpoints', function() {
    let db

    const {
        testUsers,
        testFolders,
        testBooks,
    } = helpers.makeAllItems()

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
    })

    after('disconnect from database', () => db.destroy())

    before('cleanup', () => helpers.cleanTables(db))

    afterEach('cleanup', () => helpers.cleanTables(db))

    describe(`GET /api/books`, () => {
        
        context(`Given no books`, () => {
            beforeEach('seed items', () => 
                helpers.seedTables(
                    db,
                    testUsers
                )
            )
            it('responds with 200 and empty list', () => {
                return supertest(app)
                .get('/api/books')
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .expect(200, [])
            })
        })
        context('Given books are present', () => {
            beforeEach('seed items', () => 
                helpers.seedTables(
                    db,
                    testUsers,
                    testFolders,
                    testBooks
                )
            )
            it('responds with an array of objects', () => {
                return supertest(app)
                .get('/api/books')
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .expect(200)
                .expect(res => {
                    expect(res.body).to.be.a('array');
                    res.body.forEach((item) => {
                        expect(item).to.be.a('object')
                        expect(item).to.include.keys(
                            'id',
                            'name',
                            'description',
                            'completed',
                            'modified',
                            'folder_id',
                            'user_id'
                        )
                    })
                })
            })
        })
    })

    describe('POST /api/books', () => {
        beforeEach('seed items', () => 
                helpers.seedTables(
                    db,
                    testUsers,
                    testFolders,
                )
            )
        it('should create and return book', () => {
            const newBook = {
                name: 'test book',
                folder_id: testFolders[0].id,
                description: 'test description for posting a book',
                completed: false
            }

            return supertest(app)
            .post('/api/books')
            .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
            .send(newBook)
            .expect(201)
            .expect(res => {
                expect(res.body).to.be.a('object');
                expect(res.body).to.include.keys(
                    'id',
                    'name',
                    'description',
                    'completed',
                    'modified',
                    'folder_id',
                    'user_id'
                )
                expect(res.body.name).to.equal(newBook.name)
                expect(res.body.description).to.equal(newBook.description)
                expect(res.body.completed).to.be.false;
            })
        })
    })

    describe('PATCH /api/books/:id', () => {

        beforeEach('seed items', () => 
            helpers.seedTables(
                db,
                testUsers,
                testFolders,
                testBooks
            )
        )

        it('should patch book when given existing id', () => {
            const updateFields = {
                name: 'new book name'
            }

            let book;
            return db('tbr_books')
            .first()
            .then(item => {
                book = item
                return supertest(app)
                .patch(`/api/books/${book.id}`)
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .send(updateFields)
                .expect(204)
            })
        })
    })

    describe('DELETE /api/books/:id', () => {

        beforeEach('seed items', () => 
            helpers.seedTables(
                db,
                testUsers,
                testFolders,
                testBooks
            )
        )

        it('should delete an item by id', () => {
            let book;
            return db('tbr_books')
              .first()
              .then(item => {
                  book = item;
                return supertest(app)
                  .delete(`/api/books/${book.id}`)
                  .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                  .expect(204);
              })
          });
    })
})