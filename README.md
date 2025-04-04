# LearnSphere:An Online Learning Platform for Students (MERN Fullstack Project) 🚀  
  

Enable Users to learn and teach online by uploading recorded videos and PDF notes. This project is built using the MERN stack (MongoDB, Express.js, React, Node.js) and utilizes various technologies and libraries to provide a seamless learning experience.  🚀 📚 🎓 💻 🌐

## Table of Contents 📝

1. Features
2. getting started
   a. technologies/tools used

b. Prerequisites to be installed in the machine.

3.  Setup instructions and installation of packages.

4.  API Usage and Endpoints

5.  Models Used in the Project

6.  Dependencies Usage


## 1.Features 🌟

- User Authentication and Authorization using JWT.

- Instructors can upload courses comprised of modules and lesson structure with videos and PDF notes.

- Students Can view and enroll all courses available on the platform.

- Once Enrolled,students have options to rate the courses and Leave Comment(Thoughts/Suggestions).

- Once started watching Notes/Videos  they can update it as lesson Completed.This  will be reflected in the progress bar.

- Students can view their progress and completed courses.

- Students are having Both Free and Paid Course to enroll.For confirmation of Enrollment,they can check in the enrolled Courses page and track the progress of it.

- Students can view their progress and completed courses.

- Instructors can View their Courses and total learners who enrolled in it.

- Middlewares are used to protect routes for instructors and Students.

- Stripe Payment gateway is Added to process payments for Paid Courses.

- Used JOI for validation of data.


## Project Structure 📂

