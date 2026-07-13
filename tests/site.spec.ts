import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
const routes = [
  "/",
  "/services",
  "/services/ai-video-production",
  "/services/web-design-development",
  "/services/web-applications-saas",
  "/services/mobile-app-development",
  "/services/ai-automation",
  "/services/ai-consulting-prototyping",
  "/how-we-work",
  "/opportunity-mapper",
  "/insights",
  "/insights/website-redesign-business-case",
  "/insights/ai-automation-opportunity-scorecard",
  "/insights/mvp-scope-without-regret",
  "/insights/website-project-costs",
  "/insights/ai-prototype-production-gap",
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

test("guided assistant answers a question and validates handoff details", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Ask Vantalume", exact: true })
    .click();
  await expect(
    page.getByRole("dialog", { name: "Ask Vantalume", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Starting prices", exact: true })
    .click();
  await expect(
    page.getByText(/Opportunity Mapping Sprints start from/),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Pass an enquiry to a person →", exact: true })
    .click();
  await page.locator("input[name=name]").fill("Ada Lovelace");
  await page
    .locator("textarea[name=message]")
    .fill("We need help mapping an automation opportunity.");
  await page.locator("input[name=consent]").check();
  await page
    .getByRole("button", { name: "Save and hand over →", exact: true })
    .click();
  await expect(
    page.getByText("Enter an email address or phone number so we can respond."),
  ).toBeVisible();
});
