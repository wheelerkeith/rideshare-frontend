import { AppPage } from '../src/app.po';
import { browser, logging, element, by } from 'protractor';

describe('test contact information form', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  /*
  * tests to navigate the the profile page so that the tests can be conducted in the car information form
  */
  it('login as user and navigate to profile landing page, click car information, car information container loaded', () => {
    browser.driver.manage().window().setSize(1800,720);
    page.navigateTo();
    page.getLoginButton().click();
    element(by.id("login-form-username-input")).sendKeys("wviani");
    page.getLoginFormLoginButton().click();
    browser.sleep(2000);
    page.getNavDropDown().click();
    browser.waitForAngularEnabled(false);
    page.getNavProfileA().click();
    expect(element(by.id("profile-container")).isPresent()).toBe(true);
    page.getProfileGroupedCarInfoBtn().click();
    expect(page.getProfileContainerTitle().getText()).toEqual("Car Information:");
  });

  /*
  * tests to confirm the form input fields actually loaded
  */
  it('confirm make input loaded in view', () => {
    expect(element(by.id("make")).isPresent()).toBe(true);
  });

  it('confirm model input loaded in view', () => {
    expect(element(by.id("model")).isPresent()).toBe(true);
  });

  it('confirm color input loaded in view', () => {
    expect(element(by.id("color")).isPresent()).toBe(true);
  });

  it('confirm year input loaded in view', () => {
    expect(element(by.id("year")).isPresent()).toBe(true);
  });

  it('confirm number of seats select loaded in view', () => {
    expect(element(by.id("Nrseats")).isPresent()).toBe(true);
  });

  it('confirm submit button loaded in view', () => {
    expect(page.getProfileContainerSubmitButton().isPresent()).toBe(true);
  });

  /*
  * tests to confirm data was pulled from db and ddisplayed
  */
  it('confirm correct car make is loaded from db', () => {
    expect(element(by.id("make")).getAttribute("value")).toBe("Lotus");
  });

  it('confirm correct car model is loaded from db', () => {
    expect(element(by.id("model")).getAttribute("value")).toBe("Esprit");
  });

  it('confirm correct car color is loaded from db', () => {
    expect(element(by.id("color")).getAttribute("value")).toBe("Goldenrod");
  });

  it('confirm correct car year is loaded from db', () => {
    expect(element(by.id("year")).getAttribute("value")).toBe("2002");
  });

  it('confirm correct number of car seats loaded from db', () => {
    expect(element(by.id("Nrseats")).getAttribute("value")).toBe("1");
  });

  /*
  * tests to asses user's ability to input data in the input fields
  */

  /*
  * test to make sure data is NOT persisted if the submit butotn is NOT used
  */

  /*
  * tests to make sure data is persisted if the submit butotn is used
  */

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});