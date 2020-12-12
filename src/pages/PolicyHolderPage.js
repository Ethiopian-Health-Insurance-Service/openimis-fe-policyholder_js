import React, { Component } from "react"
import { withModulesManager, formatMessageWithValues, withHistory, historyPush } from "@openimis/fe-core";
import { injectIntl } from "react-intl";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { withTheme, withStyles } from "@material-ui/core/styles";
import PolicyHolderForm from "../components/PolicyHolderForm";
import { createPolicyHolder, updatePolicyHolder } from "../actions"
import { RIGHT_POLICYHOLDER_CREATE, RIGHT_POLICYHOLDER_UPDATE } from "../constants"

const styles = theme => ({
    page: theme.page,
});

class PolicyHolderPage extends Component {
    back = () => {
        historyPush(this.props.modulesManager, this.props.history, "policyHolder.route.policyHolders")
    }

    save = (policyHolder) => {
        if (!!policyHolder.id) {
            this.props.updatePolicyHolder(
                policyHolder,
                formatMessageWithValues(
                    this.props.intl,
                    "policyHolder",
                    "UpdatePolicyHolder.mutationLabel",
                    { label: this.titleParams(policyHolder).label }
                )
            );
        } else {
            this.props.createPolicyHolder(
                policyHolder,
                formatMessageWithValues(
                    this.props.intl,
                    "policyHolder",
                    "CreatePolicyHolder.mutationLabel",
                    { label: this.titleParams(policyHolder).label }
                )
            );
        }
    }

    titleParams = (policyHolder) => {
        var params = { label: null };
        if (!!policyHolder.code && !!policyHolder.tradeName) {
            params.label = `${policyHolder.code} - ${policyHolder.tradeName}`
        } else {
            if (!!policyHolder.code) {
                params.label = `${policyHolder.code}`;
            } else if (!!policyHolder.tradeName) {
                params.label = `${policyHolder.tradeName}`;
            }
        }
        return params;
    }

    render() {
        const { classes, rights, policyHolderId } = this.props;
        return (
            rights.includes(RIGHT_POLICYHOLDER_CREATE) && rights.includes(RIGHT_POLICYHOLDER_UPDATE) && (
                <div className={classes.page}>
                    <PolicyHolderForm
                        policyHolderId={policyHolderId}
                        back={this.back}
                        save={this.save}
                        titleParams={this.titleParams}
                    />
                </div>
            )
        )
    }
}

const mapStateToProps = (state, props) => ({
    rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : [],
    policyHolderId: props.match.params.policyholder_id,
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ createPolicyHolder, updatePolicyHolder }, dispatch);
};

export default withHistory(withModulesManager(injectIntl(withTheme(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(PolicyHolderPage))))));
