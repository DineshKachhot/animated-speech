# Animated Speech

A React Native & Expo application featuring a real-time lip-syncing character. The app uses Azure Speech Service to generate audio and visemes from text, and maps those visemes to a Rive character animation for dynamic mouth movements.

## 🎥 Preview

![Animated Speech Demo](./assets/Animated_speech-demo.mp4)

If the video does not play automatically, [click here to view the demo video](./assets/Animated_speech-demo.mp4).

## 🚀 Features

- **Real-time Lip-Syncing**: Maps Azure Speech Service viseme IDs directly to Rive state machine inputs.
- **Interactive Character**: Rive animation that responds to speech.
- **Text-to-Speech**: High-quality speech synthesis using Azure Cognitive Services.
- **Expo & React Native**: Built with Expo for smooth cross-platform development.

## 🛠️ Tech Stack

- **Framework**: React Native with Expo
- **Animation**: Rive (via `rive-react-native`)
- **Speech Service**: Microsoft Azure Cognitive Services Speech SDK
- **Audio**: `expo-audio`
- **Styling**: React Native StyleSheet (Vanilla)

## 🧠 How It Works

1. **User Input**: The user enters text in the application.
2. **Speech Synthesis**: The app calls Azure Speech Service to synthesize the text into audio and extract viseme data (lip movement timestamps).
3. **Playback & Sync**: The audio is played back, and a scheduler updates the viseme ID based on the current playback time.
4. **Animation Update**: The Rive state machine receives the viseme ID and updates the character's mouth shape in real-time.

## 📦 Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd animated-speech
   ```

2. **Install dependencies**:
   ```bash
   yarn install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory and add your Azure Speech credentials:
   ```env
   AZURE_SPEECH_KEY=your_azure_speech_key
   AZURE_REGION=your_azure_region
   ```

## 🚀 Running the App

- **Start Expo**:
  ```bash
  yarn start
  ```
- **Run on iOS**:
  ```bash
  yarn ios
  ```
- **Run on Android**:
  ```bash
  yarn android
  ```
