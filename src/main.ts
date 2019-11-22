import * as core from '@actions/core';
import * as github from '@actions/github';
import { getConfiguredComments } from './services';

async function run() {
  try {
    const nitpickerFile = core.getInput('nitpickerFile');
    console.log(`Nitpicker file: ${nitpickerFile}`);

    const comments = getConfiguredComments(nitpickerFile);

    if ((comments?.length ?? 0) == 0) {
      console.log('No comments are configured');

      return;
    }

    console.log(`There are ${comments.length} comments configured`);

    const token = core.getInput('token');
    const octokit = new github.GitHub(token);

    console.log('Instantiated new octokit');
    console.log(octokit);

    core.setOutput('time', new Date().toTimeString());
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
