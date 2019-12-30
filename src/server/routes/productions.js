const express = require('express');
const router = express.Router();
const Production = require('../models/Production')
const User = require('../models/User')
const diffHistory = require('mongoose-diff-history/diffHistory');
 
// Route: Post
// Description: Create production
// Access: Private

router.post('/',async (req,res)=>{
    try {
        // get all values from request
        const { title, start_date, end_date } = req.body;

        // check if production already exists based on title
        let production = await Production.findOne({title})

        if(production){
            //if production already exists, return
            return res.status(200).json({status:false,msg:'This production already exists'});
        }
        // check if user already exists
        let user = await User.findOne({okta_id: req.user.uid})

        if(!user){
            //if user doesnt exist in app_db, create an admin user 
            user = new User({
                okta_id: req.user.uid,
                log : [`CREATED: @ ${new Date().toISOString()} by ${req.user.email}`]
            })

            // save user to database
            await user.save();
        }

        // create new production
        production = new Production({
            title: title,
            start_date: start_date,
            end_date: end_date,

            //add current user to the array of admins
            users: {admins:[user]}
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
            //find the document by id, inserts changes by req.body and returns the newly updated document from the db
        let production = await Production.findByIdAndUpdate(req.params.id,req.body,{new:true});

        if(!production){
            //if production doesn't exists, return
            return res.status(400).json({status:false,msg:'Production does not exist'});
        }

        return res.status(200).json(production)
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
        //fetch the user from the database using the okta auth uid
        const user = await User.findOne({okta_id:req.user.uid})

        //find productions that the user have access to by mongoose id
        const productions = await Production.find({$or:[{'users.admins':[user]},{'users.accounting':[user]},{'users.basics':[user]}]})
        return res.status(200).json(productions)

    } catch (error) {
        console.error(error.message)
        res.status(500).send('Server Error')        
    }
})

// Route: Get
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
