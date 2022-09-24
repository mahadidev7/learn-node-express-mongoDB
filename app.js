const express = require('express')
const fs = require('fs')
const { rawListeners } = require('process')
const app = express()
const port = process.env.PORT || 5000
app.use(express.json())

// ==========Demo start========
// app.get('/', (_req, res)=> {
//     res
//     .status(200)
//     .json({massage: "Hello express js", app: "Natours"})
// })

// app.post("/", (_req, res)=>{
//     res.send("I have sended a POST METHORD")
// })
// ==========Demo end========

// collect all blogs data
const blogs = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/blogs.json`)
);

const getAllBlogs =  (_req, res)=>{
    res.status(200).json({
        status: 'success',
        result: blogs.length,
        data : {
            blogs
        }
    })
};

const createBlog = (req, res)=>{
    const newID = blogs[blogs.length - 1].id + 1
    const newBlog = Object.assign({id: newID}, req.body)

    blogs.push(newBlog)

    fs.writeFile(
        `${__dirname}/dev-data/data/blogs.json`,
        JSON.stringify(blogs),
        err=>{
            res.status(201).json({
                status: 'success',
                data : {
                    blogs: newBlog
                }
            })
        }
    )

}

const getblog = (req, res)=>{
    const param_ID = req.params.id * 1;
    const blog = blogs.find(blog => blog.id === param_ID)

    // if(param_ID > blog.length)
    if(!blog){
       return res.status(404).json({
        status: "failed",
        message: "Invalid ID"
       }) 
    }
    res.status(200).json({
        status: "success",
        data: {
            blog
        }
    })
}

const updateBlog = (req, res)=>{
    const blog = blogs.find(el=> el.id === req.params.id * 1)

    if(!blog){
        return res.status(404).json({
            status: "failed",
            message: "Invalid ID"
        })
    }

    res.status(200).json({
        status: "success",
        data: {
            blog
        }
    })
}

const deleteBlog = (req, res)=>{
    
    if(req.params.id * 1 > blogs.length){
        return res.status(404).json({
            status: "failed",
            message: "Invalid delete ID"
        });
    }

    res.status(204).json({
        status: "success",
        data: null
    });
}

// get all blogs 
app.get('/api/v1/blogs', getAllBlogs)

//post/ADD blog 
app.post('/api/v1/blogs', createBlog)

// get single blog by params
app.get('/api/v1/blogs/:id', getblog)

// patch - update data
app.patch('/api/v1/blogs/:id', updateBlog)

//delete single data
app.delete('/api/v1/blogs/:id', deleteBlog);

// createed server
app.listen(port, ()=>{
    console.log(`app running on port ${port}.`)
})
