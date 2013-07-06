JSON = JSON || {};

JSON.load = function(file, callback) {
  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && (xhr.status === 0 || xhr.status === 200)) {
      callback(JSON.parse(xhr.responseText));
    }
  };

  xhr.open('GET', file + '.json', true);
  xhr.send(null);
};