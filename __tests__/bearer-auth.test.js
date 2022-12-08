describe
POST /api/v1/:model adds an item to the DB and returns an object with the added item
GET /api/v1/:model returns a list of :model items
GET /api/v1/:model/ID returns a single item by ID
PUT /api/v1/:model/ID returns a single, updated item by ID
DELETE /api/v1/:model/ID returns an empty object. Subsequent GET for the same ID should result in nothing found

POST /api/v2/:model with a bearer token that has create permissions adds an item to the DB and returns an object with the added item
GET /api/v2/:model with a bearer token that has read permissions returns a list of :model items
GET /api/v2/:model/ID with a bearer token that has read permissions returns a single item by ID
PUT /api/v2/:model/ID with a bearer token that has update permissions returns a single, updated item by ID
DELETE /api/v2/:model/ID with a bearer token that has delete permissions returns an empty object. Subsequent GET for the same ID should result in nothing found

'use strict';

process.env.SECRET = 'TEST_SECRET';

const base64 = require('base-64');
const middleware = require('../../../../src/auth/middleware/basic.js');
const { sequelize, users } = require('../../../../src/auth/models/index.js');

let userInfo = {
  admin: { username: 'admin-basic', password: 'password' },
};

// Pre-load our database with fake users
beforeAll(async () => {
  await sequelize.sync();
  await users.create(userInfo.admin);
});
afterAll(async () => {
  await sequelize.drop();
});

describe('Auth Middleware', () => {

  // admin:password: YWRtaW46cGFzc3dvcmQ=
  // admin:foo: YWRtaW46Zm9v

  // Mock the express req/res/next that we need for each middleware call
  const req = {};
  const res = {
    status: jest.fn(() => res),
    send: jest.fn(() => res),
  };

  const next = jest.fn();

  describe('user authentication', () => {

    it('fails a login for a user (admin) with the incorrect basic credentials', () => {
      const basicAuthString = base64.encode('username:password');

      // Change the request to match this test case
      req.headers = {
        authorization: `Basic ${basicAuthString}`,
      };

      return middleware(req, res, next)
        .then(() => {
          expect(next).not.toHaveBeenCalled();
          expect(res.status).toHaveBeenCalledWith(403);
        });

    });

    it('logs in an admin user with the right credentials', () => {
      let basicAuthString = base64.encode(`${userInfo.admin.username}:${userInfo.admin.password}`);

      // Change the request to match this test case
      req.headers = {
        authorization: `Basic ${basicAuthString}`,
      };

      return middleware(req, res, next)
        .then(() => {
          expect(next).toHaveBeenCalledWith();
        });

    });
  });
});