# Simple Task Manager

A very simple Task Manager app built with React Native and Expo SDK 53.

## Features

- Add new tasks with descriptions
- Mark tasks as complete/incomplete with visual feedback
- Delete tasks from the list
- Clean and intuitive user interface
- Accessibility support

## Getting Started

### Prerequisites

- Node.js (v18 or newer)
- npm or yarn
- Expo CLI

### Installation

1. Clone the repository or download the source code

2. Navigate to the project directory:
   ```bash
   cd SimpleTaskManager
   ```

3. Install dependencies:
   ```bash
   npm install
   ```
4. Fix package issues:
   ```bash
   npm update
   ```
   or
   ```bash
   npm audit fix
   ```
   to fix and issues with packages
4. Start the development server:
   ```bash
   npx expo start
   ```

5. Run the app on:
   - iOS Simulator (requires macOS and Xcode)
   - Android Emulator (requires Android Studio)
   - Physical device using Expo Go app (scan the QR code)
   - Web browser

## How to Use

1. **Adding a Task**:
   - Type your task in the input field at the bottom
   - Tap the "Add" button

2. **Completing a Task**:
   - Tap on a task to toggle between complete and incomplete
   - Completed tasks will be crossed out and have a green checkbox

3. **Deleting a Task**:
   - Tap the "X" button next to a task to delete it

## Project Structure

This is a simple, single-file React Native application:

- `App.js`: Contains all the app code including:
  - State management with React hooks
  - UI components
  - Styling

## Technologies Used

- **React Native**: Framework for building the mobile application
- **Expo SDK 53**: Latest development platform for React Native
- **React Hooks**: For state management (useState)
- **expo-constants**: For platform-specific constants like status bar height

## Accessibility Features

The app includes accessibility support:
- Screen reader compatibility
- Proper role definitions for interactive elements
- State descriptions for toggleable items

## Learning Resources

React Native Resources:

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Expo Documentation](https://docs.expo.dev/)
- [React Hooks Documentation](https://reactjs.org/docs/hooks-intro.html) 
