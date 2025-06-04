// __tests__/appController.test.js
const {
  profile,
  editProfile,
  getHealthArticles,
  articleById,
  getComments,
  getReplies,
  postComments,
  postReply
} = require('../controller/appController');
const httpMocks = require('node-mocks-http');
const { User } = require('../models/userModel');
const News = require('../models/newsModel');
const Comments = require('../models/commentModel');
const Reply = require('../models/replyModel');

jest.mock('../models/userModel', () => ({
  User: {
    findOne: jest.fn(),
    updateOne: jest.fn(),
    findOneAndUpdate: jest.fn()
  }
}));

jest.mock('../models/newsModel', () => ({
  find: jest.fn(),
  findById: jest.fn()
}));

jest.mock('../models/commentModel', () => ({
  aggregate: jest.fn(),
  prototype: {
    save: jest.fn()
  }
}));

jest.mock('../models/replyModel', () => ({
  aggregate: jest.fn(),
  prototype: {
    save: jest.fn()
  }
}));

describe('App Controller', () => {
  describe('profile', () => {
    it('should return user profile', async () => {
      User.findOne.mockResolvedValue({ displayName: 'John' });
      const req = httpMocks.createRequest({ session: { userId: 'abc123' } });
      const res = httpMocks.createResponse();
      await profile(req, res);
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData().user.displayName).toBe('John');
    });
  });

  describe('getHealthArticles', () => {
    it('should return articles sorted by pubDate', async () => {
      News.find.mockResolvedValue([{ _id: '1', title: 'A', pubDate: new Date(), imageUrl: 'img.jpg' }]);
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      await getHealthArticles(req, res);
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData().data.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('articleById', () => {
    it('should return an article by id', async () => {
      News.findById.mockResolvedValue({ title: 'Test Article' });
      const req = httpMocks.createRequest({ params: { id: '1' } });
      const res = httpMocks.createResponse();
      await articleById(req, res);
      expect(res.statusCode).toBe(200);
    });
  });

  describe('postComments', () => {
    it('should return 400 if data not complete', async () => {
      const req = httpMocks.createRequest({ session: {}, body: {} });
      const res = httpMocks.createResponse();
      await postComments(req, res);
      expect(res.statusCode).toBe(400);
    });
  });
});
