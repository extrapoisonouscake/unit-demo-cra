import { test, expect } from "@playwright/test";

test('по адресу /about открывается страница "о проекте"', async ({ page }) => {
  await page.goto("/unit-demo-cra/about");
  console.log('🚱',page.url())
  await expect(page.getByTestId("page-title")).toHaveText("About");
});

test("если добавить элемент, он появляется в списке", async ({ page }) => {
  await page.goto("/unit-demo-cra");
console.log('🚸',page.url())
  await page.getByTestId("input-add").type("Сделать домашку");
  await page.getByTestId("button-add").click();

  const items = page.getByTestId("list-item");
  const allTexts = await items.allTextContents();

  await expect(allTexts).toContain("Сделать домашку");
});
