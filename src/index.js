import html from './index.html';

const main = () => {
  const doc = document.createElement('html');
  doc.innerHTML = html;
  return doc.outerHTML;
};

main();
