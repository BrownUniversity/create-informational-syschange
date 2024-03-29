import * as core from "@actions/core";
import { HttpClient } from "@actions/http-client";

const jsmConstants = {
  PROJECT_TYPE: "SYS",
  ISSUE_TYPE: "10014", // [System] Informational Change
  INFORMATIONAL: "74", // Informational System Change
  WORKSPACE_ID: "3015eb17-fcd8-4eb8-b534-dfbce48cd828",
  DEFAULT_INSTALLER: "712020:db823f4a-761e-42b7-aff2-bcd0a391c480", // oit-eas-blackhole
};
const customFields = {
  REQUEST_TYPE: "customfield_10010",
  RESPONSIBLE_GROUP: "customfield_10058",
  AFFECTED_SERVICES: "customfield_10171",
  AFFECTED_INTEGRATIONS: "customfield_10406",
  GITHUB_ID: "customfield_10392",
  PLANNED_START: "customfield_10107",
  PLANNED_END: "customfield_10049",
};

export default async function run(): Promise<void> {
  try {
    const inputs = {
      summary: core.getInput("summary", { required: true }),
      author: core.getInput("author", { required: true }),
      group: core.getInput("group", { required: true }),
      affectedServices: core.getInput("affectedServices", { required: true }),
      affectedIntegrations: core.getInput("affectedIntegrations") || "",
      apiKey: core.getInput("apiKey", { required: true }),
      description: core.getInput("description") || "",
      installer: core.getInput("installer") || jsmConstants.DEFAULT_INSTALLER,
    };
    const affectedServicesJson = inputs.affectedServices
      .split(",")
      .map((id) => ({ id: `${jsmConstants.WORKSPACE_ID}:${id}` }));
    const affectedIntegrationsJson = inputs.affectedIntegrations
      .split(",")
      .filter((x) => x)
      .map((id) => ({ id: `${jsmConstants.WORKSPACE_ID}:${id}` }));
    const now = new Date().toISOString().replace(/\.\d+/, "");
    const data = {
      fields: {
        summary: inputs.summary,
        description: inputs.description,
        project: { key: jsmConstants.PROJECT_TYPE },
        reporter: { id: inputs.installer },
        issuetype: { id: jsmConstants.ISSUE_TYPE },
        [customFields.REQUEST_TYPE]: jsmConstants.INFORMATIONAL,
        [customFields.RESPONSIBLE_GROUP]: { name: inputs.group },
        [customFields.AFFECTED_SERVICES]: affectedServicesJson,
        [customFields.GITHUB_ID]: inputs.author,
        [customFields.PLANNED_START]: now,
        [customFields.PLANNED_END]: now,
      },
    };
    if (affectedIntegrationsJson.length > 0) {
      data.fields[customFields.AFFECTED_INTEGRATIONS] =
        affectedIntegrationsJson;
    }
    const headers = {
      authorization: `Basic ${Buffer.from(inputs.apiKey).toString("base64")}`,
    };
    const client = new HttpClient("create-informational-syschange");
    const response = await client.postJson<{ key: string }>(
      "https://brown.atlassian.net/rest/api/2/issue",
      data,
      headers,
    );
    core.debug(`${response.statusCode}`);
    if (response.statusCode < 300 && response.result) {
      core.setOutput(
        "ticket-link",
        `https://brown.atlassian.net/browse/${response.result.key}`,
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    }
  }
}
