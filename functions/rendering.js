function Rendering(app){

    app.get("/", function(req, res){
        res.render("home");
      });

    app.get("/prices", function(req, res){
        res.render("prices");
      });

    app.get("/login-page", function(req, res){
        res.render("admin-panel/login-page");
      });

    app.get("/compose-crypto", function(req, res){
        res.render("compose-crypto");
      });
    
    app.get("/compose-news", function(req, res){
        res.render("compose-news");
      });
}

module.exports = {Rendering};