var fs = require("fs");
var path = require("path");
var mjml2html = require("mjml");
var mjmlFolder = path.join(__dirname, '../src/mail/mjml');
 fs.readdir(mjmlFolder, function (err, files) {
    var hbs, fileContent;
    files.forEach(function (file) {
        fileContent = fs.readFileSync(path.join(__dirname, '../src/mail/mjml', file));
        fileContent = mjml2html(fileContent.toString());
        hbs = path.join(__dirname, '../src/mail/templates/' + file.replace('.mjml', '.hbs'));
         fs.writeFileSync(hbs, fileContent.html);
    });
});
