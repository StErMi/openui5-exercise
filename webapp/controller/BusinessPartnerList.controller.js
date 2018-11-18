sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
    "sap/ui/Device"
], function (Controller, Filter, FilterOperator, Device) {
	"use strict";

	return Controller.extend("com.techedge.training.SAPUI5Training.controller.Home", {
		
		/////////////////////////////////////////////////////////
		// VARIABLES
		/////////////////////////////////////////////////////////
		
		/////////////////////////////////////////////////////////
		// CONTROLLER LIFECYCLE EVENTS
		/////////////////////////////////////////////////////////
		
		onInit: function () {
		},

		onExit : function () {
		},
		
		/////////////////////////////////////////////////////////
		// EVENTS
		/////////////////////////////////////////////////////////
		
		
		/////////////////////////////////////////////////////////
		// FILTERBAR EVENTS
		/////////////////////////////////////////////////////////
		
		onUpdateFinished: function(oEvent) {
			var oDataModel = this.getView().getModel("data");
			oDataModel.setProperty("/businessPartnerList/count", oEvent.getSource().getBinding("items").getLength());
		},
		
		onSearch: function(oEvent) {
			var sQuery = oEvent.getParameter("query");
			var aFilters = [];
			
			if( sQuery ) {
				aFilters.push( new Filter("BusinessPartnerID", FilterOperator.Contains, sQuery) );
				aFilters.push( new Filter("CompanyName", FilterOperator.Contains, sQuery) );
				aFilters.push( new Filter("Address/Country", FilterOperator.EQ, sQuery) );
			}
			
			this.byId("idPartnerList").getBinding("items").filter(aFilters.length === 0 ? aFilters : new Filter(aFilters, false) );
		},
		
		onItemPress: function(oEvent) {
			var oItem = oEvent.getParameter("listItem");
			
			var sBusinessPartnerID = oItem.getBindingContext().getProperty("BusinessPartnerID");
			this.getOwnerComponent().getRouter().navTo("TargetBusinessPartnerDetail", 
				{
					BusinessPartnerID: sBusinessPartnerID
				}, 
				!Device.system.phone
			);
		}
		

	});
});