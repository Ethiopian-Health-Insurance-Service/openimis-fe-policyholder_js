import React, { Component, Fragment } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import _ from "lodash";

import { withTheme, withStyles } from "@material-ui/core/styles";

import {
  Form,
  withModulesManager,
  withHistory,
  formatMessage,
  formatMessageWithValues,
  journalize,
  Helmet,
  decodeId,
} from "@openimis/fe-core";
import { fetchPolicyHolder, clearPolicyHolder, clearPolicyHolderInsurees } from "../actions";
import {
  RIGHT_PORTALPOLICYHOLDER_SEARCH,
  RIGHT_POLICYHOLDER_CREATE,
  RIGHT_POLICYHOLDER_UPDATE,
} from "../constants";
import PolicyHolderGeneralInfoPanel from "./PolicyHolderGeneralInfoPanel";
import PolicyHolderTabPanel from "./PolicyHolderTabPanel";

const styles = (theme) => ({
  paper: theme.paper.paper,
  paperHeader: theme.paper.header,
  paperHeaderAction: theme.paper.action,
  item: theme.paper.item,
});

const jsonFields = ["address", "contactName", "bankAccount"];

class PolicyHolderForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      policyHolder: {},
      isFormValid: true,
    };
  }

  wrapJSONFields = (policyHolder) => {
    jsonFields.forEach((item) => {
      if (!!policyHolder[item]) {
        const key = `"${item}"`;
        const value = `${JSON.stringify(policyHolder[item]).replace(
          /\\n/g,
          "\\n"
        )}`;
        policyHolder[item] = `{${key}: ${value}}`;
      }
    });
  };

  unwrapJSONFields = (policyHolder) => {
    jsonFields.forEach((item) => {
      if (!!policyHolder[item]) {
        policyHolder[item] = JSON.parse(policyHolder[item])[item];
      }
    });
  };

  componentDidMount() {
    if (!!this.props.policyHolderId) {
      this.setState(
        (_, props) => ({ policyHolderId: props.policyHolderId }),
        () =>
          this.props.fetchPolicyHolder(
            this.props.modulesManager,
            this.props.policyHolderId
          )
      );
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      prevProps.fetchedPolicyHolder !== this.props.fetchedPolicyHolder &&
      !!this.props.fetchedPolicyHolder
    ) {
      this.unwrapJSONFields(this.props.policyHolder);
      this.setState((_, props) => ({
        policyHolder: props.policyHolder,
        policyHolderId: props.policyHolderId,
      }));
      const policyHolderRouteRef = this.props.modulesManager.getRef('policyHolder.route.policyHolder');
      const decodedId = decodeId(this.props.policyHolder.id);
      this.props.history.replace(`/${policyHolderRouteRef}/${decodedId}`);
    }
    if (prevProps.submittingMutation && !this.props.submittingMutation) {
      this.props.journalize(this.props.mutation);
      if (!this.props?.policyHolderId) {
        this.props.fetchPolicyHolder(this.props.modulesManager, null, [`clientMutationId: "${this.props.mutation.clientMutationId}"`]);
      }
    }
  }

  componentWillUnmount() {
    this.props.clearPolicyHolder();
    //if different default tab under policyholder then it needs to be cleared according to default tab
    this.props.clearPolicyHolderInsurees();
  }

  isMandatoryFieldsEmpty = () => {
    const { policyHolder } = this.state;
    if (
      !!policyHolder.code &&
      !!policyHolder.tradeName &&
      !!policyHolder.locations &&
      !!policyHolder.dateValidFrom
    ) {
      return false;
    }
    return true;
  };

  doesPolicyHolderChange = () => {
    const { policyHolder } = this.props;
    if (_.isEqual(policyHolder, this.state.policyHolder)) {
      return false;
    }
    return true;
  };

  canSave = () =>
    !this.isMandatoryFieldsEmpty() &&
    this.doesPolicyHolderChange() &&
    this.props.isPolicyHolderCodeValid &&
    this.props.isPolicyHolderEmployerTinValid &&
    this.state.isFormValid;

  save = (policyHolder) => {
    this.wrapJSONFields(policyHolder);
    this.props.save(policyHolder);
    this.unwrapJSONFields(policyHolder);
  };

  onEditedChanged = (policyHolder) => this.setState({ policyHolder });

  titleParams = () =>
    this.state.policyHolder && this.props.titleParams(this.state.policyHolder);

  onValidation = (isFormValid) => {
    if (this.state.isFormValid !== isFormValid) {
      this.setState({ isFormValid });
    }
  };

  isPolicyHolderPortalUser = () =>
    this.props.rights.includes(RIGHT_PORTALPOLICYHOLDER_SEARCH) &&
    !this.props.rights.includes(RIGHT_POLICYHOLDER_CREATE) &&
    !this.props.rights.includes(RIGHT_POLICYHOLDER_UPDATE);

  render() {
    const { intl, rights, back, save } = this.props;
    return (
      <Fragment>
        <Helmet
          title={formatMessageWithValues(
            this.props.intl,
            "policyHolder",
            "policyHolder.page.title",
            this.titleParams()
          )}
        />
        <Form
          module="policyHolder"
          title="policyHolder.page.title"
          titleParams={this.titleParams()}
          edited={this.state.policyHolder}
          back={back}
          canSave={this.canSave}
          save={this.save}
          onEditedChanged={this.onEditedChanged}
          HeadPanel={PolicyHolderGeneralInfoPanel}
          mandatoryFieldsEmpty={this.isMandatoryFieldsEmpty()}
          saveTooltip={formatMessage(
            intl,
            "policyHolder",
            `savePolicyHolderButton.tooltip.${
              this.canSave() ? "enabled" : "disabled"
            }`
          )}
          onValidation={this.onValidation}
          Panels={[PolicyHolderTabPanel]}
          rights={rights}
          isPolicyHolderPortalUser={this.isPolicyHolderPortalUser()}
          openDirty={save}
        />
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  fetchingPolicyHolder: state.policyHolder.fetchingPolicyHolder,
  errorPolicyHolder: state.policyHolder.errorPolicyHolder,
  fetchedPolicyHolder: state.policyHolder.fetchedPolicyHolder,
  policyHolder: state.policyHolder.policyHolder,
  isPolicyHolderCodeValid:
    state.policyHolder?.validationFields?.policyHolderCode?.isValid,
  isPolicyHolderEmployerTinValid:
    state.policyHolder?.validationFields?.employerTin?.isValid,
  submittingMutation: state.policyHolder.submittingMutation,
  mutation: state.policyHolder.mutation,
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    { fetchPolicyHolder,
      clearPolicyHolder,
      clearPolicyHolderInsurees,
      journalize,
    },
    dispatch
  );
};

export default withHistory(
  withModulesManager(
    injectIntl(
      withTheme(
        withStyles(styles)(
          connect(mapStateToProps, mapDispatchToProps)(PolicyHolderForm)
        )
      )
    )
  )
);
