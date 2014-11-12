NZTA TRAFFIC MODULE
=====================

There are two ways to use this module:
1. Normal node module in an app
2. As command line tool

###To install for #1:

1. npm install nzta_traffic
2. set up config/nztaConfig.json as per the nztaConfigjson.example

call  getTravelTime("journe_ref") any where in you node app!  AKL-SH1-NB-RNM is an example journey ref.

So for example:
getTravelTime("AKL-SH1-NB-RNM");

it will return json:
{ name: 'AKL-SH1-NB-RNM',
  averageSpeed: '84.34',
  minutes: '35',
  pollDateTime: '2014-11-12T21:54:13.227+13:00' }

  ###To install for #1:

  1. npm install nzta_traffic
  2. set up nztaConfig.json as per the nztaConfigjson.example

  Then  NODE_ENV=test node traffic.js AKL-SH1-NB-RNM  and it will log the json above to console