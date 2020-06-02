var express = require("express");
var app= express();
var bodyparser= require("body-parser");
var sanitizer= require("express-sanitizer")
var mongoose= require("mongoose");
var methodoverride= require("method-override");
mongoose.connect("mongodb://localhost/blog-app",{
	useNewUrlParser : true,
	useUnifiedTopology: true
});
app.use(bodyparser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodoverride("_method"));
app.use(sanitizer());
var blogSchema = new mongoose.Schema({
	title: String,
	img: String,
	body: String,
	created: {type: Date, Default: Date.now}
});

var blog= mongoose.model("blog", blogSchema);

/*blog.create({
	title:"test blog",
	img: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/%28_Side_view_of_Rani_Sati_temple_Jhunjhunu_%29.jpg/1200px-%28_Side_view_of_Rani_Sati_temple_Jhunjhunu_%29.jpg",
	body:"this is my first blog jai dadi ki"
});*/

//restful routes

app.get("/",function(req, res){
	res.redirect("/blogs");
})



app.get("/blogs",function(req, res){
	
	blog.find({},function(err, response){
		if(err){
			console.log("error");
		}
		else{
			console.log("fine!!");
			res.render("index",{blogs: response})
		}
	});
		
});


app.get("/blogs/new",function(req, res){
res.render("new");
});
app.post("/blogs",function(req, res){
	console.log(req.body);
	req.body.blog.body= req.sanitize(req.body.blog.body);
	console.log(req.body);
	blog.create(req.body.blog, function(err, resp){
		if(err){
			console.log("error!!");
			
		}
		else{
			console.log("WORKING!!");
			res.redirect("/blogs");
		}
	});
	
});


app.get("/blogs/:id",function(req, res){
	blog.findById(req.params.id, function(err, foundbyid){
		if(err){
			console.log("error!!");
		}
		else{
			res.render("show",{blog: foundbyid});
		}
	});
});



app.get("/blogs/:id/edit",function(req, res){
	blog.findById(req.params.id, function(err, foundbyid){
		if(err){
			console.log("ERROR!!");
		}
		else{
			console.log("EDIT FUNCTION WORKIMG!!");
			res.render("edit",{blog: foundbyid});
		}
	});
});

app.put("/blogs/:id", function(req, res){
	req.body.blog.body= req.sanitize(req.body.blog.body);
		blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedblog){
			if(err){
				res.redirect("/blogs");
			}
			else{
				res.redirect("/blogs/"+ req.params.id);
			}
		});
});
app.delete("/blogs/:id", function(req, res){
	blog.findByIdAndRemove(req.params.id, function(err){
		if(err){
			console.log("ERROR!");
		}
		else{
			res.redirect("/blogs");
		}
	});
});
app.listen(3000,function(req, res){
	console.log("SERVER IS RUNNING FINE!");
})
