<h1 align="center">KETCH IN COMPONENTS</h1>

## Features
- Toast UI
- Modal UI
- Select Modal UI
- Toolbar UI

## Setup

```bash
npm install
```
And then you can access to http://127.0.0.1:4173/example

## Command

### Run
```bash
npm run dev
```

### Build
```bash
npm run build
```

## Usage
### Toast
```ts
const toastRoot = document.querySelector("#toast");
const { ToastController } = window.ketchInComponents;
const toastController = new ToastController(toastRoot, { removeDelay: 2000 });

for (let i = 1; i < 5; i++) {
  setTimeout(() => {
    const p = document.createElement("p");
    p.innerText = `Toast ${i} TEST`;
    toastController.add({
      children: p,
      data: { i },
      momentDelay: 3000,
      onClick: (item) => {
        item.unmount(true);
        console.log(item.getData());
      },
      onClose: (item, action) => {
        console.log("456", i, item, action);
      },
    });
  }, i * 500);
}
```

### Toolbar
```ts
const root = document.querySelector("#app");
const { ToolbarController } = window.ketchInComponents;
const toolbarController = new ToolbarController(root, {});

toolbarController.add({
  status: 'KetchIn',
  handlePen: () => console.log('switch to drawing line mode'),
  handleShape: selectedShape => console.log(`switch to drawing [${selectedShape.type}] shape mode`),
  // TODO: selectedShape 객체의 svg 필드 활용
  handleColor: selectedColor => console.log(`pen color is now [${selectedColor}]`),
  onClear: () => console.log('clear canvas'),
});
```

### Modal
```ts
const root = document.querySelector("#app");
const { ModalController } = window.ketchInComponents;
const modalController = new ModalController(root, { removeDelay: 2000, modalWidth: 200 });

const p = document.createElement("p");
p.innerText = `Modal (${i})`;
modalController.add({
  children: p,
  onClose: (item) => {
    console.log(item);
  },
});
```

### Select Modal
```ts
const { SelectModalController } = window.ketchInComponents;
const selectController = new SelectModalController(root, { removeDelay: 2000, modalWidth: 400 });

const p = document.createElement("p");
p.innerText = `SelectModal TEST (${i})`;
selectController.add({
  children: p,
  buttons: { yes: "확인", no: "취소" },
  onClick: (item, id, label) => {
    console.log(item, id, label);
  },
});
```

## License

`ketch in components` is [MIT licensed](./LICENSE).
