/* eslint-disable */

export default {
  getConfig (callback) {
    fetch("http://localhost:5001/config").then(function(response) {
      return response.json();
    }).then(function(data) {
      callback(data);
    }).catch(function(err) {
      console.log("Error -> ", err);
    });
  }
}
