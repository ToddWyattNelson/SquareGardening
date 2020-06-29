const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  resetToken: String,
  resetTokenExpiration: Date,
  plan: {
    gardens: [{
      gardenId: {
        type: Schema.Types.ObjectId,
        ref: 'Garden',
        required: true
      }
    }]
  },

  resetToken: String,
  resetTokenExpiration: Date,
});

//add a new garden
userSchema.methods.addToPlans = function (garden) {
  //console.log('this is a garden' + garden);
  const planGardenIndex = this.plan.gardens.findIndex(cp => {
    return cp.gardenId.toString() === garden._id.toString();
  });
  const updatedPlanGardens = [...this.plan.gardens];

  updatedPlanGardens.push({
    gardenId: garden._id
  });

  // console.log("updatedPlanGardens: " + updatedPlanGardens);
  const updatedPlan = {
    gardens: updatedPlanGardens
  };

  // console.log("updatedPlan: " + updatedPlan);
  this.plan = updatedPlan;
  return this.save();
};

// remove garden from plans
userSchema.methods.removeFromPlans = function (gardenId) {
  const updatedPlanGardens = this.plan.gardens.filter(gardens => {
    // console.log("gardens.gardenId: " + gardens.gardenId);
    return gardens.gardenId.toString() !== gardenId.toString();
  });
  this.plan.gardens = updatedPlanGardens;
  return this.save();
};


module.exports = mongoose.model('User', userSchema);

