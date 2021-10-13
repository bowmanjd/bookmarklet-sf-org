export default () => {
  const info = {};
  const version = JSON.parse(sessionStorage.getItem('sfVersionInfo'));
  info.apiversion = version.version;
  info.release = version.label;
  info.apiurl = version.label;
  info.sessid = (`; ${document.cookie}`).split('; sid=')[1].split('; ')[0];
  info.orgid15 = (`; ${document.cookie}`).split('; oid=')[1].split('; ')[0];
  info.ip = (`; ${document.cookie}`).split('; clientSrc=')[1].split('; ')[0];
  return info;
};
