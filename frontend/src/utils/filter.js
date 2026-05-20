import leoProfanity from 'leo-profanity'

leoProfanity.loadDictionary('ru')

const clean = (text) => {
  const result = leoProfanity.clean(text)
  return result.replace(/\*+/g, '*****')
}

export default { clean }
