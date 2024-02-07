# UI Wizard

## Testing locally

1. Run `yarn` to install all the dependencies.
2. Run `yarn dev` to run the app in the development mode.
3. Open [http://localhost:5175](http://localhost:5175) to view it in the browser. The page will reload on editing.

## Using in your project

1. The Wizard component is supposed to take the whole page. So unless you are intended to have only one page in your project, it's better to use it under a separate route.
2. The Wizard component takes 2 props:
- `config` (which is a json of a specific structure, see [docs](https://www.notion.so/wekaio/fe4a8abc07444202b8f8ed0cc841aae1?v=701a5a497c78448da1df65fc76e66306&pvs=4). Required.
- `parsingFunc` (which is a function that will internally take the output json of `identifier`:`value` pairs as an argument and return the parsed data). Optional. If not provided the parsed data will be the json of `identifier`:`value` pairs.
