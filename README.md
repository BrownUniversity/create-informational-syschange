# Create Informational Syschange Github Action

Creates an informational syschange via Jira Service Management.

## Usage

```yaml
- name: Create Informational Syschange
  uses: brownuniversity/create-informational-syschange@v1
```

See [syschange.yml](.github/workflows/syschange.yml) for an example, and use the [Actions tab](https://github.com/BrownUniversity/create-informational-syschange/actions/workflows/syschange.yaml) to run it.

### Inputs

#### Required

- `summary`: Summary of change

#### Optional

- `description`: Longer description of change
- `group`: Responsible group for the change (defaults to Web Services)
- `installer`: Installer Atlassian ID (defaults to Web Services team account)

### Outputs

- `ticket-link`: Link to ticket in Jira Service Management
