module.exports = {
	"database:":"mongodb://judgechuks:chukwuka@ds141264.mlab.com:41264/stylzmax",
	"port": process.env.PORT || 4000,
	"secretKey" : "YourSecretKey",
	'facebookAuth' : {
        'clientID'      : '465510780492529', // your App ID
        'clientSecret'  : '989e906ae3045d4050df265b9588e0be', // your App Secret
        'callbackURL'   : 'https://obscure-woodland-42226.herokuapp.com/api/auth/facebook/callback'
    },
     'googleAuth': {
        'clientID': '855194110354-kcvenm6kprjpb9qpqntmvsf7njvhho73.apps.googleusercontent.com',
        'clientSecret': 'uvIDcroIgmxy2MEFH4W-WJCx',
        'callbackURL': 'https://obscure-woodland-42226.herokuapp.com/api/auth/google/callback'
    }
}




