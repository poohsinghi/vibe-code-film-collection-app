import * as functions from 'firebase-functions';
import app from './src/index';

// Firebase Cloud Functions entry point
export const api = functions.https.onRequest(app);
