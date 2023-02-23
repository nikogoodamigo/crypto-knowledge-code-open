function PanelRendering(app){
    app.get("/admin-panel/login-page", function(req, res){
        res.render("admin-panel/login-page");
      });
}

module.exports = {PanelRendering};

