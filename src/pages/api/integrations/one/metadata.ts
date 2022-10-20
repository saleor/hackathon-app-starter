import { NextApiHandler, NextApiResponse } from "next";
import { SALEOR_DOMAIN_HEADER } from "@saleor/app-sdk";
import { saleorApp } from "../../../../../saleor-app";
import { createClient } from "../../../../lib/graphql";
import { createSettingsManager } from "../../../../lib/metadata";
import { SettingsManager } from "@saleor/app-sdk/settings-manager";

/**
 * Interfaces below are shared with the client part to ensure we use the same
 * shape of the data for communication. It's completely optional, but makes
 * refactoring much easier.
 */
export interface SettingsUpdateApiRequest {
  token: string;
  booleanOption: boolean;
}

export interface SettingsApiResponse {
  success: boolean;
  data?: SettingsUpdateApiRequest;
}

/**
 * Helper function to minimize duplication and keep the same response structure.
 * Even multiple calls of `get` method will result with only one call to the database.
 */
const sendResponse = async (
  res: NextApiResponse<SettingsApiResponse>,
  statusCode: number,
  settings: SettingsManager,
  domain: string
) => {
  res.status(statusCode).json({
    success: statusCode === 200,
    data: {
      booleanOption: (await settings.get("booleanOption")) || false,
      token: obfuscateSecret((await settings.get("token", domain)) || ""),
    },
  });
};

/**
 * If your app store secrets like API keys, it is a good practice to not send
 * them to client application if thats not required.
 * Obfuscate function will hide secret value with dots, leaving only last 4
 * characters which should be enough for the user to know if thats a right value.
 */
const obfuscateSecret = (secret: string) => {
  return "*".repeat(secret.length - 4) + secret.substring(secret.length - 4);
};

const handler: NextApiHandler = async (req, res) => {
  const saleorDomain = req.headers[SALEOR_DOMAIN_HEADER] as string;
  const authData = await saleorApp.apl.get(saleorDomain);

  if (!authData) {
    console.debug(`Could not find auth data for the domain ${saleorDomain}.`);
    res.status(401).json({ success: false });
    return;
  }

  /**
   * To make queries to Saleor API we need urql client
   */
  const client = createClient(`https://${saleorDomain}/graphql/`, async () =>
    Promise.resolve({ token: authData.token })
  );

  /**
   * Helper located at `src/lib/metadata.ts` returns manager which will be used to
   * get or modify metadata.
   */
  const settings = createSettingsManager(client);

  if (req.method === "GET") {
    await sendResponse(res, 200, settings, saleorDomain);
    return;
  } else if (req.method === "POST") {
    const { token, booleanOption } = req.body as SettingsUpdateApiRequest;

    if (token && booleanOption) {
        /**
         * You can set metadata one by one, but passing array of the values
         * will spare additional roundtrips to the Saleor API.
         * After mutation is made, internal cache of the manager
         * will be automatically updated
         */
      await settings.set([
        { key: "token", value: token, domain: saleorDomain  },
        { key: "booleanOption", value: JSON.stringify(booleanOption), domain: saleorDomain },
      ]);
      await sendResponse(res, 200, settings, saleorDomain);
      return;
    } else {
      console.log("Missing Settings Values");
      await sendResponse(res, 400, settings, saleorDomain);
      return;
    }
  }
  res.status(405).end();
  return;
};

export default handler;
