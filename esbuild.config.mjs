import * as esbuild from "esbuild";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(__dirname, "dist");
const src = path.join(__dirname, "src");

const watch = process.argv.includes("--watch");

if (!fs.existsSync(dist)) {
  fs.mkdirSync(dist, { recursive: true });
}

function writeDistUiHtml() {
  const uiJs = fs.readFileSync(path.join(dist, "ui.js"), "utf8");
  let html = fs.readFileSync(path.join(src, "ui.html"), "utf8");
  html = html.replace(
    '<script src="ui.js"></script>',
    `<script>\n${uiJs}\n</script>`
  );
  fs.writeFileSync(path.join(dist, "ui.html"), html, "utf8");
}

/** Inlined HTML for figma.showUI(): external script URLs do not resolve in the injected document. */
function inlinedUiHtmlPlugin() {
  return {
    name: "inlined-ui-html",
    setup(build) {
      build.onResolve({ filter: /ui\.html$/ }, (args) => {
        if (
          args.kind === "import-statement" &&
          path.basename(args.importer || "") === "code.ts"
        ) {
          return { path: "inlined-ui-html", namespace: "inlined-ui" };
        }
      });
      build.onLoad({ filter: /.*/, namespace: "inlined-ui" }, () => {
        const uiJs = fs.readFileSync(path.join(dist, "ui.js"), "utf8");
        let html = fs.readFileSync(path.join(src, "ui.html"), "utf8");
        html = html.replace(
          '<script src="ui.js"></script>',
          `<script>\n${uiJs}\n</script>`
        );
        return { contents: html, loader: "text" };
      });
    },
  };
}

const uiBuildOptions = {
  entryPoints: [path.join(src, "ui.ts")],
  bundle: true,
  outfile: path.join(dist, "ui.js"),
  platform: "browser",
  target: "es2017",
  format: "iife",
  logLevel: "info",
};

function codeBuildOptions() {
  return {
    entryPoints: [path.join(src, "code.ts")],
    bundle: true,
    outfile: path.join(dist, "code.js"),
    platform: "neutral",
    target: "es2017",
    format: "iife",
    loader: { ".html": "text" },
    plugins: [inlinedUiHtmlPlugin()],
    logLevel: "info",
  };
}

async function buildUi() {
  await esbuild.build(uiBuildOptions);
}

async function buildCode() {
  await esbuild.build(codeBuildOptions());
}

const build = async () => {
  await buildUi();
  writeDistUiHtml();
  await buildCode();
};

if (watch) {
  await buildUi();
  writeDistUiHtml();

  const ctxCode = await esbuild.context(codeBuildOptions());

  const ctxUi = await esbuild.context({
    ...uiBuildOptions,
    plugins: [
      {
        name: "rebuild-code-after-ui",
        setup(build) {
          build.onEnd(async (result) => {
            if (result.errors.length > 0) return;
            writeDistUiHtml();
            await ctxCode.rebuild();
          });
        },
      },
    ],
  });

  await ctxCode.rebuild();
  await Promise.all([ctxUi.watch(), ctxCode.watch()]);
  console.log("Watching src/…");
} else {
  await build();
}
