require("dotenv").config();

//project variables 
let fs = require("fs");
let keys  = require("./keys.js");
let Spotify = require("node-spotify-api");
let spotify = new Spotify(keys.spotify);
let request = require("request");

let action = process.argv[2]
let parameter = process.argv[3]



//call back function
function switchCase() {

    switch (action) {
        case 'spotify-this-song':
      spotifySong(parameter);
      break;

      case 'movie-this':
      movieInfo(parameter);
      break;

      default:                            
      logInfo("Invalid Instruction");
      break;
    }
};

//spotify 
function spotifySong(parameter) {

 
    let searchTrack;
    if (parameter === undefined) {
      searchTrack = "The Sign";
    } else {
      searchTrack = parameter;
    }
  
    spotify.search({
      type: 'track',
      query: searchTrack
    }, function(error, data) {
      if (error) {
        logInfo('Error occurred: ' + error);
        return;
      } else {
        logInfo("\n---------------------------------------------------\n");
        logInfo("Artist: " + data.tracks.items[0].artists[0].name);
        logInfo("Song: " + data.tracks.items[0].name);
        logInfo("Preview: " + data.tracks.items[3].preview_url);
        logInfo("Album: " + data.tracks.items[0].album.name);
        logInfo("\n---------------------------------------------------\n");
        
      }
    })
    };
    //ombd movie finder
    function movieInfo(parameter) {


        let searchMovie;
        if (parameter === undefined) {
          searchMovie = "Mr. Nobody";
        } else {
          searchMovie = parameter;
        };
      
        let queryUrl = "http://www.omdbapi.com/?t=" + searchMovie + "&y=&plot=short&apikey=2b86df7";
        
        request(queryUrl, function(err, res, body) {
            let bodyOf = JSON.parse(body);
          if (!err && res.statusCode === 200) {
            logInfo("\n---------------------------------------------------\n");
            logInfo("Title: " + bodyOf.Title);
            logInfo("Release Year: " + bodyOf.Year);
            logInfo("IMDB Rating: " + bodyOf.imdbRating);
            logInfo("Rotten Tomatoes Rating: " + bodyOf.Ratings[1].Value); 
            logInfo("Country: " + bodyOf.Country);
            logInfo("Language: " + bodyOf.Language);
            logInfo("Plot: " + bodyOf.Plot);
            logInfo("Actors: " + bodyOf.Actors);
            logInfo("\n---------------------------------------------------\n");
          }
        });
      
      function getRandom() {
        fs.readFile('random.txt', "utf8", function(error, data){
        
            if (error) {
                return logInfo(error);
              }
        
          
            let dataArr = data.join("\n");
            
            if (dataArr[0] === "spotify-this-song") 
            {
              let songcheck = dataArr[1];
              spotifySong(songcheck);
            } 
        })
      }
    };
    function logInfo(logData) {

        console.log(logData);
    
        fs.appendFile('log.txt', logData + '\n', function(err) {
            
            if (err) return logInfo('Error logging data to file: ' + err);	
        });
    }
    
    
    switchCase();
    