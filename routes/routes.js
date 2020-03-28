const userCtrl = require("./../app/controllers/user");
const authService = require("./../services/auth");

const appRouter = (router) => {

    router.get("/", (req, res) => {
        res.json({ message: "Welcome to our RestFull API!" });   
    });
  	router.post("/authenticate", userCtrl.authenticate);
    router.use(authService.valideToken);
    router.route("/users")
        .get(userCtrl.getUsers);
    router.post("/user",userCtrl.create);
    router.route("/user/:userId")
        .put(userCtrl.updateUser);
    router.route("/user/:userId")
        .delete(userCtrl.deleteUser);
};

module.exports = appRouter;