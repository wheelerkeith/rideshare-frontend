import { AppPage } from '../src/app.po';
import { browser, logging, element, by } from 'protractor';

describe('test landing page login form', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('login as user and navigate to profile landing page, profile container loaded', () => {
    browser.driver.manage().window().setSize(1800,720);
    page.navigateTo();
    page.getLoginButton().click();
    element(by.id("login-form-username-input")).sendKeys("wviani");
    page.getLoginFormLoginButton().click();
    page.getNavDropDown().click();
    browser.waitForAngularEnabled(false);
    page.getNavProfileA().click();
    expect(element(by.id("profile-container")).isPresent()).toBe(true);
  });

  it('contact information view loaded by default', () => {
    expect(page.getProfileContainerTitle().getText()).toEqual("Contact Information:");
  });

  it('confirm first name input loaded in view', () => {
    expect(element(by.id("f_name")).isPresent()).toBe(true);
  });

  it('confirm last name input loaded in view', () => {
    expect(element(by.id("l_name")).isPresent()).toBe(true);
  });

  it('confirm email input loaded in view', () => {
    expect(element(by.id("user_email")).isPresent()).toBe(true);
  });

  it('confirm phone input loaded in view', () => {
    expect(element(by.id("phone")).isPresent()).toBe(true);
  });

  it('confirm submit button loaded in view', () => {
    expect(page.getProfileContainerSubmitButton().isPresent()).toBe(true);
  });
  

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});