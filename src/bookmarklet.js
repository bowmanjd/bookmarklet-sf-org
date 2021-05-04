(async () => {
  const apipath = '/services/data/';
  if (window.location.pathname === apipath) {
    const sessid = (`; ${document.cookie}`).split('; sid=')[1].split('; ')[0];
    const orgid15 = (`; ${document.cookie}`).split('; oid=')[1].split('; ')[0];
    const query = 'SELECT Id, Name, DefaultLocaleSidKey, TimeZoneSidKey, FiscalYearStartMonth, TrialExpirationDate, OrganizationType, InstanceName, IsSandbox FROM Organization';
    const url = `${'/services/data/v51.0/query'
      + '?'}${
      new URLSearchParams({ q: query }).toString()}`;
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${sessid}` },
    });
    const json = await response.json();
    const orgInfo = json.records[0];
    const statusResponse = await fetch(
      `https://api.status.salesforce.com/v1/instances/${orgInfo.InstanceName}/status/preview`,
    );
    const orgStatus = await statusResponse.json();
    const endpointResponse = await fetch(
      document.querySelector('Version:last-child url').textContent,
      { headers: { Authorization: `Bearer ${sessid}` } },
    );
    const endpoints = await endpointResponse.json();
    const identityEndpoint = endpoints.identity;
    const identityResponse = await fetch(new URL(identityEndpoint).pathname, {
      headers: { Authorization: `Bearer ${sessid}` },
    });
    const identity = await identityResponse.json();
    const licenseQuery = "SELECT TotalLicenses, UsedLicenses, Name FROM UserLicense WHERE LicenseDefinitionKey = 'SFDC'";
    const licenseUrl = `${'/services/data/v51.0/query'
      + '?'}${
      new URLSearchParams({ q: licenseQuery }).toString()}`;
    const licenseResponse = await fetch(licenseUrl, {
      headers: { Authorization: `Bearer ${sessid}` },
    });
    const licenseJson = await licenseResponse.json();
    const licenseInfo = licenseJson.records[0];
    const limitsEndpoint = endpoints.limits;
    const limitsResponse = await fetch(limitsEndpoint, {
      headers: { Authorization: `Bearer ${sessid}` },
    });
    const limits = await limitsResponse.json();
    window.copyVal = (el) => {
      const inp = el.previousSibling.firstElementChild;
      inp.select();
      navigator.clipboard.writeText(inp.value);
      return false;
    };
    const html = [
      '<head>',
      '<style>',
      'body {font-family: system-ui}',
      'label {font-weight: bold}',
      'a {font-size: larger; text-decoration: none}',
      '</style>',
      '</head>',
      '<body>',
      `<h1>${orgInfo.Name} (${
        orgInfo.IsSandbox
          ? `Sandbox “${window.location.host.split('.')[0].split('--')[1]}”`
          : 'Production'
      })</h1>`,
      `<h2>${orgInfo.OrganizationType} ${
        document.querySelector('Version:last-child label').textContent
      }</h2>`,
      `<p>${
        orgInfo.TrialExpirationDate
          ? `<strong>Trial ends on ${new Date(orgInfo.TrialExpirationDate).toLocaleString()}</strong>`
          : '(This is not a trial org.)'
      }</p>`,
      `<p><a href="https://status.salesforce.com/instances/${orgInfo.InstanceName}" target="_blank"><b>Status:</b> ${orgStatus.status}</a></p>`,
      `<p><label>Org ID: <input readonly="readonly" type="text" value="${orgid15}" /></label><a href="#" onclick="copyVal(this)">📋</a></p>`,
      `<p><label>18-digit Org ID: <input readonly="readonly" type="text" value="${orgInfo.Id}" /></label><a href="#" onclick="copyVal(this)">📋</a></p>`,
      `<p><b>Salesforce licenses:</b> Using ${licenseInfo.UsedLicenses} out of ${licenseInfo.TotalLicenses}</p>`,
      `<p><b>Data storage:</b> ${limits.DataStorageMB.Remaining} MB remaining out of ${limits.DataStorageMB.Max} MB</p>`,
      `<p><b>Latest API version supported:</b> ${
        document.querySelector('Version:last-child version').textContent
      }</p>`,
      `<p><b>Instance Name:</b> ${orgInfo.InstanceName}</p>`,
      `<p><b>Timezone:</b> ${orgInfo.TimeZoneSidKey}</p>`,
      `<p><b>Fiscal year starts:</b> ${Intl.DateTimeFormat('en', { month: 'long' }).format(new Date(1970, orgInfo.FiscalYearStartMonth - 1, 1))}</p>`,
      `<h3>Active User: ${identity.display_name}</h3>`,
      '<ul>',
      `<li><b>Username:</b> ${identity.username}</li>`,
      `<li><b>Email:</b> ${identity.email}</li>`,
      `<li><label>User ID: <input readonly="readonly" type="text" value="${identity.user_id}" /></label><a href="#" onclick="copyVal(this)">📋</a></li>`,
      `<li><b>Timezone:</b> ${identity.timezone}</li>`,
      `<li><label>Session ID: <input readonly="readonly" type="password" value="${sessid}" style="max-width: 90vw; width: 50em" /></label><a href="#" onclick="copyVal(this)">📋</a></li>`,
      '</ul>',
      '</body>',
    ].join('\n');
    const doc = document.createElementNS('http://www.w3.org/1999/xhtml', 'html');
    doc.innerHTML = html;
    document.documentElement.replaceWith(doc);
  } else {
    window.open(window.location.origin + apipath, '_blank');
  }
})();
