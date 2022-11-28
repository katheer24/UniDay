let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

let Journal = require('../models/uniday');

// Read Operation 

router.get('/', (req,res,next)=>{
    Journal.find((err,journallist)=>{
        if(err)
        {
            return console.error(err);
        }
        else
        {
            res.render('uniday/list',{
                title:'Journal Entries', 
                Journallist: journallist
            })
        }
    
    });
});

// Add Operation
router.get('/add', (req,res,next)=>{
    res.render('uniday/add',{title:'Add a post'})
});
//post operation for displaying add operation
router.post('/add', (req,res,next)=> {
    let newItem = Journal ({
        "date":req.body.date,
        "description":req.body.description,
    });
    Journal.create(newItem,(err,Journal) => {
        if(err)
        {
            console.log(err);
            res.end(err);
        }
        else
        {
            res.redirect('/uni-day');
        }
    });

});

// Edit Operation
router.get('/edit/:id', (req,res,next)=>{
    let id = req.params.id;
    Journal.findById(id,(err,journalToEdit) =>{
        if(err)
        {
            console.log(err);
            res.end(err);
        }
        else
        {
            res.render('uniday/edit',{title:'Edit your post', journal:journalToEdit})
        }
    });
});
//post operation for displaying edit operation
router.post('/edit/:id', (req,res,next)=>{
    let id=req.params.id;
    let updateJournal = Journal({
        "_id":id,
        "date":req.body.date,
        "description":req.body.description,
    });
    Journal.updateOne({_id:id},updateJournal,(err) =>{
        if(err)
        {
            console.log(err);
            res.end(err);
        }
        else
        {
            res.redirect('/uni-day');
        }

    })
});

// delete Operation
router.get('/delete/:id', (req,res,next)=>{
    let id = req.params.id;
    Journal.deleteOne({_id:id},(err)=>{
        if(err)
        {
            console.log(err);
            res.end(err);
        }
        else
        {
            res.redirect('/uni-day/');
        }
    })
});


module.exports=router;