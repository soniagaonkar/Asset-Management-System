// Set the ENVIRONMENT variable to point to the right environment
exports.ENV = 'development';

exports.version={
    "v1":"/api/v1/"
};


//Start node process as
/*     HOST_URL="http://localhost"  HOST="localhost"  node server.js         */

//switch the connection handles depending on the environment
switch(exports.ENV){
    case 'development':
        exports.MONGO_HOST= process.env.MONGO_HOST ? process.env.MONGO_HOST : '127.0.0.1';
        exports.MONGO_PORT = process.env.MONGO_PORT ? process.env.MONGO_PORT :27017;
        exports.MONGO_DBNAME = 'assetMgt';
        exports.APP_PORT = 3001;
        exports.HOST = process.env.HOST ? process.env.HOST : "127.0.0.1";
        exports.HOST_URL = process.env.HOST_URL ? process.env.HOST_URL : "http://localhost";
        exports.PORT = "";
        exports.ROOT = "/api";
        exports.SECRET = "myAssetAppSecret";
        break;

}	
