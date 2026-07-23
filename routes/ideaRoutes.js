import express from "express";

const router = express.Router();

// @route     GET /api/ideas
// @desc      Get all ideas
// @access    Public
router.get('/',(req,res)=>{
    const ideas = [
        { id: 1,title: "Idea 1",description: "This is 1",createdAt: new Date()},
        { id: 2,title: "Idea 2",description: "This is 2",createdAt: new Date()},
        { id: 3,title: "Idea 3",description: "This is 3",createdAt: new Date()},
    ]
    res.status(404);
    throw new Error("Ideas not found");

    res.json(ideas);
})



// @route      POST /api/ideas
// @desc       Create a new idea
// @access     Public
router.post('/',(req,res)=>{
    const {title,description} = req.body;
    console.log(description);
    res.send(title);
})

export default router;
