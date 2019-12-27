const express = require('express');
const router = express.Router();
const Production = require('../models/Production')

// Route: Post
// Description: Create production
// Access: Private

router.post('/',async (req,res)=>{

    console.log(JSON.stringify(req.headers));

    try {
        // get all values from request
        const { title, start_date, end_date } = req.body;

        // check if production already exists based on title
        let check = await Production.findOne({title})

        if(check){
            //if production already exists, return
            return res.status(200).json({status:false,msg:'This production already exists'});
        }

        // create new production
        production = new Production({
            title: title,
            start_date: start_date,
            end_date: end_date,
            log : [`Created: ${Date.now}`]
        })

        // save production to database
        await production.save();

        // return status
        return res.status(201).json({msg:'Succesfully created a new production'})

    } catch (error){
        console.error(error.message)
        res.status(500).send('Server Error')
    }
})


// Route: Put
// Description: Change production
// Access: Private

router.put('/:id',async(req,res)=>{
    try {
        
        // code here 

    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server Error')
    }
})

// Route: Get
// Description: Get all productions
// Access: Private

router.get('/',async(req,res)=>{
    try {
        const productions = await Production.find()
        return res.status(200).json(productions)

    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server Error')        
    }
})

// Route: Put
// Description: Get production
// Access: Private

router.get('/:id',async(req,res)=>{
    try {
      const production = await Production.findOne({_id: req.params.id})
      return res.status(200).json(production)

    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server Error')
    }
})



module.exports = router;
