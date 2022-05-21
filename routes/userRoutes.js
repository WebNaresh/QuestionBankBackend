const { registerUser, loginUser, logout, forgotPassword, resetPassword, getUserDetails, updatePassword, updateProfile, createPaperset } = require("../controllers/userController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = require("express").Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logout);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/me").get(isAuthenticatedUser, getUserDetails);
router.route("/me/password/update").put(isAuthenticatedUser, updatePassword);
router.route("/me/update/profile").put(isAuthenticatedUser, updateProfile);
router.route("/paperset").post(isAuthenticatedUser, authorizeRoles("admin"), createPaperset);

module.exports = router;