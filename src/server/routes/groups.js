const express = require("express");
const router = express.Router();
const Production = require("../models/Production");
const Group = require("../models/Group");

// Route: Post
// Description: Create group and add group to production
// Access: Private

router.post("/:production_id", async (req, res) => {
  try {

    //create group
    const newGroup = new Group({
      group_name: req.body.group_name
    });

    //first find the production and add group to production
    await Production.findById(req.params.production_id)
      .then(async (doc) => {
        // save group to db
        await newGroup.save();

        // add group to production
        await doc.groups.push(newGroup);
        await doc.save();
      })
      .catch(function(err) {
        console.log(err);
      });

    return res.status(200).json({ status: true, payload: newGroup });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// Route: Get
// Description: Get all groups of the production
// Access: Private

router.get("/:production_id", async (req, res,next) => {
    try {        
        Production.findById(req.params.production_id)
            .select('groups')
            .populate('groups')
            .exec((err,production)=>{
                if(err){
                    return next(err)
                }
                if(!production){
                    res.status(404).json({status:false})
                }
                //return found groups
                return res.status(200).json(production.groups)
            })

    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  });

module.exports = router;
