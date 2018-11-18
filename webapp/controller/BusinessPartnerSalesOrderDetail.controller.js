sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/Sorter",
	"sap/ui/core/format/DateFormat",
	"sap/ui/Device",
    "com/techedge/training/SAPUI5Training/model/Formatter",
	"sap/m/MessageBox",
    "sap/ui/core/routing/History",
    "sap/ui/core/UIComponent",
    "sap/ui/core/ValueState"
], function (Controller, Filter, FilterOperator, Sorter, DateFormat, Device, Formatter, MessageBox, History, UIComponent, ValueState) {
	"use strict";

	return Controller.extend("com.techedge.training.SAPUI5Training.controller.BusinessPartnerSalesDetail", {
		
		/////////////////////////////////////////////////////////
		// VARIABLES
		/////////////////////////////////////////////////////////
		
		formatter: Formatter,
		_businessPartnerID: null,
		_salesOrderID: null,
		_oDialog: null,
		_oEditDialog: null,
		_dateFormat: DateFormat.getDateInstance({pattern : "dd/MM/YYYY hh:mm" }),
		
		/////////////////////////////////////////////////////////
		// CONTROLLER LIFECYCLE EVENTS
		/////////////////////////////////////////////////////////
		
		onInit: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("TargetBusinessPartnerSalesOrderDetail").attachMatched(this.__onRouteMatched, this);
		},
		
		__onRouteMatched: function(oEvent) {
			var that = this;
			this._businessPartnerID = oEvent.getParameter("arguments").BusinessPartnerID;
			this._salesOrderID = oEvent.getParameter("arguments").SalesOrderID;
			this.getView().bindElement({
				path: "/BusinessPartnerSet('" + this._businessPartnerID + "')/ToSalesOrders('" + this._salesOrderID + "')",
				events : {
					dataRequested: function () {
						that.getView().setBusy(true);
					},
					dataReceived: function () {
						that.getView().setBusy(false);
					}
				}
			});
		},

		onExit : function () {
		},
		
		/////////////////////////////////////////////////////////
		// EVENTS
		/////////////////////////////////////////////////////////
		
		validateNote: function(oEvent) {
			var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
			var sValue = oEvent.getParameter("value");
			var oSource = oEvent.getSource();
			if( sValue && sValue.trim().length > 0 ) {
				oSource.setValueState(ValueState.Success);
				oSource.setValueStateText(null);
			} else {
				oSource.setValueState(ValueState.Error);
				oSource.setValueStateText(oResourceBundle.getText("errorEmptyNote"));
			}
		},
		
		onSalesOrderItemDialogClose: function(oEvent) {
			this.getView().getModel().resetChanges();
			this._oEditDialog.close();
		},
		
		onSalesOrderItemDialogSave: function(oEvent) {
			var controller = this;
			var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
			var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
			
			var oModel = this.getView().getModel();
			if( oModel.hasPendingChanges() ) {
				controller._oEditDialog.setBusy(true);
				oModel.submitChanges({
					success: function(oData) {
						MessageBox.success( oResourceBundle.getText("saveSaleItemSuccess"), {
							styleClass: bCompact ? "sapUiSizeCompact" : ""
						});
						controller._oEditDialog.setBusy(false);
						controller._oEditDialog.close();
					},
					error: function(oError) {
						MessageBox.error( oResourceBundle.getText("saveSaleItemError"), {
							styleClass: bCompact ? "sapUiSizeCompact" : ""
						});
						controller._oEditDialog.setBusy(false);
						controller._oEditDialog.close();
					}
				});
			} else {
				MessageBox.success( oResourceBundle.getText("saveSaleItemNoChanges"), {
					styleClass: bCompact ? "sapUiSizeCompact" : ""
				});
				controller._oEditDialog.close();
			}
		},
		
		onTitlePress: function(oEvent) {
			var oItem = oEvent.getSource().getParent();
			
			if (!this._oEditDialog) {
				this._oEditDialog = sap.ui.xmlfragment("com.techedge.training.SAPUI5Training.view.fragment.dialog.SaleOrderItemEditDialog", this);
				this.getView().addDependent(this._oEditDialog);
			}
			this._oEditDialog.bindElement( oItem.getBindingContextPath() );
			// toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oEditDialog);
			this._oEditDialog.open();
		},
		
		onNavButtonPress: function(oEvent) {
			var oHistory = History.getInstance();
    		var sPreviousHash = oHistory.getPreviousHash();
			if (sPreviousHash !== undefined) {
				oHistory.go(-1);
			} else {
				this.getOwnerComponent().getRouter().navTo("TargetBusinessPartnerList", {}, true);
			}
		},
		
		onDeleteItem: function(oEvent) {
			var controller = this;
			var oModel = this.getView().getModel();
			var sPath = oEvent.getParameter("listItem").getBindingContextPath();
			var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
			var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
			
			controller.byId("tableSalesOrderItem").setBusy(true);
			oModel.remove(sPath, {
				success: function() {
					MessageBox.success( oResourceBundle.getText("deleteSaleItemSuccess"), {
						styleClass: bCompact ? "sapUiSizeCompact" : ""
					});
					controller.byId("tableSalesOrderItem").setBusy(false);
				},
				error: function() {
					MessageBox.error( oResourceBundle.getText("deleteSaleItemError"), {
						styleClass: bCompact ? "sapUiSizeCompact" : ""
					});
					controller.byId("tableSalesOrderItem").setBusy(false);
				}
			});
		},
		
		handleViewSettingsDialogButtonOpen: function(oEvent) {
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("com.techedge.training.SAPUI5Training.view.fragment.dialog.SaleOrderItemViewSettingDialog", this);
				this.getView().addDependent(this._oDialog);
			}
			// toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
			this._oDialog.open();
		},
		
		handleViewSettingsDialogButtonConfirm: function(oEvent) {
			var oTable = this.byId("tableSalesOrderItem");

			var mParams = oEvent.getParameters();
			var oBinding = oTable.getBinding("items");

			// apply sorter to binding
			// (grouping comes before sorting)
			var sPath;
			var bDescending;
			var aSorters = [];
			
			// Gather grouping info
			if (mParams.groupItem) {
				sPath = mParams.groupItem.getKey();
				bDescending = mParams.groupDescending;
				aSorters.push(new Sorter(sPath, bDescending, true));
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
		
		onSearch: function(oEvent) {
			var oFilterModel = this.getView().getModel("filters");
			
			var sProductId = oFilterModel.getProperty("/productId");
			var aFilters = [];
			
			if( sProductId ) {
				aFilters.push( new Filter("ProductID", FilterOperator.Contains, sProductId) );
			}
			
			this.byId("tableSalesOrderItem").getBinding("items").filter(aFilters);
		},
		
		onClear: function(oEvent) {
			var oFilterModel = this.getView().getModel("filters");
			oFilterModel.setProperty("/", {});
			this.onSearch(null);
		}
		
	});
});