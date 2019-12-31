const express = require('express');
const router = express.Router();
const Production = require('../models/Production')
 
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

        // create new production
        production = new Production({
            title: title,
            start_date: start_date,
            end_date: end_date,

            //add current user to the array of admins
            users: {admins:[req.user.uid]},

            //log creation (not provided by mongoose-diff-history)
            createdAt : {
                date : new Date(),
                user : `${req.user.email}`
            }
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
        let production = await Production.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true,
            __user: req.user.email,
            __reason: req.body.reason
        });

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
// Description: Get all active productions (isArchived == false)
// Access: Private

router.get('/',async(req,res)=>{
    try {
        //find productions that the user have access to by mongoose id and that is not archived
        const productions = await Production.find({isArchived:false,$or:[{'users.admins':[req.user.uid]},{'users.accounting':[req.user.uid]},{'users.basics':[req.user.uid]}]})
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
