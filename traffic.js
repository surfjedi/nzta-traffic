var https = require('https'),
    xml2js = require('xml2js');
//TODO: better way to absolute path the config
if(process.env.NODE_ENV !== "test")
{
    nztaConfig = require( '../../config/nztaConfig.json')
}

// Remove console log in production mode
if(process.env.NODE_ENV == "production")
{
    console.log = function(){};
}
if(process.env.NODE_ENV == "test")
{
    nztaConfig = require( './nztaConfig.json');
    ref = process.argv[2];

}

//var ref = "AKL-SH1-NB-RNM";

function getTravelTime(ref) {

    var nztaOptions = {
        host: 'infoconnect1.highwayinfo.govt.nz',
        port: 443,
        path: '/ic/jbi/SsdfJourney2/REST/FeedService/journey/' + ref,
        headers: {
            "username": nztaConfig.username,
            "password": nztaConfig.password
        }
    };

    https.get(nztaOptions, function(nztaResponse) {
        var nztaData = '';

        if (nztaResponse.statusCode !== 200) {
            console.log('Problem with route: ' + ref + ' status code: ' + nztaResponse.statusCode);
        } else {
            nztaResponse.on('data', function(chunk) {
                // chunk response from NZTA
                nztaData += chunk;
                var message = "" + chunk;
                //console.log('Received response of ' + message.length + ' bytes from nzta.');
            });

            nztaResponse.on('end', function() {
                // final response, now process data
                console.log('response end.');

                //TODO:convert to promises
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

if(process.env.NODE_ENV == "test")
{
    getTravelTime(ref);
}

module.exports.getTravelTime = getTravelTime;