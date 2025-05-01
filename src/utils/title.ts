export const setPageTitle = (title?: string) => {
  const baseTitle = 'Ribbet Shop';
  document.title = title ? `${title} | ${baseTitle}` : baseTitle;
}; 