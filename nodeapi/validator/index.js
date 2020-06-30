
exports.useSignupValidator = (req, res, next) => {
    //name is not null and between 4-10 charas.
    req.check("name", "Name is required").notEmpty();

    //email is not null, valid and normalize.

    req.check("email", "Email must be between 3 to 32 chars")
    .matches(/.+\@.+\..+/)
    .withMessage("Email must contain @")
    .isLength({
        min: 4,
        max:2000
    })

    //check for password
    req.check("password", "password is required").notEmpty();
    req.check('password')
    .isLength({min:6})
    .withMessage("Password must contain at least 6 characters")
    .matches(/\d/)
    .withMessage("Password must contain a number")

    //check for errors
    const errors = req.validationErrors()

    //if error show the first one as they happen
    if (errors) {
        const firstError = errors.map((error) => error.msg)[0];
        return res.status(400).json({ error: firstError })
    }

    //proceed to nest middleware
    next();
}