const request = require('supertest');
const app = require('./app');

describe('GET /companies', () => {
  test('It should respond with an array of companies', async () => {
    const response = await request(app).get('/companies');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body.companies)).toBeTruthy();
  });
});

describe('POST /companies', () => {
  test('It should add a new company', async () => {
    const response = await request(app)
      .post('/companies')
      .send({ name: 'Test Company', description: 'Test Description' });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('company');
  });
});

describe('GET /companies/:code', () => {
  test('It should respond with details of the specified company', async () => {
    const response = await request(app).get('/companies/apple');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('company');
  });
});

// Add more tests for other routes

// Example test for the GET /invoices route
describe('GET /invoices', () => {
  test('It should respond with an array of invoices', async () => {
    const response = await request(app).get('/invoices');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body.invoices)).toBeTruthy();
  });
});
