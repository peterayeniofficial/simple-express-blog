const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const expressSanitizer = require('express-sanitizer')
const mongoose = require('mongoose')

// App config
mongoose.connect('mongodb://localhost/express_blog')
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(expressSanitizer())
app.use(methodOverride("_method"))

// Database Schema
const blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
})

const Blog = mongoose.model('Blog', blogSchema)
/* const createAnewBlog = {
    title: "USAID Development Innovation Venture",
    image: "https://i0.wp.com/www.mbeleacademy.org/wp-content/uploads/2018/09/HSI-3.jpg",
    body: "USAID is accepting new applications for the Development Innovation Ventures Program. The Development Innovation Ventures (DIV) is USAID’s open innovation program that tests and scales creative solutions to any global development challenge. By investing in breakthrough innovations driven by rigorous evidence, USAID impacts millions of lives at a fraction of the usual cost."
}
Blog.create(createAnewBlog, (err, newBlogCreated) => {
    if(err){
        console.log(err)
    }else{
        console.log(newBlogCreated)
    }
}) */
// Restful Routes

app.get('/', (req, res) => {
    res.redirect('/blogs')
})

app.get('/blogs', (req, res) => {
    Blog.find({}, (err, blogs) => {
        if(err){
            console.log("Error")
        }else {
            res.render('index', {blogs: blogs})
        }
    })
})

app.get('/blogs/new', (req, res) => {
    res.render('new')
})

app.post('/blogs', (req, res) => {
    req.body.blog.body = req.sanitizer(req.body.blog.body)
    Blog.create(req.body.blog, (err, newBlog) => {
        if(err){
            res.render('new')
        }else {
            res.redirect('/')
        }
    })
})
  
app.get('/blogs/:id', (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if(err){
            res.redirect('/blogs')
        }else{
            res.render("show", {blog: foundBlog})
        }
    })
})

app.get("/blogs/:id/edit", (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if(err){
           res.redirect('/blogs') 
        }else {
            res.render('edit', {blog: foundBlog})
        }
    })
})

app.put('/blogs/:id', (req, res) => {
    req.body.blog.body = req.sanitizer(req.body.blog.body)
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
        if(err){
            res.redirect("/blogs")
        }else {
            res.redirect('/blogs/' + req.params.id)
        }
    })
})

app.delete('/blogs/:id', (req, res) => {
    Blog.findByIdAndRemove(req.params.id, (err) => {
        if(err){
            res.redirect('/')
        }else{
            res.redirect('/')
        }
    })
})

app.listen(9001, () => {
    console.log('Blog Server started')
})