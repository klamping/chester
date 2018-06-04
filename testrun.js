const executeTest = require('./executeTest.js');

const dbSettings = {};
const db = new Database(dbSettings);
await db.init();

function initTest (userId, projectId, command, opts) {
  const testRun = db.createTestrun(userId, {
    projectId
    command,
    opts
  });

  const gitUrl = users.getProjectGitUrl(userId, projectId)

  executeTest(testRun.id, gitUrl, command, opts);

  return testRun.id;
}