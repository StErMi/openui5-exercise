function initModel() {
	var sUrl = "/ES5/sap/opu/odata/iwbep/GWSAMPLE_BASIC/";
	var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);
	sap.ui.getCore().setModel(oModel);
}