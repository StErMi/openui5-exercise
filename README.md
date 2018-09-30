
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

Follow the help video: [Create a new SAPUI5 app on SAP WebIDE Full-Stack](https://www.youtube.com/watch?v=ymopVPlTTuw)

### Configure the OData service with the ES5 Destination

Now we need to create a Destination from our SAP SCP account to our OData Service.
Follow the help video: [Configure OData Service on your SAPUI5 Application](https://www.youtube.com/watch?v=-SXlugW-QNc)

##  Step 1

### Recap from previus Step
We've created our SAPUI5 application on SAP WebIDE and we have configured our app to use the ES5 Gateway Destination created on SAP SCP Cockpit.

### What will be covered on this exercise

 - What is a XML Metadata Manifest and what's inside it
 - Use a `sap.m.Table` with items and property binding
 - Use `sap.ui.model.type.DateTime` to format JavaScript Date
 - How to style columns to act differently on mobile/table/desktop devices

Now it's time to get our hands dirty with some code. In this step you are going to display a table of Business Partner with some useful inforations.

The first thing to do is to checkout our service metadata. Each oData service expose a special XML file called XML Metadata Manifest. You can see it by appending `$metadata` to the service url. This is our [GWSAMPLE_BASIC metadata URL](https://sapes5.sapdevcenter.com/sap/opu/odata/iwbep/GWSAMPLE_BASIC/$metadata).
The Metatada Manifest is really important because it describes:

 - Which Model Set exposed by the service
 - For each Model which is the primary key, the list of attributes (with type and constraints) and if it has some navigation property (how you can navigate from this model to others as relations)
 - A lot of other useful informations 

Take a look at the `BusinessPartner EntitySet`, and try to guess which property I've used for the final result of this step.  Now checkout the Table documentation on SAPUI5 and try to replicate my layout with the correct order of columns and items. For each column name create a translation in the `i18n.property` files and use it in the XML as a binding.
Now, attach the BusinessPartnerSet to the table, add the requested column and style the column values according to the example. 

Please note that:
 - Created At has a specific DateTime formated displayed
 - Column act differently if the app is opened in a phone, tablet or desktop browser

After you have finished the exercise you can check out the result.
