import { test, expect } from "@playwright/test";

test.describe("Blog App", () => {
  const blogTitle = "Test Blog";
  const blogAuthor = "Test Author";
  const blogUrl = "http://testblog.com";
  const blogLikes = "0";

  test("succeeds with correct credentials and shows logout & create new blog button", async ({
    page,
  }) => {
    // Fill login form
    await page.fill('input[name="username"]', "testuser");
    await page.fill('input[name="password"]', "password123");
    await page.click('button[type="submit"]');

    // Check if the logout button is visible
    await expect(page.locator("button#logout")).toBeVisible({
      timeout: 10000,
    });

    // Check if the create new blog button is visible
    await expect(page.locator("button#create-new-blog")).toBeVisible({
      timeout: 10000,
    });
  });

  test("creates a new blog", async ({ page }) => {
    // Click on the 'Create New Blog' button
    await page.click("button#create-new-blog");

    // Fill in the blog form
    await page.fill('input[name="title"]', blogTitle);
    await page.fill('input[name="author"]', blogAuthor);
    await page.fill('input[name="url"]', blogUrl);
    await page.fill('input[name="likes"]', blogLikes);
    await page.click('button[type="submit"]'); // Submit the form

    // Wait for the new blog to be added and visible
    await expect(page.locator(`text=${blogTitle}`)).toBeVisible({
      timeout: 10000,
    });
  });

  test("views the blog details", async ({ page }) => {
    // Locate and click the 'View' button for the first blog
    await page.click("button.toggle-button"); // Assuming this button toggles the blog visibility

    // Check if the blog details are visible
    await expect(page.locator("div.blog-details")).toBeVisible({
      timeout: 10000,
    });

    // Check if the blog title, author, url, and likes are correct
    await expect(page.locator("h3")).toHaveText(`${blogTitle} - ${blogAuthor}`);
    await expect(page.locator("div.url")).toHaveText(blogUrl);
    await expect(page.locator("div.likes")).toHaveText(`Likes: ${blogLikes}`);
  });

  test("likes a blog", async ({ page }) => {
    // Locate and click the 'Like' button for the first blog
    await page.click("button.like-button");

    // Check if the like count has increased (assuming it starts at 0 and becomes 1)
    await expect(page.locator("div.likes")).toHaveText("Likes: 1");
  });

  test("removes a blog", async ({ page }) => {
    // Locate and click the 'Remove' button for the first blog
    await page.click("button.remove-button");

    // Confirm that the blog is no longer visible
    await expect(page.locator(`text=${blogTitle}`)).not.toBeVisible({
      timeout: 10000,
    });
  });

  test("fails with wrong credentials", async ({ page }) => {
    // Fill login form with incorrect credentials
    await page.fill('input[name="username"]', "wronguser");
    await page.fill('input[name="password"]', "wrongpass");
    await page.click('button[type="submit"]');

    // Check for invalid login message
    await expect(page.locator("text=Invalid username or password")).toBeVisible(
      {
        timeout: 10000,
      }
    );
  });
});
