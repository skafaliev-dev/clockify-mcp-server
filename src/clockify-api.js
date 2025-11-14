// Moved to src/clockify-api.js
// This file has been removed as it has been relocated to the src directory.
// Please refer to src/clockify-api.js for the updated implementation.
import fetch from 'node-fetch';

export class ClockifyAPI {
  constructor(apiKey, baseUrl = 'https://api.clockify.me/api/v1') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  async request(method, endpoint, body = null) {
    const url = `${this.baseUrl}${endpoint}`;
    const options = {
      method,
      headers: {
        'X-Api-Key': this.apiKey,
        'Content-Type': 'application/json',
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Clockify API error (${response.status}): ${errorText}`);
    }

    // Handle empty responses
    if (response.status === 204) {
      return null;
    }

    const text = await response.text();
    return text ? JSON.parse(text) : null;
  }

  // Workspaces
  async getWorkspaces() {
    return this.request('GET', '/workspaces');
  }

  async getWorkspace(workspaceId) {
    return this.request('GET', `/workspaces/${workspaceId}`);
  }

  // Projects
  async getProjects(workspaceId, params = {}) {
    const queryParams = new URLSearchParams();
    if (params.archived !== undefined) queryParams.append('archived', params.archived);
    if (params.name) queryParams.append('name', params.name);
    if (params.page) queryParams.append('page', params.page);
    if (params.pageSize) queryParams.append('page-size', params.pageSize);
    
    const query = queryParams.toString();
    return this.request('GET', `/workspaces/${workspaceId}/projects${query ? '?' + query : ''}`);
  }

  async getProject(workspaceId, projectId) {
    return this.request('GET', `/workspaces/${workspaceId}/projects/${projectId}`);
  }

  async createProject(workspaceId, data) {
    return this.request('POST', `/workspaces/${workspaceId}/projects`, data);
  }

  async updateProject(workspaceId, projectId, data) {
    return this.request('PUT', `/workspaces/${workspaceId}/projects/${projectId}`, data);
  }

  async deleteProject(workspaceId, projectId) {
    return this.request('DELETE', `/workspaces/${workspaceId}/projects/${projectId}`);
  }

  // Tags
  async getTags(workspaceId, params = {}) {
    const queryParams = new URLSearchParams();
    if (params.archived !== undefined) queryParams.append('archived', params.archived);
    if (params.name) queryParams.append('name', params.name);
    if (params.page) queryParams.append('page', params.page);
    if (params.pageSize) queryParams.append('page-size', params.pageSize);
    
    const query = queryParams.toString();
    return this.request('GET', `/workspaces/${workspaceId}/tags${query ? '?' + query : ''}`);
  }

  async getTag(workspaceId, tagId) {
    return this.request('GET', `/workspaces/${workspaceId}/tags/${tagId}`);
  }

  async createTag(workspaceId, data) {
    return this.request('POST', `/workspaces/${workspaceId}/tags`, data);
  }

  async updateTag(workspaceId, tagId, data) {
    return this.request('PUT', `/workspaces/${workspaceId}/tags/${tagId}`, data);
  }

  async deleteTag(workspaceId, tagId) {
    return this.request('DELETE', `/workspaces/${workspaceId}/tags/${tagId}`);
  }

  // Time Entries
  async getTimeEntries(workspaceId, userId, params = {}) {
    const queryParams = new URLSearchParams();
    if (params.start) queryParams.append('start', params.start);
    if (params.end) queryParams.append('end', params.end);
    if (params.projectId) queryParams.append('project', params.projectId);
    if (params.description) queryParams.append('description', params.description);
    if (params.page) queryParams.append('page', params.page);
    if (params.pageSize) queryParams.append('page-size', params.pageSize);
    
    const query = queryParams.toString();
    return this.request('GET', `/workspaces/${workspaceId}/user/${userId}/time-entries${query ? '?' + query : ''}`);
  }

  async getTimeEntry(workspaceId, timeEntryId) {
    return this.request('GET', `/workspaces/${workspaceId}/time-entries/${timeEntryId}`);
  }

  async createTimeEntry(workspaceId, userId, data) {
    return this.request('POST', `/workspaces/${workspaceId}/time-entries`, data);
  }

  async updateTimeEntry(workspaceId, timeEntryId, data) {
    return this.request('PUT', `/workspaces/${workspaceId}/time-entries/${timeEntryId}`, data);
  }

  async deleteTimeEntry(workspaceId, timeEntryId) {
    return this.request('DELETE', `/workspaces/${workspaceId}/time-entries/${timeEntryId}`);
  }

  async getRunningTimeEntry(workspaceId, userId) {
    const entries = await this.getTimeEntries(workspaceId, userId, { 'in-progress': true });
    return entries && entries.length > 0 ? entries[0] : null;
  }

  async stopTimeEntry(workspaceId, userId, data) {
    return this.request('PATCH', `/workspaces/${workspaceId}/user/${userId}/time-entries`, data);
  }

  // Clients
  async getClients(workspaceId, params = {}) {
    const queryParams = new URLSearchParams();
    if (params.archived !== undefined) queryParams.append('archived', params.archived);
    if (params.name) queryParams.append('name', params.name);
    if (params.page) queryParams.append('page', params.page);
    if (params.pageSize) queryParams.append('page-size', params.pageSize);
    
    const query = queryParams.toString();
    return this.request('GET', `/workspaces/${workspaceId}/clients${query ? '?' + query : ''}`);
  }

  async getClient(workspaceId, clientId) {
    return this.request('GET', `/workspaces/${workspaceId}/clients/${clientId}`);
  }

  async createClient(workspaceId, data) {
    return this.request('POST', `/workspaces/${workspaceId}/clients`, data);
  }

  async updateClient(workspaceId, clientId, data) {
    return this.request('PUT', `/workspaces/${workspaceId}/clients/${clientId}`, data);
  }

  async deleteClient(workspaceId, clientId) {
    return this.request('DELETE', `/workspaces/${workspaceId}/clients/${clientId}`);
  }

  // Tasks
  async getTasks(workspaceId, projectId, params = {}) {
    const queryParams = new URLSearchParams();
    if (params.isActive !== undefined) queryParams.append('is-active', params.isActive);
    if (params.name) queryParams.append('name', params.name);
    if (params.page) queryParams.append('page', params.page);
    if (params.pageSize) queryParams.append('page-size', params.pageSize);
    
    const query = queryParams.toString();
    return this.request('GET', `/workspaces/${workspaceId}/projects/${projectId}/tasks${query ? '?' + query : ''}`);
  }

  async getTask(workspaceId, projectId, taskId) {
    return this.request('GET', `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`);
  }

  async createTask(workspaceId, projectId, data) {
    return this.request('POST', `/workspaces/${workspaceId}/projects/${projectId}/tasks`, data);
  }

  async updateTask(workspaceId, projectId, taskId, data) {
    return this.request('PUT', `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`, data);
  }

  async deleteTask(workspaceId, projectId, taskId) {
    return this.request('DELETE', `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`);
  }

  // Users
  async getUsers(workspaceId, params = {}) {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.pageSize) queryParams.append('page-size', params.pageSize);
    
    const query = queryParams.toString();
    return this.request('GET', `/workspaces/${workspaceId}/users${query ? '?' + query : ''}`);
  }

  async getUser(workspaceId, userId) {
    return this.request('GET', `/workspaces/${workspaceId}/users/${userId}`);
  }

  async getCurrentUser() {
    return this.request('GET', '/user');
  }

  // Reports
  async getReports(workspaceId, data) {
    return this.request('POST', `/workspaces/${workspaceId}/reports/summary`, data);
  }
}
