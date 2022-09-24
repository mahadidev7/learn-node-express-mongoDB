const express = require('express')
const fs = require('fs')
const app = express()
const port = 5000
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

const blogs = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/blogs.json`)
);

// get all blogs 
app.get('/api/v1/blogs', (_req, res)=>{
    res.status(200).json({
        status: 'success',
        result: blogs.length,
        data : {
            blogs
        }
    })
})

//post/ADD blog 
app.post('/api/v1/blogs', (req, res)=>{
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

})

// get single blog by params
app.get('/api/v1/blogs/:id', (req, res)=>{
    const param_ID = req.params.id * 1;
    const blog = blogs.find(blog => blog.id === param_ID)

    if(!blog){
       return res.status(404).json({
        status: "failed",
        message: "Invalid ID"
       }) 
    }
    res.status(200).json({
        status: "success",
        data: blog
    })
})

app.listen(port, ()=>{
    console.log(`app running on port ${port}.`)
})
