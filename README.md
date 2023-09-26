# Create Informational Syschange Github Action

Creates an informational syschange via Jira Service Management.

## Usage

```yaml
- name: Create Informational Syschange
  uses: brownuniversity/create-informational-syschange@v2
```

See [syschange.yaml](.github/workflows/syschange.yaml) for an example, and use the [Actions tab](https://github.com/BrownUniversity/create-informational-syschange/actions/workflows/syschange.yaml) to run it.

### Inputs

#### Required

- `summary`: Summary of change
- `author`: GitHub username of triggering user
- `affectedService`: Atlassian ID of the affected service (see below)
- `apiKey`: Atlassian API key

#### Optional

- `description`: Longer description of change
- `group`: Responsible group for the change (defaults to Web Services)
- `installer`: Installer Atlassian ID (defaults to Web Services team account)

### Outputs

- `ticket-link`: Link to ticket in Jira Service Management

### Required Data

To find the Atlassian ID of the affected service (we'll use ASK as an example):

1. Navigate to the JSM application object collection: https://brown.atlassian.net/jira/servicedesk/assets/object-schema/3?typeId=25
2. Locate your service: https://brown.atlassian.net/jira/servicedesk/assets/object-schema/3?typeId=25&objectId=509576
3. Grab the `objectId` from URL: `509576`
