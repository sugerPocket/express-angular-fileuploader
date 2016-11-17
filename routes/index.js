var express = require('express');
var router = express.Router();
var multiparty = require('multiparty');
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('sample');
});

router.post('/upload', function(req, res, next) {
    var form = new multiparty.Form({ uploadDir: './uploads' });
    res.writeHead(200, { 'content-type': 'text/plain;charset=utf-8' });

    form.parse(req, function(err, fields, uploads) {
        if (err) res.end(JSON.stringify({ success: false, error: err }));
        else {
            var file = uploads.file[0];
            fs.rename(file.path, form.uploadDir + '/' + file.originalFilename, function(err) {
                var data = { success: true };
                if (err) {
                    data.error = err;
                    data.success = false;
                }

                res.end(JSON.stringify(data));
            });
        }
    });
});

module.exports = router;