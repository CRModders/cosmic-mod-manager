import MarkdownRenderBox from "~/components/md-renderer";

export default function () {
    return (
        <main className="grid grid-cols-1 w-full overflow-auto">
            <MarkdownRenderBox
                className="bg-card-background p-6 pt-0 rounded-lg"
                text={`
# Services' status

<table>
  <thead>
    <tr>
      <th></th>
      <th>Status&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
      <th>Uptime&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
      <th>Latency&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Website</strong></td>
      <td>
        <picture>
          <img src="https://status.crmm.tech/api/badge/1/status?style=for-the-badge" alt="Website Status">
        </picture>
      </td>
      <td>
        <picture>
          <img src="https://status.crmm.tech/api/badge/1/uptime?style=for-the-badge" alt="Website Uptime">
        </picture>
      </td>
      <td>
        <picture>
          <img src="https://status.crmm.tech/api/badge/1/avg-response?style=for-the-badge" alt="Website Latency">
        </picture>
      </td>
    </tr>
    <tr>
      <td><strong>API</strong></td>
      <td>
        <picture>
          <img src="https://status.crmm.tech/api/badge/2/status?style=for-the-badge" alt="API Status">
        </picture>
      </td>
      <td>
        <picture>
          <img src="https://status.crmm.tech/api/badge/2/uptime?style=for-the-badge" alt="API Uptime">
        </picture>
      </td>
      <td>
        <picture>
          <img src="https://status.crmm.tech/api/badge/2/avg-response?style=for-the-badge" alt="API Latency">
        </picture>
      </td>
    </tr>
    <tr>
      <td><strong>Search</strong></td>
      <td>
        <picture>
          <img src="https://status.crmm.tech/api/badge/3/status?style=for-the-badge" alt="Search Status">
        </picture>
      </td>
      <td>
        <picture>
          <img src="https://status.crmm.tech/api/badge/3/uptime?style=for-the-badge" alt="Search Uptime">
        </picture>
      </td>
      <td>
        <picture>
          <img src="https://status.crmm.tech/api/badge/3/avg-response?style=for-the-badge" alt="Search Latency">
        </picture>
      </td>
    </tr>
    <tr>
      <td><strong>CDN</strong></td>
      <td>
        <picture>
          <img src="https://status.crmm.tech/api/badge/5/status?style=for-the-badge" alt="CDN Status">
        </picture>
      </td>
      <td>
        <picture>
          <img src="https://status.crmm.tech/api/badge/5/uptime?style=for-the-badge" alt="CDN Uptime">
        </picture>
      </td>
      <td>
        <picture>
          <img src="https://status.crmm.tech/api/badge/5/avg-response?style=for-the-badge" alt="CDN Latency">
        </picture>
      </td>
    </tr>
    <tr>
      <td><strong>Database</strong></td>
      <td>
        <picture>
          <img src="https://status.crmm.tech/api/badge/4/status?style=for-the-badge" alt="Database Status">
        </picture>
      </td>
      <td>
        <picture>
          <img src="https://status.crmm.tech/api/badge/4/uptime?style=for-the-badge" alt="Database Uptime">
        </picture>
      </td>
      <td>
        <picture>
          <img src="https://status.crmm.tech/api/badge/4/avg-response?style=for-the-badge" alt="Database Latency">
        </picture>
      </td>
    </tr>
    <tr>
      <td><strong>Redis Cache</strong></td>
      <td>
        <picture>
          <img src="https://status.crmm.tech/api/badge/6/status?style=for-the-badge" alt="Redis Cache Status">
        </picture>
      </td>
      <td>
        <picture>
          <img src="https://status.crmm.tech/api/badge/6/uptime?style=for-the-badge" alt="Redis Cache Uptime">
        </picture>
      </td>
      <td>
        <picture>
          <img src="https://status.crmm.tech/api/badge/6/avg-response?style=for-the-badge" alt="Redis Cache Latency">
        </picture>
      </td>
    </tr>
  </tbody>
</table>


Visit [status.crmm.tech](https://status.crmm.tech) for more details.
`}
            />
        </main>
    );
}
