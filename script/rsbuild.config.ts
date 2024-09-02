import { defineConfig } from "@rsbuild/core";
import TerserPlugin from "terser-webpack-plugin";

export default defineConfig({
  output: {
    target: "web-worker",
    distPath: {
      js: ".",
    },
    filenameHash: false,
  },
  tools: {
    bundlerChain(chain, { CHAIN_ID, isProd }) {
      if (isProd) {
        chain.optimization.minimizer(CHAIN_ID.MINIMIZER.JS).use(
          new TerserPlugin({
            terserOptions: {
              keep_fnames: true,
              mangle: true,
            },
          })
        );
      }
    },
  },
});
