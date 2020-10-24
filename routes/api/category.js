const express = require('express');
const Category = require('../../models/category');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const auth = require('../../middleaware/auth')
const MSGS = require('../../messages')


// @route    GET /category/:id
// @desc     DETAIL category
// @access   Public
router.get('/:id', async (req, res, next) => {
    try {
        const id = req.params.id
        const category = await Category.findOne({_id : id})
        if(category){
            res.json(category)
        }else{
            res.status(404).send({ "error": MSGS.CATEGORY404 }) 
        }
    } catch (err) {
      console.error(err.message)
      res.status(500).send({ "error": MSGS.GENERIC_ERROR })
    }
})


// @route    PATCH /category/:id
// @desc     PARTIAL UPDATE category
// @access   Private
router.patch('/:id',auth, async (req, res, next) => {
  try {
      const category = await Category.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
      if(category){
          res.json(category)
      }else{
          res.status(404).send({ "error": MSGS.CATEGORY404 }) 
      }
  } catch (err) {
    console.error(err.message)
    res.status(500).send({ "error": MSGS.GENERIC_ERROR })
  }
})

// @route    DELETE /category/:id
// @desc     DELETE category
// @access   Private
router.delete('/:id',auth, async (req, res, next) => {
  try {
      const id = req.params.id
      const category = await Category.findOneAndDelete({_id : id})
      if(category){
          res.json(category)
      }else{
          res.status(404).send({ "error": MSGS.CATEGORY404 }) 
      }
  } catch (err) {
    console.error(err.message)
    res.status(500).send({ "error": MSGS.GENERIC_ERROR })
  }
})


// @route    GET /category
// @desc     LIST category
// @access   Public
router.get('/', async (req, res, next) => {
    try {
      const category = await Category.find({})
      res.json(category)
    } catch (err) {
      console.error(err.message)
      res.status(500).send({ "error": MSGS.GENERIC_ERROR })
    }
  })
  

// @route    POST /category
// @desc     CREATE category
// @access   Private
router.post('/',auth, [
    check('name').not().isEmpty(),check('icon').not().isEmpty()
  ], async (req, res, next) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      } else {
        let { name, icon } = req.body
        console.log(req.body)
        let category = new Category({ name, icon })
        await category.save()
        if (category.id) {
          res.json(category);
        }
      }
    } catch (err) {
      console.error(err.message)
      res.status(500).send({ "error": MSGS.GENERIC_ERROR })
    }
  })


module.exports = router;