import { getUserWords } from '@/model/api-userWords';
import { getWords, getWordsAsync } from '@/model/api-words';
import { Word } from '@/model/app-types';
import { PAGES_PER_GROUP, WORDS_PER_PAGE } from '@/model/constants';

export const getRandomIndex = (max: number, notEqual = <Array<number>>[]) => {
  let random = Math.floor(Math.random() * max);;
  while (notEqual.includes(random)){
    random = Math.floor(Math.random() * max);
  }
  return random;
};

export const loadWords = (g: number, p: number) => new Promise(resolve => {
  getWords(`${g}`, `${p}`)
    .then((data: Word[]) => {
      resolve(data);
    })
    .catch(err => { console.log(err); });
});

export const getRandomPage = (usedPages: number[]) => {
  let index = getRandomIndex(PAGES_PER_GROUP);
  while (usedPages.includes(index)) {
    index = getRandomIndex(PAGES_PER_GROUP);
  }
  return index;
};

export const loadWordsWithoutLearned = async (
  g: number,
  p: number,
  userId: string,
  userToken: string,
) => {
  const words: Word[] = [];
  let page = p;

  const allWords = await getUserWords(userId, userToken);
  const learnedWordIDs = allWords?.filter(el=>el.difficulty === 'learned').map(el => el.optional.wordId);

  while (words.length < WORDS_PER_PAGE && page >= 0){
    const wordsPack = await getWordsAsync(`${g}`, `${page}`);
    const notLearned = wordsPack?.filter(el=>!learnedWordIDs?.includes(el.id));
    if (notLearned) words.push(...notLearned);
    page -= 1;
  }

  if (words.length > WORDS_PER_PAGE) {
    words.length = WORDS_PER_PAGE;
  }

  return words;

};
