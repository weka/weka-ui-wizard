# UI Wizard

## Testing locally

1. Run `yarn` to install all the dependencies.
2. Run `yarn dev` to run the app in the development mode.
3. Open [http://localhost:5175](http://localhost:5175) to view it in the browser. The page will reload on editing.

## Using in your project

1. The Wizard component is supposed to take the whole page. So unless you are intended to have only one page in your project, it's better to use it under a separate route.
2. The Wizard component takes the following props:
- `config` (which is a _json of a specific structure_, see [docs](https://www.notion.so/wekaio/fe4a8abc07444202b8f8ed0cc841aae1?v=701a5a497c78448da1df65fc76e66306&pvs=4)). Required.
- `projectName` (_string_. Is used for storing values in local storage). Required.
- `tabs` (an _array of objects_ that represents tabs of the right sidebar). Required.

  
Example:
```javascript
  const TABS = [
    {
      key: 'hcl',
      title: 'TF File Preview (HCL)',
      parser: generateOutputHcl,
      downloadFunc: (content) => {
        try {
          utils.downloadFile(content, 'tf_wizard_config.tf', MIME_TYPES.PLAIN, false)
        } catch (e) {
          utils.toastError(e)
        }
      }
    },
    {
      key: 'json',
      title: 'TF File Preview (JSON)',
      parser: generateOutputDict,
      downloadFunc: (content) => {
        try {
          utils.downloadFile(content, 'tf_wizard_config.tf.json')
        } catch (e) {
          utils.toastError(e)
        }
      }
    }
  ]
```


- `interchangeableTabs` (_an array of 2 objects_. If provided, the toggle button will be shown next to the right sidebar, allowing to switch between the formats provided). Optional.

    Example:
    ```javascript
  const interchangeableTabs = [
      { key: 'hcl', label: 'HCL', isOnByDefault: true },
      { key: 'json', label: 'JSON', isOnByDefault: false }
  ]
    ```
- `hasGuidance` (_boolean_. If true and at least one of section has `section_description` or at least one of inputs has `description`, the guidance tab will present). Optional. Default is false.
- `guidanceTabTitle` (_string_. If provided, the title of the guidance tab will be replaced with the provided value). Optional. Default is 'Configuration Guidance'.
- `incompleteTab` (_object_. If provided, the list of incomplete sections will be shown once the form is filled incorrectly). Optional.
        
  Example:
```javascript
    const incompleteTab = {
      key: 'configReadiness',
      title: 'Configuration Readiness'
    }
```
- `downloadBtnText` (_string_. If provided, the text of the download button will be replaced with the provided value). Optional. Default is 'Download'.
