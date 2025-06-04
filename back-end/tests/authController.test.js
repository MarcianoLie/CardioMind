// __tests__/authController.test.js
const {
  register,
  login,
  handleGoogleAuth,
  resetPassword,
  signOutUser,
  checkSession
} = require('../controller/authController');
const httpMocks = require('node-mocks-http');
const { User } = require('../models/userModel');

jest.mock('../models/userModel', () => ({
  User: {
    findOne: jest.fn(),
    prototype: {
      save: jest.fn()
    }
  }
}));

jest.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: jest.fn(),
  sendEmailVerification: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  sendPasswordResetEmail: jest.fn()
}));

jest.mock('../auth/middleware', () => ({
  admin: {
    auth: () => ({
      verifyIdToken: jest.fn().mockResolvedValue({
        uid: 'uid123',
        name: 'John Doe',
        email: 'john@example.com',
        picture: 'profile.jpg'
      })
    })
  }
}));

const { createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, sendPasswordResetEmail } = require('firebase/auth');

describe('Auth Controller', () => {
  describe('signOutUser', () => {
    it('should destroy session', async () => {
      const req = httpMocks.createRequest({ session: { destroy: jest.fn(cb => cb()) } });
      const res = httpMocks.createResponse();
      await signOutUser(req, res);
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData().message).toBe('Sign out Berhasil');
    });
  });

  describe('checkSession', () => {
    it('should return isLoggedIn true if session exists', () => {
      const req = httpMocks.createRequest({ session: { userId: '123', username: 'John', status: 'user' } });
      const res = httpMocks.createResponse();
      checkSession(req, res);
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData().isLoggedIn).toBe(true);
    });

    it('should return isLoggedIn false if no session', () => {
      const req = httpMocks.createRequest({ session: {} });
      const res = httpMocks.createResponse();
      checkSession(req, res);
      expect(res.statusCode).toBe(401);
    });
  });

  describe('resetPassword', () => {
    it('should send password reset email', async () => {
      sendPasswordResetEmail.mockResolvedValue(true);
      const req = httpMocks.createRequest({ body: { email: 'test@example.com' } });
      const res = httpMocks.createResponse();
      await resetPassword(req, res);
      expect(res.statusCode).toBe(200);
    });

    it('should handle errors', async () => {
      sendPasswordResetEmail.mockRejectedValue(new Error('Reset error'));
      const req = httpMocks.createRequest({ body: { email: 'fail@example.com' } });
      const res = httpMocks.createResponse();
      await resetPassword(req, res);
      expect(res.statusCode).toBe(400);
    });
  });

  // register, login, and handleGoogleAuth could be tested in-depth with more mocks
});
