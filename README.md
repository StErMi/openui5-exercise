# OpenUI5 Training
This repo will contain a step-by-step training course that I've created for new OpenUI5 developers that are joining our [Techedge Group](http://www.techedgegroup.com) office in Lucca (Italy).

Training will be divided in step from easy to hard to build a complete CRUD SAPUI5 Master-Detail application.
The project will consume/create data of an SAP OData service from [Netweaver Gateway Demo ES5](https://blogs.sap.com/2017/06/16/netweaver-gateway-demo-es5-now-in-beta/). 
The IDE used in this topic is the SAP WebIDE that allow us to leverage the power of SAP SCP (Cloud Platform) to develop, configure, build and deploy on SAP Cloud Environment in a matter of seconds.

You can find each step of the exercise (with a description and a video of the final result) in a separate branch of this GitHub repository.

## Topics

 - XML views and fragments
 - Routing
 - Filter and Sort
 - OData model (configuring an SCP Destination)
 - JSONModel
 - Understanding manifest.json
 - Table and List
 - Master-Detail layout
 - SAP WebIDE
 - SAP Fiori Launch
 - Tip & Tricks

## Useful resources

-   [Documentation](https://sapui5.hana.ondemand.com/#/topic): various documentation about different topics. The first step you should do is to follow the whole  [Walkthrough](https://sapui5.hana.ondemand.com/#/topic/3da5f4be63264db99f2e5b04c5e853db)  that will show you how to create a SAPUI5 application from A to Z.
-   [Open Courses SAP](https://open.sap.com/courses/): here you will find a ton of free courses made by SAP developers on many topics. For SAPUI5 development I would suggest you  [Developing Web Apps with SAPUI5](https://open.sap.com/courses/ui51).
-   [API Reference](https://sapui5.hana.ondemand.com/#/api): here you will find useful information about models, controls with details about their properties, events, methods, aggregations and which class they are extending
-   [Samples](https://sapui5.hana.ondemand.com/#/controls): they are fundamental to see in actions every UI control. For each control, it will show you some real use-case scenario and how to configure them to have the same results. Clicking on the top-right icon of the example will allow you to access the source code of the example
-   [Build.me](https://build.me/): it’s a service developed by SAP that offers a complete set of cloud‑based tools to design and build your enterprise app, from low-fidelity to high-fidelity prototype
-   [SAP Cloud Platform Trial (for developers)](https://cloudplatform.sap.com/index.html): is an open platform-as-a-service (PaaS) that delivers in-memory capabilities, core platform services, and unique microservices for building and extending intelligent, mobile-enabled cloud applications. You can register a free trial account on  [https://account.hanatrial.ondemand.com/](https://account.hanatrial.ondemand.com/)
-   [SCN](https://www.sap.com/community.html): SAP community network, it’s the main community site where you can find Blog posts and QA made by SAP developers, mentors or users (think about it like StackOverflow).
-   [OpenUI5 Slack](https://slackui5invite.herokuapp.com/): this is our unofficial Slack channel where you can discuss an talk about SAPUI5 and other topics like WebIDE, HANA, custom controls and so on. Here you will also find SAP core developers to directly talk to.
-   [OpenUI5 GitHub repo](https://github.com/SAP/openui5): this is the official GitHub repository of OpenUI5 (in the SAP repo you will also find other interesting projects like the new build tool or sample applications)
-   [OpenUI5.org](http://openui5.org/): this is the official OpenUI5 application site
-   [UI5Con](https://wiki.scn.sap.com/wiki/display/events/UI5con): this is the main event about OpenUI5 (2017/2018) where you can find all the talks/hands-on session made with links to the slides, videos, and examples.
-   [UI5Lab](https://ui5lab.io/): this site is made by community members for community members ;) This is where we develop and share new custom libraries and controls to teach newcomers.

## Where to start

As I said this exercise will be based on an OData service provided through the SAP Netweaver Gateway Demo. You have to create a user on the demo system in order to access to those informations.

###  Configure SCP Cockpit Destination used 
Login into your SAP SCP account. Go inside *Connectivity > Destinations* and create a *New Destination* with the information provided in the blog post of the Gateway Demo System.
I've already prepared the configuration for (lazy one!) so you can just click on the *Import Destination* button. Just remember to configure your User/Password and test it before hitting Save.

    #Sat Sep 29 09:12:42 UTC 2018
    Description=SAP Gateway Demo System
    Type=HTTP
    TrustAll=true
    Authentication=BasicAuthentication
    WebIDEUsage=odata_abap, bsp_execute_abap, odata_gen
    Name=ES5
    WebIDEEnabled=true
    ProxyType=Internet
    URL=https\://sapes5.sapdevcenter.com
    sap-client=002
    User=YOU_ES5_USER_HERE
    WebIDESystem=ES5
**Tip:** I would suggest you to call the destination on your SAP SCP cockpit the same way I've used. In this way when you clone the Exercise Step from the repo's branch there will be no naming conflict

### Create a WebIDE Project from Template

Ok, it's time to develop. Now I will show you how you can create a WebIDE project. We're in an advanced exercise so I hope you already know how to do it but maybe it could be useful also for newcomers ;)

Follow the help video: [Create a new SAPUI5 app on SAP WebIDE Full-Stack](https://www.youtube.com/watch?v=ymopVPlTTuw)

### Configure the OData service with the ES5 Destination

Now we need to create a Destination from our SAP SCP account to our OData Service.
Follow the help video: [Configure OData Service on your SAPUI5 Application](https://www.youtube.com/watch?v=-SXlugW-QNc)

## Step 1

We're ready to follow the instructions inside the [Step 1](https://github.com/StErMi/openui5-exercise/tree/step_1) of our exercise.