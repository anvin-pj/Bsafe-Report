# Getting Started with Traffix!

![image](https://github.com/user-attachments/assets/17cd69a6-1a17-4ed5-b57c-506cf99a3b0d)

# Traffix - Road Safety Reporting DApp

## Overview
The **Traffix** is a decentralized application (DApp) that allows users to report road safety issues anonymously. Built using **React** and **Web3**, the application interacts with the blockchain to store reports securely. It uses **Metamask** for wallet connection and **IPFS** for image storage, providing a trustless and transparent platform for reporting.

### Key Features:
1. **Connect Wallet**: Users can connect their Metamask wallet to the app.
2. **Capture Image**: Users can take photos of road safety issues directly from their webcam.
3. **Add Details**: Provide additional information about the issue via a simple report form.
4. **Submit Report**: Submit the report to the blockchain, where it is stored securely and anonymously.
5. **View Reports**: View previously submitted reports and track ongoing issues within the community.


## Technologies Used:
- **React**: For building the user interface.
- **Web3.js**: For blockchain interaction and smart contract calls.
- **Metamask**: For wallet integration and blockchain authentication.
- **IPFS**: For decentralized image storage.
- **Pinata**: For IPFS file management.

## Screenshots:
### 1. Connect Wallet:
Users need to connect their Metamask wallet to start using the app.
![image](https://github.com/user-attachments/assets/0682f412-87af-4eb8-be5f-c8849c7eaacc)

### 2. Capture Image:
Capture an image of the road safety issue using your webcam.
![image](https://github.com/user-attachments/assets/a917212b-ba0d-4139-9d10-80e2b6d13d53)

### 3. Add Details:
Fill in the details like location and issue description.
![image](https://github.com/user-attachments/assets/cb120d65-f51b-473b-a5bb-f6dfb063b56d)

### 4. Submit Report:
Submit the report to the blockchain securely and anonymously.
![image](https://github.com/user-attachments/assets/8d2a83db-9c28-4780-8ee7-c191df0d2288)

## Getting Started

### Prerequisites
To run this application locally, you will need:

- **Node.js**: Install it from [Node.js Official Website](https://nodejs.org/).
- **npm**: Node Package Manager is bundled with Node.js.
- **Metamask Wallet**: Install the [Metamask extension](https://metamask.io/) in your browser.
- **Git**: To clone the repository.

### Installation Steps

1. **Clone the Repository:**

   Open your terminal and run the following command to clone the repository:

   ```bash
   git clone https://github.com/kichuman28/ipfs-admin-panel.git
   ```

2. **Navigate to the Project Directory:**

   ```bash
   cd ipfs-admin-panel
   ```

3. **Install Dependencies:**

   Run the following command to install the necessary packages:

   ```bash
   npm install
   ```

4. **Start the Development Server:**

   After the dependencies have been installed, start the local development server by running:

   ```bash
   npm start
   ```

   This will launch the app in your browser at `http://localhost:3000`.

### Deployment

To deploy this application on GitHub Pages:

1. **Install gh-pages:**

   ```bash
   npm install gh-pages --save-dev
   ```

2. **Add the deployment script to `package.json`:**

   ```json
   "scripts": {
      "predeploy": "npm run build",
      "deploy": "gh-pages -d build"
   }
   ```

3. **Deploy to GitHub Pages:**

   ```bash
   npm run deploy
   ```

## How to Use

1. **Connect Metamask Wallet**: Open the app and connect your Metamask wallet using the "Connect Wallet" button.
2. **Capture an Image**: Use your webcam to capture an image of the issue you want to report.
3. **Add Report Details**: Fill in the necessary details, including a description of the issue and location.
4. **Submit Report**: Once the image and details are ready, click on the "Submit Report" button to submit the report to the blockchain.
5. **View Existing Reports**: You can browse through existing reports submitted by other users.

## License
This project is licensed under the MIT License.

## Contributions
Contributions are welcome! Feel free to fork this project and submit pull requests. 

---



