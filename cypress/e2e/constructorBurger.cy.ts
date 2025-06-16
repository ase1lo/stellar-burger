/// <reference types="cypress" />

/**
 * Тесты для страницы конструктора бургера
 * Проверяют основные функции:
 * - Добавление и замена ингредиентов
 * - Оформление заказа
 * - Работу с модальными окнами
 */

const TEST_IDS = {
  // Ингредиенты
  BUN: '643d69a5c3f7b9001cfa093c', // Краторная булка N-200i
  ANOTHER_BUN: '643d69a5c3f7b9001cfa093d', // Флюоресцентная булка R2-D3
  FILLING: '643d69a5c3f7b9001cfa0941', // Мясо бессмертных моллюсков Protostomia
  
  // Элементы интерфейса
  ORDER_BUTTON: 'order-button', // Кнопка оформления заказа
  OVERLAY: 'overlay', // Затемнение для модальных окон
  MODAL: 'modals', // Контейнер модальных окон
  CONSTRUCTOR: 'burger_constructor', // Секция конструктора
  PRICE: 'price' // Элемент с ценой
};

describe('Страница конструктора бургера', () => {
  beforeEach(() => {
    // Подготавливаем моки для API
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('POST', 'api/orders', { fixture: 'orderResponse.json' }).as('postOrder');
    cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' }).as('getUser');

    // Открываем страницу и ждем загрузки
    cy.visit('/');
    cy.wait('@getIngredients');
    cy.get(`#${TEST_IDS.MODAL}`).as('modal');
  });

  describe('Управление ингредиентами', () => {
    it('счетчик ингредиента увеличивается при добавлении', () => {
      // Добавляем начинку и проверяем счетчик
      cy.get(`[data-cy=${TEST_IDS.FILLING}]`).children('button').click();
      cy.get(`[data-cy=${TEST_IDS.FILLING}]`).find('.counter__num').should('contain', '1');
    });

    describe('Добавление ингредиентов в конструктор', () => {
      it('булка и начинка добавляются в правильном порядке', () => {
        // Сначала булка, потом начинка
        cy.get(`[data-cy=${TEST_IDS.BUN}]`).children('button').click();
        cy.get(`[data-cy=${TEST_IDS.FILLING}]`).children('button').click();
      });

      it('булка добавляется после начинки', () => {
        // Сначала начинка, потом булка
        cy.get(`[data-cy=${TEST_IDS.FILLING}]`).children('button').click();
        cy.get(`[data-cy=${TEST_IDS.BUN}]`).children('button').click();
      });

      it('булка заменяется в пустом конструкторе', () => {
        // Добавляем первую булку и заменяем на вторую
        cy.get(`[data-cy=${TEST_IDS.BUN}]`).children('button').click();
        cy.get(`[data-cy=${TEST_IDS.ANOTHER_BUN}]`).children('button').click();
      });

      it('булка заменяется при наличии начинок', () => {
        // Добавляем булку, начинку и заменяем булку
        cy.get(`[data-cy=${TEST_IDS.BUN}]`).children('button').click();
        cy.get(`[data-cy=${TEST_IDS.FILLING}]`).children('button').click();
        cy.get(`[data-cy=${TEST_IDS.ANOTHER_BUN}]`).children('button').click();
      });
    });
  });

  describe('Оформление заказа', () => {
    it('заказ создается для авторизованного пользователя', () => {
      // Подготавливаем заказ
      cy.get(`[data-cy=${TEST_IDS.BUN}]`).children('button').click();
      cy.get(`[data-cy=${TEST_IDS.FILLING}]`).children('button').click();

      // Оформляем заказ и проверяем результат
      cy.get(`[data-cy=${TEST_IDS.ORDER_BUTTON}]`).click();
      cy.wait('@postOrder');
      cy.get('@modal').should('not.be.empty');
    });
  });

  describe('Работа с модальными окнами', () => {
    it('открывается окно с информацией об ингредиенте', () => {
      // Проверяем открытие модального окна
      cy.get('@modal').should('be.empty');
      cy.get(`[data-cy=${TEST_IDS.FILLING}]`).children('a').click();
      cy.get('@modal').should('not.be.empty');
      cy.url().should('include', TEST_IDS.FILLING);
    });

    it('окно закрывается по клику на крестик', () => {
      // Открываем и закрываем окно крестиком
      cy.get(`[data-cy=${TEST_IDS.FILLING}]`).children('a').click();
      cy.get('@modal').should('not.be.empty');
      cy.get('@modal').find('button').click();
      cy.get('@modal').should('be.empty');
    });

    it('окно закрывается по клику на затемнение', () => {
      // Открываем и закрываем окно кликом по затемнению
      cy.get(`[data-cy=${TEST_IDS.FILLING}]`).children('a').click();
      cy.get('@modal').should('not.be.empty');
      cy.get(`[data-cy=${TEST_IDS.OVERLAY}]`).click({ force: true });
      cy.get('@modal').should('be.empty');
    });

    it('окно закрывается по нажатию Escape', () => {
      // Открываем и закрываем окно клавишей Escape
      cy.get(`[data-cy=${TEST_IDS.FILLING}]`).children('a').click();
      cy.get('@modal').should('not.be.empty');
      cy.get('body').trigger('keydown', { key: 'Escape' });
      cy.get('@modal').should('be.empty');
    });
  });
});
