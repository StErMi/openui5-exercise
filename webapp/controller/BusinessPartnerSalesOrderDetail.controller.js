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
    "sap/ui/core/ValueState",
    "sap/ui/model/odata/v2/ODataModel"
], function (Controller, Filter, FilterOperator, Sorter, DateFormat, Device, Formatter, MessageBox, History, UIComponent, ValueState, ODataModel) {
	"use strict";

	return Controller.extend("com.techedge.training.SAPUI5Training.controller.BusinessPartnerSalesDetail", {
		
		/////////////////////////////////////////////////////////
		// VARIABLES
		/////////////////////////////////////////////////////////
		
		formatter: Formatter,
		_businessPartnerID: null,
		_salesOrderID: null,
		_oDialog: null,
		_fromCreate: false,
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
		// FORM VALIDATION
		/////////////////////////////////////////////////////////
		
		validateProduct: function(value, elID) {
			var oEl = this.getView().byId(elID);
			var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
			if( !value ) {
				oEl.setValueState(ValueState.Error);
				oEl.setValueStateText(oResourceBundle.getText("errorInvalidProduct"));
				return false;
			} else {
				oEl.setValueState(ValueState.Success);
				return true;
			}
		},
		
		validateNote: function(value, elID) {
			var oEl = this.getView().byId(elID);
			var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
			if( !value ) {
				oEl.setValueState(ValueState.Error);
				oEl.setValueStateText(oResourceBundle.getText("errorInvalidNote"));
				return false;
			} else {
				oEl.setValueState(ValueState.Success);
				return true;
			}
		},
		
		validateDelivery: function(value, elID) {
			var oEl = this.getView().byId(elID);
			var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
			if( !value || !(value instanceof Date && !isNaN(value)) ) {
				oEl.setValueState(ValueState.Error);
				oEl.setValueStateText(oResourceBundle.getText("errorInvalidDeliveryDate"));
				return false;
			} else {
				oEl.setValueState(ValueState.Success);
				return true;
			}
		},
		
		validateQuantity: function(value, elID) {
			var oEl = this.getView().byId(elID);
			var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
			if( !value || isNaN(value) ) {
				oEl.setValueState(ValueState.Error);
				oEl.setValueStateText(oResourceBundle.getText("errorInvalidQuantity"));
				return false;
			} else {
				oEl.setValueState(ValueState.Success);
				return true;
			}
		},
		
		/////////////////////////////////////////////////////////
		// CREATE / EDIT EVENT
		/////////////////////////////////////////////////////////
		
		onNoteChange: function(oEvent) {
			this.validateNote(oEvent.getParameter("value"), "form_note");	
		},
		
		onDeliveryChange: function(oEvent) {
			this.validateDelivery(new Date(oEvent.getParameter("value")), "form_delivery");	
		},
		
		onQuantityChange: function(oEvent) {
			var sValue = oEvent.getParameter("value");
			this.validateQuantity(sValue, "form_quantity");
			if( this._selectedProduct ) {
				var newQuantity = parseInt(sValue, 10);
				this.oNewItemContext.getModel().setProperty(this.oNewItemContext.getPath() + "/NetAmount", "" + (parseFloat(this._selectedProduct.Price) * newQuantity));
				this.oNewItemContext.getModel().setProperty(this.oNewItemContext.getPath() + "/TaxAmount", "" + (parseFloat(this._selectedProduct.Price) * newQuantity));
				this.oNewItemContext.getModel().setProperty(this.oNewItemContext.getPath() + "/GrossAmount", "" + (parseFloat(this._selectedProduct.Price) * newQuantity));
			}
		},
		
		onProductSelectionChange: function(oEvent) {
			var oItem = oEvent.getParameter("selectedItem");
			this.validateProduct( oItem ? oItem.getKey() : null, "form_product");
			if( oItem ) {
				var oObj = oItem.getBindingContext().getObject();
				this._selectedProduct = oObj;
				this.oNewItemContext.getModel().setProperty(this.oNewItemContext.getPath() + "/QuantityUnit", oObj.MeasureUnit);
				this.oNewItemContext.getModel().setProperty(this.oNewItemContext.getPath() + "/CurrencyCode", oObj.CurrencyCode);
				// this.oNewItemContext.getModel().setProperty(this.oNewItemContext.getPath() + "/ToProduct/Price", oObj.Price);
				this.oNewItemContext.getModel().setProperty(this.oNewItemContext.getPath() + "/NetAmount", "" + (oObj.Price * parseInt(this.oNewItemContext.getObject().Quantity, 10)) );
				this.oNewItemContext.getModel().setProperty(this.oNewItemContext.getPath() + "/TaxAmount", "" + (oObj.Price * parseInt(this.oNewItemContext.getObject().Quantity, 10)) );
				this.oNewItemContext.getModel().setProperty(this.oNewItemContext.getPath() + "/GrossAmount", "" + (oObj.Price * parseInt(this.oNewItemContext.getObject().Quantity, 10)) );
				this.oNewItemContext.getModel().setProperty(this.oNewItemContext.getPath() + "/NoteLanguage", oObj.NameLanguage);
			}
		},
		
		onSalesOrderItemDialogOpen: function(bFromCreate, oItemBindingContextPath) {
			this._fromCreate = bFromCreate;	
			this.getView().getModel("data").setProperty("/salesOrderItemFormCreate", bFromCreate);
			
			if (!this._oEditDialog) {
				this._oEditDialog = sap.ui.xmlfragment(this.getView().getId(), "com.techedge.training.SAPUI5Training.view.fragment.dialog.SaleOrderItemEditDialog", this);
				this.getView().addDependent(this._oEditDialog);
			}
			
			this._oEditDialog.bindElement( oItemBindingContextPath );
			// toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oEditDialog);
			this._oEditDialog.open();
		},
		
		onSalesOrderItemDialogClose: function(oEvent) {
			if( this.oNewItemContext ) {
				this.getView().getModel().deleteCreatedEntry(this.oNewItemContext);
				this.oNewItemContext = null;
			}
			this.getView().getModel().resetChanges();
			this._oEditDialog.close();
		},
		
		onSalesOrderItemDialogSaveFormCheck: function() {
			var obj = this.oNewItemContext.getObject();
			var bProduct = this.validateProduct(obj.ProductID, "form_product");
			var bNote = this.validateNote(obj.Note, "form_note");
			var bDelivery = this.validateDelivery(obj.DeliveryDate, "form_delivery");
			var bQuantity = this.validateQuantity(obj.Quantity, "form_quantity");
			
			return bProduct && bNote && bDelivery && bQuantity;
		},
		
		onSalesOrderItemDialogSave: function(oEvent) {
			var controller = this;
			
			var canSave = this.onSalesOrderItemDialogSaveFormCheck();
			if( !canSave ) {
				return;
			}
			
			var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
			var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
			
			var oModel = this.getView().getModel();
			if( oModel.hasPendingChanges() ) {
				controller._oEditDialog.setBusy(true);
				oModel.setUseBatch(true);
				oModel.submitChanges({
					success: function(oData) {
						controller._oEditDialog.setBusy(false);
						controller._oEditDialog.close();
						
						if( oData.__batchResponses[0].response && oData.__batchResponses[0].response.statusCode === "400" ) {
							var oResponse = JSON.parse(oData.__batchResponses[0].response.body);
							var sMessage = oResponse.error.message.value;
							MessageBox.success( oResourceBundle.getText( "createSaleItemErrorWithMessage", sMessage ), {
								styleClass: bCompact ? "sapUiSizeCompact" : ""
							});
						} else {
							MessageBox.success( oResourceBundle.getText( controller._fromCreate ? "createSaleItemSuccess" : "updateSaleItemSuccess" ), {
								styleClass: bCompact ? "sapUiSizeCompact" : ""
							});
						}
						
						controller.oNewItemContext = null;
						oModel.setUseBatch(true);
					},
					error: function(oError) {
						controller._oEditDialog.setBusy(false);
						controller._oEditDialog.close();
						MessageBox.error( oResourceBundle.getText( controller._fromCreate ? "createSaleItemError" : "updateSaleItemError" ), {
							styleClass: bCompact ? "sapUiSizeCompact" : ""
						});
						oModel.setUseBatch(true);
					}
				});
			} else {
				controller._oEditDialog.close();
				MessageBox.success( oResourceBundle.getText( controller._fromCreate ? "createSaleItemNoChanges" : "updateSaleItemNoChanges"), {
					styleClass: bCompact ? "sapUiSizeCompact" : ""
				});
			}
		},
		
		onAddSalesOrderItem: function(oEvent) {
			var controller = this;
			var oModel = this.getView().getModel();
			var dDeliveryDate = new Date();
			dDeliveryDate.setDate( new Date().getDate() + 7 );
			
			oModel.read("/BusinessPartnerSet('" + this._businessPartnerID + "')/ToSalesOrders('" + this._salesOrderID + "')/ToLineItems", {
				urlParameters: {
					"$top": 1,
					"$select": "ItemPosition"
				},
				sorters: [
					new Sorter("ItemPosition", true)
				],
				success: function(oData, response) {
					var latestItemPosition = oData.results && oData.results.length > 0 ? parseInt(oData.results[0].ItemPosition, 10) + 1 : 0;
					controller.oNewItemContext = oModel.createEntry("/SalesOrderLineItemSet", {
						properties: {
							SalesOrderID: controller._salesOrderID, 
							DeliveryDate: new Date(),
							Quantity: "1",
							ItemPosition: "" + latestItemPosition
						}
					});
					controller.onSalesOrderItemDialogOpen(true, controller.oNewItemContext.getPath());
				},
				error: function(error) {
					// TODO handle the error in the correct way
				}
			});
		},
		
		onEditSalesOrderItem: function(oEvent) {
			var oItem = oEvent.getSource().getParent();
			this.onSalesOrderItemDialogOpen(false, oItem.getBindingContextPath());
		},
		
		/////////////////////////////////////////////////////////
		// EVENTS
		/////////////////////////////////////////////////////////
		
		/*validateNote: function(oEvent) {
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
		},*/
		
		onTitlePress: function(oEvent) {
			this.onEditSalesOrderItem(oEvent);
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
				this._oDialog = sap.ui.xmlfragment(this.getView().getId(), "com.techedge.training.SAPUI5Training.view.fragment.dialog.SaleOrderItemViewSettingDialog", this);
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