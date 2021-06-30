// Import Router
import { Router } from 'express';

// Importando al controlador Home
import homeController from '@server/controllers/homeControllers';

// Creando la instancia de un router
const router = new Router();

// GET '/'
router.get(['/', '/index'], homeController.index);
// router.get('/index', homeController.index);   Este codigo hace lo mismo que lo que esta rriba

// GET '/greeting'
router.get('/greeting', homeController.greeting);

// GET '/about'
router.get('/about', homeController.about);

// Exportando el router que maneja las subrutas
// para el controlador Home
export default router;
