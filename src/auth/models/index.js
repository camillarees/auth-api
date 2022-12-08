'use strict';

const { Sequelize, DataTypes } = require('sequelize');
const userModel = require('./users.js');
const clothesModel = require('./clothes/model');
const foodModel = require('./food/model');
const Collection = require('./data-collection.js');

const DATABASE_URL = process.env.DATABASE_URL || 'sqlite:memory;';

const sequelize = new Sequelize(DATABASE_URL);
const clothes = clothesModel(sequelize, DataTypes);
const food = foodModel(sequelize, DataTypes);

module.exports = {
  db: sequelize,
  users: userModel(sequelize, DataTypes),
  clothes: new Collection(clothes),
  food: new Collection(food),
}
