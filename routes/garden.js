const express = require('express');
const isAuth = require('../middleware/is-auth');
const { check, body } = require('express-validator/check');

const gardenController = require('../controllers/garden');

const router = express.Router();

router.get("/plans", isAuth, gardenController.getPlans);

router.get("/GardenOutLine", isAuth, gardenController.getGardenOutLine);

router.post('/addPlan',
    isAuth,
    body("title")
    .isLength({ min: 1 })
    .withMessage("Need A Title"),
    body("length")
    .isFloat({ min: 1, max: 10 })
    .withMessage("Length Must Be At Least 1 And No More Than 10"),
    body("width")
    .isFloat({ min: 1, max: 10 })
    .withMessage("Width Must Be At Least 1 And No More Than 10"),
    body("width", "legth")

    .custom((value, { req }) => {
        console.log(req.body.length);
        console.log(req.body.width);
        if (req.body.length == 1 && req.body.width == 1) {
            return Promise.reject('Must Be Bigger Then 1 X 1!');
        }
        return true;
      }),
    
    gardenController.postAddPlan);

router.get('/editGarden/:id', isAuth, gardenController.getEditGarden);

router.post('/saveGarden', isAuth, gardenController.postEditGarden);

router.post('/delete-garden', isAuth, gardenController.postDeleteGarden);



module.exports = router;