import express from 'express';
import {
  getAllProducts,
  getProductById,
  getCategories,
  getBrands
} from '../controllers/productController.js';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);

export default router;
