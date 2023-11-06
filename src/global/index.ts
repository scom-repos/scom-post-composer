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
  const queries = new URLSearchParams({...params}).toString();
  try {
    const response = await fetch(`https://api.giphy.com/v1/gifs/categories/reactions?${queries}`);
    return await response.json();
  } catch {
    return null
  }
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
  const groups = Array.from(mapper);
  let result = [];
  for (let group of groups) {
    const filteredGroup = [...group].filter(emoji => emoji.name.toLowerCase().includes(keyword));
    result = [...result, ...filteredGroup]
  }
  return result;
}
