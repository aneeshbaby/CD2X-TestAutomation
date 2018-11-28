import * as fs from 'graceful-fs';
import * as webdriver from 'selenium-webdriver';
import { assert } from 'chai';

// start a new scenario
describe('Selenium Demo on ChemDraw JS', function () {
    let driver;
    // time out for test execution
    this.timeout(60000);
    
    before(function () {
        // initializing chrome driver
        driver = new webdriver.Builder()
            .withCapabilities(webdriver.Capabilities.chrome())
            .build();
        // maximizing chrome browser
        driver.manage().window().maximize();
    });
    
    afterEach(function () {
        let testCaseName: string = this.currentTest.title;
        let testCaseStatus: string = this.currentTest.state;
        if (testCaseStatus === 'failed') {
            console.log(`Test: ${testCaseName}, Status: Failed!`);
            // capturing screenshot if test fails
            driver.takeScreenshot().then((data) => {
                let screenshotPath = `TestResults/Screenshots/${testCaseName}.png`;
                console.log(`Saving Screenshot as: ${screenshotPath}`);
                fs.writeFileSync(screenshotPath, data, 'base64');
            });
        } else if (testCaseStatus === 'passed') {
            console.log(`Test: ${testCaseName}, Status: Passed!`);
        } else {
            console.log(`Test: ${testCaseName}, Status: Unknown!`);
        }
    });

    after(function () {
        driver.quit();
    });

    it('should launch ChemDraw JS page', function () {
        let Url: string = "http://cdd-docker.scienceaccelerated.com:8180/js/sample/index.html#";
        return driver.get(Url).then(() => {
            console.log(`Page "${Url}" opened`);
        }).then("chekURL",() => {
            return driver.getCurrentUrl().then((currentUrl) => {
                assert.include(currentUrl, `cdd-docker.scienceaccelerated.com`,
                    `Expected url: cdd-docker.scienceaccelerated.com, Actual url: ${currentUrl}`);
                    driver.sleep(3000);
            });
        });
    });

    it.only('Launch Google.com and sign in', function () {
        let Url: string = "https://www.google.com/";
        return driver.get(Url).then(() => {
            return driver.getCurrentUrl().then((currentNewURL) => {
                console.log(`page "${currentNewURL}" opened`);
            }).then(() => {
                return driver.sleep(500).then(() => {
                    return driver.findElement(webdriver.By.linkText("Sign in")).then((signInText) => {
                        console.log(signInText);
                        return signInText.click().then(() => {
                            return driver.findElement(webdriver.By.id("identifierId")).then((emailTextField) => {
                                emailTextField.sendKeys("aneeshbaby@gmail.com");
                                driver.sleep(500);
                                // find the Next button and clik
                                let emailNextButton = driver.findElement(webdriver.By.xpath("//span[contains(text(), 'Next')]"));//.then((emailNextButton) => {
                                emailNextButton.click();
                                driver.sleep(5000);
                            }).then(() => {
                                // enter the password
                                let passwordField = driver.findElement(webdriver.By.name("password"));
                                passwordField.sendKeys("XXXX");
                                driver.sleep(1000);
                                // click next
                                let passwordNext = driver.findElement(webdriver.By.xpath("//span[text()='Next']"));
                                passwordNext.click();
                                driver.sleep(5000);
                            })
                        });
                    })
                })
            })
        })
        });
});