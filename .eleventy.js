const fs = require("fs");
const markdownIt = require("markdown-it");

// html:true lets seeded inline HTML pass through; typographer:false keeps quotes/dashes verbatim.
const md = markdownIt({ html: true, linkify: false, typographer: false, breaks: false });

// Read content fresh on every build (avoids require() module-cache staleness during --serve).
function load(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

module.exports = function (eleventyConfig) {
  // Static assets — copied verbatim. Paths must stay identical to the current site.
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("photos");
  eleventyConfig.addPassthroughCopy("florals");
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("admin"); // Sveltia CMS: /admin/index.html + config.yml

  // CMS-editable content (content/*.json) -> template globals.
  eleventyConfig.addGlobalData("site",     () => load("./content/site.json"));
  eleventyConfig.addGlobalData("home",     () => load("./content/home.json"));
  eleventyConfig.addGlobalData("photos",   () => load("./content/photos.json").items);
  eleventyConfig.addGlobalData("gallery",  () => load("./content/gallery.json"));
  eleventyConfig.addGlobalData("schedule", () => load("./content/schedule.json").items);
  eleventyConfig.addGlobalData("faqs",     () => load("./content/faqs.json").groups);
  eleventyConfig.addGlobalData("travel",   () => load("./content/travel.json"));
  eleventyConfig.addGlobalData("registry", () => load("./content/registry.json"));
  eleventyConfig.addGlobalData("party",    () => load("./content/party.json").groups);

  // Rebuild when content/ changes during `npm run serve`.
  eleventyConfig.addWatchTarget("content");

  // Filters
  eleventyConfig.addFilter("md", (s) => md.render(s || ""));
  eleventyConfig.addFilter("mdInline", (s) => md.renderInline(s || ""));
  eleventyConfig.addFilter("findById", (arr, id) => (arr || []).find((x) => x.id === id));
  eleventyConfig.addFilter("initials", (name) =>
    (name || "").split(/\s+/).map((w) => w[0] || "").join("").toUpperCase()
  );

  return {
    dir: { input: "src", includes: "_includes", output: "_site" },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
};
