var proxyServer = require('http-route-proxy');

 
/**
 *   proxy configs
 */
proxyServer.proxy([
    {
        from: 'localhost:9000',
        to: 'www.google.com',
        
    }
]);

