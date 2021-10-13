#!/usr/bin/env node

const { build, buildSync } = require('esbuild');
const minifyHtml = require('@minify-html/js');
const cheerio = require('cheerio');

const cfg = minifyHtml.createConfiguration({ minifyJs: true, minifyCss: true });

const htmlPlugin = {
  name: 'html',
  setup(bld) {
    const fs = require('fs');
    const path = require('path');

    bld.onLoad({ filter: /\.html$/ }, async (args) => {
      const text = await fs.promises.readFile(args.path, 'utf8');
      const dom = cheerio.load(text);
      const stylesheets = dom('link[rel=stylesheet]').remove();
      let style = dom('head style');
      if (style.length === 0) {
        style = dom('<style/>').appendTo(dom('head'));
      }
      const scripts = dom('script[src]');
      const dir = path.dirname(args.path);
      stylesheets.each((i, el) => {
        const css = fs.readFileSync(path.join(dir, el.attribs.href), 'utf8');
        style.append(css);
      });
      scripts.each((i, el) => {
        const jsMin = buildSync({
          entryPoints: [path.join(dir, el.attribs.src)],
          bundle: true,
          globalName: 'BMKLT',
          write: false,
        });
        dom(el).removeAttr('src');
        dom(el).append(jsMin.outputFiles[0].text);
      });
      return {
        contents: minifyHtml.minify(dom.html(), cfg),
        loader: 'text',
      };
    });
  },
};

const builder = async () => {
  const result = await build({
    entryPoints: ['src/index.js'],
    bundle: true,
    minify: true,
    write: false,
    plugins: [htmlPlugin],
  }).catch(() => process.exit(1));
  const code = result.outputFiles[0].text.trim().replace(/;([a-z]\(\);)/, ';return $1');
  process.stdout.write(`javascript:${code}`);
};

builder();
