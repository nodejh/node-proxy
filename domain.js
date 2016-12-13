/* eslint-disable */
var app = express();
var server = require('http').create(app);
var domain = require('domain');

// 使用 domain 来捕获大部分异常
app.use(function (req, res, next) {
    var reqDomain = domain.create();
    reqDomain.on('error', function () {
        try {
            var killTimer = setTimeout(function () {
                process.exit(1);
            }, 30000);
            killTimer.unref();

            server.close();

            res.send(500);
        } catch (e) {
            console.log('error when exit', e.stack);
        }
    });

    reqDomain.run(next);
});

// uncaughtException 避免程序崩溃
process.on('uncaughtException', function (err) {
    console.log(err);

    try {
        var killTimer = setTimeout(function () {
            process.exit(1);
        }, 30000);
        killTimer.unref();

        server.close();
    } catch (e) {
        console.log('error when exit', e.stack);
    }
});
