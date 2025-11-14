# Clockify MCP Server

A Model Context Protocol (MCP) server for Clockify time tracking integration. This server enables AI assistants to interact with Clockify's API to manage time entries, projects, tags, clients, tasks, and more.

## Features

- **Workspaces**: Retrieve workspace information
- **Projects**: Create, read, update, and delete projects
- **Time Entries**: Track time with full CRUD operations
- **Tags**: Organize time entries with tags
- **Clients**: Manage client information
- **Tasks**: Create and manage tasks within projects
- **Users**: Retrieve user information
- **Reports**: Generate time tracking reports

## Prerequisites

- Node.js 18.0.0 or higher
- A Clockify account with API access
- Clockify API key

## Installation

1. Clone or download this repository

2. Install dependencies:
```bash
npm install
```

3. Set up your environment variables (see Configuration below)

## Configuration

### Get Your Clockify API Key

1. Log in to Clockify
2. Go to Settings → Advanced → Manage API keys
3. Copy your API key

### Environment Variables

Set the following environment variables:

```bash
CLOCKIFY_API_KEY=your_api_key_here
CLOCKIFY_API_BASE_URL=https://api.clockify.me/api/v1  # Optional, defaults to this value
```

**Regional URLs** (if you're using a regional instance):
- EU: `https://euc1.clockify.me/api/v1`
- US: `https://use2.clockify.me/api/v1`
- UK: `https://euw2.clockify.me/api/v1`
- AU: `https://apse2.clockify.me/api/v1`

## Usage

### Running the Server

```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

### Using with Claude Desktop

Add to your Claude Desktop configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "clockify": {
      "command": "node",
      "args": ["<path-to-your-server.js>"],
      "env": {
        "CLOCKIFY_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

### Using with Other MCP Clients

The server communicates over stdio and follows the Model Context Protocol specification. Configure your MCP client to run:

```bash
node server.js
```

with the appropriate environment variables set.

## Available Tools

### Workspace Tools
- `get_workspaces` - Get all accessible workspaces
- `get_workspace` - Get details of a specific workspace

### Project Tools
- `get_projects` - List projects in a workspace
- `get_project` - Get project details
- `create_project` - Create a new project
- `update_project` - Update project details
- `delete_project` - Delete a project

### Time Entry Tools
- `get_time_entries` - List time entries
- `create_time_entry` - Create a new time entry
- `update_time_entry` - Update a time entry
- `delete_time_entry` - Delete a time entry
- `start_time_entry` - Start a running timer
- `stop_time_entry` - Stop the current timer
- `get_running_time_entry` - Get currently running time entry

### Tag Tools
- `get_tags` - List tags in a workspace
- `create_tag` - Create a new tag

### Client Tools
- `get_clients` - List clients in a workspace
- `create_client` - Create a new client

### Task Tools
- `get_tasks` - List tasks in a project
- `create_task` - Create a new task

### User Tools
- `get_current_user` - Get authenticated user details
- `get_users` - List users in a workspace

### Reporting Tools
- `get_reports` - Generate time tracking reports

## Example Usage

### Starting a Timer

```json
{
  "tool": "start_time_entry",
  "arguments": {
    "workspaceId": "your_workspace_id",
    "description": "Working on documentation",
    "projectId": "your_project_id",
    "tagIds": ["tag_id_1", "tag_id_2"],
    "billable": true
  }
}
```

### Creating a Project

```json
{
  "tool": "create_project",
  "arguments": {
    "workspaceId": "your_workspace_id",
    "name": "New Project",
    "clientId": "client_id",
    "color": "#FF5733",
    "billable": true
  }
}
```

### Getting Time Entries

```json
{
  "tool": "get_time_entries",
  "arguments": {
    "workspaceId": "your_workspace_id",
    "start": "2025-01-01T00:00:00Z",
    "end": "2025-01-31T23:59:59Z",
    "projectId": "your_project_id"
  }
}
```

## API Rate Limits

Clockify API has a rate limit of **50 requests per second** per add-on on one workspace. The server does not currently implement rate limiting, so be mindful of this when making requests.

## Resources

The server exposes the following resources:

- `clockify://workspaces` - List of all workspaces

## Error Handling

The server handles errors from the Clockify API and returns them in a structured format. Common errors include:

- Missing or invalid API key
- Invalid workspace/project/tag IDs
- Rate limit exceeded
- Insufficient permissions

## Development

### Project Structure

```
mcp/
├── server.js              # Main MCP server implementation
├── clockify-api.js        # Clockify API client wrapper
├── package.json           # Project dependencies
├── clockify-mcp-spec.json # API specification
└── README.md             # This file
```

### Adding New Tools

1. Add the tool definition in the `ListToolsRequestSchema` handler
2. Implement the API method in `clockify-api.js` if needed
3. Add the tool handler case in the `CallToolRequestSchema` handler

## Troubleshooting

### "CLOCKIFY_API_KEY environment variable is required"
- Make sure you've set the `CLOCKIFY_API_KEY` environment variable
- Check that your MCP client configuration includes the env variables

### API errors
- Verify your API key is valid in Clockify settings
- Check that you're using the correct workspace/project IDs
- Ensure you have the necessary permissions in Clockify

### Connection issues
- Verify you're using the correct regional API URL if applicable
- Check your internet connection
- Ensure Clockify services are operational

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

MIT

## Related Links

- [Clockify API Documentation](https://clockify.me/developers-api)
- [Model Context Protocol](https://modelcontextprotocol.io)
- [MCP SDK](https://github.com/modelcontextprotocol/typescript-sdk)

## Support

For issues related to:
- **This MCP server**: Open an issue in this repository
- **Clockify API**: Contact Clockify support
- **MCP protocol**: Check the MCP documentation
