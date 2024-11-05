/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const mongoose = require('mongoose');
mongoose.connect(process.env.DB);

// Create Book Schema and Model
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  comments: [String],
  commentcount: { type: Number, default: 0 }
});

const Book = mongoose.model('Book', bookSchema);

module.exports = function (app) {
  app.route('/api/books')
    .get(async function (req, res) {
      try {
        const books = await Book.find({});
        res.json(books);
      } catch (err) {
        res.status(500).send('Error fetching books');
      }
    })
    
    .post(async function (req, res) {
      const title = req.body.title;
      if (!title) {
        return res.send('missing required field title');
      }
      
      try {
        const newBook = await Book.create({ title });
        res.json({ _id: newBook._id, title: newBook.title });
      } catch (err) {
        res.status(500).send('Error saving book');
      }
    })
    
    .delete(async function(req, res) {
      try {
        await Book.deleteMany({});
        res.send('complete delete successful');
      } catch (err) {
        res.status(500).send('Error deleting books');
      }
    });

  app.route('/api/books/:id')
    .get(async function (req, res) {
      try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.send('no book exists');
        res.json(book);
      } catch (err) {
        res.send('no book exists');
      }
    })
    
    .post(async function(req, res) {
      const comment = req.body.comment;
      if (!comment) {
        return res.send('missing required field comment');
      }
      
      try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.send('no book exists');
        
        book.comments.push(comment);
        book.commentcount = book.comments.length;
        await book.save();
        res.json(book);
      } catch (err) {
        res.send('no book exists');
      }
    })
    
    .delete(async function(req, res) {
      try {
        const result = await Book.findByIdAndDelete(req.params.id);
        if (!result) return res.send('no book exists');
        res.send('delete successful');
      } catch (err) {
        res.send('no book exists');
      }
    });
};
