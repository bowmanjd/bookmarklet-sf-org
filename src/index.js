import html from './index.html';

const main = () => {
  const apipath = '/services/data/';
  let output;
  if (window.location.pathname === apipath) {
    const latest = document.querySelector('Version:last-child');
    const versionInfo = Array.from(latest.children).reduce((o, el) => {
      o[el.tagName] = el.textContent; return o;
    }, {});
    sessionStorage.setItem('sfVersionInfo', JSON.stringify(versionInfo));
    output = html;
  } else {
    window.open(window.location.origin + apipath, '_blank');
  }
  return output;
};

main();
