# playwrights-hpstore


# 01. To Clone the project

    git clone <repository-url>


# 02. To Install Packages, use below command

    npm install
    
#### Outcome:- 'node_modules' folder should be created

# 03. To Run Tests in Chrome and Headless

    npx playwright test --project=chrome



# 04. Generating Allure Report

## Run the Playwright tests and the Allure reports are generated under 'allure-results' default

## To Install Allure, use below command (Only Once)

    npm install -g allure-commandline --save-dev


#### Note:- specify -g to install globally

## To Open Allure report, use below command (Java should be installed)

    allure serve

## To Generate and view HTML Allure report, use below command

    allure generate

or

    allure generate --clean --single-file

#### Outcome:- HTML report is generated under 'allure-report'
