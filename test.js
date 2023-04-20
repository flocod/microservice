const request = require('supertest');
const app = require('./app.js');

describe('Test API routes', () => {
  it('should return a list of accounts', async () => {
    const res = await request(app).get('/accounts');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('accounts');
  });

  it('should return a single account', async () => {
    const res = await request(app).get('/accounts/1');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('id', 1);
    expect(res.body).toHaveProperty('name', 'John Doe');
    expect(res.body).toHaveProperty('balance', 1000);
  });

  it('should create a new account', async () => {
    const res = await request(app)
      .post('/accounts')
      .send({ name: 'Jane Doe', balance: 500 });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('name', 'Jane Doe');
    expect(res.body).toHaveProperty('balance', 500);
  });

  it('should delete an account', async () => {
    const res = await request(app).delete('/accounts/1');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Account with id 1 deleted');
  });
});
