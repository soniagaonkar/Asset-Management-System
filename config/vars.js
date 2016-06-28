// Set the ENVIRONMENT variable to point to the right environment
exports.ENV = 'development';

exports.version={
    "v1":"/api/v1/"
};

//switch the connection handles depending on the environment
switch(exports.ENV){
    case 'development':
        exports.MONGO_HOST= '127.0.0.1';
        exports.MONGO_PORT = 27017;
        exports.MONGO_DBNAME = 'assetMgt';
        exports.APP_PORT = 3001;
        exports.IS_DEV = false;
        exports.HOST = "127.0.0.1";
        exports.PORT = "";
        exports.ROOT = "/api";
        exports.SECRET = "myAssetAppSecret";
        break;

}

	
	
