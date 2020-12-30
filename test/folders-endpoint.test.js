const { expect } = require('chai')
const knex = require('knex')
const supertest = require('supertest')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Folders Endpoints', function() {
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

    describe(`GET /api/folders`, () => {
        
        context(`Given no folders`, () => {
            beforeEach('seed items', () => 
                helpers.seedTables(
                    db,
                    testUsers
                )
            )
            it('responds with 200 and empty list', () => {
                return supertest(app)
                .get('/api/folders')
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .expect(200, [])
            })
        })
        context('Given folders are present', () => {
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
                .get('/api/folders')
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .expect(200)
                .expect(res => {
                    expect(res.body).to.be.a('array');
                    res.body.forEach((item) => {
                        expect(item).to.be.a('object')
                        expect(item).to.include.keys(
                            'id',
                            'name',
                            'user_id'
                        )
                    })
                })
            })
        })
    })

    describe('POST /api/folders', () => {
        beforeEach('seed items', () => 
                helpers.seedTables(
                    db,
                    testUsers,
                )
            )
        it('should create and return folder', () => {
            const newFolder = {
                name: 'test folders',
            }

            return supertest(app)
            .post('/api/folders')
            .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
            .send(newFolder)
            .expect(201)
            .expect(res => {
                expect(res.body).to.be.a('object');
                expect(res.body).to.include.keys(
                    'id',
                    'name',
                    'user_id'
                )
                expect(res.body.name).to.equal(newFolder.name)
            })
        })
    })

    describe('GET /api/folder/:id', () => {

        beforeEach('seed items', () => 
            helpers.seedTables(
                db,
                testUsers,
                testFolders,
                testBooks
            )
        )

        it('should return folder when given existing id', () => {
            let folder;
            return db('tbr_folders')
            .first()
            .then(item => {
                folder = item
                return supertest(app)
                .get(`/api/folders/${folder.id}`)
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .expect(200)
            })
        })
    })
})