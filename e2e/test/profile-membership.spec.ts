import { AppPage } from '../src/app.po';
import { browser, logging, element, by } from 'protractor';

describe('test membership form', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  /*
  * tests to navigate the the profile page so that the tests can be conducted in the contact info view
  */
  it('login as user and navigate to profile landing page, click membership, membership container loaded', () => {
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
    page.getProfileGroupedMembershipBtn().click();
    expect(page.getProfileContainerTitle().getText()).toEqual("Membership:");
  });

  /*
  * tests to confirm the form input fields actually loaded
  */
  it('confirm batch label loaded in view', () => {
    expect(element(by.id("batch-name")).isPresent()).toBe(true);
  });

  it('confirm role select loaded in view', () => {
    expect(element(by.id("select-role")).isPresent()).toBe(true);
  });

  it('confirm status select loaded in view', () => {
    expect(element(by.id("select-status")).isPresent()).toBe(true);
  });

  it('confirm seats available select loaded in view', () => {
    expect(element(by.id("select-seats-available")).isPresent()).toBe(true);
  });

  it('confirm submit button loaded in view', () => {
    expect(page.getProfileContainerSubmitButton().isPresent()).toBe(true);
  });

  /*
  * tests to confirm data was pulled from db and ddisplayed
  */
  it('confirm correct batch loaded', () => {
    expect(element(by.id("batch-name")).getText()).toBe("1 - Morgantown");
  });

  it('confirm correct role loaded', () => {
    expect(element(by.id("select-role")).getAttribute("value")).toBe("false");
  });

  it('confirm correct status loaded', () => {
    expect(element(by.id("select-status")).getAttribute("value")).toBe("false");
  });

  it('confirm correct number of available seats loaded', () => {
    expect(element(by.id("select-seats-available")).getAttribute("value")).toBe("1: 1");
  });

  /*
  * tests to asses user's ability change inputs
  */
  it('able to change role', () => {
    element(by.id("select-role")).click();
    element(by.id("select-role")).element(by.cssContainingText('option', 'Driver')).click();
    expect(element(by.id("select-role")).getAttribute("value")).toBe("true");
  });

  it('able to change status', () => {
    element(by.id("select-status")).click();
    element(by.id("select-status")).element(by.cssContainingText('option', 'Active')).click();
    expect(element(by.id("select-status")).getAttribute("value")).toBe("true");
  });

  it('able to change available seats', () => {
    element(by.id("select-seats-available")).click();
    element(by.id("select-seats-available")).element(by.cssContainingText('option', '0')).click();
    expect(element(by.id("select-seats-available")).getAttribute("value")).toBe("0: 0");
  });

  it('available seats disabled when status is set to disabled', () => {
    element(by.id("select-status")).click();
    element(by.id("select-status")).element(by.cssContainingText('option', 'Disabled')).click();
    expect(element(by.id("select-status")).getAttribute("value")).toBe("false");
    expect(element(by.id("select-seats-available")).getAttribute('disabled')).toBe("true");
  });

  /*
  * test to make sure data is NOT persisted if the submit butotn is NOT used
  */
  it('not submit data, rout away, rout back, changes not persisted', () => {
    page.getProfileGroupedContactInfoBtn().click();
    page.getProfileGroupedMembershipBtn().click();
    expect(element(by.id("select-role")).getAttribute("value")).toBe("false");
    expect(element(by.id("select-status")).getAttribute("value")).toBe("false");
    expect(element(by.id("select-seats-available")).getAttribute("value")).toBe("1: 1");

  });

  /*
  * tests to make sure data is persisted if the submit butotn is used
  */
  it('persisted - role changes saved', () => {
    element(by.id("select-role")).click();
    element(by.id("select-role")).element(by.cssContainingText('option', 'Driver')).click();
    page.getProfileContainerSubmitButton().click();
    /*
    * these sleeps are so that the app has time to process the form submit
    */
    browser.sleep(500);
    page.getProfileGroupedContactInfoBtn().click();
    page.getProfileGroupedMembershipBtn().click();
    expect(element(by.id("select-role")).getAttribute("value")).toBe("true");
    element(by.id("select-role")).click();
    element(by.id("select-role")).element(by.cssContainingText('option', 'Rider')).click();
    page.getProfileContainerSubmitButton().click();
    browser.sleep(500);
    expect(element(by.id("select-role")).getAttribute("value")).toBe("false");
  });

  it('persisted - status changes saved', () => {
    element(by.id("select-status")).click();
    element(by.id("select-status")).element(by.cssContainingText('option', 'Active')).click();
    page.getProfileContainerSubmitButton().click();
    /*
    * these sleeps are so that the app has time to process the form submit
    */
    browser.sleep(500);
    page.getProfileGroupedContactInfoBtn().click();
    page.getProfileGroupedMembershipBtn().click();
    expect(element(by.id("select-status")).getAttribute("value")).toBe("true");
  });

  it('persisted - seats available changes saved', () => {
    element(by.id("select-seats-available")).click();
    element(by.id("select-seats-available")).element(by.cssContainingText('option', '0')).click();
    page.getProfileContainerSubmitButton().click();
    /*
    * these sleeps are so that the app has time to process the form submit
    */
    browser.sleep(500);
    page.getProfileGroupedContactInfoBtn().click();
    page.getProfileGroupedMembershipBtn().click();
    expect(element(by.id("select-seats-available")).getAttribute("value")).toBe("0: 0");
    element(by.id("select-seats-available")).click();
    element(by.id("select-seats-available")).element(by.cssContainingText('option', '1')).click();
    element(by.id("select-status")).click();
    element(by.id("select-status")).element(by.cssContainingText('option', 'Disabled')).click();
    page.getProfileContainerSubmitButton().click();
    browser.sleep(500);
    expect(element(by.id("select-seats-available")).getAttribute("value")).toBe("1: 1");
    expect(element(by.id("select-status")).getAttribute("value")).toBe("false");
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});