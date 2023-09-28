const mockPostJson = jest.fn();

const core = require("@actions/core");
const http = require("@actions/http-client");
const run = require("./main");

jest.spyOn(core, "setOutput").mockImplementation(() => {});
jest.spyOn(core, "setFailed").mockImplementation(() => {});
jest.spyOn(core, "debug").mockImplementation(() => {});
jest.spyOn(http, "HttpClient").mockImplementation(() => {});

beforeEach(() => {
  process.env = {};
  jest.clearAllMocks();
});

function setInputs(inputs) {
  process.env = Object.keys(inputs).reduce(
    (memo, input) => ({
      ...memo,
      [`INPUT_${input.toUpperCase()}`]: inputs[input],
    }),
    {},
  );
}

const expectedHeaders = {
  authorization: `Basic ${Buffer.from("username:password").toString("base64")}`,
};

describe("with default inputs", () => {
  it("makes expected api call and returns result", async () => {
    setInputs({
      summary: "Generic v1.0.1",
      author: "oit-eas-blackhole",
      group: "OIT-JSM-EAS",
      affectedServices: "12345",
      apiKey: "username:password",
    });
    const postJson = jest.fn(async () => ({
      statusCode: 200,
      result: { key: "1234" },
    }));
    http.HttpClient.mockReturnValueOnce({ postJson });

    await run();
    expect(postJson).toHaveBeenCalledTimes(1);
    expect(postJson).toHaveBeenCalledWith(
      "https://brown.atlassian.net/rest/api/2/issue",
      {
        fields: {
          summary: "Generic v1.0.1",
          description: "",
          project: { key: "SYS" },
          reporter: { id: "712020:db823f4a-761e-42b7-aff2-bcd0a391c480" },
          issuetype: { id: "10014" },
          customfield_10010: "74",
          customfield_10058: { name: "OIT-JSM-EAS" },
          customfield_10171: [
            { id: "3015eb17-fcd8-4eb8-b534-dfbce48cd828:12345" },
          ],
          customfield_10392: "oit-eas-blackhole",
          customfield_10107: expect.stringMatching(
            /\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\dZ/,
          ),
          customfield_10049: expect.stringMatching(
            /\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\dZ/,
          ),
        },
      },
      expectedHeaders,
    );
    expect(core.setOutput).toHaveBeenCalledTimes(1);
    expect(core.setOutput).toHaveBeenCalledWith(
      "ticket-link",
      "https://brown.atlassian.net/browse/1234",
    );
  });
});

describe("with optional inputs", () => {
  it("makes expected api call and returns result", async () => {
    setInputs({
      summary: "Generic v1.0.1",
      author: "oit-eas-blackhole",
      group: "OIT-JSM-EAS",
      affectedServices: "12345",
      apiKey: "username:password",
      description: "Released v1.0.1 of Generic",
      installer: "test-installer-id",
    });
    const postJson = jest.fn(async () => ({
      statusCode: 200,
      result: { key: "1234" },
    }));
    http.HttpClient.mockReturnValueOnce({ postJson });

    await run();
    expect(postJson).toHaveBeenCalledTimes(1);
    expect(postJson).toHaveBeenCalledWith(
      "https://brown.atlassian.net/rest/api/2/issue",
      {
        fields: {
          summary: "Generic v1.0.1",
          description: "Released v1.0.1 of Generic",
          project: { key: "SYS" },
          reporter: { id: "test-installer-id" },
          issuetype: { id: "10014" },
          customfield_10010: "74",
          customfield_10058: { name: "OIT-JSM-EAS" },
          customfield_10171: [
            { id: "3015eb17-fcd8-4eb8-b534-dfbce48cd828:12345" },
          ],
          customfield_10392: "oit-eas-blackhole",
          customfield_10107: expect.stringMatching(
            /\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\dZ/,
          ),
          customfield_10049: expect.stringMatching(
            /\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\dZ/,
          ),
        },
      },
      expectedHeaders,
    );
    expect(core.setOutput).toHaveBeenCalledTimes(1);
    expect(core.setOutput).toHaveBeenCalledWith(
      "ticket-link",
      "https://brown.atlassian.net/browse/1234",
    );
  });
});

describe("affected services", () => {
  it("can be single-valued", async () => {
    setInputs({
      summary: "Generic v1.0.1",
      author: "oit-eas-blackhole",
      group: "OIT-JSM-EAS",
      affectedServices: "12345",
      apiKey: "username:password",
    });
    const postJson = jest.fn(async () => ({
      statusCode: 200,
      result: { key: "1234" },
    }));
    http.HttpClient.mockReturnValueOnce({ postJson });

    await run();
    expect(postJson).toHaveBeenCalledTimes(1);
    expect(postJson).toHaveBeenCalledWith(
      "https://brown.atlassian.net/rest/api/2/issue",
      {
        fields: expect.objectContaining({
          customfield_10171: [
            { id: "3015eb17-fcd8-4eb8-b534-dfbce48cd828:12345" },
          ],
        }),
      },
      expectedHeaders,
    );
    expect(core.setOutput).toHaveBeenCalledTimes(1);
    expect(core.setOutput).toHaveBeenCalledWith(
      "ticket-link",
      "https://brown.atlassian.net/browse/1234",
    );
  });

  it("can be multi-valued", async () => {
    setInputs({
      summary: "Generic v1.0.1",
      author: "oit-eas-blackhole",
      group: "OIT-JSM-EAS",
      affectedServices: "12345,67890,46873",
      apiKey: "username:password",
    });
    const postJson = jest.fn(async () => ({
      statusCode: 200,
      result: { key: "1234" },
    }));
    http.HttpClient.mockReturnValueOnce({ postJson });

    await run();
    expect(postJson).toHaveBeenCalledTimes(1);
    expect(postJson).toHaveBeenCalledWith(
      "https://brown.atlassian.net/rest/api/2/issue",
      {
        fields: expect.objectContaining({
          customfield_10171: [
            { id: "3015eb17-fcd8-4eb8-b534-dfbce48cd828:12345" },
            { id: "3015eb17-fcd8-4eb8-b534-dfbce48cd828:67890" },
            { id: "3015eb17-fcd8-4eb8-b534-dfbce48cd828:46873" },
          ],
        }),
      },
      expectedHeaders,
    );
    expect(core.setOutput).toHaveBeenCalledTimes(1);
    expect(core.setOutput).toHaveBeenCalledWith(
      "ticket-link",
      "https://brown.atlassian.net/browse/1234",
    );
  });
});

it("handles errors", async () => {
  setInputs({
    summary: "Generic v1.0.1",
    author: "oit-eas-blackhole",
    group: "OIT-JSM-EAS",
    affectedServices: "12345,67890,46873",
    apiKey: "username:password",
  });
  const postJson = jest.fn(async () => {
    throw new http.HttpClientError("Failed request: (500)", 500);
  });
  http.HttpClient.mockReturnValueOnce({ postJson });

  await run();
  expect(core.setFailed).toHaveBeenCalledTimes(1);
  expect(core.setFailed).toHaveBeenCalledWith("Failed request: (500)");
});
