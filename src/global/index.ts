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
    const response = await fetch(`http://api.giphy.com/v1/gifs/search?${queries}`);
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
  const builderTarget = elm.getConfigurators ? elm.getConfigurators().find((conf: any) => conf.target === 'Builders' || conf.target === 'Editor') : null;
  if (elm.ready) await elm.ready();
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

export interface IEmojiCategory {
  name: string;
  value: string;
  image?: string;
  groups?: string[];
}

export interface IEmoji {
  name: string;
  category: string;
  group: string;
  htmlCode: string[];
  unicode: string[];
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
  title: string;
  description?: string;
  disabled?: boolean;
}

export const emojiCategories = [
  {
    name: 'Recent',
    value: 'recent',
    image: 'https://abs-0.twimg.com/emoji/v2/svg/1f551.svg',
    groups: []
  },
  {
    name: 'Smileys & Emotion',
    value: 'smileys-and-people',
    image: 'https://abs-0.twimg.com/emoji/v2/svg/1f600.svg',
    groups: ['body', 'cat-face', 'clothing', 'creature-face', 'emotion', 'face-negative', 'face-neutral', 'face-positive', 'face-positive', 'face-role', 'face-sick', 'family', 'monkey-face', 'person', 'person-activity', 'person-gesture', 'person-role', 'skin-tone']
  },
  {
    name: 'Animals & nature',
    value: 'animals-and-nature',
    image: 'https://abs-0.twimg.com/emoji/v2/svg/1f43b.svg',
    groups: ['animal-amphibian', 'animal-bird', 'animal-bug', 'animal-mammal', 'animal-marine', 'animal-reptile', 'plant-flower', 'plant-other']
  },
  {
    name: 'Food & drink',
    value: 'food-and-drink',
    image: 'https://abs-0.twimg.com/emoji/v2/svg/1f354.svg',
    groups: ['dishware', 'drink', 'food-asian', 'food-fruit', 'food-prepared', 'food-sweat', 'food-vegetable']
  },
  {
    name: 'Activity',
    value: 'activities',
    image: 'https://abs-0.twimg.com/emoji/v2/svg/26bd.svg',
    groups: ["activities"]
  },
  {
    name: 'Travel & places',
    value: 'travel-and-places',
    image: 'https://abs-0.twimg.com/emoji/v2/svg/1f698.svg',
    groups: ["travel-and-places"]
  },
  {
    name: 'Objects',
    value: 'objects',
    image: 'https://abs-0.twimg.com/emoji/v2/svg/1f4a1.svg',
    groups: ["objects"]
  },
  {
    name: 'Symbols',
    value: 'symbols',
    image: 'https://abs-0.twimg.com/emoji/v2/svg/1f523.svg',
    groups: ["symbols"]
  },
  {
    name: 'Flags',
    value: 'flags',
    image: 'https://abs-0.twimg.com/emoji/v2/svg/1f6a9.svg',
    groups: ["flags"]
  }
]

export const colorsMapper = {
  'rgb(255, 220, 93)': {
    htmlCode: '',
    unicode: ''
  },
  'rgb(247, 222, 206)': {
    htmlCode: '&#127995;',
    unicode: 'U+1F3FB'
  },
  'rgb(243, 210, 162)': {
    htmlCode: '&#127996;',
    unicode: 'U+1F3FC'
  },
  'rgb(213, 171, 136)': {
    htmlCode: '&#127997;',
    unicode: 'U+1F3FD'
  },
  'rgb(175, 126, 87)': {
    htmlCode: '&#127998;',
    unicode: 'U+1F3FE'
  },
  'rgb(124, 83, 62)': {
    htmlCode: '&#127999;',
    unicode: 'U+1F3FF'
  }
}

const EMOJI_BASE_URL = 'https://emojihub.yurace.pro/api/all';
export const fetchEmojis = async (params: any) => {
  try {
    const uri = `${EMOJI_BASE_URL}/category/${params.category}`;
    const response = await fetch(`${uri}`);
    return await response.json();
  } catch {
    return [];
  }
}

export const searchEmojis = (q: string, mapper: Map<string, any>) => {
  const keyword = q.toLowerCase();
  const categoryName = emojiCategories.find(cate => cate.name.toLowerCase().includes(keyword))?.name;
  if (categoryName) return mapper.get(categoryName);
  const groups = mapper.values();
  let result = [];
  for (let group of groups) {
    const filteredGroup = [...group].filter(emoji => emoji.name.toLowerCase().includes(keyword));
    result = [...result, ...filteredGroup]
  }
  return result;
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
    title: 'Membership NFT',
    description: 'Mint a membership NFT for gated communities'
  },
  {
    name: '@scom/oswap-nft-widget',
    icon: { name: 'campground' },
    title: 'Oswap Troll NFT',
    description: 'Mint a membership NFT for OpenSwap community'
  },
  {
    name: '@scom/scom-video',
    icon: { name: 'video' },
    title: 'Video',
    description: 'Insert a video'
  },
  {
    name: '@scom/scom-image',
    icon: { name: 'image' },
    title: 'Image',
    description: 'Insert an image'
  },
  {
    name: '@scom/scom-twitter-post',
    icon: { image: { url: assets.fullPath('img/twitter.svg'), width: '100%', height: '100%', display: 'inline-block' }},
    title: 'X',
    description: 'Insert an X post'
  }
]