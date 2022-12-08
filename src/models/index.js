'use strict';

const { Sequelize, DataTypes } = require('sequelize');
const userModel = require('../auth/models/users.js');
const clothesModel = require('./clothes/model');
const foodModel = require('./food/model');
const Collection = require('./data-collection.js');

const DATABASE_URL = process.env.DATABASE_URL || 'sqlite:memory;';

const sequelize = new Sequelize(DATABASE_URL);
const users = userModel(sequelize, DataTypes);
const clothes = clothesModel(sequelize, DataTypes);
const food = foodModel(sequelize, DataTypes);

module.exports = {
  db: sequelize,
  users,
  clothes: new Collection(clothes),
  food: new Collection(food),
};
