const fs = require("fs");
const fetch = require("node-fetch");

const HASHNODE_USERNAME = "retr0758";

const QUERY = `
{
  user(username: "${HASHNODE_USERNAME}") {
    publications(first: 1) {
      edges {
        node {
          posts(first: 5) {
            edges {
              node {
                title
                slug
                publishedAt
              }
            }
          }
        }
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

  const posts = json?.data?.user?.publications?.[0]?.node?.posts?.edges;

  if (!posts) {
    console.error("❌ Could not fetch posts. Full response:", JSON.stringify(json, null, 2));
    process.exit(1);
  }

  const output = posts
    .map((edge) => {
      const post = edge.node;
      return `- [${post.title}](https://${HASHNODE_USERNAME}.hashnode.dev/${post.slug})`;
    })
    .join("\n");

  const readme = fs.readFileSync("README.md", "utf-8");

  const updated = readme.replace(
    /<!-- BLOG-POST-LIST:START -->([\s\S]*?)<!-- BLOG-POST-LIST:END -->/,
    `<!-- BLOG-POST-LIST:START -->\n${output}\n<!-- BLOG-POST-LIST:END -->`
  );

  fs.writeFileSync("README.md", updated);
})();
