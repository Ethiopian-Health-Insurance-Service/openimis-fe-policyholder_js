import React, { Component } from "react";
import { withModulesManager } from "@openimis/fe-core";
import { injectIntl } from "react-intl";
import ConfigBasedPicker from "./ConfigBasedPicker";

class EmployerTypePicker extends Component {
    constructor(props) {
        super(props);
        this.employerTypeOptions = props.modulesManager.getConf("fe-policyHolder", "policyHolderFilter.employerTypeOptions",
            [{
                "value": "1", 
                "label": {
                    "en": "Gov.",
                    "fr": "Gov."
                }
            }, {
                "value": "2",
                "label": {
                    "en": "Public",
                    "fr": "Public"
                }
            }, {
                "value": "3",
                "label": {
                    "en": "Private SSA",
                    "fr": "Privée SSA"
                }
            }, {
                "value": "4",
                "label": {
                    "en": "Public SSA",
                    "fr": "Public SSA"
                }
            }, {
                "value": "5",
                "label": {
                    "en": "NGO",
                    "fr":"NGO"
                }
            }]
        );
    }

    render() {
        return (
            <ConfigBasedPicker
                configOptions={this.employerTypeOptions}
                {...this.props}
            />
        )
    }
}

export default withModulesManager(injectIntl(EmployerTypePicker));
