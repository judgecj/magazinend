module.exports = {
	"database:":"mongodb://judgechuks:chuks@ds051655.mlab.com:51655/userme",
	"port": process.env.PORT || 2000,
	"secretKey" : "YourSecretKey",
	'facebookAuth' : {
        'clientID'      : '1813537375627570', // your App ID
        'clientSecret'  : '491af6dfd455b243f31c2f670a0059e5', // your App Secret
        'callbackURL'   : 'http://localhost:2000/api/auth/facebook/callback'
    },
     'googleAuth': {
        'clientID': '855194110354-kcvenm6kprjpb9qpqntmvsf7njvhho73.apps.googleusercontent.com',
        'clientSecret': 'uvIDcroIgmxy2MEFH4W-WJCx',
        'callbackURL': 'http://localhost:2000/api/auth/google/callback'
    }
}




