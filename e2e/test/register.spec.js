
describe('Sign Up tests', function(){
    let elSignUpLink = element(by.xpath('/html/body/app-root/app-home-page/div[1]/div/div/button[2]/signupmodal/a'));
    let elRegisterHeader = element(by.xpath('/html/body/modal-container/div/div/div[1]/h4'));
    let firstNameInput
    let lastNameInput
    let usernameInput
    let emailInput
    let phoneInput
    let addressInput
    let cityInput
    let stateInput
    let zipCodeInput
    let driverRadio
    
    it('Sign up link on login page opens Sign up modal', function() {
        browser.get('http://localhost:4200/');
        browser.driver.sleep(500);
        elSignUpLink.click();
        browser.driver.sleep(500);
        expect(elRegisterHeader.getText()).toBe('Sign Up');
    });

    it ('After submit routes to landing page', function() {
        browser.get('http://localhost:4200/');
        elSignUpLink.click();
    });
});
