// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "idontpayattention",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },
  async run() {
    new sst.aws.Nextjs("IDontPayAttention", {
      ...$app.stage === "production" && {
        domain: {
          name: "idontfuckingpayattention.com",
          redirects: ["www." + "idontfuckingpayattention.com"],
          aliases: ["idontpayattention.com"],
        },
      },
    });
  },
});
