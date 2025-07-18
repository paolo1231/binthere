# Voice Feature Documentation

## Overview
The Voice Feature allows users to add items to their inventory using voice commands. This makes the app more accessible and convenient, especially when users' hands are occupied or they prefer voice input over typing.

## Implementation Details

### Components
1. **VoiceModal**: A modal component that handles the voice recognition UI and user interaction.
2. **Voice Recognition Utility**: A utility that interfaces with the device's speech recognition capabilities.

### Dependencies
- `@react-native-voice/voice`: React Native module for speech recognition.

### Feature Flag
The voice feature can be enabled or disabled using the `voiceEntry` feature flag in `src/config/featureFlags.ts`.

## Usage Flow
1. User taps the Voice button in the ItemEntry component.
2. The VoiceModal appears, prompting the user to speak.
3. User speaks an item name followed by "in" or "at" and then a location.
   Example: "Hammer in garage toolbox"
4. The app processes the voice input and extracts the item name and location.
5. The extracted information is populated in the item entry form.
6. User can review and edit the information before adding the item.

## Integration with Other Features
- The voice feature works alongside other input methods like manual entry and photo recognition.
- Users can start with voice input and then refine their entries using other features.

## Future Enhancements
- Support for more complex voice commands
- Multiple language support
- Voice command for selecting categories
- Voice-guided item entry process

## Troubleshooting
- If voice recognition is not working, ensure that:
  - The device has microphone permissions granted to the app
  - The device has an active internet connection (for cloud-based speech recognition)
  - The `voiceEntry` feature flag is enabled