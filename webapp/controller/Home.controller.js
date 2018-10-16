sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/Sorter",
	"sap/ui/core/format/DateFormat"
], function (Controller, Filter, FilterOperator, Sorter, DateFormat) {
	"use strict";

	return Controller.extend("com.techedge.training.SAPUI5Training.controller.Home", {
		
		/////////////////////////////////////////////////////////
		// VARIABLES
		/////////////////////////////////////////////////////////
		
		_oDialog: null,
		_dateFormat: DateFormat.getDateInstance({pattern : "dd/MM/YYYY hh:mm" }),
		
		/////////////////////////////////////////////////////////
		// CONTROLLER LIFECYCLE EVENTS
		/////////////////////////////////////////////////////////
		
		onInit: function () {
			var oController = this;
			this.mGroupFunctions = {
				CreatedAt: function(oContext) {
					var dCreatedAt = oContext.getProperty("CreatedAt");
					var sDateFormatted = oController._dateFormat.format(dCreatedAt);
					return {
						key: sDateFormatted,
						text: sDateFormatted
					};
				}
			};
		},

		onExit : function () {
			if (this._oDialog) {
				this._oDialog.destroy();
			}
		},
		
		/////////////////////////////////////////////////////////
		// EVENTS
		/////////////////////////////////////////////////////////
		
		handleViewSettingsDialogButtonOpen: function(oEvent) {
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("com.techedge.training.SAPUI5Training.view.fragment.dialog.PartnerViewSettingDialog", this);
				this.getView().addDependent(this._oDialog);
			}
			// toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
			this._oDialog.open();
		},
		
		handleViewSettingsDialogButtonConfirm: function(oEvent) {
			var oTable = this.byId("idPartnerTable");

			var mParams = oEvent.getParameters();
			var oBinding = oTable.getBinding("items");

			// apply sorter to binding
			// (grouping comes before sorting)
			var sPath;
			var bDescending;
			var vGroup;
			var aSorters = [];
			
			// Gather grouping info
			if (mParams.groupItem) {
				sPath = mParams.groupItem.getKey();
				bDescending = mParams.groupDescending;
				vGroup = this.mGroupFunctions[sPath];
				aSorters.push(new Sorter(sPath, bDescending, vGroup === null ? true : vGroup));
			}
			
			// Gather sorting info
			sPath = mParams.sortItem.getKey();
			bDescending = mParams.sortDescending;
			aSorters.push(new Sorter(sPath, bDescending));
			oBinding.sort(aSorters);
		},
		
		/////////////////////////////////////////////////////////
		// FILTERBAR EVENTS
		/////////////////////////////////////////////////////////
		
		onUpdateFinished: function(oEvent) {
			var sReason = oEvent.getParameter("reason");
			if( sReason === "Filter" ) {
				var oDataModel = this.getView().getModel("data");
				oDataModel.setProperty("/toolbar/visible", true);
				oDataModel.setProperty("/toolbar/timestamp", new Date());
				oDataModel.setProperty("/toolbar/count", oEvent.getSource().getBinding("items").getLength());
			}
		},
		
		onSearch: function(oEvent) {
			var oFilterModel = this.getView().getModel("filters");
			
			var sID = oFilterModel.getProperty("/id");
			var sName = oFilterModel.getProperty("/name");
			var sStreet = oFilterModel.getProperty("/street");
			var sCountry = oFilterModel.getProperty("/country");
			var aFilters = [];
			
			if( sID ) {
				aFilters.push( new Filter("BusinessPartnerID", FilterOperator.Contains, sID) );
			}
			
			if( sName ) {
				aFilters.push( new Filter("CompanyName", FilterOperator.Contains, sName) );
			}
			
			if( sStreet ) {
				aFilters.push( new Filter("Address/Street", FilterOperator.Contains, sStreet) );
			}
			
			if( sCountry ) {
				aFilters.push( new Filter("Address/Country", FilterOperator.EQ, sCountry) );
			}
			
			this.byId("idPartnerTable").getBinding("items").filter(aFilters);
		},
		
		onClear: function(oEvent) {
			var oFilterModel = this.getView().getModel("filters");
			oFilterModel.setProperty("/", {});
			this.onSearch(null);
		}

	});
});