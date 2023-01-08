<h1 align="center">
  <img src="./public/img/icon.png">
  <br>
  KETCH IN
  <br>
  CHROME EXTENSION
  <br>
  [deprecated]
</h1>

<h4 align="center">ketch-in-extension는 <a href="https://github.com/ketch-in/ketch-in">ketch-in</a>에서 함께 관리됩니다.</h4>

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

### Socket

Extension uses `socket.io-client` ^4.4.1 version. so, server must use `socket.io` ^3.0.0 or later version.

### Chrome Extension

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
