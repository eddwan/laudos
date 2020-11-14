module.exports = {
    oauth: {
      clientId: process.env.GITHUB_CLIENT_ID || '27k0ludo34f7d6srb493a22hj',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '1ol5nmse3qttu5lkdl9qc9suv8g3jietgf96hru17pi7iukcgnji',
      authorizationUrl: 'https://iaa-dev.auth.us-east-1.amazoncognito.com/login',
      tokenUrl: 'https://iaa-dev.auth.us-east-1.amazoncognito.com/oauth2/token',
      useBasicAuthorizationHeader: false,
      // don't touch me
      redirectUri: 'http://localhost'
    }
  };