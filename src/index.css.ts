import { Styles } from "@ijstech/components";

export const modalStyle = Styles.style({
  $nest: {
    '.modal > div:nth-child(2)': {
      width: '100%',
      height: '100%',
      overflow: 'hidden'
    },
    'i-scom-storage': {
      display: 'block',
      width: '100%',
      height: 'calc(100% - 1.5rem)',
      overflow: 'hidden'
    }
  }
})

export const formStyle = Styles.style({
  $nest: {
    'i-scom-token-input > i-hstack > i-vstack': {
      margin: '0 !important'
    }
  }
})

export const widgetPreviewStyle = Styles.style({
  boxSizing: 'border-box !important' as 'border-box',
  $nest: {
    '*': {
      boxSizing: 'border-box !important' as 'border-box'
    },
    'img': {
      margin: 'inherit !important'
    }
  }
})

export const alertStyle = Styles.style({
  $nest: {
    'i-vstack i-label': {
      textAlign: 'center'
    }
  }
})