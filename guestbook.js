/**
 * Web application
 */
const apiUrl = 'https://9393fc9c.us-south.apiconnect.appdomain.cloud/guestbook';
const guestbook = {
  // retrieve the existing guestbook entries
  get() {
    return $.ajax({
      type: 'GET',
      url: `${apiUrl}/entries`,
      dataType: 'json'
    });
  },
  // add a single guestbood entry
  add(name, email, comment) {
    console.log('Sending', name, email, comment)
    return $.ajax({
      headers: 
      { accept: 'application/json',
        'content-type': 'application/json' },
      type: 'POST',
      url: `${apiUrl}/entries`,
      contentType: 'application/json; charset=utf-8',
      body:
      {data: JSON.stringify({
        name,
        email,
        comment,
      })},
      dataType: 'json',
    });
  }
};

// Install request by running "npm install --save request"
// var request = require("request");

// var options = { method: 'PUT',
//   url: 'https://9393fc9c.us-south.apiconnect.appdomain.cloud/guestbook/entries',
//   headers: 
//    { accept: 'application/json',
//      'content-type': 'application/json' },
//   contentType: 'application/json; charset=utf-8',
//   data: JSON.stringify({
//     name,
//     email,
//     comment,
//   }),
//   json: true };

// request(options, function (error, response, body) {
//   if (error) return console.error('Failed: %s', error.message);

//   console.log('Success: ', body);
// });

(function() {

  let entriesTemplate;

  function prepareTemplates() {
    entriesTemplate = Handlebars.compile($('#entries-template').html());
  }

  // retrieve entries and update the UI
  function loadEntries() {
    console.log('Loading entries...');
    $('#entries').html('Loading entries...');
    guestbook.get().done(function(result) {
      if (!result.entries) {
        return;
      }

      const context = {
        entries: result.entries
      }
      $('#entries').html(entriesTemplate(context));
    }).error(function(error) {
      $('#entries').html('No entries');
      console.log(error);
    });
  }

  // intercept the click on the submit button, add the guestbook entry and
  // reload entries on success
  $(document).on('submit', '#addEntry', function(e) {
    e.preventDefault();

    guestbook.add(
      $('#name').val().trim(),
      $('#email').val().trim(),
      $('#comment').val().trim()
    ).done(function(result) {
      // reload entries
      loadEntries();
    }).error(function(error) {
      console.log(error);
    });
  });

  $(document).ready(function() {
    prepareTemplates();
    loadEntries();
  });
})();
