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
      height: 'calc(100% - 2rem)',
      overflow: 'hidden'
    }
  }
})