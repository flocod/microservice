const express = require('express');
const bodyParser = require('body-parser');
const { Op } = require('sequelize');
const { Account, accountSchema } = require('./models/account');
const { Transaction } = require('sequelize');

const app = express();

app.use(bodyParser.json());

// GET /accounts - Récupère tous les comptes bancaires
app.get('/accounts', async (req, res) => {
  const accounts = await Account.findAll();
  res.json({ accounts });
});

// GET /accounts/:id - Récupère un compte bancaire par ID
app.get('/accounts/:id', async (req, res) => {
  const account = await Account.findByPk(req.params.id);
  if (account) {
    res.json(account);
  } else {
    res.status(404).json({ error: 'Account not found' });
  }
});

// POST /accounts - Crée un nouveau compte bancaire
app.post('/accounts', async (req, res) => {
  const { name, balance } = req.body;

  try {
    await accountSchema.validateAsync({ name, balance });
    const transaction = await sequelize.transaction();
    const account = await Account.create({ name, balance }, { transaction });
    await transaction.commit();
    res.status(201).json(account);
  } catch (error) {
    res.status(400).json({ error: error.details[0].message });
  }
});

// DELETE /accounts/:id - Supprime un compte bancaire par ID
app.delete('/accounts/:id', async (req, res) => {
  const account = await Account.findByPk(req.params.id);
  if (account) {
    const transaction = await sequelize.transaction();
    await account.destroy({ transaction });
    await transaction.commit();
    res.json({ message: `Account with id ${req.params.id} deleted` });
  } else {
    res.status(404).json({ error: 'Account not found' });
  }
});

module.exports = app;
