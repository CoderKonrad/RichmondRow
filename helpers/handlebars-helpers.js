const moment = require('moment');

module.exports =
{

  select: function(selected, options)
  {
    return options.fn(this).replace(new RegExp(' value=\"'+ selected + '\"'), '$&selected="selected"');
  },

  generateDate: function(date, format)
  {
    return moment(date).format(format);
  },

  paginate: function(options)
  {
    let output = '';
    if (options.hash.current == 1)
    {
      output += '<li class="page-item disabled"><a class="page-link">First</a></li>';
    }
    else
    {
      output += '<li class="page-item"><a href="?page=1" class="page-link">First</a></li>';
    }
    return output;
    // console.log(options.hash.current);
  }





};
