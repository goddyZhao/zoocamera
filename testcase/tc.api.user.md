# tc.api.user

## # /users - POST

* it should return 400 status code when the email is not provided
* it should return 400 status code when the email is invalid
* it should return 400 status code when the password is not provided
* it should return 400 status code when the password is invalid
* it should return 409 status code when the user's email is duplicated
* it should return 201 status code and the created new user info when the both of email and password are valid
