const dbSettings = {};
const db = new Database(dbSettings);

async function executeTest (testRunId, gitUrl, command, opts) {
  await db.init();

  const testRun = db.getTestRun(testRunId);

  const folder = `/tmp/run-{testRunId}`;

  testRun.setStatus('cloning');
  try {
    await clone(gitUrl, folder);
  } catch (e) {
    testRun.setStatus('error cloning', e);
  }

  testRun.setStatus('installing');
  try {
    await npm(folder);
  } catch (e) {
    testRun.setStatus('error installing', e);
  }

  testRun.setStatus('running tests');
  let results;
  try {
    results = await runTest(folder, command, opts);
  } catch (e) {
    testRun.setStatus('error running test', e);
  }

  testRun.storeResults(results);

  testRun.setStatus('creating report');
  try {
    const report = await createReport(folder);
  } catch (e) {
    testRun.setStatus('error creating report', e);
  }

  testRun.storeReport(report);

  testRun.setStatus('complete');
}