// ----- SETUP
const express = require("express");
const app = express();
var dotenv = require("dotenv");
var passport = require("passport");
var Auth0Strategy = require("passport-auth0");
// const json2html = require("json-to-html");
const { Datastore } = require("@google-cloud/datastore");
const bodyParser = require("body-parser");
const rp = require("request-promise");
const request = require("request");
const { get } = require("request");
const datastore = new Datastore();
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const { authorize } = require("passport");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var util = require("util");
var url = require("url");
var querystring = require("querystring");
var axios = require("axios").default;

dotenv.config();
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

// ----- IMPORT GLOBALS FROM APP.JS
const {
    CLIENT_ID,
    CLIENT_SECRET,
    DOMAIN,
    pageURL,
    WINES,
    WINERIES,
    MGMT_API_ACCESS_TOKEN,
} = require("./globals");
const router = (module.exports = require("express").Router());

// ----- ROUTES
app.use("/users", require("./users"));
app.use("/wineries", require("./wineries"));
app.use("/wines", require("./wines"));

//Patrick Stumbaugh

/* ------------- JWT Functions ------------- */
const checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${DOMAIN}/.well-known/jwks.json`,
    }),

    // Validate the audience and the issuer.
    issuer: `https://${DOMAIN}/`,
    algorithms: ["RS256"],
});

/* ------------- End JWT Functions ------------- */

/* ------------- Front-end interaction ------------- */

//get info from front-end and return JWT info. If info is bad, return 500
router.get("/requestAuth", function (req, res) {
    const email = req.query.email;
    const password = req.query.password;
    var options = {
        method: "POST",
        url: `https://${DOMAIN}/oauth/token`,
        headers: { "content-type": "application/json" },
        body: {
            grant_type: "password",
            username: email,
            password: password,
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
        },
        json: true,
    };
    rp(options)
        .then(function (body) {
            let context = {};
            context.access_token = body.access_token;
            context.id_token = body.id_token;
            context.expires_in = body.expires_in;
            context.token_type = body.token_type;

            //get userId via axios
            var options = {
                method: "GET",
                url: "https://" + DOMAIN + "/api/v2/users",
                params: { q: "email:" + email, search_engine: "v3" },
                headers: { authorization: "Bearer " + MGMT_API_ACCESS_TOKEN },
            };

            axios
                .request(options)
                .then(function (response) {
                    context.user_id = response.data[0].user_id;
                    res.render("results", context);
                    return;
                })
                .catch(function (error) {
                    res.status(400).json(error);
                    return;
                });
        })
        .catch(function (err) {
            res.render("badLogin");
            return;
        });
});

//direct to the homepage
router.get("/", function (req, res) {
    res.render("home");
});

//direct to the homepage
router.get("/login", function (req, res) {
    res.render("home");
});

//direct to the homepage
router.get("/welcome", function (req, res) {
    res.render("home");
});

//direct to the homepage
router.get("/logoutSuccess", function (req, res) {
    res.render("logoutSuccess");
});

/* ------------- End Front-end interaction ------------- */

/* ------------- API functionality ------------- */

router.post("/login/", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    var options = {
        method: "POST",
        url: `https://${DOMAIN}/oauth/token`,
        headers: { "content-type": "application/json" },
        body: {
            grant_type: "password",
            username: username,
            password: password,
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
        },
        json: true,
    };
    request(options, (error, response, body) => {
        if (error) {
            res.status(500).send(error);
        } else {
            res.send(body);
        }
    });
});

router.get;

/* ------------- End API functionality ------------- */

/* ------------- Extra server setup ------------- */

app.use("/", router);

// NEW USER SIGNUP / LOGOUT functionality************************************************************************

// Configure Passport to use Auth0
var strategy = new Auth0Strategy(
    {
        domain: DOMAIN,
        clientID: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        callbackURL: pageURL + "/login2",
    },
    function (accessToken, refreshToken, extraParams, profile, done) {
        // accessToken is the token to call Auth0 API (not needed in the most cases)
        // extraParams.id_token has the JSON Web Token
        // profile has all the information from the user

        return done(null, extraParams, accessToken, profile);
    }
);

passport.use(strategy);
// You can use this section to keep a smaller payload
passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

app.use(cookieParser());

// config express-session
var sess = {
    secret: "pat secret",
    cookie: {},
    resave: false,
    saveUninitialized: true,
};

if (app.get("env") === "production") {
    // If you are using a hosting provider which uses a proxy (eg. Heroku),
    // comment in the following app.set configuration command
    //
    // Trust first proxy, to prevent "Unable to verify authorization request state."
    // errors with passport-auth0.
    // Ref: https://github.com/auth0/passport-auth0/issues/70#issuecomment-480771614
    // Ref: https://www.npmjs.com/package/express-session#cookiesecure
    // app.set('trust proxy', 1);

    sess.cookie.secure = true; // serve secure cookies, requires https
}
app.use(session(sess));

app.use(passport.initialize());
app.use(passport.session());

// Perform the login, after login Auth0 will redirect to callback
app.get(
    "/login2",
    passport.authenticate("auth0", {
        scope: "openid email profile",
    }),
    function (req, res) {
        // const email = req.query.email;

        let context = {};
        context.access_token = req.user.access_token;
        context.id_token = req.user.id_token;
        context.expires_in = req.user.expires_in;
        context.token_type = req.user.token_type;

        // //get userId via axios
        // var options = {
        //     method: "GET",
        //     url: "https://" + DOMAIN + "/api/v2/users",
        //     params: { q: "email:" + email, search_engine: "v3" },
        //     headers: { authorization: "Bearer " + MGMT_API_ACCESS_TOKEN },
        // };

        // axios
        //     .request(options)
        //     .then(function (response) {
        //         context.user_id = response.data[0].user_id;
        //         res.render("results", context);
        //         return;
        //     })
        //     .catch(function (error) {
        //         res.status(400).json(error);
        //         return;
        //     });

        res.render("results2", context);
    }
);

// Perform the final stage of authentication and redirect to previously requested URL or '/user'
app.get("/callback", function (req, res, next) {
    passport.authenticate("auth0", function (err, user, info) {
        req.logIn(user, info, function (err) {
            if (err) {
                return next(err);
            }
            res.render("/results");
        });
    })(req, res, next);
    res.render("/results");
});

// Perform session logout and redirect to homepage
app.get("/logout", (req, res) => {
    req.logout();

    const logoutURL =
        "https://" +
        DOMAIN +
        "/v2/logout?client_id=" +
        CLIENT_ID +
        "&returnTo=" +
        pageURL +
        "/logoutSuccess";

    res.redirect(logoutURL);
});

/* GET user profile. */
app.get("/user", function (req, res, next) {
    const { _raw, _json, ...userProfile } = req.user;
    res.redirect(pageURL, {
        userProfile: JSON.stringify(userProfile, null, 2),
        title: "Profile page",
    });
});

module.exports = router;

module.exports = app;
// END NEW USER SIGNUP / LOGOUT ************************************************************************
