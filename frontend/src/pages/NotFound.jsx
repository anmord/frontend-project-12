import { useTranslation } from '../../node_modules/react-i18next';

export const NotFoundPage = () => {
  const { t } = useTranslation()

  return <h1>{t('errors.pnf')}</h1>
};