const router = require("express").Router();
const { createQuestionSet, findUserQuestionSet, findUserQuestionSet_code, findQuestionSet } = require("../controllers/questionSetController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");


router.route("/questionSet/create").post(isAuthenticatedUser, authorizeRoles("admin"), createQuestionSet);
router.route("/questionSet/user/questionSet").get(findUserQuestionSet);
// router.route("/questionSet/user/questionSet").get(isAuthenticatedUser, authorizeRoles("admin"), findUserQuestionSet);
router.route("/questionSet/user/:id").get(findUserQuestionSet_code);
router.route("/questionSet/:id").get(findQuestionSet);


module.exports = router;