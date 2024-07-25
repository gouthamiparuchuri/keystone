([
  // Authenticated :: Portal :: Dashboard :: Desktop
  {
    "report-name": " DellProjectNameConfig  :: Account Dashboard :: Authenticated :: Desktop",
    "report-description": "Account Dashboard scan for Desktop (accessible only through login)",
    preparePage: async (page) => {
      await page.setRequestInterception(true);
      page.on('request', (req) => {
        if (req.resourceType() === 'image') {
          req.abort();
        }
        else {
          req.continue();
        }
      });
      // page.on('console', msg => console.log('PAGE LOG:', msg));
      await page.goto('https://ma- DellProjectNameConfig -ci1.pnp6.pcf.dell.com/');
      await page.waitForTimeout(10000);
      await page.waitForSelector('#SignInModel_EmailAddress');
      await page.focus("#SignInModel_EmailAddress");    // Focusing on email field
      await page.keyboard.type("dellmyaccount@dell.com"); // Typing credential in email field
      await page.focus("#userPwd_UserInputSecret");    // Focusing on password field
      await page.keyboard.type("Dell@2020"); // Typing credential in password field
      await page.waitForTimeout(10000);
      await Promise.all([
        // page.$eval('form', form => form.submit()),
        await page.$eval("#btnSignIn", (el) => el.click()),  // Clicking login using css id selector to login
        await page.waitForSelector('acct- DellProjectNameConfig -acctng-dashboard')
      ]);
      await page.waitForTimeout(10000);
    },
    "viewport": {
      "width": 1920,
      "height": 1080,
      "isLandscape": true
    },
    "exclusions": [ "#masthead, #footer, #contact-drawer, #vocaasDiv, #ma__card-orders, #ma__card-devices, #ma__card-service-requests, #ma__card-financing, #ma__card-rewards, #ma__card-managesubscription, #ma__card-notifications, .dma-loading-indicator, #loadingIndicatorMsg" ]
  },
  
  
  // ACCOUNT
  // Authenticated :: Portal :: Account
  // (accessible only through login which was provided in scripted preparePage above)
  
  // Dashboard (Home) :: Mobile Navigation
  {
    "report-name": " DellProjectNameConfig  :: Account Dashboard :: Authenticated :: Mobile Navigation",
    "report-description": "Account Overview scan for Mobile Navigation",
    preparePage: async (page) => { },
    "viewport": {
        "width": 320,
        "height": 860
    },
    "exclusions": [ "#masthead, #footer, #contact-drawer, #vocaasDiv, #ma__card-orders, #ma__card-devices, #ma__card-service-requests, #ma__card-financing, #ma__card-rewards, #ma__card-managesubscription, #ma__card-notifications, .dma-loading-indicator, #loadingIndicatorMsg" ]
  },

  // Dashboard (Home) :: Mobile
  {
    "report-name": "Portal :: Account Dashboard :: Authenticated :: Mobile",
    "report-description": "Account Dashboard scan for Mobile",
    preparePage: async (page) => {
      await page.waitForSelector('a[data-test-id="ma__nav__mobile-overview-link"]');
      await page.click('a[data-test-id="ma__nav__mobile-overview-link"]');
      await page.waitForTimeout(5000);
    },
    "viewport": {
        "width": 320,
        "height": 860
    },
    "exclusions": [ "#masthead, #footer, #contact-drawer, #vocaasDiv, #ma__card-orders, #ma__card-devices, #ma__card-service-requests, #ma__card-financing, #ma__card-rewards, #ma__card-managesubscription, #ma__card-notifications, .dma-loading-indicator, #loadingIndicatorMsg" ]
  },
  
  // Profile Settings
  {
    "report-name": "Portal :: Profile Settings :: Authenticated :: Desktop",
    "report-description": "Profile Settings scan for Desktop",
    preparePage: async (page) => {
      await page.goto('https://ma-portal-ci1.pnp6.pcf.dell.com/myaccount/en-us/home/account-settings/profile');
      await page.waitForTimeout(10000);
    },
    "viewport": {
      "width": 1920,
      "height": 1080,
      "isLandscape": true
    },
    "exclusions": [ "#masthead, #footer, #contact-drawer, #vocaasDiv, #ma__card-addresses, #ma__card-payments, .dma-loading-indicator, #loadingIndicatorMsg" ]
  },
  {
    "report-name": "Portal :: Profile Settings :: Authenticated :: Mobile",
    "report-description": "Profile Settings scan for Mobile",
    preparePage: async (page) => { },
    "viewport": {
        "width": 320,
        "height": 860
    },
    "exclusions": [ "#masthead, #footer, #contact-drawer, #vocaasDiv, #ma__card-addresses, #ma__card-payments, .dma-loading-indicator, #loadingIndicatorMsg" ]
  },
  
  // Software & Subscriptions
  {
    "report-name": "Portal :: Software & Subscriptions :: Authenticated :: Desktop",
    "report-description": "Software & Subscriptions Account scan for Desktop",
    preparePage: async(page) => {
      await page.goto('https://ma-portal-ci1.pnp6.pcf.dell.com/myaccount/en-us/home/software-and-subscriptions');
      await page.waitForTimeout(10000);
    },
    "viewport": {
      "width": 1920,
      "height": 1080,
      "isLandscape": true
    },
    "exclusions": [ "#masthead, #footer, #contact-drawer, #vocaasDiv, .dma-loading-indicator, #loadingIndicatorMsg" ]
  },
  {
    "report-name": "Portal :: Software & Subscriptions :: Authenticated :: Mobile",
    "report-description": "Software & Subscriptions Account scan for Mobile",
    preparePage: async(page) => { },
    "viewport": {
        "width": 320,
        "height": 860
    },
    "exclusions": [ "#masthead, #footer, #contact-drawer, #vocaasDiv, .dma-loading-indicator, #loadingIndicatorMsg" ]
  },
  
  // Dashboard (Work)
  {
    "report-name": "Portal :: Account Dashboard (Work) :: Authenticated :: Desktop",
    "report-description": "Account Dashboard (Work) scan for Desktop",
    preparePage: async(page) => {
      await page.goto('https://ma-portal-ci1.pnp6.pcf.dell.com/myaccount/en-us/work/overview');
      await page.waitForTimeout(5000);
    },
    "viewport": {
      "width": 1920,
      "height": 1080,
      "isLandscape": true
    },
    "exclusions": [ "#masthead, #footer, #contact-drawer, #vocaasDiv, #ma__card-orders, #ma__card-devices, #ma__card-service-requests, #ma__card-financing, #ma__card-rewards, #ma__card-notifications, #ma__card-managesubscription, .dma-loading-indicator, #loadingIndicatorMsg" ]
  },
  // Dashboard (Work) Mobile
  {
    "report-name": "Portal :: Account Dashboard (Work) :: Authenticated :: Mobile",
    "report-description": "Account Dashboard (Work) scan for Mobile",
    preparePage: async(page) => {
      await page.waitForSelector('a[data-test-id="ma__nav__mobile-overview-link"]');
      await page.click('a[data-test-id="ma__nav__mobile-overview-link"]');
      await page.waitForTimeout(5000);
    },
    "viewport": {
        "width": 320,
        "height": 860
    },
    "exclusions": [ "#masthead, #footer, #contact-drawer, #vocaasDiv, #ma__card-orders, #ma__card-devices, #ma__card-service-requests, #ma__card-financing, #ma__card-rewards, #ma__card-notifications, #ma__card-managesubscription, .dma-loading-indicator, #loadingIndicatorMsg" ]
  },
  
  // Profile Settings (Work)
  {
    "report-name": "Portal :: Profile Settings (Work) :: Authenticated :: Desktop",
    "report-description": "Profile Settings (Work) scan for Desktop",
    preparePage: async(page) => {
      await page.goto('https://ma-portal-ci1.pnp6.pcf.dell.com/myaccount/en-us/work/account-settings/profile');
      await page.waitForTimeout(5000);
    },
    "viewport": {
      "width": 1920,
      "height": 1080,
      "isLandscape": true
    },
    "exclusions": [ "#masthead, #footer, #contact-drawer, #vocaasDiv, #ma__card-addresses, #ma__card-payments, .dma-loading-indicator, #loadingIndicatorMsg" ]
  },
  // Profile Settings (Work) Mobile
  {
    "report-name": "Portal :: Profile Settings (Work) :: Authenticated :: Mobile",
    "report-description": "Profile Settings (Work) scan for Mobile",
    preparePage: async(page) => { },
    "viewport": {
        "width": 320,
        "height": 860
    },
    "exclusions": [ "#masthead, #footer, #contact-drawer, #vocaasDiv, #ma__card-addresses, #ma__card-payments, .dma-loading-indicator, #loadingIndicatorMsg" ]
  },
  
])
