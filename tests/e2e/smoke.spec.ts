import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { SITE } from "../../app/_data/site";

test.describe("portfolio smoke", () => {
  test("home renders the key sections", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Zulfahmi/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/rely on/i);
    await expect(page.locator(".zf-stack")).toBeVisible();
    // Featured project (DuitNow) + two secondary lead cards.
    await expect(page.getByRole("heading", { name: /DuitNow Payments App/ })).toBeVisible();
    await expect(page.locator(".zf-card")).toHaveCount(2);
    await expect(page.locator(".zf-stripe").first()).toBeAttached();
    await expect(page.locator(".zf-footer")).toBeVisible();
  });

  test("primary navigation routes between pages", async ({ page }) => {
    await page.goto("/");
    const nav = page.locator(".zf-nav");

    await nav.getByRole("link", { name: "Work" }).click();
    await expect(page).toHaveURL(/\/work\/?$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/projects/i);

    await nav.getByRole("link", { name: "About" }).click();
    await expect(page).toHaveURL(/\/about\/?$/);

    await nav.getByRole("link", { name: "Contact" }).click();
    await expect(page).toHaveURL(/\/contact\/?$/);
    await expect(page.getByText(SITE.email)).toBeVisible();
  });

  test("theme toggle switches the document theme and persists", async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");
    const toggle = page.locator(".zf-theme-toggle");

    // Default (no stored mode, light OS preference) resolves to light.
    await expect(html).toHaveAttribute("data-theme", "light");
    await toggle.click(); // auto -> light
    await toggle.click(); // light -> dark
    await expect(html).toHaveAttribute("data-theme", "dark");

    // The choice survives a reload via localStorage + the pre-paint script.
    await page.reload();
    await expect(html).toHaveAttribute("data-theme", "dark");
  });

  test("work grid lists all projects and opens a case study", async ({ page }) => {
    await page.goto("/work");
    await expect(page.locator(".zf-work-card")).toHaveCount(6);

    await page.getByRole("link", { name: /DuitNow Payments App/ }).click();
    await expect(page).toHaveURL(/\/work\/duitnow\/?$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/DuitNow/);
    await expect(page.locator(".zf-shot")).toHaveCount(4); // app screenshots gallery
    await expect(page.getByText("Key decisions")).toBeVisible();
    await expect(page.getByText("Checks and tests")).toBeVisible();
    await expect(page.getByText("What I would improve next")).toBeVisible();

    // A screenshot thumbnail opens the shared viewer dialog with that one shot.
    const viewer = page.locator("dialog.zf-viewer");
    await page.locator(".zf-shot-trigger").first().click();
    await expect(viewer).toBeVisible();
    await expect(viewer.getByRole("img")).toHaveCount(1);
    await page.keyboard.press("Escape");
    await expect(viewer).toBeHidden();
  });

  test("contact form validates before sending", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.locator("#cf-name")).toBeVisible();
    await page.getByRole("button", { name: /Send message/i }).click();
    // Submitting empty surfaces inline errors rather than navigating away.
    await expect(page.getByText("Tell me who you are.")).toBeVisible();
    await expect(page.getByText("I need somewhere to write back.")).toBeVisible();
  });

  test("résumé opens in a viewer dialog with a download action", async ({ page }) => {
    await page.goto("/about");
    const dialog = page.locator("dialog.zf-viewer");
    await expect(dialog).toBeHidden();

    await page.getByRole("button", { name: /View résumé/i }).click();
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("img")).toHaveCount(2); // two résumé pages
    await expect(
      dialog.getByRole("link", { name: /Download PDF/i }),
    ).toHaveAttribute("href", /zulfahmi-cv\.pdf$/);

    const axe = await new AxeBuilder({ page })
      .include("dialog.zf-viewer")
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    const blocking = axe.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious",
    );
    expect(blocking, "a11y violations in open viewer").toEqual([]);

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });

  test("a certification opens its scan in the viewer dialog", async ({ page }) => {
    await page.goto("/about");
    const dialog = page.locator("dialog.zf-viewer");

    await page
      .getByRole("button", { name: /View Microsoft Certified Professional, .*2014 certificate/i })
      .click();
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("img")).toHaveCount(1);
    await expect(dialog.getByRole("link", { name: /Download PDF/i })).toHaveCount(0);

    await dialog.getByRole("button", { name: /Close viewer/i }).click();
    await expect(dialog).toBeHidden();
  });

  test("axe finds no serious or critical a11y violations", async ({ page }) => {
    for (const path of ["/", "/work", "/work/duitnow", "/about", "/contact"]) {
      await page.goto(path);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
      const blocking = results.violations.filter(
        (v) => v.impact === "critical" || v.impact === "serious",
      );
      if (blocking.length) {
        console.log(`[a11y] ${path}\n${JSON.stringify(blocking, null, 2)}`);
      }
      expect(blocking, `a11y violations on ${path}`).toEqual([]);
    }
  });
});
