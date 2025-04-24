import type { ConstructorParams } from "@browserbasehq/stagehand";
import dotenv from "dotenv";
dotenv.config();

// Define a new type that extends ConstructorParams or includes its properties plus targetUrl
interface ExtendedStagehandConfig extends ConstructorParams {
  targetUrl?: string; // Make it optional or required as needed
}

const StagehandConfig: ExtendedStagehandConfig = {
  verbose: 2 /* Verbosity level for logging: 0 = silent, 1 = info, 2 = all */,
  domSettleTimeoutMs: 30_000 /* Timeout for DOM to settle in milliseconds */,
  targetUrl: "https://www.linkedin.com/feed/",

  //   LLM configuration
  modelName: "gemini-1.5-flash" /* Name of the model to use */,
  modelClientOptions: {
    apiKey: process.env.GOOGLE_API_KEY, // Use Google API Key from env var
  } /* Configuration options for the model client */,

  // Browser configuration
  env:
    process.env.BROWSERBASE_API_KEY && process.env.BROWSERBASE_PROJECT_ID
      ? "BROWSERBASE"
      : "LOCAL",
  apiKey: process.env.BROWSERBASE_API_KEY /* API key for authentication */,
  projectId: process.env.BROWSERBASE_PROJECT_ID /* Project identifier */,
  browserbaseSessionID:
    undefined /* Session ID for resuming Browserbase sessions */,
  browserbaseSessionCreateParams: {
    projectId: process.env.BROWSERBASE_PROJECT_ID!,
    browserSettings: {
      blockAds: true,
      viewport: {
        width: 1024,
        height: 768,
      },
    },
  },
  localBrowserLaunchOptions: {
    headless: false,
    viewport: {
      width: 1024,
      height: 768,
    },
  } /* Configuration options for the local browser */,
};
export default StagehandConfig;
