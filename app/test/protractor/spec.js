describe('Linksupp start page', function() {
    console.log('Testing the start page');
    beforeEach(function() {
        browser.get('http://localhost:3000');
    });

    it('should have a title', function() {
        expect(browser.getTitle()).toEqual('Linksupp');
    });

    it('should not allow you to create a meal if you are not logged in', function() {
        element(by.css('[ng-click="tryApp()"]')).click();
        element(by.repeater('pick in staffPicks').row(0)).click();
        element.all(by.id('createMealButton')).then(function(buttons) {
            buttons[1].click();
        });
        // expect(element(by.id('errorModal')).isDisplayed()).toBe(true);
        expect(element(by.id('mySmallModalabel')).getText()).toEqual('Need an Account');
    });


    it('should allow you to login via facebook', function() {
        element.all(by.id('loginTour')).then(function(buttons) {
            buttons[0].click();
        });
        element(by.id('fbLogin')).click();
        browser.sleep(2000);
        browser.driver.getAllWindowHandles().then(function(handles) {
            browser.driver.switchTo().window(handles[1]);
            expect(browser.driver.getCurrentUrl()).toContain('facebook');

            browser.driver.findElement(by.id('email')).sendKeys('leonfeli@gmail.com');
            browser.driver.findElement(by.id('pass')).sendKeys('mangiamo!');
            browser.driver.findElement(by.id('loginbutton')).click();

            browser.sleep(1000);
            browser.driver.switchTo().window(handles[0]);
        });

        browser.waitForAngular();
    });

    it('should bring up the contact modal when you press contact us', function() {
        element(by.css('[ng-click="contact()"]')).click();
        element(by.model('contactEmail')).sendKeys('Testing@test.com');
        element(by.model('contactMessage')).sendKeys('Just giving this a shot!');
        expect(element(by.id('contactModal')).isDisplayed()).toBe(true);
    });

    it('should now allow you to create a meal', function() {
        expect(browser.getTitle()).toEqual('Linksupp');
    });
});
