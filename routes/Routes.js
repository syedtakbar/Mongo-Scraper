const Comments = require("../models/comment"); 
const Articles = require("../models/article"); 
const ArticleScraper = require("./ArticleScraper"); 

module.exports= function(app) {    
    app.get("/", function (req, res) {
        Articles.find({}, function (err, doc) {
            if (err) return handleError(err);                
            const hbsObject = {articles: doc, title: "Home"};                
            res.render("home", hbsObject);
        });
    });


    app.get("/scraped", function (req, res) {
        Articles.find({}, function (err, doc) {
            if (err) return handleError(err);                
            const hbsObject = {articles: doc};                
            res.render("srape", hbsObject);
        });
    }); 


    app.get("/cleared", function (req, res) {
        Articles.find({}, function (err, doc) {
            if (err) return handleError(err);                
            const hbsObject = {articles: doc};                
            res.render("clear", hbsObject);
        });
    });  

    
    app.get("/scrape", function (req, res) {

            ArticleScraper.scrape(function(){
                    res.redirect("/scraped");
                },
                process.env.SCRAPED_SITE,
                process.env.SCRAPED_ELEMENT);
    });


    app.get("/save/:id", function (req, res) {        
        const id = req.params.id; 
        Articles.findById(id, function (err, articles) {
            if (err) return handleError(err);
            articles.saved = true;
            articles.save(function (err) {
                if (err) return handleError(err);                
            });
        });
    });

    
    app.get("/saved", function (req, res) {
        Articles.find({saved:true}, function (err, doc) {
            if (err) return handleError (err);
                const hbsObject = {articles: doc, title: "Saved"};
                res.render("saved", hbsObject);
        });
    });
    
    app.get("/delete/:id", function (req, res) {
        const id = req.params.id;                 
        Articles.findById(id, function (err, articles) {  
            articles.saved = false;                      
            articles.save(function (err) {
                if (err) return handleError(err);                  
                res.redirect("/"); 
            });
        });
    });

    
    app.get("/comments/:id", function (req, res) {        
        Articles.findOne({_id: req.params.id})      
            .populate("comments")  
            .exec(function (error, doc) { 
                if (error) console.log(error);
                else {
                    //console.log(doc);
                    res.json(doc);
                }
            });
    });

    
    app.post("/comments/:id", function (req, res) {        
        const newComment = new Comments(req.body);        
        newComment.save(function (err, doc) {            
            if (err) console.log(err);                       
            Articles.findOneAndUpdate(
                {_id: req.params.id}, 
                {$push: {comments: doc._id}}, 
                {new: true},
                function(err, articledoc){
                    if (err) return handleError(err);
                    res.send(articledoc);
            });
        });
    });

    
    app.get("/deleteComment/:id", function(req, res){
        console.log("deleting item: " + req.params.id);
        Comments.findOneAndDelete({_id: req.params.id}, 
            function(err, data){
            if(err) console.log(err);
            //console.log(data);
            res.redirect("/"); 
        });
    });

    app.get('/clear', function(req, res){
        Articles.deleteMany({}, function(err, newdoc){
            if(err) console.log(err);
            res.redirect("/cleared"); 
        });
    });

}; 