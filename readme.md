### Pre-requirements:

*	Aws account with lambda service
*	Amazon Alexa account
*	NodeJS with npm installed

### Installation:

1.	Create AWS Lambda service at the AWS Console. Make Sure that your region supports Alexa Skills Kit.
2.	Login to the AWS Console and select lambda services.
3.	Create new lambda function
![CreateLambda](https://bytebucket.org/yoctopeople/hpeonesphere/raw/4db13f98ab2c569c4d7b92e04f0020cd2cdbb91e/wiki/img/aws/lambda_create_function.png)
4.	Fill info
![CreateLambdaInfo](https://bytebucket.org/yoctopeople/hpeonesphere/raw/4db13f98ab2c569c4d7b92e04f0020cd2cdbb91e/wiki/img/aws/lambda_create_function_info.png)
5.	Select alexa skills kit
![LambdaAlexaSkill](https://bytebucket.org/yoctopeople/hpeonesphere/raw/4db13f98ab2c569c4d7b92e04f0020cd2cdbb91e/wiki/img/aws/add_alexa_skill.png)
6.	Provide Skill ID from [Alexa Dev Portal](https://developer.amazon.com/alexa)  (Instructions for creating your the Alexa skill can be found below)
![LambdaAlexaSkillId](https://bytebucket.org/yoctopeople/hpeonesphere/raw/4db13f98ab2c569c4d7b92e04f0020cd2cdbb91e/wiki/img/aws/skill_id.png)
7.	Clone the source code to the local folder
8.	Open terminal and run “npm install”. Wait till the all dependencies will be installed
9.	Compress all project folder's files with installed dependencies
10.	Upload ZIP
![LambdaUploadBuild](https://bytebucket.org/yoctopeople/hpeonesphere/raw/4db13f98ab2c569c4d7b92e04f0020cd2cdbb91e/wiki/img/aws/upload_build.png)
11.	Configure environment variables. See “Environment variables configuration” section below
![LambdaEnvironment](https://bytebucket.org/yoctopeople/hpeonesphere/raw/4db13f98ab2c569c4d7b92e04f0020cd2cdbb91e/wiki/img/aws/environments.png)
12.	Encrypt your OneSphere login add password
![LambdaEncrypt](https://bytebucket.org/yoctopeople/hpeonesphere/raw/4db13f98ab2c569c4d7b92e04f0020cd2cdbb91e/wiki/img/aws/encrypt_data.png)
13.	Increase request timeout
![LambdaTimeout](https://bytebucket.org/yoctopeople/hpeonesphere/raw/4db13f98ab2c569c4d7b92e04f0020cd2cdbb91e/wiki/img/aws/update_timeout.png)
14.	Login to the “Alexa Developer Portal” and go to the “Alexa Consoles -> Skills”
15.	Add a new skill
![AlexaSkill](https://bytebucket.org/yoctopeople/hpeonesphere/raw/4db13f98ab2c569c4d7b92e04f0020cd2cdbb91e/wiki/img/alexa/create_skill.png)
16.	Fill skill name field and press Next
![AlexaSkillInfo](https://bytebucket.org/yoctopeople/hpeonesphere/raw/4db13f98ab2c569c4d7b92e04f0020cd2cdbb91e/wiki/img/alexa/create_skill_info.png)
17.	Select “Custom Skill” and press “Create Skill”
![AlexaSkillModel](https://bytebucket.org/yoctopeople/hpeonesphere/raw/4db13f98ab2c569c4d7b92e04f0020cd2cdbb91e/wiki/img/alexa/create_skill_model.png)
18.	Open your new skill
19.	Go to the Build Section
![AlexaBuild](https://bytebucket.org/yoctopeople/hpeonesphere/raw/4db13f98ab2c569c4d7b92e04f0020cd2cdbb91e/wiki/img/alexa/alexa_build.png)
20.	Open JSON Editor and paste content from the “intents.json” file
![AlexaBuildJSON](https://bytebucket.org/yoctopeople/hpeonesphere/raw/4db13f98ab2c569c4d7b92e04f0020cd2cdbb91e/wiki/img/alexa/alexa_build_json.png)
21.	Open “Endpoint” and add your AWS Lambda ARN
![AlexaBuildEndpoint](https://bytebucket.org/yoctopeople/hpeonesphere/raw/4db13f98ab2c569c4d7b92e04f0020cd2cdbb91e/wiki/img/alexa/alexa_build_endpoint.png)
22. Enable your dev skill through the mobile app

### Environment variables configuration:

ANALYTICS_API_URI: “http://ebc-demo.yoctocode.com:8086” - Eufore analytics URI

ANALYTICS_CLIENT_ID: “xxxxxxx-xxxx-xxxx-xxxx” – Eufore Client ID

IGNORE_SERVICE_SPEND: “true” – Set true to exclude “services” from total spend requests

ONESPHERE_APP_ID: “amzn1.ask.skill.xxxxxxxxxxxxxxxxxxxxx” – Alexa Skill ID

ONESPHERE_HOST: “https://demo.hpeonesphere.com” – OneSphere environment URI

ONESPHERE_PASSWORD: “encrypted_password” – Encrypted login

ONESPHERE_USERNAME: “encrypted_username” – Encrypted password


### Supported questions

Initiate OneSphere skills by saying "Alexa, ask one sphere." The response will be "Welcome to HPE OneSphere."

1. demoFirstQuestionIntent

    - Alexa, what do you think of One Sphere?

        - RE: I must say, I\'m enjoying my interactions with One Sphere and recommend every AWS customer sign up.

2. lobSpendCurrentMonthIntent

    - Alexa, which line of business has the highest spend this month

        - RE: The line of business "name" has the highest spend this month, total of $

3. projectsTopSpendCurrentMonthIntent

    - which project has the highest spend this month?
    - which project has the highest spend?

        - RE: Your project “name” has the highest spend in January of $

4. projectsTotalSpendCurrentMonthIntent

    - what's my spend across projects?
    - for my spend across projects
    - for my project spend this month
    - what is my spend across projects
    - my project spend this month

        - RE: You have 4 projects with a total February spend of $

5. providerTypesExtendedStatusIntent

    - How are my One Sphere cloud providers doing
    - Alexa, ask One Sphere how my cloud providers are doing

        - RE: 2 out of 2 providers status is OK

6. regionStatusIntent

    - Alexa,what are my "Private Cloud" Regions?

        - RE: 2 out of 2 regions status OK.

7. totalSpendAcrossProvidersIntent

    - Alexa, what is my total spend for the month?
    - Alexa, what is my total spend for the December?

        - RE: The total spend across all of your providers in February is $8,397

8. utilizationAcrossHybridCloudsIntentByProviderType

    - what is the utilization of my Private Cloud?

        - RE: The utilization score in Amazon Web Services is 159, using 5% cpu. The utilization score in your Private Cloud is 625, using 55% cpu, 45% memory, and 55% storage.

9. zoneStatusByRegionIntent

    - Alexa, ask One Sphere about the status of my zones in Private Cloud region?
    - zone status in Houston

        - RE: In Houston region there is 1 zone: Beach-1 zone is OK and; it has 1 cluster named Picaso and 8 datastores and 5 networks.