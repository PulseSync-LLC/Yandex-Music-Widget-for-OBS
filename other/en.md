# Yandex Music Widget for OBS

[![Join our Discord](https://img.shields.io/discord/1227552882744754267?label=Discord&logo=discord&logoColor=white?style=for-the-badge)](https://discord.com/invite/pulsesync)
[![Subscribe on Boosty](https://img.shields.io/badge/Boosty-Subscribe-orange?style=for-the-badge)](https://boosty.to/evt)

![safsa](https://repository-images.githubusercontent.com/915801533/829d6f0f-0207-4eda-b064-a3362d28ad2c)

## What is this?

This is a collection of beautiful widgets for OBS Studio that display information about the track currently playing in Yandex Music. The widget automatically updates and shows:
- Track name
- Artist name
- Album cover
- Playback status (playing, paused, etc.)
- Track progress

![aTYB7VGE7H](https://github.com/user-attachments/assets/2e5a33ed-5e43-41d0-82e8-19b96067b79b)

## What do I need?

**Just 2 simple steps:**

1. **Install PulseSync**
   - Download the application from the official website: [pulsesync.dev](https://pulsesync.dev/)
   - Install it on your computer
   - Run Yandex Music and PulseSync at the same time

2. **Choose a widget**
   - Open the `preview.html` file in your browser to see all available widgets
   - Choose your favorite design

**That's it!** No additional configuration needed. The widget will automatically connect to PulseSync and start displaying track information.

## How to add a widget to OBS?

### Step-by-step instructions:

1. **Open OBS Studio**
   - Launch OBS on your computer

2. **Add Browser Source**
   - In the sources list (at the bottom of the screen), click the **"+"** (plus) button
   - Select **"Browser Source"**
   - Give it a name, for example: "Yandex Music"

3. **Specify the widget path**
   - In Browser Source settings, find the **"Local file"** field
   - Click the **"Browse"** button
   - Find the widgets folder (for example: `C:\{your path}\Yandex-Music-Widget-for-OBS\designs\`)
   - Select the folder with the desired widget (for example: `EvT (Pulsma)`)
   - Open the `index.html` file
   - Or copy the path from the preview page (`preview.html`) — there's a "Copy path" button there

4. **Adjust the size**
   - In Browser Source settings, specify the width and height
   - Recommended sizes are shown on the preview page for each widget
   - Or simply drag the widget corners in OBS to change the size

5. **Done!**
   - The widget will appear in OBS and start showing information about the current track
   - If the track is not displayed, make sure PulseSync is running and Yandex Music is playing

### Useful tips:

- **Positioning**: Many widgets support parameters like `?position=top-left&offsetX=25&offsetY=25` to change position
- **Transparency**: Some widgets support the `?fade=0.8` parameter to adjust background transparency
- **Auto-color**: The widget can automatically match the background color to the track cover
- **Auto-size**: The widget can automatically adjust its size to fit the track title length

All these settings can be changed directly on the preview page (`preview.html`)!

## Available widgets

The project includes several ready-made designs to choose from:

- **EvT (Pulsma)** — classic widget with text animation and auto-color matching
- **Battlebeats Classic Card** — card in Battlebeats style
- **LeftBar** — vertical panel on the left
- **Strofi** — beautiful widget with cover carousel and animations
- **Get Track Test** — widget for developers, shows all available track information

Open `preview.html` in your browser to see all widgets and choose the one you like!

## Project structure

```
Yandex-Music-Widget-for-OBS/
├─ designs/              # Folder with all widgets
│   ├─ EvT (Pulsma)/    # "Pulsma Bar" widget
│   ├─ Battlebeats/     # "Battlebeats Classic Card" widget
│   ├─ LeftBar/         # "LeftBar" widget
│   ├─ Strofi/          # "Strofi" widget
│   └─ getTrackTest/    # Widget for developers
├─ preview.html         # Preview page for all widgets
├─ api.js               # File for connecting to PulseSync
└─ readme.md            # This file
```

**For regular users:** You don't need to understand the file structure! Just use `preview.html` to choose a widget and follow the instructions above.

## Want to create your own design?

We **welcome** different styles! If you have ideas — create your version, make a **Pull Request** to this repository, and we will add the new theme to the `designs/` folder.

### Example structure for a new widget:

```
designs/
  MyAwesomeDesign/      # Your widget name
    ├─ index.html       # Main widget page
    ├─ style.css        # Styling
    ├─ main.js          # Widget logic
    └─ default.png      # Placeholder for cover (when no track is playing)
```

You can name your folder however you like and create any design!

## Frequently asked questions

**Q: The widget doesn't show the track, what should I do?**  
A: Make sure:
- PulseSync is running and working
- Yandex Music is open and playing a track
- The correct path to the `index.html` file is specified in OBS

**Q: Can I use the widget outside of OBS?**  
A: Yes! You can open `index.html` in any browser or host the widget on a web server.

**Q: How do I change the widget position on screen?**  
A: Many widgets support URL parameters:
- `?position=top-left` — position (top-left, top-right, bottom-left, bottom-right, center)
- `?offsetX=25&offsetY=25` — offsets from edges in pixels

**Q: The widget is too big/small**  
A: In OBS, you can change the Browser Source size by dragging its corners or specifying exact dimensions in settings.

**Q: Where can I get PulseSync?**  
A: Download from the official website: [pulsesync.dev](https://pulsesync.dev/)

## Contacts and support

- 💬 [Discord server](https://discord.com/invite/pulsesync) — ask questions, get help
- 🌐 [Official website](https://pulsesync.dev/) — download PulseSync
- 💎 [Boosty](https://boosty.to/evt) — support the project

If you have any questions or something isn't working — feel free to ask on our Discord server, we're always happy to help!

---

**Enjoy! 🎵**
