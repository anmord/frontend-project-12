import leoProfanity from 'leo-profanity'

leoProfanity.loadDictionary('ru')

const clean = (text) => leoProfanity.clean(text).replace(/\*\*\*/g, '*****')

export default { clean }
