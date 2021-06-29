// Import Router
import { Router } from 'express';
// Importando al controlador Home
import userController from '@server/controllers/userControllers';

// Creando la instancia de router
const router = new Router();

/* GET users listing. */
router.get('/', userController.index);

module.exports = router;

export default router;
