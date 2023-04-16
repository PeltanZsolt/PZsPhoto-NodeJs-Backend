const db = require('../utils/database');
const express = require('express');
const router = express.Router();
const multerUpload = require('../utils/multerUpload');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const xss = require('xss');
const jwt = require('jsonwebtoken');
const passwordValidator = require('../utils/password.validator');
const visitorsCounterMiddleware = require('../utils/visitors-counter.middleware');

const jwtSecretKey = '12e&6hga6336bxtT6bt567ugytvty09832hvg6gvvYgTVu765t';

router.post('/visitorsCount', visitorsCounterMiddleware, async (req, res) => {
   res.send({ visitorsCount: req.visitorsCount });
});

router.post('/signup', async (req, res) => {
   const newUser = {
      username: xss(req.body.username),
      password: xss(req.body.password),
      passwordVerify: xss(req.body.passwordVerify),
   };

   if (!passwordValidator(newUser.password)) {
      return res.json({ message: 'Weak password' });
   }
   if (newUser.password !== newUser.passwordVerify) {
      return res.json({ message: `Passwords doesn't match` });
   }
   let verifyExistingUser;
   try {
      verifyExistingUser = await db.query(
         `SELECT * FROM users WHERE username = ?`,
         newUser.username
      );
   } catch (error) {
      console.log('Database error: ', error.message);
      return res.send(error);
   }
   if (verifyExistingUser[0] && verifyExistingUser[0][0]) {
      return res.json({ message: 'Username already exists.' });
   }
   let newUserResponse;
   const jwtToken = jwt.sign({ username: newUser.username }, 'jwtSecretKey');
   const signupData = [
      newUser.username,
      await bcrypt.hash(newUser.password, 12),
      jwtToken,
   ];
   try {
      newUserResponse = await db.query(
         `INSERT INTO users (username, password, jwtToken) VALUES (?)`,
         [signupData]
      );
   } catch (error) {
      console.log('Database error: ', error.message);
      return res.status(500).send(error);
   }
   res.status(200).json({
      message: 'Signup successful!',
      jwtToken: jwtToken,
      isAdmin: false,
   });
});

router.post('/login', async (req, res) => {
   const user = {
      username: xss(req.body.username),
      password: xss(req.body.password),
   };
   let loginResponse;
   try {
      loginResponse = await db.query(
         `SELECT * FROM users WHERE username = (?)`,
         user.username
      );
   } catch (error) {
      return res.json({ message: error.message });
   }
   if (!loginResponse[0][0]) {
      return res.json({ message: `User doesn't exists!` });
   }
   if (!(await bcrypt.compare(user.password, loginResponse[0][0].password))) {
      return res.json({
         message: 'Incorrect password',
      });
   }
   res.json({
      message: 'Login successful',
      jwtToken: loginResponse[0][0].jwtToken,
      isAdmin: loginResponse[0][0].isAdmin,
   });
});

router.get('/category/partiallist', async (req, res) => {
   let categoriesLIstResponse;
   try {
      categoriesLIstResponse = await db.query(
         `SELECT category FROM categories WHERE EXISTS (SELECT category FROM photos WHERE categories.category = photos.category)`
         );
   } catch (error) {
      console.log('error: ', error);
      res.status(500).send({ message: 'Error during fetching categories' });
   }
   res.send(categoriesLIstResponse[0].map(el => el.category))
});

router.get('/category/fulllist', async (req, res) => {
   let categoriesLIstResponse;
   try {
      categoriesLIstResponse = await db.query(
         `SELECT category FROM categories`
         );
   } catch (error) {
      console.log('error: ', error);
      res.status(500).send({ message: 'Error during fetching categories' });
   }
   res.send(categoriesLIstResponse[0].map(el => el.category))
});

router.post('/category/update', async (req, res) => {
   const category = req.body.category;
   try {
      categoryUpdateResponse = await db.query(
         `INSERT INTO categories (category) VALUES (?)`, [category]
      );
   } catch (error) {
      console.log(error);
      res.status(500).send({ message: 'Error during creaating new category' });
   }
   res.send({success: 'Ok', message: 'Photo categories list successfully updated.'})
});

router.get('/getPhotoAttributes', async (req, res) => {
   const photoAttributes = await db.query('SELECT * FROM photos WHERE id = ?', [
      req.query.id,
   ]);
   const filePath = '/uploads/' + photoAttributes[0][0].category;
   const options = {
      root: path.join(__dirname, filePath),
   };
   res.status(200).send(photoAttributes[0]);
});

router.get('/getHeroPhotoByCategory', async (req, res) => {
   if (!req.query.category) {
      return res.send({ message: 'server error' });
   }
   let heroPhotos;
   try {
      heroPhotos = await db.query(
         `SELECT * FROM photos WHERE category = '${req.query.category}'`
      );
   } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error.message });
   }
   const filePath = '../uploads/' ;
   const options = {
      root: path.join(__dirname, filePath),
   };
   if (!heroPhotos[0][0]) {
      return res.status(200).json({ message: `No photos uploaded yet for category ${req.query.category}`});
   }
   const randomIndex = Math.round(Math.random() * (heroPhotos[0].length -1))
   const fileName = heroPhotos[0][randomIndex].filename;
   res.sendFile(fileName, options, function (err) {
      if (err) {
         () => {
            console.log('Error while sending file: ', err);
         };
      }
   });
});

