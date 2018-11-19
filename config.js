module.exports = {
    port: process.env.PORT || 5000,
    staticDir: `${__dirname}/public`,
    firebase: {
        serviceAccount: "./chatty-firebase.json",
        databaseURL: "https://db-chatty.firebaseio.com"
    },
}