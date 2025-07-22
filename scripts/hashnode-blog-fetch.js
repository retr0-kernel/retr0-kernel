const fs = require("fs");
const fetch = require("node-fetch");

const HASHNODE_USERNAME = "krizzzz";
const QUERY = `
{
  user(username: "${HASHNODE_USERNAME}") {
    publication {
      posts(page: 0) {
        title
        brief
        slug
        dateAdded
      }
    }
  }
}`;

(async () => {
  const res = await fetch("https://gql.hashnode.com/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: QUERY }),
  });

  const json = await res.json();

  const posts = json.data.user.publication.posts.slice(0, 5);
  const output = posts
    .map(
      (post) =>
        `- [${post.title}](https://${HASHNODE_USERNAME}.hashnode.dev/${post.slug})`
    )
    .join("\n");

  const readme = fs.readFileSync("README.md", "utf-8");

  const updated = readme.replace(
    /<!-- BLOG-POST-LIST:START -->([\s\S]*?)<!-- BLOG-POST-LIST:END -->/,
    `<!-- BLOG-POST-LIST:START -->\n${output}\n<!-- BLOG-POST-LIST:END -->`
  );

  fs.writeFileSync("README.md", updated);
})();
