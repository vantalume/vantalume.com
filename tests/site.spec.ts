import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
const routes = [
  "/",
  "/services",
  "/services/web-design-development",
  "/services/web-applications-saas",
  "/services/mobile-app-development",
  "/services/ai-automation",
  "/services/ai-consulting-prototyping",
  "/how-we-work",
  "/opportunity-mapper",
  "/insights",
  "/insights/website-redesign-business-case",
  "/about",
  "/contact",
  "/privacy",
  "/cookies",
  "/terms",
  "/robots.txt",
  "/sitemap.xml",
];
for (const route of routes)
  test(`${route} loads without serious accessibility or console errors`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });
    const response = await page.goto(route, { waitUntil: "networkidle" });
    expect(response?.status()).toBeLessThan(400);
    if (!route.endsWith(".txt") && !route.endsWith(".xml")) {
      const axe = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze();
      expect(
        axe.violations.filter(
          (v) => v.impact === "critical" || v.impact === "serious",
        ),
        JSON.stringify(axe.violations, null, 2),
      ).toEqual([]);
      expect(await page.locator("h1").count()).toBe(1);
    }
    expect(errors).toEqual([]);
  });
test("all same-origin homepage links resolve", async ({ page, request }) => {
  await page.goto("/");
  const hrefs = await page
    .locator("a[href]")
    .evaluateAll((nodes) => [
      ...new Set(
        nodes
          .map((n) => (n as HTMLAnchorElement).href)
          .filter((x) => x.startsWith(location.origin)),
      ),
    ]);
  for (const href of hrefs) {
    const response = await request.get(href);
    expect(response.status(), href).toBeLessThan(400);
  }
});
test("opportunity mapper completes and hands route to contact", async ({
  page,
}) => {
  await page.goto("/opportunity-mapper");
  for (const answer of [
    "Small business",
    "A workflow is too manual",
    "Internal operations",
    "£5,000–£20,000",
    "This quarter",
  ])
    await page.getByRole("button", { name: answer }).click();
  await expect(
    page.getByRole("heading", {
      name: "Workflow mapping and automation pilot",
    }),
  ).toBeVisible();
  await page.getByRole("link", { name: /Discuss this route/ }).click();
  await expect(page.locator("select[name=need]")).toHaveValue(
    "Workflow mapping and automation pilot",
  );
});
test("contact form exposes validation and provider recovery", async ({
  page,
}) => {
  await page.goto("/contact");
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(page.locator("input[name=name]:invalid")).toHaveCount(1);
  await page.locator("input[name=name]").fill("Ada Lovelace");
  await page.locator("input[name=email]").fill("ada@example.com");
  await page
    .locator("select[name=need]")
    .selectOption({ label: "Web application or SaaS" });
  await page
    .locator("textarea[name=details]")
    .fill(
      "We need to replace a manual reporting workflow with a dependable application.",
    );
  await page.locator("input[name=consent]").check();
  await page.waitForTimeout(2600);
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(page.getByText("Submission not sent")).toBeVisible();
    await expect(page.locator(".error-summary")).toContainText(
      "contact@vantalume.com",
    );
});
