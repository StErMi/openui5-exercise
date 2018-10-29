sap.ui.define([
	"sap/ui/core/ValueState"
], function (ValueState) {
	"use strict";
	
	return {
		
		getLifeCycleStatus: function(sValue) {
			if( sValue === "C" ) {
				// Closed
				return ValueState.Success;
			} else if ( sValue === "X" ) {
				// Cancelled
				return ValueState.Error;
			} else if ( sValue === "P" ) {
				// Progress
				return ValueState.Warning;
			} else if ( sValue === "N" ) {
				// New
				return ValueState.None;
			} else {
				return ValueState.None;
			}
		},
		
		getBillingStatus: function(sValue) {
			if( sValue === "P" ) {
				// Paid
				return ValueState.Success;
			} else if ( sValue === "" ) {
				// Initial
				return ValueState.None;
			} else {
				return ValueState.None;
			}
		},
		
		getDeliveryStatus: function(sValue) {
			if( sValue === "D" ) {
				// Delivered
				return ValueState.Success;
			} else if ( sValue === "" ) {
				// Initial
				return ValueState.None;
			} else {
				return ValueState.None;
			}
		}
				
	};
});