```
client
  public
 ┗ vite.svg
 src
 ┣ assets
 ┃ ┗ assets
 ┃ ┃ ┣ accenture_logo.svg
 ┃ ┃ ┣ add_icon.svg
 ┃ ┃ ┣ adobe_logo.svg
 ┃ ┃ ┣ appointments_icon.svg
 ┃ ┃ ┣ arrow_icon.svg
 ┃ ┃ ┣ assets.js
 ┃ ┃ ┣ blue_tick_icon.svg
 ┃ ┃ ┣ course_1.png
 ┃ ┃ ┣ course_2.png
 ┃ ┃ ┣ course_3.png
 ┃ ┃ ┣ course_4.png
 ┃ ┃ ┣ cross_icon.svg
 ┃ ┃ ┣ down_arrow_icon.svg
 ┃ ┃ ┣ dropdown_icon.svg
 ┃ ┃ ┣ earning_icon.svg
 ┃ ┃ ┣ email_icon.svg
 ┃ ┃ ┣ facebook_icon.svg
 ┃ ┃ ┣ favicon.svg
 ┃ ┃ ┣ file_upload_icon.svg
 ┃ ┃ ┣ google-icon.svg
 ┃ ┃ ┣ home_icon.svg
 ┃ ┃ ┣ instagram_icon.svg
 ┃ ┃ ┣ lesson_icon.svg
 ┃ ┃ ┣ lesson_upload_icon.svg
 ┃ ┃ ┣ lock_icon.svg
 ┃ ┃ ┣ logo.svg
 ┃ ┃ ┣ logout_icon.svg
 ┃ ┃ ┣ logo_dark.svg
 ┃ ┃ ┣ microsoft_logo.svg
 ┃ ┃ ┣ my_course_icon.svg
 ┃ ┃ ┣ patients_icon.svg
 ┃ ┃ ┣ paypal_logo.svg
 ┃ ┃ ┣ pdf_icon.svg
 ┃ ┃ ┣ person_tick_icon.svg
 ┃ ┃ ┣ play_icon.svg
 ┃ ┃ ┣ profile_img.png
 ┃ ┃ ┣ profile_img2.png
 ┃ ┃ ┣ profile_img3.png
 ┃ ┃ ┣ profile_img_1.png
 ┃ ┃ ┣ profile_img_2.png
 ┃ ┃ ┣ profile_img_3.png
 ┃ ┃ ┣ quiz_icon.svg
 ┃ ┃ ┣ rating_star.svg
 ┃ ┃ ┣ react.svg
 ┃ ┃ ┣ rich-text-css.txt
 ┃ ┃ ┣ search_icon.svg
 ┃ ┃ ┣ sktech.svg
 ┃ ┃ ┣ star_dull_icon.svg
 ┃ ┃ ┣ time_clock_icon.svg
 ┃ ┃ ┣ time_left_clock_icon.svg
 ┃ ┃ ┣ twitter_icon.svg
 ┃ ┃ ┣ upload_area.svg
 ┃ ┃ ┣ user_icon.svg
 ┃ ┃ ┣ user_icon_2.svg
 ┃ ┃ ┣ user_profile_icon.svg
 ┃ ┃ ┣ video_icon.svg
 ┃ ┃ ┗ walmart_logo.svg
 ┣ Components
 ┃ ┣ Instructor
 ┃ ┃ ┣ ContentStats.jsx
 ┃ ┃ ┣ Navbar.jsx
 ┃ ┃ ┗ SideMenu.jsx
 ┃ ┗ Student
 ┃ ┃ ┣ CallToAction.jsx
 ┃ ┃ ┣ Companies.jsx
 ┃ ┃ ┣ CourseCard.jsx
 ┃ ┃ ┣ CourseSection.jsx
 ┃ ┃ ┣ Footer.jsx
 ┃ ┃ ┣ Hero.jsx
 ┃ ┃ ┣ Loading.jsx
 ┃ ┃ ┣ Navbar.jsx
 ┃ ┃ ┣ PdfViewer.jsx
 ┃ ┃ ┣ Rating.jsx
 ┃ ┃ ┗ SearchBar.jsx
 ┣ context
 ┃ ┣ auth-context
 ┃ ┃ ┗ index.jsx
 ┃ ┗ AppContext.jsx
 ┣ Pages
 ┃ ┣ Auth
 ┃ ┃ ┣ index.jsx
 ┃ ┃ ┗ Logout.jsx
 ┃ ┣ Instructor
 ┃ ┃ ┣ AddCourse.jsx
 ┃ ┃ ┣ Dashboard.jsx
 ┃ ┃ ┣ Instructor.jsx
 ┃ ┃ ┗ InstructorProfile.jsx
 ┃ ┣ Student
 ┃ ┃ ┣ CourseDetails.jsx
 ┃ ┃ ┣ CourseList.jsx
 ┃ ┃ ┣ Home.jsx
 ┃ ┃ ┣ MyEnrollments.jsx
 ┃ ┃ ┣ Player.jsx
 ┃ ┃ ┗ VerifyPayment.jsx
 ┃ ┗ ProtectedComponent.jsx
 ┣ App.jsx
 ┣ index.css
 ┗ main.jsx
 ┣ .env
 ┗ package.json

 # Backend Project Structure

 Server
 Config
 ┣ Cloudinary.js
 ┣ DbConfig.js
 ┣ Multer.js
 ┣ MUXConfig.js
 ┗ S3Config.js
 Controllers
 ┣ Students
 ┃ ┣ CourseController.js
 ┃ ┗ StudentController.js
 ┣ InstructorController.js
 ┗ UserController.js
 Middlewares
 ┣ InstructorAccess.js
 ┣ StudentAccess.js
 ┣ tokenExpire.js
 ┣ validateToken.js
 ┗ Validations.js
 Models
 ┣ Blacklist.js
 ┣ Course.js
 ┣ CourseProgress.js
 ┣ Payment.js
 ┗ User.js
 Routes
 ┣ authRoutes.js
 ┣ CourseRoutes.js
 ┣ index.js
 ┣ InstructorRoutes.js
 ┗ StudentRoutes.js
 Services
 ┗ SignedURL.js
 Utils
 ┗ CommonServerError.js
 ┣ app.js
 ┣ package.json
 ┣ package-lock.json
 ┣ README.md
 ┣ .env

 ```

 # Frontend Project Structure  
 
 -  assets - Contains images,icons and svg's required for the project.
 -  components - Contains all the reusable components used in the project like Navbar,Footer,CourseCard maintaining folders for  Instructor and students etc.

 - Context - Contains the context provider for the application One is AuthContext and other is AppContext.
 - Pages - Contains all the pages of the application.
 - App.jsx - Contains the main component of the application.
 - index.css - Contains the global styles of the application.
 - main.jsx - Contains the main component of the application.
 - .env - Contains the environment variables of the application.
 - package.json
 - package-lock.json
 
 # Backend Project Structure

 - Config - Contains the configuration files for the application like database connection, cloudinary, multer, mux, s3 etc.
 - Controllers - Contains the controllers for the application, like user, instructor, student, course etc.
 - Middlewares - Contains the middlewares for the application, like authentication, authorization, validation etc.
 - Models - Contains the models for the application, like User, Payment, CourseProgress, course and BlackList etc.
 - Routes - Contains the routes for the application, like auth, Instructor, Student, Course and prefix Route as Index Routes which controls the routes.
 - Services - Contains the services for the application, like SignedURL.js which is used to generate the signed url for the uploaded files.
 - Utils - Contains the common server error handler.
 - app.js - Contains the main file of the application.
 - package.json - Contains the dependencies of the application.
 - package-lock.json
 - README.md - Contains the documentation of the application.
 - .env - Contains the environment variables of the application.

