# OpenUI5 Training
This repo will contains a step-by-step training course that I've created for new OpenUI5 developers that are joining our [Techedge Group](http://www.techedgegroup.com) office in Lucca (Italy).

Training will be divided in step from easy to hard to build a complete CRUD SAPUI5 Master-Detail application.
The project will consume/create data of a SAP OData service from [Netweaver Gateway Demo ES5](https://blogs.sap.com/2017/06/16/netweaver-gateway-demo-es5-now-in-beta/). 
The IDE used in this topic is the SAP WebIDE that allow us to leverage the power of SAP SCP (Cloud Platform) to develop, configure, build and deploy on SAP Cloud Environment in a matter of seconds.

You can find each step of the exercise (with a description and a video of the final result) in a seperate branch of this GitHub repository.

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

## Where to start

As I said this exercise will be based on an OData service provided through the SAP Netweaver Gateway Demo. You have to create an user on the demo system in order to access to those information.

###  Configure SCP Cockpit Destination used 
Login into your SAP SCP account. Go inside *Connectivity > Destinations* and create a *New Destination* with the information provided in the blog post of the Gateway Demo System.
I've already preparated the configuration for (lazy one!) so you can just click on the *Import Destination* button. Just remember to configure your User/Password and test it before hitting Save.

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

Ok it's time to develop. Now I will show you how you can create a WebIDE project. We're in an advanced exercise so I hope you already know how to do it but maybe it could be useful also for newcomers ;)

<< Insert Video >>

### Configure the OData service with the ES5 Destination

<< Insert Video >>

##  Step 1
Ok we're ready, now I will show you what you have to do on Step 1
