const Model = require('./models')

Model.UserTransaction.findAll({
  where: {
    UserId: 1
  },
  include: [{
    model: Model.Transaction,
    include: [{
      model: Model.User
    }]
  }]
})
.then(data => {
  // res.send(data)
  console.log(data[0].Transaction)
})
.catch(err => {
  console.log(err)
})
