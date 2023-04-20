/**
 * Ces tests utilisent la bibliothèque supertest pour effectuer
 *  des requêtes HTTP sur notre microservice et vérifier les réponses.
 *  Le test de chaque route vérifie que la réponse est valide en fonction
 *  de la requête et des données stockées dans la base de données.
 * 
 */


const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../models');

beforeAll(async () => {
  await sequelize.sync();
});

afterAll(async () => {
  await sequelize.close();
});

describe('Test routes', () => {
  const accountData = {
    name: 'John',
    balance: 1000
  };

  let accountId;

  it('should create a new account', async () => {
    const response = await request(app)
      .post('/accounts')
      .send(accountData);
    expect(response.status).toBe(201);
    expect(response.body.name).toBe(accountData.name);
    expect(response.body.balance).toBe(accountData.balance);
    accountId = response.body.id;
  });

  it('should retrieve the account by id', async () => {
    const response = await request(app)
      .get(`/accounts/${accountId}`);
    expect(response.status).toBe(200);
    expect(response.body.name).toBe(accountData.name);
    expect(response.body.balance).toBe(accountData.balance);
  });

  it('should retrieve all accounts', async () => {
    const response = await request(app)
      .get('/accounts');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.accounts)).toBe(true);
    expect(response.body.accounts.length).toBeGreaterThan(0);
  });

  it('should delete the account by id', async () => {
    const response = await request(app)
      .delete(`/accounts/${accountId}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe(`Account with id ${accountId} deleted`);
  });

  it('should return 404 for non-existing account', async () => {
    const response = await request(app)
      .get('/accounts/1234');
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Account not found');
  });

  it('should return 400 for missing name or balance', async () => {
    const response = await request(app)
      .post('/accounts')
      .send({});
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('"name" and "balance" are required');
  });
});
