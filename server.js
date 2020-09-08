const KustoClient = require("azure-kusto-data").Client;
const KustoConnectionStringBuilder = require("azure-kusto-data").KustoConnectionStringBuilder;
const ClientRequestProperties = require("azure-kusto-data").ClientRequestProperties;
const uuidv4 = require("uuid/v4");

const clusterConectionString = "https://azmarket.kusto.windows.net";
const database = "StoreApi";
const table = "HttpOutgoingRequests";

async function getKustoData()
{
    var kcs = KustoConnectionStringBuilder.withAadDeviceAuthentication(clusterConectionString);
    var kustoClient = new KustoClient(kcs);
    try {
        const results = await kustoClient.execute(database, `['${table}'] | where env_time >ago(7d)|where code!=-1| distinct env_time,correlationId,operationName|summarize num = count() by operationName|sort by num desc database("StoreApi")`);
        console.log(JSON.stringify(results));
        data = JSON.stringify(results);
        console.log(results.primaryResults[0].toString());
        return data
    }

    catch (error) {
        console.log(error);
        return "none"
    }
}



var http = require('http'); // Import Node.js core module

var server = http.createServer(function (req, res) {   //create web server
    if (req.url == '/') { //check the URL of the current request
        
        // set response header
        res.writeHead(200, { 'Content-Type': 'text/html' }); 
        
        // set response content    
        res.write('<html><body><p>This is home Page.</p></body></html>');
        res.end();
    
    }
    else if (req.url == "/student") {
        
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write('<html><body><p>This is student Page.</p></body></html>');
        res.end();
    
    }
    else if (req.url == "/admin") {
        
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write('<html><body><p>This is admin Page.</p></body></html>');
        res.end();
    
    }
    else if (req.url == '/data') { //check the URL of the current request
        res.writeHead(200, { 'Content-Type': 'application/json' });
        var data = getKustoData()
        res.write(data)
}
    else
        res.end('Invalid Request!');

});

server.listen(5000); //6 - listen for any incoming requests

console.log('Node.js web server at port 5000 is running..')