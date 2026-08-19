import { clerkMiddleware } from '@clerk/express';

export const requireAuth = clerkMiddleware();

export const getAuthUserId = (req) => {
  return req.auth?.userId || null;
};
