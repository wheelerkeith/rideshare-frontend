import { browser, logging, by, element } from 'protractor';
import { AppPage } from '../src/app.po';

describe('navigation tests', function() {
    let page: AppPage;

    beforeEach(() => {
        page = new AppPage();
      });

    let profilebuttonname = element(by.id('driverbuttontext'));
    
    it('has the users name at top right', function() {
        expect(profilebuttonname.getText()).toEqual('Wain Vian');
    });

    it('user can click on profile button', function() {
        page.navigateTo();
        page.getNavProfileA().click();
        expect(element(by.id('profile-container-title')).getText()).toBe('Contact Information');
    });

    afterEach(async () => {
        // Assert that there are no errors emitted from the browser
        const logs = await browser.manage().logs().get(logging.Type.BROWSER);
        expect(logs).not.toContain(jasmine.objectContaining({
          level: logging.Level.SEVERE,
        } as logging.Entry));
      });
});