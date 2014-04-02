/*
 * Serve JSON to our AngularJS client
 */

exports.youtubeSearch = function(req, res){
  var q = "Harry Potter";
  
  var youtubeRequest = gapi.client.youtube.search.list({
    q: q,
    part: 'snippet'
  });

  youtubeRequest.execute(function(response) {
    // var str = JSON.stringify(response.result);
    console.log(response.result);
    // res.json(response.result);
  });
}