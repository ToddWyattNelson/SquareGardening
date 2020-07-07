const Garden = require('../models/garden');
const User = require('../models/user');
const { validationResult } = require('express-validator/check');


exports.getPlans = (req, res, next) => {
    req.user
        .populate('plan.gardens.gardenId')
        .execPopulate()
        .then(user => {
            const gardens = user.plan.gardens;
            res.render('pages/garden/plans', {
                path: 'pages/garden/plans',
                pageTitle: 'Plans',
                gardens: gardens,
                // isAuthenticated: req.session.isLoggedIn
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.getGardenOutLine = (req, res, next) => {
    let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
    res.render('pages/garden/GardenOutLine', {
        errorMessage: message,
        path: '/garden/GardenOutLine',
        pageTitle: 'Outline',
        // isAuthenticated: req.session.isLoggedIn,
        oldInput: {
            length: '',
            width: '',
            title: ''
          },
    });
}


exports.postAddPlan = (req, res, next) => {
const length = req.body.length
const width =req.body.width
const title =req.body.title

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render('pages/garden/GardenOutLine', {
        // isAuthenticated: req.session.isLoggedIn,
        path: '/pages/garden/GardenOutLine',
        pageTitle: 'Outline',
        errorMessage: errors.array()[0].msg,
        oldInput: {
          length: length,
          width: width,
          title: title
        },
        validationErrors: errors.array()
      });
    }
    

    // Make the garden
    let size = [];
    // console.log("size: " + size);
    let total = 0;

    for (let widthIndex = 0; widthIndex < req.body.width; widthIndex++) {
        let testArray = [];
        for (let lengthIndex = 0; lengthIndex < req.body.length; lengthIndex++) {
            testArray[lengthIndex] = "Empty";
            total++;
        }
        size.push(testArray);
    }
    const garden = new Garden({
        title: req.body.title,
        length: req.body.length,
        width: req.body.width,
        size: size
    });

    garden
        .save()
        .then(result => {
            // console.log(result);
            // console.log('Created garden');
        })
        .then(result => {
            const gardenId = garden._id;
            // console.log('gardenId: ' + gardenId)

            //Add to plans
            Garden
                .findById(gardenId)
                .then(garden => {

                    // console.log("this is the garden:" + garden);
                    return req.user.addToPlans(garden);
                })
                .then(result => {
                    // console.log(result);
                    res.redirect("/editGarden/" + gardenId);
                })
                .catch(err => console.log(err));
        })
        .catch(err => {
            console.log(err);
        });
    // console.log(garden);
};


exports.getEditGarden = (req, res, next) => {
    let id = req.params.id;
    Garden.findById(id)
        .then((garden) => {
            res.render("pages/garden/editGarden", {
                pageTitle: "About " + garden.id,
                path: '/pages/garden/editGarden',
                garden: garden,
                // isAuthenticated: req.session.isLoggedIn
            });

        })
        .catch(err => console.log(err));

};

exports.postEditGarden = (req, res, next) => {
    //updated values
    // console.log('postEditGarden: ' + req.body.index[1])

    let size = [];

    let counter = 0;

    for (let widthIndex = 0; widthIndex < req.body.width; widthIndex++) {
        let newSize = [];
        for (let lengthIndex = 0; lengthIndex < req.body.length; lengthIndex++) {
            newSize[lengthIndex] = req.body.index[counter];
            counter++;
        }
         console.log(newSize)
        size.push(newSize);
    }
    
    let gardenId = req.body.gardenId;
    Garden
        .findById(gardenId)
        .then(garden => {

            garden.size = size;
            return garden.save();
        })
        .then(result => {
            console.log('UPDATED Garden!');
            res.redirect('/plans')
        })
        .catch(err => console.log(err));

};


exports.postDeleteGarden = (req, res, next) => {

    const gardenId = req.body.gardenId;

    // console.log("gardenId: " + gardenId);
    req.user
        // remove garden from database
        .removeFromPlans(gardenId)
        .then(
            Garden
                // remove garden from plans
                .findByIdAndRemove(gardenId)
                .then(() => { console.log('DESTROYED garden: ' + gardenId); })
                .catch(err => console.log(err))
        )
        .then(result => { res.redirect('/plans'); })
        .catch(err => console.log(err));


};