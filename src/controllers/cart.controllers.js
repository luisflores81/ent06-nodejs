const catchError = require('../utils/catchError');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Category = require('../models/Category');
const ProductImg = require('../models/ProductImg');

const getAll = catchError(async (req, res) => {
  const userId = req.user.id
  const results = await Cart.findAll({
    where: { userId: userId },
    include: [
      {
        model: Product,
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        include: [
          {
            model: Category,
            attributes: ['name']
          },
          {
            model: ProductImg,
            attributes: ['url']
          }
        ]
      }
    ]
  });
  return res.json(results);
});

const create = catchError(async (req, res) => {

  const userId = req.user.id 
  const { quantity, productId } = req.body 

  const result = await Cart.create({ userId, quantity, productId });
  return res.status(201).json(result);
});

const getOne = catchError(async (req, res) => {
  const { id } = req.params;

  const userId = req.user.id

  const result = await Cart.findByPk(id, {
    where: { userId: userId },
    include: [
      {
        model: Product,
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        include: [
          {
            model: Category,
            attributes: ['name']
          },
          {
            model: ProductImg
          }
        ]
      }
    ]
  });
  if (!result) return res.sendStatus(404);
  return res.json(result);
});

const remove = catchError(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id
  const result = await Cart.destroy({ where: { id, userId } });
  if (!result) return res.sendStatus(404);
  return res.sendStatus(204);
});

const update = catchError(async (req, res) => {
  const { id } = req.params;

  delete req.body.userId
  delete req.body.productId

  const result = await Cart.update(
    req.body,
    { where: { id, userId: req.user.id }, returning: true }
  );
  if (result[0] === 0) return res.sendStatus(404);
  return res.json(result[1][0]);
});

module.exports = {
  getAll,
  create,
  getOne,
  remove,
  update
}