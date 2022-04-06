<h1 align="center">
  <img src="./public/icon.png">
  <br>
  KETCH IN
  <br>
  CHROME EXTENSION
</h1>

## Features

| target     | support |
| ---------- | ------- |
| TypeScript | ✅      |
| Browser    | ✅      |
| Node       | 🚫      |

## Setup

```bash
npm install
```

## Command

### Build

```bash
npm run build
```

### Clean

```bash
npm run clean
```

## Install

1. Build

```bash
npm run build
```

2. Go to [chrome://extensions/](chrome://extensions/)

3. turn on `"Developer mode"`

<img width="155" alt="image" src="https://user-images.githubusercontent.com/9214362/161409261-f63a6c74-0399-42de-a6f5-65634036717e.png">

4. click `"Load unpacked"`

<img width="138" alt="image" src="https://user-images.githubusercontent.com/9214362/161409270-ca6768ae-34ab-4b74-9462-0d890e16c7d1.png">

5. choice `"./dist"` folder.

<img width="493" alt="image" src="https://user-images.githubusercontent.com/9214362/161409343-b46901da-14c1-4721-9cb9-5ce7e711f58b.png">

6. done.

## TypeScript

In the case of `io`, it is imported in `./public/popup.html` in the form of `script src`, so it can be accessed as a global variable.

To make it accessible as a global variable, I defined it in the `./types/socket.io` part. It is almost forced to import, so some typeguards or methods may not exist.

If a typeguard or method does not exist, you can directly edit it in the `types/socket.io` section.

### Chrome Extension

In the case of the chrome extension, it does not allow scripts in the html itself, and src likewise restricts riding external paths. For that reason, `socket.io` is also stored locally in `./public/socket.io.js`.

```json
{
  "target": "self",
  "toggle": true,
  "roomId": "xpz-vddh-vhu",
  "organizerInfo": {...},
  "draw":  [],
}
```

- storage _(temporary variable)_
  - target: "self" | "other"
    - "self" : Presenter
    - "other" : attendees
  - toggle : boolean
    - switch disable/enable
  - roomId : string
    - Meet room information
  - organizerInfo : json
    - Presenter information (I haven't found an identifiable key yet)
  - draw : json[]
    - Coordinate data drawn on the screen
