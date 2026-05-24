import leoProfanity from 'leo-profanity'

leoProfanity.loadDictionary('ru')
leoProfanity.loadDictionary('en')

const clean = text => leoProfanity.clean(text)

export default { clean }
