// Imports
const got = require("got");

// getTestData will download the test data uploaded by the testing-corpus repo
// for the webportal health-checks to use.
async function getTestData() {
  try {
    const query = `https://040e2npojpl9tiahghgls0d13bvacn5qo9jodruda8lcp3l4q3h1ikg.siasky.net/`;
    const json = await got(query).json();
    console.log(json);
  } catch (error) {
    console.log(error);
  }
}

// Call function
getTestData();
