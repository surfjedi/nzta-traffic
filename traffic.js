var https = require('https'),
    xml2js = require('xml2js');

//var ref = process.argv[2];

// Remove console log in production mode
if(process.env.NODE_ENV == "production")
{
    console.log = function(){};
}
if(process.env.NODE_ENV == "test" || process.env.NODE_ENV == "production")
{
    ref = process.argv[2];
}

//var ref = "AKL-SH1-NB-RNM";
var nztaOptions = {
    host: 'infoconnect1.highwayinfo.govt.nz',
    port: 443,
    path: '/ic/jbi/SsdfJourney2/REST/FeedService/journey/' + ref,
    headers: {
        "username": "LeeB",
        "password": "H9r8z6w3g9"
    }
};
//request('https://google.com', function (error, response, body) {
//    if (!error && response.statusCode == 200) {
//        console.log(body) // Print the google web page.
//    }
//})

function getData() {
    https.get(nztaOptions, function(nztaResponse) {
        var nztaData = '';

        if (nztaResponse.statusCode !== 200) {
            console.log(nztaResponse.statusCode);
        } else {
            nztaResponse.on('data', function(chunk) {
                // chunk response from NZTA
                nztaData += chunk;
                var message = "" + chunk;
                console.log('Received response of ' + message.length + ' bytes from nzta.');
            });

            nztaResponse.on('end', function() {
                // final response, now process data
                console.log('response end.');
                try {
                    xml2js.parseString(nztaData, function(err, result) {
                        //console.log(nztaData);
                        console.log('\n ------------------------ \n');
                        console.log(result["tns:findJourneyByReferenceResponse"]["tns:return"][0]["tns:name"][0]);


                        var journey = {
                            name: result["tns:findJourneyByReferenceResponse"]["tns:return"][0]["tns:name"][0],
                            averageSpeed: result["tns:findJourneyByReferenceResponse"]["tns:return"][0]["tns:averageSpeed"][0],
                            minutes: result["tns:findJourneyByReferenceResponse"]["tns:return"][0]["tns:lastEstimate"][0],
                            pollDateTime: result["tns:findJourneyByReferenceResponse"]["tns:return"][0]["tns:lastEstimateTime"][0]
                        };


                        console.log(journey );
                        //callback(journey);

                    });
                } catch (e) {
                    console.log('error in nztaResponse on ' + e)
                }

            });
        }

    });
}

getData();

module.exports.getData = getData;