## 2.Getting Started  

### a.Technologies/tools Used

***********************Frontend Technologies***********************

1. **React.js using Vite** - A frontend framework for building user interfaces.
2. **Quill** - A powerful WYSIWYG editor for creating rich text content.
3. **React-Quill** - A React component for integrating Quill into React applications.
4. **React-Router-Dom** - A library for handling routing in React applications.
5. **axios** - A library for making HTTP requests to the backend API.
6. **React-Toastify** - A library for displaying toast notifications in the application.
7. **React-Player** - A library for playing videos of amazon S3 Objcet URL in the application.
8. **rc-progress** - A library for displaying progress bars in the application.
9. **Humanize** - A library for converting timestamps to human-readable formats.
10. **uniqId** - A library for generating unique IDs.

************************Backend Technologies*************************
1. **Node.js** - A JavaScript runtime for building server-side applications.
2. **Express.js** - A web application framework for Node.js.
3. **MongoDB** - A NoSQL database for storing application data.
4. **Mongoose** - An Object Data Modeling (ODM) library for MongoDB.
5. **Bcrypt** - A library for hashing and salting passwords.
6. **JsonWeb** - A library for generating and verifying JSON Web Tokens (JWT).
7. **Multer** - A middleware for handling file uploads.
8. **Cloudinary** - A cloud-based image and video management service.
9. **Stripe** - A payment processing platform for handling online payments.
10. **aws-sdk** - A library for interacting with AWS services.
11. **dotenv** - A library for loading environment variables from a .env file.
12. **Joi** - A library for validating and sanitizing user input.
13. **helmet** - A library for securing HTTP headers in Express applications.
14. **multer-s3** - A middleware for uploading files to Amazon S3.
15. **s3-request-presigner** - A library for generating presigned URLs for S3 objects.
16. **cors** - A middleware for enabling Cross-Origin Resource Sharing (CORS).


---

### b.Prerequisites to be installed in the machine. 📦

- Make sure your Node.js version to be installed more than 18, not below versions.
- Make sure to install React version to be more than 18, not below versions.
- npm Command Line Interface (CLI) which comes under node to install the required packages.
- Make use of MongoDB Atlas Cloud, for storing the data.
- Make use of Stripe for payment gateway.
- Make use of AWS S3 for storing the Video and Pdf files.
- Make use of Cloudinary for storing the Image files.

---

## 3.Setup instructions and installation of packages. 🔧

_Step1_: Create the repository in the github and link to your machine with your specific drive.

- Git init https://github.com/pavankumar-ui/LearnSphere.git

the above command will create the repository in the github and link to your machine with your specific drive.

_Step 2_ : Navigate to the Project Directory.

- Type `cd LearnSphere` in the terminal.

_Step 3_ : Install the required packages in your terminal.

- Type `npm install` in the terminal.
      if any dependencies are missing, then install them using `npm install <package_name>`

_Step 4_ : Now in the package.json file, add the following script:

