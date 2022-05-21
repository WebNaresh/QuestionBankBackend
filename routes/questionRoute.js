const router = require("express").Router();
const { getAllQuestion, createQuestion, updateQuestion, deleteQuestion, singleQuestion, answerCheck } = require("../controllers/questionController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");


// router.route("/questions").get(isAuthenticatedUser, authorizeRoles("admin"), getAllQuestion);
router.route("/questions").get(getAllQuestion);
router.route("/admin/questions/create").post(isAuthenticatedUser, createQuestion);
router.route("/admin/questions/:id")
    .put(isAuthenticatedUser, updateQuestion)
    .delete(isAuthenticatedUser, deleteQuestion);

router.route("/questions/:id")
    .get(singleQuestion);
module.exports = router;

router.route("/questions/:id/")
    .post(answerCheck);