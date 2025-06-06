// __tests__/adminController.test.js
const {
  getTotalUsers,
  getTotalMedics,
  getTotalNews,
  getAllUsers,
  getAllMedics,
  searchUser,
  promoteToMedic,
  changeToUser,
  deleteUser
} = require('../controller/adminController');
const httpMocks = require('node-mocks-http');
const { User } = require('../models/userModel');
const News = require('../models/newsModel');
const { admin } = require('../auth/middleware');

jest.mock('../models/userModel', () => ({
  User: {
    countDocuments: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    deleteOne: jest.fn()
  }
}));

jest.mock('../models/newsModel', () => ({
  countDocuments: jest.fn()
}));

jest.mock('../auth/middleware', () => ({
  admin: {
    auth: () => ({
      getUserByEmail: jest.fn().mockResolvedValue({ uid: 'mockUid' }),
      deleteUser: jest.fn().mockResolvedValue(true)
    })
  }
}));

describe('Admin Controller', () => {
  const mockAdminSession = { session: { status: 'admin' } };
  const mockUserSession = { session: { status: 'user' } };

  describe('getTotalUsers', () => {
    it('returns 401 if not admin', async () => {
      const req = httpMocks.createRequest(mockUserSession);
      const res = httpMocks.createResponse();
      await getTotalUsers(req, res);
      expect(res.statusCode).toBe(401);
    });

    it('returns total users if admin', async () => {
      User.countDocuments.mockResolvedValue(10);
      const req = httpMocks.createRequest(mockAdminSession);
      const res = httpMocks.createResponse();
      await getTotalUsers(req, res);
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData().total).toBe(10);
    });
  });

  describe('getTotalMedics', () => {
    it('returns 401 if not admin', async () => {
      const req = httpMocks.createRequest(mockUserSession);
      const res = httpMocks.createResponse();
      await getTotalMedics(req, res);
      expect(res.statusCode).toBe(401);
    });

    it('returns total medics if admin', async () => {
      User.countDocuments.mockResolvedValue(3);
      const req = httpMocks.createRequest(mockAdminSession);
      const res = httpMocks.createResponse();
      await getTotalMedics(req, res);
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData().total).toBe(3);
    });
  });

  describe('getTotalNews', () => {
    it('returns 401 if not admin', async () => {
      const req = httpMocks.createRequest(mockUserSession);
      const res = httpMocks.createResponse();
      await getTotalNews(req, res);
      expect(res.statusCode).toBe(401);
    });

    it('returns total news if admin', async () => {
      News.countDocuments.mockResolvedValue(7);
      const req = httpMocks.createRequest(mockAdminSession);
      const res = httpMocks.createResponse();
      await getTotalNews(req, res);
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData().total).toBe(7);
    });
  });

  // You can continue with getAllUsers, getAllMedics, searchUser, etc.
});
