var moment = require('moment')
module.exports = {
  context: 'no context',
  g: function(context, message) {
    if(!message) {
      message = context
      context = this.context
    }
    console.log(moment().format('YYYY-MM-DD hh:mm:ss') + ' - ' + context + ' - ' + message)
  }
}
