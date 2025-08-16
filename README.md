# Vibe Hacker Security

A tool to help developers find and resolve security vulnerabilities in their code.

## About the Project

Vibe Hacker Security is a developer-focused security scanner that helps you identify and fix security issues early in the development process. It's designed to be easy to use and integrate into your existing workflow.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Node.js and npm installed. You can download them from [nodejs.org](https://nodejs.org/).
*   A Convex account. You can sign up for free at [convex.dev](https://www.convex.dev/).

### Installation

1.  Clone the repo
    ```sh
    git clone https://github.com/LikkleOra/Vibe-hacker-security-for-vibe-coders-.git
    ```
2.  Install NPM packages for the web client
    ```sh
    cd Vibe-hacker-security-for-vibe-coders-/vibesec
    npm install
    ```
3.  Set up Convex
    ```sh
    npx convex dev
    ```
    This will guide you through logging in and setting up your Convex project. It will also generate the necessary files in the `convex/_generated` directory.

### Running the Application

Once you have completed the installation steps, you can run the development server:

```sh
npm run dev
```

This will start the Next.js development server, and you can view the application at [http://localhost:3000](http://localhost:3000).

## MVP Scope (Sprint 1)

The current focus is on building the core MVP features, which include:

*   **Repo Import & File Read:** Drag-and-drop a ZIP file of your repository to be unzipped and analyzed in the browser.
*   **Secrets Scanner:** A regex-based scanner to find leaked secrets like API keys and private keys.
*   **Dependency Audit:** For Node.js projects, it will recommend `npm audit fix` commands for vulnerable dependencies.
*   **Issue Cards UI:** A user-friendly interface to display the identified vulnerabilities with details and fix suggestions.
*   **Report Export:** The ability to download the scan report as a Markdown file.

## Contributing

Contributions are welcome! We are currently working on adding a `LICENSE` and a CI/CD pipeline. Please feel free to open an issue or submit a pull request.
