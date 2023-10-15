# Link Conversion API

The Link Conversion API allows you to seamlessly convert between web URLs and deeplinks.

## Prerequisites

Before using the API, you'll need to set up your development environment and make sure you have the required tools installed.

### 1. Clone the Repository:

```bash
git clone https://github.com/riyazkhan21295/washmen--link-converter.git
```

### 2. Node.js and NPM:

Ensure you have Node.js installed, preferably version **16** or **higher**. If not, download and install it from [Node.js Website](https://nodejs.org/en)

### 3. Sails.js:

Sails.js is the web application framework used for this project. If you don't have Sails.js installed globally, you can install it with the following command:

```bash
npm install -g sails
```

### 4. PostgreSQL Database:

This API relies on a PostgreSQL database. Make sure you have PostgreSQL installed, and create a database named "<span style="color: #fff000;">**washmen**</span>". You'll need to configure your database connection in the project, which is typically done in **config/datastores.js**.

### 5. Install Project Dependencies:

Navigate to the project folder and install the required dependencies using npm:

### 6. Start the Server:

To run the API, use the following command:

```bash
sails lift
```

That's it! Your Link Conversion API should be up and running.

## How to Use the API

The API provides two main endpoints for converting URLs to deeplinks and vice versa.

Here's how to use them:

### Convert Web URL to Deeplink

- **URL:** **`/api/linkConverter/webUrlToDeeplink`**
- **Method:** POST
- **Request Body:** Send a JSON object with the web URL you want to convert

```json
{
  "webURL": "https://www.washmen.com/clean-and-press/shirts-p-1894501?cityId=994892-asda0-123-asdq"
}
```

- **Response Body:** You will receive a JSON response containing the generated deeplink

```json
{
  "deeplink": "washmen://?Page=Product&ContentId=1894501&CityId=994892-asda0-123-asdq"
}
```

### Convert Deeplink to Web URL

- **URL:** **`/api/linkConverter/deeplinkToWebUrl`**
- **Method:** POST
- **Request Body:** Send a JSON object with the web URL you want to convert

```json
{
  "deeplink": "washmen://?Page=Product&ContentId=1894501&CityId=994892-asda0-123-asdq"
}
```

- **Response Body:** You will receive a JSON response containing the generated deeplink

```json
{
  "webURL": "https://www.washmen.com/clean-and-press/shirts-p-1894501?cityId=994892-asda0-123-asdq"
}
```

This API is ready for use in your applications to seamlessly convert URLs to deeplinks and back.