router.get('/getPhotoBlob', async (req, res) => {
   const photosResponse = await db.query(
      `SELECT * FROM photos WHERE id = '${req.query.id}'`
   );
   const filePath = '../uploads/' ;
   const options = {
      root: path.join(__dirname, filePath),
   };
   const fileName = photosResponse[0][0].filename;
   console.log('file sent: ', fileName)
   res.sendFile(fileName, options, function (err) {
      if (err) {
         handleFileError(err);
      } else {
         // console.log('sent', req.query.id, fileName);
      }
      function handleFileError(err) {
         console.log('next-error: ', err);
      }
   });
});

router.get('/getPhotoListByCategory', async (req, res) => {
   console.log(req.query.category)
   const galleryList = await db.query(
      `SELECT * FROM photos WHERE category = '${req.query.category}'`
   );
   const filePath = '../uploads/' + req.query.category;
   const options = {
      root: path.join(__dirname, filePath),
   };
   res.status(200).send(galleryList[0]);
});

router.post('/upload', multerUpload.single('file'), async (req, res, next) => {
   if (req.headers.jwttoken) {
      try {
         const jwtDecoded = jwt.verify(req.headers.jwttoken, 'jwtSecretKey');
      } catch (error) {
         console.log(error);
         return res.json({ error: 'Unauthorized access' });
      }
   }
   const photoAttributes = JSON.parse(req.body.photoAttributes);
   const newPhotoAttributes = Object.values(photoAttributes).map((attribute) =>
      xss(String(attribute))
   );
   newPhotoAttributes[0] = req.file.filename; // Get randomized filename from Multer
   try {
      [imageUploadResult] = await db.query(
         `INSERT INTO photos (filename, title, category, description, year, place, viewsNr, averageRating) VALUES (?)`,
         [newPhotoAttributes]
      );
   } catch (error) {
      const path =
         '../uploads/' +
         photoAttributes.category +
         '/' +
         newPhotoAttributes.filename;
      fs.unlink(path, (error) => {
         console.log('Unlink error: ', error.code);
         res.status(500).send(error.code);
      });
      console.log('Databese error:', error);
      return res.send(error);
   }
   res.status(201).send({
      message: 'Upload successful.',
      imageUploadResult: imageUploadResult,
   });
});

router.post('/comment', async (req, res) => {
   const newComment = [];
   for (let [key, value] of Object.entries(req.body.comment)) {
      // console.log(key, value);
      newComment.push(xss(String(value)));
   }

   let commentResponse;
   try {
      commentResponse = await db.query(
         `SELECT * FROM comments WHERE photoId = ${newComment[0]}`
      );
   } catch (error) {
      console.log('error: ', error);
      return res.status(200).send({ error });
   }
   const newRatings = commentResponse[0].map((comment) => comment.rating);
   newRatings.push(Number(newComment[3]));
   const averageRating =
      newRatings.reduce((a, b) => a + b, 0) / (commentResponse[0].length + 1);
   try {
      [imageUploadResult] = await db.query(
         `UPDATE photos SET averageRating = ${averageRating} WHERE id = ${newComment[0]}`
      );
   } catch (error) {
      console.log(error.code);
      return res.send(error);
   }
   newComment.splice(4, 1);
   try {
      commentResponse = await db.query(
         `INSERT INTO comments (photoId, user, comment, rating) VALUES (?)`,
         [newComment]
      );
   } catch (error) {
      console.log('error: ', error);
      return res.status(200).send({ error });
   }
   res.status(200).send({
      commentResponse: commentResponse,
      averageRating: averageRating,
   });
});

router.get('/comment', async (req, res) => {
   const photoId = req.query.photoId.toString();
   let commentResponse;
   try {
      commentResponse = await db.query(
         `SELECT * FROM comments WHERE photoId = ${photoId}`
      );
   } catch (error) {
      console.log('error: ', error);
      return res.status(500).send({ error });
   }
   res.status(200).send(commentResponse[0]);
});

router.post('/incrementViewsNr', async (req, res) => {
   const photoId = xss(req.body.photoId);
   let viewsNrResponse;
   try {
      viewsNrResponse = await db.query(
         `UPDATE photos SET viewsNr = viewsNr + 1 WHERE id = ${photoId};
      SELECT * FROM photos WHERE id = ${photoId};`
      );
   } catch (error) {
      console.log('error: ', error);
      return res.status(500).send({ error });
   }
   res.status(200).json({ viewsNr: viewsNrResponse[0][1][0].viewsNr });
});

router.get('*', (req, res) => {
   res.json({ status: 'Backend is ready...' });
});

module.exports = router;
