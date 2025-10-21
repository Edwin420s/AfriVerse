const request = require('supertest');

jest.mock('../src/services/symbolizerService', () => ({
  extractAtoms: jest.fn(async (transcript, context) => ({
    atoms: ['(Person "Amina")', '(From "Kisumu")'],
    rawResponse: '{"mock":true}',
    atomCount: 2
  }))
}));

const app = require('../src/app');

describe('POST /api/submit/symbolize', () => {
  it('400s when missing transcript', async () => {
    const res = await request(app)
      .post('/api/submit/symbolize')
      .send({});
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('returns atoms for valid payload', async () => {
    const res = await request(app)
      .post('/api/submit/symbolize')
      .send({ transcript: 'Amina from Kisumu', context: { language: 'sw' } });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.atoms)).toBe(true);
    expect(res.body.atomCount).toBe(2);
  });
});
