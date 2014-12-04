describe('Linksupp start page', function() {
    console.log('Testing the start page');
    beforeEach(function() {
        browser.get('http://localhost:3000');
    });

    it('should have a title', function() {
        expect(browser.getTitle()).toEqual('Linksupp');
    });

    it('should take you to the map when you press grab lunch', function() {
        // browser.sleep(3000);
        element(by.css('[ng-click="tryApp()"]')).click();
        expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/#/main');
    });

    it('should bring up the contact modal when you press contact us', function() {
        browser.sleep(3000);
        element(by.css('[ng-click="contact()"]')).click();

    });
});
