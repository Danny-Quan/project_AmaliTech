**File Server Project by AmaliTech for AmaliTech NSS 2024/25**

**# File Sharer**
This project is a file server application that allows users to easily access, share, and manage files anytime and anywhere. It provides a user-friendly interface for browsing, downloading, and sending files via email, eliminating the need for traditional methods of file distribution.

**Features:**

* **User Access:**
    - Browse all files
    - Download files
    - Send files to other users via email
    - Sign up and confirm emails
    - Reset forgotten passwords
* **Administrator Privileges:**
    - Upload files
    - Edit files
    - Delete files
    - Access number of times a file have been download
    - Access number of times a file have been sent through email

**Benefits:**

* **Convenience:** Users can access and share files anytime, anywhere.
* **Efficiency:** Eliminates the need for time-consuming traditional file sharing methods.
* **Security:** Provides a secure platform for file sharing through email integration.

**Setup Instructions:**

1. **Node.js and npm:**
    - Ensure you have Node.js version 20.11.1 or later installed on your machine. You can download it from the official Node.js website ([https://nodejs.org/en](https://nodejs.org/en)).
    - Verify that you have npm (Node Package Manager) installed, which typically comes bundled with Node.js.

2. **Project Setup:**
    - Clone this project repository to your local machine using Git.
    - Open a terminal or command prompt and navigate to the project directory.

3. **Install Dependencies:**
    - Run the following command in your terminal to install all required dependencies:

      ```bash
      npm install
      ```

4. **MongoDB Database:**
    - Create a MongoDB database that will be used by the application.
    - Update the `server.js` file with your MongoDB connection string in the appropriate configuration section.

5. **Dropbox Access Tokens (Optional):**
    - If you intend to integrate Dropbox functionality for file storage, retrieval, and updates, you'll need to obtain a Dropbox access token, client ID, and client secret.
    - Create a `.env` file in the project root directory to securely store these access tokens. (**Note:** Refer to the Dropbox documentation for instructions on generating these credentials.)

**Usage:**

1. **Run the Application:**

    **Option A: Using Nodemon (Recommended):**

    - Ensure you have `nodemon` installed globally. If not, install it using:

      ```bash
      npm install -g nodemon
      ```

    - Start the application with nodemon for automatic restarts during development:

      ```bash
      nodemon start
      ```

    **Option B: Running Directly:**

      ```bash
      node server.js
      ```

2. **Accessing the Application:** 
    - The application will typically start on a default port 8000.
