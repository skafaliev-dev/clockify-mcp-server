import { ClockifyAPI } from '../src/clockify-api.js';

// Mock values for testing
const apiKey = 'test-api-key';
const baseUrl = 'https://api.clockify.me/api/v1';
const clockify = new ClockifyAPI(apiKey, baseUrl);

function test(description, fn) {
  try {
    fn();
    console.log(`✔️  ${description}`);
  } catch (error) {
    console.error(`❌  ${description}`);
    console.error(error);
  }
}

test('ClockifyAPI initializes with apiKey and baseUrl', () => {
  if (clockify.apiKey !== apiKey) throw new Error('apiKey not set correctly');
  if (clockify.baseUrl !== baseUrl) throw new Error('baseUrl not set correctly');
});

test('ClockifyAPI has request method', () => {
  if (typeof clockify.request !== 'function') throw new Error('request method missing');
});

test('ClockifyAPI has getWorkspaces method', () => {
  if (typeof clockify.getWorkspaces !== 'function') throw new Error('getWorkspaces method missing');
});

test('ClockifyAPI has getProjects method', () => {
  if (typeof clockify.getProjects !== 'function') throw new Error('getProjects method missing');
});

test('ClockifyAPI has getClients method', () => {
  if (typeof clockify.getClients !== 'function') throw new Error('getClients method missing');
});
