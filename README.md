# Vite React Project

This is a Vite-based React project. Follow the steps below to download, set up, and run the project on your local machine.

## Prerequisites

Before you begin, make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (version 16 or above)
- [Git](https://git-scm.com/)

## Getting Started

### 1. Clone the repository

Start by cloning the project repository from GitHub:

```
git clone <repository_url>
cd <project_directory>
```

### 2. Install dependencies

Once you've cloned the repository, navigate to the project directory and install the required dependencies using npm or yarn:

Using npm:

```bash
npm install
```

Using yarn:

```
yarn
```

### 3. Set up environment variables

There is a .example.env file in the project root directory that contains environment variable placeholders. To configure your environment:

Copy the .example.env file and rename it to .env:

```
cp .example.env .env
```

Open the .env file and replace the following variables with your actual values:
VITE_PRINTNODE_API_KEY=<your_api_key>
VITE_PRINTNODE_PRINTER_ID=<your_printer_id>
VITE_API_URL=<your_api_url>
Example:

```
VITE_PRINTNODE_API_KEY=your_api_key_here
VITE_PRINTNODE_PRINTER_ID=your_printer_id_here
VITE_API_URL=https://api.example.com
```

### 4. Run the development server

Once your environment variables are set, you can start the development server:

Using npm:

```
npm run dev
```

Using yarn:

```
yarn dev
```

The application should now be running at [http://localhost:5173](http://localhost:5173).

### Building for Production

To build the project for production, run:

Using npm:

```
npm run build
```

Using yarn:

```
yarn build
```

This will create an optimized build of the project in the `dist` directory.

### Running the Production Build

To run the production build locally, you can use the preview command:

Using npm:

```
npm run preview
```

Using yarn:

```
yarn preview
```

This will serve the production build of the project locally at [http://localhost:4173](http://localhost:4173).

### Additional Notes

- The .env file should never be committed to the repository. Ensure it is added to .gitignore to keep sensitive information private.
- Make sure you have valid API keys and other environment-specific data to replace in the .env file.
- For further configuration, refer to the Vite documentation.

## License

This project is licensed under the MIT License.
