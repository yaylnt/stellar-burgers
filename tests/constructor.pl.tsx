import { test, expect } from '@playwright/test';

test.describe('Конструктор бургеров с HAR', () => {
  test('Проверка отображения ингредиентов', async ({ page }) => {
    await page.routeFromHAR('./tests/hars/ingredients.har', {
      url: '**/api/ingredients',
      notFound: 'abort'
    });
    await page.goto('/');
    await expect(page.getByText('Флюоресцентная булка R2-D3')).toBeVisible();
  });

  test('Проверка добавления ингредиента из списка в конструктор', async ({
    page
  }) => {
    await page.routeFromHAR('./tests/hars/ingredients.har', {
      url: '**/api/ingredients',
      notFound: 'abort'
    });
    await page.goto('/');
    await expect(page.getByText('Флюоресцентная булка R2-D3')).toBeVisible();

    const bun = page
      .getByTestId('burger-ingredient')
      .filter({ hasText: 'Флюоресцентная булка R2-D3' });

    await bun.getByRole('button', { name: 'Добавить' }).click();
    await expect(page.getByTestId('constructor-bun-top')).toContainText(
      'Флюоресцентная булка R2-D3'
    );
    await expect(page.getByTestId('constructor-bun-bottom')).toContainText(
      'Флюоресцентная булка R2-D3'
    );

    const ingredient = page
      .getByTestId('burger-ingredient')
      .filter({ hasText: 'Биокотлета из марсианской Магнолии' });
    await ingredient.getByRole('button', { name: 'Добавить' }).click();
    await expect(page.getByTestId('constructor-ingredient')).toContainText(
      'Биокотлета из марсианской Магнолии'
    );
  });

  test('Проверка работы модальных окон', async ({ page }) => {
    await page.routeFromHAR('./tests/hars/ingredients.har', {
      url: '**/api/ingredients',
      notFound: 'abort'
    });
    await page.goto('/');
    await expect(page.getByText('Флюоресцентная булка R2-D3')).toBeVisible();

    // Модальное окно открыто
    const ingredient = page
      .getByTestId('burger-ingredient')
      .filter({ hasText: 'Биокотлета из марсианской Магнолии' });
    await ingredient.getByRole('link').click();
    await expect(
      page
        .getByTestId('modal')
        .getByTestId('ingredient-details')
        .getByText('Биокотлета из марсианской Магнолии')
    ).toBeVisible();

    // Модальное окно закрыто по кнопке
    await page.getByTestId('modal-close').click();
    await expect(page.getByTestId('modal')).not.toBeVisible();

    // Модальное окно закрыто по клику на оверлей
    await ingredient.getByRole('link').click();
    await page
      .getByTestId('modal-overlay')
      .click({ position: { x: 10, y: 10 } });
    await expect(page.getByTestId('modal')).not.toBeVisible();
  });

  test('Проверка создания заказа', async ({ page, context }) => {
    // Мокаем данные индредиентов, авторизации и создания заказа
    await page.routeFromHAR('./tests/hars/ingredients.har', {
      url: '**/api/ingredients',
      notFound: 'abort'
    });

    await page.routeFromHAR('./tests/hars/user.har', {
      url: '**/api/auth/user',
      notFound: 'abort'
    });

    await context.addCookies([
      {
        name: 'accessToken',
        value: 'test-access-token',
        domain: 'localhost',
        path: '/'
      }
    ]);

    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'test-refresh-token');
    });

    await page.routeFromHAR('./tests/hars/order.har', {
      url: '**/api/orders',
      notFound: 'abort'
    });

    await page.goto('/');
    await expect(page.getByText('BurgerOfMars')).toBeVisible();

    // Добавляем ингредиенты в конструктор
    const bun = page
      .getByTestId('burger-ingredient')
      .filter({ hasText: 'Флюоресцентная булка R2-D3' });
    await bun.getByRole('button', { name: 'Добавить' }).click();
    const ingredient = page
      .getByTestId('burger-ingredient')
      .filter({ hasText: 'Биокотлета из марсианской Магнолии' });
    await ingredient.getByRole('button', { name: 'Добавить' }).click();
    await page.getByText('Оформить заказ').click();

    // // Проверяем, что модальное окно с номером заказа открыто
    await expect(page.getByTestId('modal')).toBeVisible();
    await expect(page.getByTestId('order-number')).toBeVisible();
    await expect(page.getByTestId('order-number')).toHaveText('8459');

    // Закрываем модальное окно по кнопке
    await page.getByTestId('modal-close').click();
    await expect(page.getByTestId('modal')).not.toBeVisible();

    // Проверяем, что конструктор пустой после оформления заказа
    await expect(page.getByText('Выберите булки').first()).toBeVisible();
    await expect(page.getByText('Выберите начинку')).toBeVisible();

    await context.clearCookies();
    await page.evaluate(() => localStorage.clear());
  });
});