- `"dev": "nodemon app.js"` in the scripts object present in package.json file in Server folder.
- ``"dev": "vite"` in the scripts object present in package.json file in Client folder.

_Step 5_ : Now run the following command in the terminal to start the server and client.
- `npm run dev` in the terminal.

_Step 6_ : Now open the browser and type `localhost:<PORT>` in the address bar.

_Step 7_ : Now you can use the application.



## 4.  API Usage and Endpoints 🔥

The Prefix is used for the API endpoints.
`/api/v1/WebSphere/`


| Method     | Path                        | Description                                    | Authentication |
|------------|-----------------------------|------------------------------------------------|----------------|
| POST       | `auth/Login`                | To Login  the User                             | Yes            |
| PUT        | `auth/Logout`               | To Logout  the User                            | Yes            |
| PUT        | `auth/profile`              | To Login  the User                             | Yes            |
| GET        | `auth/profile`              | To Get  the User profile                       | Yes            |
| POST       | `auth/Register`             | To Register the User                           | No             |
| POST       | `Instructor/courses `       | To Add a new course                            | Yes            |
| GET        | `Instructor/courses `       | To fetch a course added                        | Yes            |
| GET        | `student/courses/:id `      | To fetch a course detail                       | Yes            |
| GET        | `student/courses/`          | To Display all Courses                         | Both           |
| GET        | `student/enrolled`          | To view enrolled course for students           | Yes            |
| PUT        | `student/free-enrollment `  | To Enroll a course without payment             | Yes            |
| POST       | `student/get-progress `     | To see the marked lesson update                | Yes            |
| POST       | `student/payment `          | To make a payment to enroll the course         | Yes            |
| POST       | `student/rating `           | To rate and review the course                  | Yes            |
| POST       | `student/updated-progress ` | To mark the lesson as completed                | Yes            |
| GET        | `student/verify-payment `   | To verify a payment to view enrolled  course   | Yes            |
| POST       | `student/video-url `        | To Stream the video and display notes material | Yes            |
| ---------- | ------------------------    | --------------------------------               | --------       |


## Middlewares Used: 🔑

1. **validateToken** - A middleware function that validates the token and checks if the user is authenticated.
2. **Validations.js** - A middleware function that validates the data using Joi.
3. **InstructorAccess** - A middleware function that checks if the user is an instructor.
4. **StudentAccess** - A middleware function that checks if the user is a student.
5. **tokenExpire** - A middleware function that checks if the token has expired.






## 5.  Models Used in the Project 🔑

1. **User** - A Mongoose model that represents a user in the system.(Student and Instructor)
2. **Course** - A Mongoose model that represents a course in the system having nested modules and lessons.
3. **Payment** - A Mongoose model that represents a payment made by a user.
4. **courseProgress** - A Mongoose model that represents a progress made by a user in a course.
5. **BlacklistToken** - A Mongoose model that represents a token that has been blacklisted.(optional for postman usage)



## 6.  Dependencies Usage 🔑

***************Frontend Dependencies***************
1. - [`reactjs`](https://www.npmjs.com/package/react) - A JavaScript library for building user interfaces.
2. - [`react-dom`](https://www.npmjs.com/package/react-dom) - A package that provides DOM-specific methods.
3. - [`react-router-dom`](https://www.npmjs.com/package/react-router-dom) - A package that provides routing functionality.
4. - [`quill`](https://www.npmjs.com/package/quill) - A package that provides a rich text editor.
5. - [`rc-progress`](https://www.npmjs.com/package/rc-progress) - A package that provides a progress bar.
6. - [`react-player`](https://www.npmjs.com/package/react-player) - A package that provides a video player.
7. - [`react-toastify`](https://www.npmjs.com/package/react-toastify) - A package that provides a toast notification.
8. - [`uniqid`](https://www.npmjs.com/package/uuid) - A package that provides a unique identifier.
9. - [`axios`](https://www.npmjs.com/package/axios) - A package that provides a promise-based HTTP client.
10. - [`humanize-duration`](https://www.npmjs.com/package/humanize-duration) - A package that provides a human-readable duration.

***************Backend Dependencies***************
- [`bcryptjs`](https://www.npmjs.com/package/bcryptjs) - To hash the password.
- [`crypto`](https://www.npmjs.com/package/crypto-js) - To generate the random string.
- [`dotenv`](https://www.npmjs.com/package/dotenv)- To load the environment variables.
- [`express`](https://www.npmjs.com/package/express) - To create the server.
- [`joi`](https://www.npmjs.com/package/joi) - To validate the data.
- [`jsonwebtoken`](https://www.npmjs.com/package/jsonwebtoken) - To generate the token.
- [`mongoose`](https://www.npmjs.com/package/mongoose) - To connect the database.
- [`aws-sdk`](https://www.npmjs.com/package/aws-sdk) - To upload the file to the S3 bucket.
- [`multer`](https://www.npmjs.com/package/multer) - To upload the file to the server.
- [`multer-s3`](https://www.npmjs.com/package/multer-s3) - To upload the file to the S3 bucket.
- [`cloudinary`](https://www.npmjs.com/package/cloudinary) - To upload the file to the cloud.
- [`stripe`](https://www.npmjs.com/package/stripe) - To process the payment.
- [`nodemon`](https://www.npmjs.com/package/nodemon) - To restart the server.
- [`helmet`](https://www.npmjs.com/package/helmet) - To secure the headers.
- [`cors`](https://www.npmjs.com/package/cors) - To enable the cross-origin resource sharing.














