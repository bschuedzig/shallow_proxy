var http = require('http'),
    httpProxy = require('http-proxy');

var OPTIONS = {
	target : {
		host: 'httpbin.org',
		proto: 'https'
	},
	port: 5050,
	addResponseHeader: {
		'Access-Control-Allow-Origin' : '*',
		'Access-Control-Allow-Headers' : '*',
		'Access-Control-Allow-Methods' : '*'
	},
};


//####################################################################

var proxy = httpProxy.createProxyServer({
	secure:false,
	changeOrigin: true,
	auth : 'user:pass'
});


/*
   *  `options` is needed and it must have the following layout:
   *
   *  {
   *    target : <url string to be parsed with the url module>
   *    forward: <url string to be parsed with the url module>
   *    agent  : <object to be passed to http(s).request>
   *    ssl    : <object to be passed to https.createServer()>
   *    ws     : <true/false, if you want to proxy websockets>
   *    xfwd   : <true/false, adds x-forward headers>
   *    secure : <true/false, verify SSL certificate>
   *    toProxy: <true/false, explicitly specify if we are proxying to another proxy>
   *    prependPath: <true/false, Default: true - specify whether you want to prepend the target's path to the proxy path>
   *    ignorePath: <true/false, Default: false - specify whether you want to ignore the proxy path of the incoming request>
   *    localAddress : <Local interface string to bind for outgoing connections>
   *    changeOrigin: <true/false, Default: false - changes the origin of the host header to the target URL>
   *    auth   : Basic authentication i.e. 'user:password' to compute an Authorization header.  
   *    hostRewrite: rewrites the location hostname on (301/302/307/308) redirects, Default: null.
   *    autoRewrite: rewrites the location host/port on (301/302/307/308) redirects based on requested host/port. Default: false.
   *    protocolRewrite: rewrites the location protocol on (301/302/307/308) redirects to 'http' or 'https'. Default: null.
   *  }
   *
   *  NOTE: `options.ws` and `options.ssl` are optional.
   *    `options.target and `options.forward` cannot be
   *    both missing
   *  }
   */




// tamper with the request
/*
proxy.on('proxyReq', function(proxyReq, req, res, options) {
	
	proxyReq.setHeader('Bleh', OPTIONS.target.host);
});
*/


proxy.on('proxyRes', function(proxyRes, req, res) {

	if (OPTIONS.addResponseHeader) {
		var keys = Object.keys(OPTIONS.addResponseHeader);

		for(var x = 0; x<keys.length; x++) {
			res.setHeader(keys[x], OPTIONS.addResponseHeader[keys[x]]);
		}
	}
});


var server = http.createServer(function(req, res) {
	var target = OPTIONS.target.proto + '://' + OPTIONS.target.host;
	proxy.web(req, res, { target: target });
});


server.listen(OPTIONS.port, function() {
	console.log('(Shallow) Proxy listening on port ' + OPTIONS.port);
	console.log('##> ' + OPTIONS.target.proto + '://' + OPTIONS.target.host);
	console.log();	
});

