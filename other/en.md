# Yandex Music Widget for OBS

[![Join our Discord](https://img.shields.io/discord/1227552882744754267?label=Discord&logo=discord&logoColor=white&style=for-the-badge)](https://discord.com/invite/pulsesync)
[![Subscribe on Boosty](https://img.shields.io/badge/Boosty-Subscribe-orange?style=for-the-badge)](https://boosty.to/evt)

![safsa](https://repository-images.githubusercontent.com/915801533/829d6f0f-0207-4eda-b064-a3362d28ad2c)

## Installation and Usage Instructions

Hello! Below is an explanation on how to launch the widget.  
This is a regular HTML/JS project without using Node.js or any build tools — you can open it in OBS as a "Browser Source" or host it on any local/remote server.

## What does the project do?

1. **Connects** to our public API ([pulsesync.dev/api/v1/](https://ru-node-1.pulsesync.dev/api/v1/)) to find out which track is playing.  
2. **Displays** a card with the cover art, track name, artist, status (playing, etc.).

![aTYB7VGE7H](https://github.com/user-attachments/assets/2e5a33ed-5e43-41d0-82e8-19b96067b79b)

## How to get access to the public API?

1. **Subscribe** at [Boosty.to/evt](https://boosty.to/evt) for a symbolic 30 rubles.  
2. After purchase, you will receive a **message** with instructions:
   ```text
   "Hello and thank you for subscribing!
    Link your Discord account in the Boosty settings:
    https://boosty.to/app/settings/external-apps
    
    Then join the server:
    https://discord.com/invite/pulsesync
    and the bot will assign you the beta tester role (within 15 minutes).
    
    If the role does not appear, contact the administrators.
    If you had an older version of the program, please do the repatch.
    Enjoy!"
   ```
3. **Obtain the beta tester role** on the Discord server.
4. **Register** in the application, then use the command `/create-api-key` in the Discord bot (or `/get-api-key` if you forgot).
5. **Copy** your token and paste it into `api.js` where the `API_KEY` variable is located.

## File Structure

```
├─ designs
│   └─ EvT (Pulsma)
│       ├─ color.js
│       ├─ default.png
│       ├─ index.html
│       ├─ main.js
│       ├─ style.css
│       └─ textAnimation.js
└─api.js
```

As an example, here is my implementation of the “EvT (Pulsma)” theme.

- **`api.js`**  
  Contains the function `fetchTrackStatusFromApi()` and your `API_KEY`.  
- **`color.js`**  
  Code that determines the cover color (using canvas) and darkens it if necessary.  
- **`textAnimation.js`**  
  A “Matrix”-style animation (or any other) that gradually "prints" the final text.  
- **`index.html`**  
  The main page with the markup. All scripts and styles are linked here.  
- **`style.css`**  
  Contains the general styling for the card.  
- **`main.js`**  
  Contains the overall animation logic (slideOut/slideIn), DOM manipulation (cover, text), the API call from `api.js`, etc.  
- **`default.png`**  
  A placeholder image for the cover.

## Running in OBS (or anywhere else)

1. Open **OBS** and add a **Browser Source**.  
2. Specify the path to `index.html` (for example, `file:///C:/Project/designs/EvT%20(Pulsma)/index.html`) or use a local/remote server.  
3. Adjust the size.  
4. That’s it! The card will update and display the current track with animation.

## Have your own design?

We **welcome** different styles!  
If you have ideas — create your version, make a **Pull Request** to this repository, and we will add the new theme under the `designs/` folder.  
Example folder structure:  
```
designs/
  EvT (Pulsma)/
    color.js
    default.png
    index.html
    main.js
    style.css
    textAnimation.js
```
You can name your folder as you wish, for example:  
```
designs/
  MyChinazisDesign/
    color.js
    ...
```

## Contacts

- Our [Discord server](https://discord.com/invite/pulsesync).  
- [Boosty](https://boosty.to/evt) for subscriptions.  

If you have any questions or something isn’t working — feel free to ask on our Discord server.

---
**Bye bye!**

---