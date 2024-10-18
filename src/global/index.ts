import { application, Control, IconName } from "@ijstech/components";
import assets from '../assets';

export const fetchGifs = async (params: any) => {
  if (!params.offset) params.offset = 0;
  if (!params.limit) params.limit = 40;
  params.api_key = 'K0QfKNGrvsuY9nPKE1vn9lEGapWEY4eR';
  const queries = params ? new URLSearchParams({
    ...params
  }).toString() : '';
  try {
    const response = await fetch(`https://api.giphy.com/v1/gifs/search?${queries}`);
    return await response.json();
  } catch {
    return null
  }
}

export const fetchReactionGifs = async () => {
  const params = {
    api_key: 'K0QfKNGrvsuY9nPKE1vn9lEGapWEY4eR'
  };
  const queries = new URLSearchParams({ ...params }).toString();
  try {
    const response = await fetch(`https://api.giphy.com/v1/gifs/categories/reactions?${queries}`);
    return await response.json();
  } catch {
    return null
  }
}

const WIDGET_URL = 'https://widget.noto.fan';
export const getWidgetEmbedUrl = (module: string, data: any) => {
  if (module) {
    const widgetData = {
      module: {
        name: module
      },
      properties: { ...data },
      modifiedTime: Date.now()
    };
    const encodedWidgetDataString = encodeURIComponent(window.btoa(JSON.stringify(widgetData)));
    const moduleName = module.slice(1);
    return `${WIDGET_URL}/#!/${moduleName}/${encodedWidgetDataString}`;
  }
  return '';
}

export const extractWidgetUrl = (url: string) => {
  const rule = /https?:\/\/widget\.\S+\/scom\/\S+\/\S+/g;
  let match = rule.exec(url);
  let widgetUrl = match && match[0] || '';
  if (!widgetUrl) return null;
  let arr = widgetUrl.split('/scom/');
  let paths = arr[1].split('/');
  const moduleName = `@scom/${paths[0]}`;
  let data;
  try {
    const dataBase64 = decodeURIComponent(paths.slice(1).join('/'));
    data = JSON.parse(atob(dataBase64));
    if ('properties' in data) {
      data = { ...data.properties };
    }
  } catch (err) { }
  return {
    moduleName,
    modifiedTime: data?.modifiedTime,
    data: { ...data }
  }
}

export const getEmbedElement = async (postData: any, parent: Control) => {
  const { module, data } = postData;
  if (parent.ready) await parent.ready();
  const elm = await application.createElement(module, true) as any;
  if (!elm) throw new Error('not found');
  elm.parent = parent;
  if (elm.ready) await elm.ready();
  const builderTarget = elm.getConfigurators ? elm.getConfigurators().find((conf: any) => conf.target === 'Builders' || conf.target === 'Editor') : null;
  elm.maxWidth = '100%';
  elm.maxHeight = '100%';
  if (builderTarget?.setData && data.properties) {
    await builderTarget.setData(data.properties);
  }
  const { dark, light } = data.properties || {};
  let tag = {};
  const darkTheme = getThemeValues(dark);
  const lightTheme = getThemeValues(light);
  if (darkTheme) {
    tag['dark'] = darkTheme;
  }
  if (lightTheme) {
    tag['light'] = lightTheme;
  }
  tag = { ...tag, ...data.tag };
  if (builderTarget?.setTag && Object.keys(tag).length) {
    await builderTarget.setTag(tag);
  }
  return elm;
}

const getThemeValues = (theme: any) => {
  if (!theme || typeof theme !== 'object') return null;
  let values = {};
  for (let prop in theme) {
    if (theme[prop]) values[prop] = theme[prop];
  }
  return Object.keys(values).length ? values : null;
}

export interface IWidget {
  name: string | string[];
  icon?: { name: IconName } | {
    image: {
      url: string;
      width: string;
      height: string;
      display: string;
    };
  }
  configuratorCustomData?: string;
  title: string;
  description?: string;
  note?: string;
  disabled?: boolean;
  isDevOnly?: boolean;
}

export const chartWidgets: string[] = ['@scom/scom-pie-chart', '@scom/scom-line-chart', '@scom/scom-bar-chart', '@scom/scom-area-chart', '@scom/scom-mixed-chart', '@scom/scom-scatter-chart', '@scom/scom-counter'];

export const widgets: IWidget[] = [
  {
    name: chartWidgets,
    icon: { name: 'chart-line' },
    title: 'Chart',
    description: 'Insert a chart widget',
    disabled: true
  },
  {
    name: '@scom/scom-swap',
    icon: { name: 'exchange-alt' },
    title: 'Swap',
    description: 'Insert a swap widget',
    disabled: true
  },
  {
    name: '@scom/scom-staking',
    icon: { name: 'hand-holding-usd' },
    title: 'Staking',
    description: 'Insert a staking widget',
    disabled: true
  },
  {
    name: '@scom/scom-xchain-widget',
    icon: { name: 'exchange-alt' },
    title: 'Xchain',
    description: 'Insert an xchain widget',
    disabled: true
  },
  {
    name: '@scom/scom-voting',
    icon: { name: 'vote-yea' },
    title: 'Voting',
    description: 'Insert a voting widget',
    disabled: true
  },
  {
    name: '@scom/scom-nft-minter',
    icon: { name: 'gavel' },
    title: 'Create Membership NFT',
    description: 'Create a new NFT index to Mint a membership NFT for gated communities',
    note: 'Will only work after a successful transaction',
    configuratorCustomData: 'new1155',
    isDevOnly: true
  },
  {
    name: '@scom/scom-nft-minter',
    icon: { name: 'gavel' },
    title: 'Existing Membership NFT',
    description: 'Mint a membership NFT for gated communities',
    configuratorCustomData: 'customNft',
    isDevOnly: true
  },
  {
    name: '@scom/oswap-nft-widget',
    icon: { name: 'campground' },
    title: 'Oswap Troll NFT',
    description: 'Mint a membership NFT for OpenSwap community',
    disabled: true
  },
  {
    name: '@scom/scom-video',
    icon: { name: 'video' },
    title: 'YouTube Video',
    description: 'embeded YouTube video',
    configuratorCustomData: "defaultLinkYoutube"
  },
  {
    name: '@scom/scom-video',
    icon: { name: 'video' },
    title: 'Video file',
    description: '.mp4 or .mov file',
    configuratorCustomData: "defaultLinkMp4"
  },
  {
    name: '@scom/scom-image',
    icon: { name: 'image' },
    title: 'Image',
    description: 'Insert an image',
    isDevOnly: true
  },
  {
    name: '@scom/scom-twitter-post',
    icon: { image: { url: assets.fullPath('img/twitter.svg'), width: '100%', height: '100%', display: 'inline-block' }},
    title: 'X',
    description: 'Insert an X post'
  }
]