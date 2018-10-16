
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

##  Step 1

### Recap from previous Step
We've created our SAPUI5 application on SAP WebIDE and we have configured our app to use the ES5 Gateway Destination created on SAP SCP Cockpit.

### What will be covered on this exercise

 - What is an XML Metadata Manifest and what's inside it
 - Use a `sap.m.Table` with items and property binding
 - Use `sap.ui.model.type.DateTime` to format JavaScript Date
 - How to style columns to act differently on mobile/table/desktop devices

Now it's time to get our hands dirty with some code. In this step, you are going to display a table of Business Partner with some useful inforation.

The first thing to do is to check out our service metadata. Each oData service exposes a special XML file called XML Metadata Manifest. You can see it by appending `$metadata` to the service URL. This is our [GWSAMPLE_BASIC metadata URL](https://sapes5.sapdevcenter.com/sap/opu/odata/iwbep/GWSAMPLE_BASIC/$metadata).
The Metatada Manifest is really important because it describes:

 - Which Model Set exposed by the service
 - For each Model which is the primary key, the list of attributes (with type and constraints) and if it has some navigation property (how you can navigate from this model to others as relations)
 - A lot of other useful pieces of information

Take a look at the `BusinessPartner EntitySet`, and try to guess which property I've used for the final result of this step.  Now check out the Table documentation on SAPUI5 and try to replicate my layout with the correct order of columns and items. For each column name create a translation in the `i18n.property` files and use it in the XML as a binding.
Now, attach the BusinessPartnerSet to the table, add the requested column and style the column values according to the example. 

Please note that:
 - Created At has a specific DateTime formated displayed
 - Column act differently if the app is opened in a phone, tablet or desktop browser

After you have finished the exercise you can check out the result on the source code of the branch.

##  Step 2

### Recap from previous Step
In the [previous blog post](https://medium.com/@stermi/sapui5-for-dummies-part-1-a-complete-step-by-step-exercise-b9ce23425203), we started designing our application rendering a table with some Business Partner. We learned what OData protocol is, how to read an OData XML manifest, how to bind data to a Table and how to customize columns layout based on different screen resolution.

### What will be covered on this exercise
With Part 2 of this series of blog posts, we will learn how to interact with data in our Tables and List. We will learn how to filter and sort data in a smart way.

-   Create [JSONModel](https://sapui5.hana.ondemand.com/#/api/sap.ui.model.json.JSONModel) to handle local data
-   Set a default sizeLimit to our JSONModel
-   [FilterBar](https://sapui5.hana.ondemand.com/#/api/sap.ui.comp.filterbar.FilterBar): UI control that displays filters in a user-friendly manner to populate values for a query
-   Use XML Fragments to create a View Settings Dialog to handle sort and group data
-   [Filter](https://sapui5.hana.ondemand.com/#/api/sap.ui.model.Filter) and [Sort](https://sapui5.hana.ondemand.com/#/api/sap.ui.model.Sorter) data
-   Add an Info Toolbar to our table to display useful information

#### FilterBar

The first thing we want to do is to allow users to filter the Business Partner list displayed on our table. Most of the time we have a really large data (our Business Partner set is made of 13880 records) set to display and the user wants to just filter all those records based on some useful information.

> Rule of thumb: do not display filter input for pieces of information that aren’t displayed in your table/list

To do so you need to add a FilterBar above your table. This UI control is only available on SAPUI5 and not in OpenUI5.

FilterBar allows you to group filter in an ordered manner. This UI control is always used with a [Variant Manager](https://sapui5.hana.ondemand.com/#/api/sap.ui.comp.variants.VariantManagement) that I will not cover this time.

![](https://cdn-images-1.medium.com/max/1000/1*03aLB4e_WLfThVfh5CwQPg.gif)

Add four different filter:

-   ID: Input that will filter the BusinessPartnerID attribute
-   Name: Input that will filter the CompanyName attribute
-   Street: Input that will
-   Country: Select ([country code list JSON](https://gist.github.com/StErMi/fd8f3a51fc97d78794996f3a8dc903a8)) to filter Address/Country attribute

After you will have added those input to the FilterBar what you need to do is to bind to the “search” and “clear” events. The first one will be triggered when the user starts a search, the second one when you will have to clear all the filters and start a blank search.

Filters must be exclusive with each other. If the user has added “SAP” in the company name and “IT” in the country code your table should filter for a query like

> Give me all the Business Partner with a Name **containing** “SAP” and with a country code **equals** to “DE”
#### JSONModel

We already said that in SAPUI5 you have to different kind of models:

-   [ODataModel](https://sapui5.hana.ondemand.com/#/api/sap.ui.model.odata.v2.ODataModel) v2: model implementation based on the OData protocol (version 2). It is used when you need to interact with an OData service.
-   [JSONModel](https://sapui5.hana.ondemand.com/#/api/sap.ui.model.json.JSONModel): model implementation for JSON data. It’s mostly used to handle local/temporary data

For our exercise, I suggest you create one JSONModel to store filter data and another one to store country codes. When you have created a local JSON file inside your model folder you can easily import them from the _manifest.json_ that will handle all the logic to pre-load information when your app will start.

#### Filter

new sap.ui.model.Filter(vFilterInfo, vOperator?, vValue1?, vValue2?)

Filter is a powerful tool, it allows you to mix different filters to create complex OData query that will be then translated in SQL on the backend side.

1.  The first parameter is the column name you want to filter on. You can also specify a column from an expanded property like “Address/Street”
2.  The second parameter is the operation you would like to apply to your filter. You can find all the possible operations on the [FilterOperator](https://sapui5.hana.ondemand.com/#/api/sap.ui.model.FilterOperator) documentation.
3.  The third and fourth parameter are query values inputted by the user and that you want to filter on.

The second constructor of the Filter allows you to mix filters in order to create groups of AND and OR filter.

new sap.ui.model.Filter(aFilters, bAnd)

After you have created your final Filter you can apply it to the Table binding.

#### Sort and Group

A user always wants to also sort/group record based on a specific column and they work more or less like Filter.

new sap.ui.model.Sorter(sPath, bDescending?, vGroup?, fnComparator?)

1.  The first parameter (as for Filter) is the OData attribute you want to sort on
2.  The second parameter (boolean) will sort data in a Descending or Ascending way
3.  The third parameter can be both a boolean (if you want to regroup data) or a function (I will explain this in a moment).
4.  The last parameter is optional and allows you to do a local (not on OData) custom sort based on the function result

The vGroup parameter is important because allows you to specify a custom way to re-group items. You just need to implement a custom function that returns a JavaScript object with a _key_ and a _text_ value inside.

-   Key will be used by SAPUI5 to understand if the record is contained already in a group with the same key value
-   Text is used by SAPUI5 to create the UI to show the group name

This function is particularly important when you want to regroup items for special values like dates. Each JavaScript date is different because it handles data to the millisecond. In this case, you could format the date to only show year-month-day and items will be grouped correctly for the date.

Try to just group for “CreatedAt” attribute without a custom function and see what happens ;)

#### Sorting and Grouping: UI/UX

The best way to allow a user to sort and group data in your table/list is to use the [ViewSettingsDialog](https://sapui5.hana.ondemand.com/#/api/sap.m.ViewSettingsDialog).

![](https://cdn-images-1.medium.com/max/1000/1*r2_mbcZHEa2driC9eVfWxw.gif)

It’s pretty easy to define and configure and gives you a lot of control. ViewSettingsDialog is embedded inside a Fragment and it’s displayed as a Dialog/Popover.

Usually, when you want to display a dialog like this you just need to create your fragment definition in a file (like ViewSettingDialog.fragment.xml) and loaded when the user clicks on the button above the table.

When we’re talking about Fragments we need to pay a lot of attention about two things:

-   Re-use of resources
-   Lifecycle dependency

Both of them allows you to not waste resourced and to not create memory leaks (and you really don’t want to deal with them!)

So:

1.  Create a new sap.ui.xmlfragment only when needed (when the variable that holds the reference is not null or destroyed) otherwise just reuse it and open the dialog
2.  Remember to destroy the dialog when needed like when the dialog closes if you’re using the same variable for different fragments or on the exit event of the controller

#### Info Toolbar

The Info Toolbar is a UI control that is handled by the Table and usually is displayed below the Table’s header. It’s very useful when you want to show some pieces of information that need to be highlighted.

In our case, when the user performs a search we’re going to display the latest timestamp of the search and how many records have been filtered in total.

### What's next in Step 3? 
In Step 3 we will move everything we've just created into a master-detail layout! So be ready and start study about [
](https://sapui5.hana.ondemand.com/#/api/sap.m.SplitApp) and [
](https://sapui5.hana.ondemand.com/#/topic/1b6dcd39a6a74f528b27ddb22f15af0d) ;)
