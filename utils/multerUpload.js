const fs = require('fs');
const multer = require('multer');
const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      const path = './uploads/' + '/';
      try {
         if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
         }
      } catch (err) {
         console.log('Multer error:', err);
      }
      cb(null, path);
   },
   filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
   },
});
var multerUpload = multer({ storage: storage, limits: 10000000 });

module.exports = multerUpload;
