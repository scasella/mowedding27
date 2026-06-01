/* Custom Decap CMS preview templates for mowedding27.com.
   Renders each collection using the real site markup + CSS so the preview pane
   resembles the live page. Image slots become on-brand placeholder boxes
   (the site's own empty-container backgrounds), since real photos/SVG art
   aren't available inside the editor preview.
   Globals provided by the Decap bundle: CMS, createClass, h. */
(function () {
  "use strict";

  // --- tiny markdown renderer (covers exactly the formats used in content/*) ---
  function mdInline(s) {
    return (s || "")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\*([^*]+)\*/g, "<em>$1</em>")
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  }
  function md(s) {
    return (s || "")
      .split(/\n{2,}/)
      .map(function (p) { return "<p>" + mdInline(p.trim()) + "</p>"; })
      .join("");
  }
  function raw(html) { return h("div", { dangerouslySetInnerHTML: { __html: html } }); }
  function data(props) {
    var im = props.entry.getIn(["data"]);
    return im && im.toJS ? im.toJS() : {};
  }
  function page(children) {
    return h("main", { id: "main", className: "cms-preview" }, children);
  }
  // an image placeholder that reuses a real container class (so bg/aspect match)
  function imgBox(cls, label, dark, extra) {
    var style = {
      display: "flex", alignItems: "center", justifyContent: "center",
      textAlign: "center", padding: "14px",
      font: '600 11px/1.4 var(--sans, "Inter", sans-serif)',
      letterSpacing: ".14em", textTransform: "uppercase",
      color: dark ? "rgba(245,242,235,.82)" : "rgba(36,31,26,.45)"
    };
    if (extra) { for (var k in extra) { style[k] = extra[k]; } }
    return h("div", { className: cls || "", style: style }, h("span", null, label || "Photo"));
  }
  function initials(name) {
    return (name || "").split(/\s+/).map(function (w) { return w[0] || ""; }).join("").toUpperCase();
  }

  // ---------------------------------------------------------------- Schedule
  var Schedule = createClass({
    render: function () {
      var items = data(this.props).items || [];
      return page(h("section", { className: "section" },
        h("div", { className: "shell" },
          h("div", { className: "timeline" },
            items.map(function (ev, i) {
              return h("div", { className: "tl-item", key: i },
                h("div", { className: "tl-time" },
                  h("span", { className: "day" }, ev.day || ""), ev.time || ""),
                h("div", { className: "tl-body" },
                  h("h3", null, ev.title || ""),
                  h("p", { className: "where" }, ev.where || ""),
                  raw(md(ev.body))
                ));
            })
          )
        )
      ));
    }
  });

  // -------------------------------------------------------------------- FAQs
  var Faqs = createClass({
    render: function () {
      var groups = data(this.props).groups || [];
      return page(h("section", { className: "section" },
        h("div", { className: "shell" },
          groups.map(function (g, gi) {
            return h("div", { className: "faq-group", key: gi },
              h("p", { className: "subhead" }, g.subhead || ""),
              (g.items || []).map(function (q, qi) {
                return h("details", { className: "faq", open: true, key: qi },
                  h("summary", null, raw(mdInline(q.question || ""))),
                  h("div", { className: "faq__answer" },
                    raw(md(q.answer)),
                    (q.voices && q.voices.length) ? h("div", { className: "voices" },
                      q.voices.map(function (v, vi) {
                        return h("div", { className: "voice", key: vi },
                          h("span", { className: "who" + (v.owen ? " is-owen" : "") }, v.who || ""),
                          h("p", null, v.text || ""));
                      })
                    ) : null
                  ));
              })
            );
          })
        )
      ));
    }
  });

  // ------------------------------------------------------------------ Travel
  function infoBlock(c, i) {
    return h("div", { className: "info-block", key: i },
      h("p", { className: "kicker is-plain" }, c.kicker || ""),
      h("h3", null, c.title || ""),
      raw(md(c.body)));
  }
  var Travel = createClass({
    render: function () {
      var d = data(this.props);
      return page([
        h("section", { className: "section", key: "air" },
          h("div", { className: "shell" },
            h("div", { className: "section-head" }, h("p", { className: "kicker" }, "By air & by road")),
            h("div", { className: "info-grid" }, (d.airports || []).map(infoBlock)))),
        h("hr", { className: "rule", key: "r" }),
        h("section", { className: "section", key: "stay" },
          h("div", { className: "shell" },
            h("div", { className: "section-head" },
              h("p", { className: "kicker" }, "Where to stay"),
              h("h2", { className: "h-md mt-m" }, "A few good beds, near the barn.")),
            h("div", { className: "stay" }, (d.hotels || []).map(function (ho, i) {
              return h("div", { className: "stay__row", key: i },
                h("div", null, h("span", { className: "tag" }, ho.tag || ""), h("h3", null, ho.name || "")),
                raw(md(ho.notes)),
                h("a", { className: "linkarrow", href: ho.link || "#" },
                  (ho.link_label || ""), " ", h("span", { className: "arrow", "aria-hidden": "true" }, "→")));
            })))),
        h("section", { className: "section--tight", key: "todo" },
          h("div", { className: "shell" },
            h("div", { className: "section-head" },
              h("p", { className: "kicker" }, "If you have a spare afternoon"),
              h("h2", { className: "h-md mt-m" }, "Things to do nearby.")),
            h("div", { className: "info-grid" }, (d.todo || []).map(infoBlock))))
      ]);
    }
  });

  // ---------------------------------------------------------------- Registry
  var Registry = createClass({
    render: function () {
      var d = data(this.props);
      return page([
        h("section", { className: "section--tight", key: "fund" },
          h("div", { className: "shell" },
            h("div", { className: "fund" },
              imgBox("fund__media", "Photo", true),
              h("div", { className: "fund__body" },
                h("p", { className: "kicker" }, d.fund_kicker || ""),
                h("h2", null, d.fund_title || ""),
                h("div", { className: "prose" }, raw(md(d.fund_body))),
                h("a", { className: "btn btn--primary", href: d.fund_link || "#" },
                  (d.fund_button || ""), " ", h("span", { className: "arrow", "aria-hidden": "true" }, "→")))))),
        h("section", { className: "section--tight", key: "stores" },
          h("div", { className: "shell" },
            h("p", { className: "kicker" }, "Where we registered"),
            h("div", { className: "store-row mt-s" }, (d.stores || []).map(function (s, i) {
              return h("a", { className: "store-chip", href: s.url || "#", key: i }, s.name || "");
            })))),
        h("p", { className: "muted measure", key: "note",
          style: { maxWidth: "60ch", margin: "8px auto 0", fontSize: "14px", fontStyle: "italic", opacity: .8 } },
          "The 12 hand-drawn gift cards render on the live site.")
      ]);
    }
  });

  // ------------------------------------------------------------ Wedding party
  var Party = createClass({
    render: function () {
      var groups = data(this.props).groups || [];
      return page(h("section", { className: "section" },
        h("div", { className: "shell" },
          groups.map(function (g, gi) {
            return h("div", { className: "wp-group", key: gi },
              g.subhead ? h("p", { className: "subhead" }, g.subhead) : null,
              h("div", { className: "party-grid" }, (g.people || []).map(function (p, pi) {
                var media = p.photo
                  ? imgBox("person__media", "Photo", false)
                  : h("div", { className: "person__media person__media--tbd" },
                      h("span", { className: "monogram", "aria-hidden": "true" }, p.monogram || initials(p.name)));
                return h("article", { className: "person", key: pi },
                  media,
                  h("h3", null, p.name || ""),
                  p.role ? h("p", { className: "role" }, p.role) : null);
              })));
          })
        )
      ));
    }
  });

  // ----------------------------------------------------------------- Gallery
  function galleryGrid(items) {
    return h("div", { className: "gallery-grid" }, (items || []).map(function (it, i) {
      return h("div", { className: "g-item " + (it.classes || ""), key: i, style: { minHeight: "120px" } },
        imgBox(null, "Photo", true, { position: "absolute", inset: "0" }),
        h("span", { className: "g-cap", style: { opacity: 1, transform: "none" } },
          h("span", { className: "cap-note" }, it.cap_note || ""), " · " + (it.cap_rest || "")));
    }));
  }
  var Gallery = createClass({
    render: function () {
      var d = data(this.props);
      return page([
        h("section", { className: "section--tight", key: "a1" },
          h("div", { className: "shell" },
            h("div", { className: "act-head" },
              h("span", { className: "num" }, d.act1_num || ""),
              h("h2", null, d.act1_title || ""),
              h("p", null, d.act1_blurb || "")),
            galleryGrid(d.act1_items))),
        h("section", { className: "section--tight", key: "a2" },
          h("div", { className: "shell" },
            h("div", { className: "act-head" },
              h("span", { className: "num" }, d.act2_num || ""),
              h("h2", null, d.act2_title || ""),
              h("p", null, d.act2_blurb || "")),
            galleryGrid(d.act2_items)))
      ]);
    }
  });

  // ------------------------------------------------------------------ Photos
  var Photos = createClass({
    render: function () {
      var items = data(this.props).items || [];
      return page(h("section", { className: "section" },
        h("div", { className: "shell" },
          h("p", { className: "kicker", style: { marginBottom: "20px" } }, "Engagement photos · marquee order"),
          h("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: "16px" } },
            items.map(function (p, i) {
              return h("div", { key: i },
                imgBox(null, p.id || ("Photo " + (i + 1)), false,
                  { aspectRatio: (p.width && p.height) ? (p.width + "/" + p.height) : "3/2",
                    background: "var(--stone)", borderRadius: "3px" }),
                h("p", { className: "muted", style: { fontSize: "12px", marginTop: "6px", lineHeight: 1.4 } }, p.alt || ""));
            }))
        )
      ));
    }
  });

  // -------------------------------------------------------- Pages (site/home)
  function renderHome(d) {
    return page([
      h("section", { className: "section", key: "w" },
        h("div", { className: "shell" },
          h("div", { className: "welcome" },
            h("div", null,
              h("p", { className: "kicker", style: { marginBottom: "26px" } }, d.welcome_kicker || ""),
              h("p", { className: "welcome__lede" }, raw(mdInline(d.welcome_lede || ""))),
              h("div", { className: "welcome__body prose" }, raw(md(d.welcome_body)))),
            h("aside", { className: "welcome__aside" },
              imgBox(null, "Hero & photo marquee", true, { minHeight: "160px", borderRadius: "3px", background: "var(--harbor)" }))))),
      h("section", { className: "section band", key: "s" },
        h("div", { className: "shell" },
          h("div", { className: "story-split" },
            h("div", { className: "story-split__text" },
              h("header", { className: "story__head" },
                h("p", { className: "kicker" }, d.story_kicker || ""),
                h("h2", { className: "h-lg mt-m" }, d.story_title || "")),
              h("div", { className: "story__body prose", style: { maxWidth: "46ch" } },
                h("p", { className: "dropcap" }, raw(mdInline(d.story_intro || ""))),
                h("p", null, raw(mdInline(d.story_p2 || ""))),
                h("p", null, raw(mdInline(d.story_p3 || ""))))),
            imgBox("story-split__media", "Photo", false, { minHeight: "260px", borderRadius: "3px" }))),
        h("div", { className: "pullquote-block" }, h("div", { className: "shell" },
          h("p", { className: "pullquote" },
            h("span", { className: "mark" }, "“"), raw(mdInline(d.pullquote || "")), h("span", { className: "mark" }, "”")),
          h("p", { className: "attr" }, d.pullquote_attr || ""))),
        h("div", { className: "shell" }, h("div", { className: "story" },
          h("div", { className: "story__body prose", style: { marginInline: 0, maxWidth: "62ch" } }, raw(md(d.story_close))))))
    ]);
  }
  function renderSettings(d) {
    // Self-contained (no hero-scoped classes) so it reads clearly in the preview pane.
    var serif = 'var(--serif, "Cormorant Garamond", serif)';
    var sans = 'var(--sans, "Inter", sans-serif)';
    return page(h("section", { className: "section" }, h("div", { className: "shell", style: { textAlign: "center" } },
      h("p", { style: { font: "500 clamp(30px,4vw,46px)/1.1 " + serif, color: "var(--ink)" } }, d.date_line || ""),
      h("p", { style: { font: "400 15px/1.5 " + sans, letterSpacing: ".02em", color: "var(--ink)", marginTop: "10px" } }, (d.venue ? d.venue + " · " : "") + (d.location || "")),
      h("p", { style: { font: "italic 400 clamp(19px,2vw,24px)/1.45 " + serif, color: "var(--ink)", maxWidth: "42ch", margin: "22px auto 0" } }, d.hero_lede || ""),
      h("hr", { style: { border: 0, borderTop: "1px solid var(--line, #e7ddcb)", margin: "36px auto", width: "120px" } }),
      h("p", { style: { font: "italic 400 clamp(20px,2.2vw,28px)/1.4 " + serif, color: "var(--harbor, #7e3c32)", maxWidth: "34ch", margin: "0 auto" } }, d.footer_quote || ""),
      h("p", { style: { font: "400 15px/1.6 " + sans, color: "var(--ink)", opacity: .7, maxWidth: "46ch", margin: "16px auto 0" } }, d.footer_tagline || ""),
      h("p", { style: { font: "400 13px/1.5 " + sans, color: "var(--ink)", opacity: .55, marginTop: "20px" } }, "Contact: " + (d.contact_email || ""))
    )));
  }
  var Pages = createClass({
    render: function () {
      var d = data(this.props);
      var isHome = ("welcome_kicker" in d) || ("story_title" in d) || ("story_close" in d);
      return isHome ? renderHome(d) : renderSettings(d);
    }
  });
  // Multi-file collections match preview templates by FILE name, so register those too.
  var Home = createClass({ render: function () { return renderHome(data(this.props)); } });
  var Settings = createClass({ render: function () { return renderSettings(data(this.props)); } });

  // --------------------------------------------------------------- register
  CMS.registerPreviewStyle("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&family=Inter:wght@300;400;500;600&display=swap");
  CMS.registerPreviewStyle("/assets/css/site.css");
  CMS.registerPreviewStyle(
    ".cms-preview{padding:18px 8px;background:var(--white);} .cms-preview .section,.cms-preview .section--tight{padding-block:28px;}",
    { raw: true }
  );

  CMS.registerPreviewTemplate("pages", Pages);
  CMS.registerPreviewTemplate("home", Home);
  CMS.registerPreviewTemplate("site", Settings);
  CMS.registerPreviewTemplate("photos", Photos);
  CMS.registerPreviewTemplate("schedule", Schedule);
  CMS.registerPreviewTemplate("faqs", Faqs);
  CMS.registerPreviewTemplate("travel", Travel);
  CMS.registerPreviewTemplate("registry", Registry);
  CMS.registerPreviewTemplate("party", Party);
  CMS.registerPreviewTemplate("gallery", Gallery);
})();
