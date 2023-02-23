const express = require("express");
const https = require("https");
const ejs = require("ejs");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/cryptoDB", {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

const overviewSchema = {
  name: String,
  description: String,
  logo: String
};

const Overview = mongoose.model("Overview", overviewSchema);

const articleSchema = {
  name: String,
  date: String,
  photo: String,
  content: String,
  author: String
};

const Article = mongoose.model("Article", articleSchema);

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));

app.get("/", function(req, res){
  res.render("home");
});

app.get("/news", function(req, res){
  Article.find({}, function(err, articles){
    res.render("news", {
      articles: articles,
    });
  });
});

app.get("/cryptos", function(req, res){
  Overview.find({}, function(err, overviews){
    res.render("cryptos", {
      overviews: overviews
    })
  });
});

app.get("/prices", function(req, res){
  res.render("prices");
});

app.get("/overview/:overviewId", function(req, res){
  const requestedOverviewId = req.params.overviewId;

  Overview.findOne({_id: requestedOverviewId}, function(err, overview){
    res.render("overview",{
      name: overview.name,
      logo: overview.logo,
      description: overview.description
    });
    console.log(overview.logo);
  });
});

app.get("/panel", function(req, res){
  var i = 0;
  var k = 0;

  Overview.find({}, function(err,overviews){
    Article.find({}, function(err, articles){

      overviews.forEach(function(overview){
        return i++;
      });

      articles.forEach(function(article){
        return k++;
      });

      res.render("panel", {
        numberOfCryptos: i,
        numberOfArticles: k
      });

    });
  });
});

app.get("/panel-crypto", function(req, res){
  Overview.find({}, function(err, overviews){
    res.render("panel-crypto", {
      overviews: overviews
    })
  });
});

app.get("/panel-news", function(req, res){
  Article.find({}, function(err, articles){
    res.render("panel-news", {
      articles: articles
    })
  });
});

app.get("/compose-crypto", function(req, res){
  res.render("compose-crypto");
});

app.post("/compose-crypto", function(req, res) {

  const cryptoName = req.body.cryptoName;
  const cryptoDescription = req.body.cryptoDescription;
  const cryptoLogo = req.body.cryptoLogo;

  const overview = new Overview({
    name: cryptoName,
    description: cryptoDescription,
    logo: cryptoLogo
  });

  overview.save(function(err){
    if (!err) {
      res.redirect("/panel-crypto");
    };
  });

});

app.get("/update/:overviewId", function(req, res){
  const requestedOverviewId = req.params.overviewId;

  Overview.findOne({_id: requestedOverviewId}, function(err, overview){
    res.render("update", {
      name: overview.name,
      description: overview.description,
      logo: overview.logo,
      _id: overview._id
    });
  });
});

app.post("/update", function(req, res){
  const cryptoName = req.body.cryptoName;
  const cryptoDescription = req.body.cryptoDescription;
  const cryptoLogo = req.body.cryptoLogo;
  const requestedOverviewId = req.body.cryptoId;

  Overview.updateOne({_id: requestedOverviewId}, { $set: {name: cryptoName, description: cryptoDescription, logo: cryptoLogo}}, function(err){
    if(!err){
      console.log(requestedOverviewId + " updated");
      res.redirect("/panel-crypto");
    }
  });
});

app.post("/delete-crypto", function(req, res){
  const deletedItemId= req.body.button;
  console.log(deletedItemId);

  Overview.deleteOne({_id: deletedItemId}, function(err){
      if(err){
        console.log(err);
      }
      else{
        console.log("Successfully deleted");
        res.redirect("/panel-crypto");
      }
    });
});

app.get("/compose-news", function(req, res){
  res.render("compose-news");
});

app.post("/compose-news", function(req, res) {

  const articleAuthor = req.body.articleAuthor;
  const articleName = req.body.articleName;
  const articleContent = req.body.articleContent;
  const articlePhoto = req.body.articlePhoto;
  const articleDate = req.body.articleDate;

  const article = new Article({
    name: articleName,
    date: articleDate,
    photo: articlePhoto,
    content: articleContent,
    author: articleAuthor
  });

  article.save(function(err){
    if (!err) {
      res.redirect("/panel-news");
    };
  });

});

app.get("/update-news/:articleId", function(req, res){
  const requestedArticleId = req.params.articleId;

  Article.findOne({_id: requestedArticleId}, function(err, article){
    res.render("update-news", {
      author: article.author,
      name: article.name,
      content: article.content,
      photo: article.photo,
      date: article.date,
      _id: article._id
    });
  });
});

app.post("/update-news", function(req, res){
  const articleName = req.body.articleName;
  const articleContent = req.body.articleContent;
  const articlePhoto = req.body.articlePhoto;
  const articleDate = req.body.articleDate;
  const articleAuthor = req.body.articleAuthor;
  const requestedArticleId = req.body.articleId;

  Article.updateOne({_id: requestedArticleId}, { $set: {name: articleName, content: articleContent, photo: articlePhoto, date: articleDate, author: articleAuthor}}, function(err){
    if(!err){
      console.log(requestedArticleId + " updated");
      res.redirect("panel-news");
    }
  });
});


app.post("/delete-news", function(req, res){
  const deletedItemId= req.body.button;
  console.log(deletedItemId);

  Article.deleteOne({_id: deletedItemId}, function(err){
      if(err){
        console.log(err);
      }
      else{
        console.log("Successfully deleted");
        res.redirect("/panel-news");
      }
    });
});



app.listen(process.env.PORT || 3000, function(){
  console.log("Server is running on port 3000");
});
