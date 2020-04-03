import { AppPage } from '../src/app.po';
import { browser, logging, element, by } from 'protractor';

describe('test landing page login form', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  /*
  * tests to navigate the the profile page so that the tests can be conducted in the contact info view
  */
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

  /*
  * tests to confirm the form input fields actually loaded
  */
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

  /*
  * tests to confirm data was pulled from db and ddisplayed
  */
  it('confirm users first name loaded in input', () => {
    expect(element(by.id("f_name")).getAttribute("value")).toBe("Wain");
  });

  it('confirm users last name loaded in input', () => {
    expect(element(by.id("l_name")).getAttribute("value")).toBe("Vian");
  });

  it('confirm users email loaded in input', () => {
    expect(element(by.id("user_email")).getAttribute("value")).toBe("wviani@homestead.com");
  });

  it('confirm users phone loaded in input', () => {
    expect(element(by.id("phone")).getAttribute("value")).toBe("704-338-2790");
  });

  /*
  * tests to asses user's ability to input data in the input fields
  */
  it('able to input data in first name input field', () => {
    element(by.id("f_name")).sendKeys("test");
    expect(element(by.id("f_name")).getAttribute("value")).toBe("Waintest");
  });

  it('able to input data in last name input field', () => {
    element(by.id("l_name")).sendKeys("test");
    expect(element(by.id("l_name")).getAttribute("value")).toBe("Viantest");
  });

  it('able to input data in email input field', () => {
    element(by.id("user_email")).sendKeys("test");
    expect(element(by.id("user_email")).getAttribute("value")).toBe("wviani@homestead.comtest");
  });

  it('able to input data in the phone input field', () => {
    expect(element(by.id("phone")).sendKeys("0000"));
    expect(element(by.id("phone")).getAttribute("value")).toBe("704-338-27900000");
  });

  /*
  * test to make sure data is NOT persisted if the submit butotn is NOT used
  */
  it('not submit data and rout away, rout back, changes not persisted', () => {
    page.getProfileGroupedLocationBtn().click();
    page.getProfileGroupedContactInfoBtn().click();
    expect(element(by.id("f_name")).getAttribute("value")).toBe("Wain");
    expect(element(by.id("l_name")).getAttribute("value")).toBe("Vian");
    expect(element(by.id("user_email")).getAttribute("value")).toBe("wviani@homestead.com");
    expect(element(by.id("phone")).getAttribute("value")).toBe("704-338-2790")
  });

  /*
  * tests to make sure data is persisted if the submit butotn is used
  */
  it('persisted - first name changes saved', () => {
    element(by.id("f_name")).clear();
    element(by.id("f_name")).sendKeys("test_name");
    page.getProfileContainerSubmitButton().click();
    page.getProfileGroupedLocationBtn().click();
    page.getProfileGroupedContactInfoBtn().click();
    expect(element(by.id("f_name")).getAttribute("value")).toBe("test_name");
    browser.pause();
    element(by.id("f_name")).clear();
    element(by.id("f_name")).sendKeys("Wain");
    page.getProfileContainerSubmitButton().click();
    browser.pause();
  });




  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});