const express = require('express');
const isAuth = require('../middleware/is-auth');

const gardenController = require('../controllers/garden');

const router = express.Router();

router.get("/plans", gardenController.getPlans);

router.get("/GardenOutLine", gardenController.getGardenOutLine);

router.post('/addPlan', gardenController.postAddPlan);

router.get('/editGarden/:id', gardenController.getEditGarden);

router.post('/saveGarden', gardenController.postEditGarden);

router.post('/delete-garden', gardenController.postDeleteGarden);



module.exports = router;