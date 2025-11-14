#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { ClockifyAPI } from "./clockify-api.js";

// Initialize Clockify API client
const apiKey = process.env.CLOCKIFY_API_KEY;
const baseUrl =
  process.env.CLOCKIFY_API_BASE_URL || "https://api.clockify.me/api/v1";

if (!apiKey) {
  console.error("Error: CLOCKIFY_API_KEY environment variable is required");
  process.exit(1);
}

const clockify = new ClockifyAPI(apiKey, baseUrl);

// Create MCP server
const server = new Server(
  {
    name: "clockify-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_workspaces",
        description: "Retrieve all workspaces for the authenticated user",
        inputSchema: {
          type: "object",
          properties: {},
          required: [],
        },
      },
      {
        name: "get_workspace",
        description: "Get details of a specific workspace",
        inputSchema: {
          type: "object",
          properties: {
            workspaceId: {
              type: "string",
              description: "The workspace ID",
            },
          },
          required: ["workspaceId"],
        },
      },
      {
        name: "get_projects",
        description: "Retrieve all projects in a workspace",
        inputSchema: {
          type: "object",
          properties: {
            workspaceId: {
              type: "string",
              description: "The workspace ID",
            },
            archived: {
              type: "boolean",
              description: "Filter archived projects (default: false)",
              default: false,
            },
            name: {
              type: "string",
              description: "Filter projects by name",
            },
            page: {
              type: "number",
              description: "Page number for pagination",
              default: 1,
            },
            pageSize: {
              type: "number",
              description: "Number of items per page",
              default: 50,
            },
          },
          required: ["workspaceId"],
        },
      },
      {
        name: "get_project",
        description: "Get details of a specific project",
        inputSchema: {
          type: "object",
          properties: {
            workspaceId: {
              type: "string",
              description: "The workspace ID",
            },
            projectId: {
              type: "string",
              description: "The project ID",
            },
          },
          required: ["workspaceId", "projectId"],
        },
      },
      {
        name: "create_project",
        description: "Create a new project in a workspace",
        inputSchema: {
          type: "object",
          properties: {
            workspaceId: {
              type: "string",
              description: "The workspace ID",
            },
            name: {
              type: "string",
              description: "Project name",
            },
            clientId: {
              type: "string",
              description: "Client ID to associate with the project",
            },
            color: {
              type: "string",
              description: "Project color (hex code)",
            },
            note: {
              type: "string",
              description: "Project notes",
            },
            billable: {
              type: "boolean",
              description: "Whether the project is billable",
              default: false,
            },
            public: {
              type: "boolean",
              description: "Whether the project is public",
              default: false,
            },
          },
          required: ["workspaceId", "name"],
        },
      },
      {
        name: "update_project",
        description: "Update an existing project",
        inputSchema: {
          type: "object",
          properties: {
            workspaceId: {
              type: "string",
              description: "The workspace ID",
            },
            projectId: {
              type: "string",
              description: "The project ID",
            },
            name: {
              type: "string",
              description: "Project name",
            },
            clientId: {
              type: "string",
              description: "Client ID to associate with the project",
            },
            color: {
              type: "string",
              description: "Project color (hex code)",
            },
            note: {
              type: "string",
              description: "Project notes",
            },
            billable: {
              type: "boolean",
              description: "Whether the project is billable",
            },
            archived: {
              type: "boolean",
              description: "Whether the project is archived",
            },
          },
          required: ["workspaceId", "projectId"],
        },
      },
      {
        name: "delete_project",
        description: "Delete a project",
        inputSchema: {
          type: "object",
          properties: {
            workspaceId: {
              type: "string",
              description: "The workspace ID",
            },
            projectId: {
              type: "string",
              description: "The project ID",
            },
          },
          required: ["workspaceId", "projectId"],
        },
      },
      {
        name: "get_tags",
        description: "Retrieve all tags in a workspace",
        inputSchema: {
          type: "object",
          properties: {
            workspaceId: {
              type: "string",
              description: "The workspace ID",
            },
            archived: {
              type: "boolean",
              description: "Filter archived tags",
            },
            name: {
              type: "string",
              description: "Filter tags by name",
            },
          },
          required: ["workspaceId"],
        },
      },
      {
        name: "create_tag",
        description: "Create a new tag in a workspace",
        inputSchema: {
          type: "object",
          properties: {
            workspaceId: {
              type: "string",
              description: "The workspace ID",
            },
            name: {
              type: "string",
              description: "Tag name",
            },
          },
          required: ["workspaceId", "name"],
        },
      },
      {
        name: "get_time_entries",
        description: "Retrieve time entries in a workspace",
        inputSchema: {
          type: "object",
          properties: {
            workspaceId: {
              type: "string",
              description: "The workspace ID",
            },
            userId: {
              type: "string",
              description: "Filter by user ID (defaults to current user)",
            },
            projectId: {
              type: "string",
              description: "Filter by project ID",
            },
            start: {
              type: "string",
              description: "Start date (ISO 8601 format)",
            },
            end: {
              type: "string",
              description: "End date (ISO 8601 format)",
            },
            description: {
              type: "string",
              description: "Filter by description",
            },
          },
          required: ["workspaceId"],
        },
      },
      {
        name: "create_time_entry",
        description: "Create a new time entry with optional project and tags",
        inputSchema: {
          type: "object",
          properties: {
            workspaceId: {
              type: "string",
              description: "The workspace ID",
            },
            start: {
              type: "string",
              description: "Start time in ISO 8601 format",
            },
            end: {
              type: "string",
              description:
                "End time in ISO 8601 format (optional for running entries)",
            },
            description: {
              type: "string",
              description: "Description of the time entry",
            },
            projectId: {
              type: "string",
              description: "Project ID to associate with the time entry",
            },
            taskId: {
              type: "string",
              description: "Task ID to associate with the time entry",
            },
            tagIds: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Array of tag IDs",
            },
            billable: {
              type: "boolean",
              description: "Whether the time entry is billable",
            },
          },
          required: ["workspaceId", "start"],
        },
      },
      {
        name: "update_time_entry",
        description: "Update an existing time entry",
        inputSchema: {
          type: "object",
          properties: {
            workspaceId: {
              type: "string",
              description: "The workspace ID",
            },
            timeEntryId: {
              type: "string",
              description: "The time entry ID",
            },
            start: {
              type: "string",
              description: "Start time in ISO 8601 format",
            },
            end: {
              type: "string",
              description: "End time in ISO 8601 format",
            },
            description: {
              type: "string",
              description: "Description of the time entry",
            },
            projectId: {
              type: "string",
              description: "Project ID",
            },
            tagIds: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Array of tag IDs",
            },
            billable: {
              type: "boolean",
              description: "Whether the time entry is billable",
            },
          },
          required: ["workspaceId", "timeEntryId"],
        },
      },
      {
        name: "delete_time_entry",
        description: "Delete a time entry",
        inputSchema: {
          type: "object",
          properties: {
            workspaceId: {
              type: "string",
              description: "The workspace ID",
            },
            timeEntryId: {
              type: "string",
              description: "The time entry ID",
            },
          },
          required: ["workspaceId", "timeEntryId"],
        },
      },
      {
        name: "start_time_entry",
        description: "Start a new running time entry",
        inputSchema: {
          type: "object",
          properties: {
            workspaceId: {
              type: "string",
              description: "The workspace ID",
            },
            description: {
              type: "string",
              description: "Description of the time entry",
            },
            projectId: {
              type: "string",
              description: "Project ID",
            },
            taskId: {
              type: "string",
              description: "Task ID",
            },
            tagIds: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Array of tag IDs",
            },
            billable: {
              type: "boolean",
              description: "Whether the time entry is billable",
            },
          },
          required: ["workspaceId"],
        },
      },
      {
        name: "stop_time_entry",
        description: "Stop a running time entry",
        inputSchema: {
          type: "object",
          properties: {
            workspaceId: {
              type: "string",
              description: "The workspace ID",
            },
            end: {
              type: "string",
              description:
                "End time in ISO 8601 format (optional, defaults to now)",
            },
          },
          required: ["workspaceId"],
        },
      },
      {
        name: "get_running_time_entry",
        description: "Get the currently running time entry for a user",
        inputSchema: {
          type: "object",
          properties: {
            workspaceId: {
              type: "string",
              description: "The workspace ID",
            },
            userId: {
              type: "string",
              description: "User ID (defaults to authenticated user)",
            },
          },
          required: ["workspaceId"],
        },
      },
      {
        name: "get_clients",
        description: "Retrieve all clients in a workspace",
        inputSchema: {
          type: "object",
          properties: {
            workspaceId: {
              type: "string",
              description: "The workspace ID",
            },
            archived: {
              type: "boolean",
              description: "Filter archived clients",
            },
            name: {
              type: "string",
              description: "Filter clients by name",
            },
          },
          required: ["workspaceId"],
        },
      },
      {
        name: "create_client",
        description: "Create a new client in a workspace",
        inputSchema: {
          type: "object",
          properties: {
            workspaceId: {
              type: "string",
              description: "The workspace ID",
            },
            name: {
              type: "string",
              description: "Client name",
            },
            note: {
              type: "string",
              description: "Client notes",
            },
          },
          required: ["workspaceId", "name"],
        },
      },
      {
        name: "get_tasks",
        description: "Retrieve all tasks in a project",
        inputSchema: {
          type: "object",
          properties: {
            workspaceId: {
              type: "string",
              description: "The workspace ID",
            },
            projectId: {
              type: "string",
              description: "The project ID",
            },
            isActive: {
              type: "boolean",
              description: "Filter active tasks",
            },
          },
          required: ["workspaceId", "projectId"],
        },
      },
      {
        name: "create_task",
        description: "Create a new task in a project",
        inputSchema: {
          type: "object",
          properties: {
            workspaceId: {
              type: "string",
              description: "The workspace ID",
            },
            projectId: {
              type: "string",
              description: "The project ID",
            },
            name: {
              type: "string",
              description: "Task name",
            },
            assigneeIds: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Array of user IDs to assign",
            },
          },
          required: ["workspaceId", "projectId", "name"],
        },
      },
      {
        name: "get_current_user",
        description: "Get details of the authenticated user",
        inputSchema: {
          type: "object",
          properties: {},
          required: [],
        },
      },
      {
        name: "get_users",
        description: "Retrieve all users in a workspace",
        inputSchema: {
          type: "object",
          properties: {
            workspaceId: {
              type: "string",
              description: "The workspace ID",
            },
          },
          required: ["workspaceId"],
        },
      },
      {
        name: "get_reports",
        description: "Get time tracking reports for a workspace",
        inputSchema: {
          type: "object",
          properties: {
            workspaceId: {
              type: "string",
              description: "The workspace ID",
            },
            start: {
              type: "string",
              description: "Start date (ISO 8601 format)",
            },
            end: {
              type: "string",
              description: "End date (ISO 8601 format)",
            },
            projectIds: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Filter by project IDs",
            },
            userIds: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Filter by user IDs",
            },
            groupBy: {
              type: "string",
              description: "Group report by field (PROJECT, USER, TAG, etc.)",
            },
          },
          required: ["workspaceId"],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "get_workspaces": {
        const result = await clockify.getWorkspaces();
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "get_workspace": {
        const result = await clockify.getWorkspace(args.workspaceId);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "get_projects": {
        const result = await clockify.getProjects(args.workspaceId, args);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "get_project": {
        const result = await clockify.getProject(
          args.workspaceId,
          args.projectId
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "create_project": {
        const { workspaceId, ...projectData } = args;
        const result = await clockify.createProject(workspaceId, projectData);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "update_project": {
        const { workspaceId, projectId, ...projectData } = args;
        const result = await clockify.updateProject(
          workspaceId,
          projectId,
          projectData
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "delete_project": {
        await clockify.deleteProject(args.workspaceId, args.projectId);
        return {
          content: [
            {
              type: "text",
              text: "Project deleted successfully",
            },
          ],
        };
      }

      case "get_tags": {
        const result = await clockify.getTags(args.workspaceId, args);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "create_tag": {
        const { workspaceId, ...tagData } = args;
        const result = await clockify.createTag(workspaceId, tagData);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "get_time_entries": {
        const { workspaceId, userId, ...params } = args;
        const user = userId || (await clockify.getCurrentUser()).id;
        const result = await clockify.getTimeEntries(workspaceId, user, params);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "create_time_entry": {
        const { workspaceId, ...entryData } = args;
        const user = await clockify.getCurrentUser();
        const result = await clockify.createTimeEntry(
          workspaceId,
          user.id,
          entryData
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "update_time_entry": {
        const { workspaceId, timeEntryId, ...entryData } = args;
        const result = await clockify.updateTimeEntry(
          workspaceId,
          timeEntryId,
          entryData
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "delete_time_entry": {
        await clockify.deleteTimeEntry(args.workspaceId, args.timeEntryId);
        return {
          content: [
            {
              type: "text",
              text: "Time entry deleted successfully",
            },
          ],
        };
      }

      case "start_time_entry": {
        const { workspaceId, ...entryData } = args;
        const user = await clockify.getCurrentUser();
        const data = {
          ...entryData,
          start: new Date().toISOString(),
        };
        const result = await clockify.createTimeEntry(
          workspaceId,
          user.id,
          data
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "stop_time_entry": {
        const { workspaceId, end } = args;
        const user = await clockify.getCurrentUser();
        const data = {
          end: end || new Date().toISOString(),
        };
        const result = await clockify.stopTimeEntry(workspaceId, user.id, data);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "get_running_time_entry": {
        const { workspaceId, userId } = args;
        const user = userId || (await clockify.getCurrentUser()).id;
        const result = await clockify.getRunningTimeEntry(workspaceId, user);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "get_clients": {
        const result = await clockify.getClients(args.workspaceId, args);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "create_client": {
        const { workspaceId, ...clientData } = args;
        const result = await clockify.createClient(workspaceId, clientData);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "get_tasks": {
        const { workspaceId, projectId, ...params } = args;
        const result = await clockify.getTasks(workspaceId, projectId, params);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "create_task": {
        const { workspaceId, projectId, ...taskData } = args;
        const result = await clockify.createTask(
          workspaceId,
          projectId,
          taskData
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "get_current_user": {
        const result = await clockify.getCurrentUser();
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "get_users": {
        const result = await clockify.getUsers(args.workspaceId, args);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "get_reports": {
        const { workspaceId, ...reportData } = args;
        const dateRange = {};
        if (reportData.start) dateRange.start = reportData.start;
        if (reportData.end) dateRange.end = reportData.end;

        const data = {
          dateRangeStart: reportData.start,
          dateRangeEnd: reportData.end,
          summaryFilter: {
            groups: reportData.groupBy ? [reportData.groupBy] : [],
          },
        };

        if (reportData.projectIds) data.projects = reportData.projectIds;
        if (reportData.userIds) data.users = reportData.userIds;

        const result = await clockify.getReports(workspaceId, data);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

// List available resources
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: "clockify://workspaces",
        name: "Clockify Workspaces",
        description:
          "List of all workspaces accessible to the authenticated user",
        mimeType: "application/json",
      },
    ],
  };
});

// Read resources
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  try {
    if (uri === "clockify://workspaces") {
      const workspaces = await clockify.getWorkspaces();
      return {
        contents: [
          {
            uri,
            mimeType: "application/json",
            text: JSON.stringify(workspaces, null, 2),
          },
        ],
      };
    }

    throw new Error(`Unknown resource: ${uri}`);
  } catch (error) {
    throw new Error(`Failed to read resource: ${error.message}`);
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Clockify MCP server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
