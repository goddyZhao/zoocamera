# tc.api.auth

## # /login - POST

* it should fail when the email is not provided
* it should fail when the email is not correct
* it should fail when the password is not provided
* it should fail when the password is not correct
* it should fail when the user with provided email and password does not exist
* it should success and return the login user when the user with provided email and password exists