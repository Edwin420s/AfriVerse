const request = require('supertest');
const path = require('path');

jest.mock('../src/services/transcriptionService', () => ({
  transcribeAudio: jest.fn(async (buffer, language) => ({
    text: 'mock transcript',
    language: language || 'sw',
    duration: 1.23,
    words: []
  }))
}));

const app = require('../src/app');

describe('POST /api/submit/transcribe', () => {
  it('returns 400 when no file provided', async () => {
    const res = await request(app)
      .post('/api/submit/transcribe')
      .field('language', 'sw');
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('transcribes when file is attached', async () => {
    // Using a tiny text file fixture; multer allows text/plain and controller only checks presence
    const fixturePath = path.join(__dirname, 'fixtures', 'dummy.txt');
    const res = await request(app)
      .post('/api/submit/transcribe')
      .field('language', 'sw')
      .attach('file', fixturePath);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.transcript).toBe('mock transcript');
  });
});
