import React, { Fragment } from "react";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";

import { Grid, Divider, Typography } from "@material-ui/core";
import { withTheme, withStyles } from "@material-ui/core/styles";

import {
  withModulesManager,
  formatMessage,
  FormPanel,
  TextInput,
  ValidatedTextInput,
  TextAreaInput,
  FormattedMessage,
  PublishedComponent,
} from "@openimis/fe-core";
import {
  policyHolderCodeClear,
  policyHolderCodeSetValid,
  policyHolderCodeValidation,
  policyHolderEmployerTinValidation,
  policyHolderEmployerTinSetValid,
  policyHolderEmployerTinClear,
} from "../actions";
import {
  MAX_ACCOUNTANCYACCOUNT_LENGTH,
  MAX_ADDRESS_LENGTH,
  MAX_CODE_LENGTH,
  MAX_EMAIL_LENGTH,
  MAX_FAX_LENGTH,
  MAX_PAYMENTREFERENCE_LENGTH,
  MAX_PHONE_LENGTH,
  MAX_TRADENAME_LENGTH,
} from "../constants";

const styles = (theme) => ({
  tableTitle: theme.table.title,
  item: theme.paper.item,
  fullHeight: {
    height: "100%",
  },
});

class PolicyHolderGeneralInfoPanel extends FormPanel {
  constructor(props) {
    super(props);
    this.phoneValidation = props.modulesManager.getConf(
      "policyHolder",
      "policyHolderForm.phoneValidation",
      {
        regex: /^[0-9]*$/,
        regexMsg: {
          en: formatMessage(
            props.intl,
            "policyHolder",
            "phoneValidation.regexMsg.en"
          ),
          fr: formatMessage(
            props.intl,
            "policyHolder",
            "phoneValidation.regexMsg.fr"
          ),
        },
      }
    );
    this.faxValidation = props.modulesManager.getConf(
      "policyHolder",
      "policyHolderForm.faxValidation",
      {
        regex: /^[0-9]{8,9}$/,
        regexMsg: {
          en: formatMessage(
            props.intl,
            "policyHolder",
            "faxValidation.regexMsg.en"
          ),
          fr: formatMessage(
            props.intl,
            "policyHolder",
            "faxValidation.regexMsg.fr"
          ),
        },
      }
    );
    this.emailValidation = {
      regex: /^(?:[^\s@]+@[^\s@]+\.[^\s@]+)$/,
      regexMsg: {
        en: formatMessage(
          props.intl,
          "policyHolder",
          "emailValidation.regexMsg.en"
        ),
        fr: formatMessage(
          props.intl,
          "policyHolder",
          "emailValidation.regexMsg.fr"
        ),
      },
    };
    this.accountancyAccountValidation = props.modulesManager.getConf(
      "policyHolder",
      "policyHolderForm.accountancyAccountValidation",
      {
        regex: /.+/,
        regexMsg: {
          en: formatMessage(
            props.intl,
            "policyHolder",
            "accountancyAccountValidation.regexMsg.en"
          ),
          fr: formatMessage(
            props.intl,
            "policyHolder",
            "accountancyAccountValidation.regexMsg.fr"
          ),
        },
      }
    );
    this.paymentReferenceValidation = props.modulesManager.getConf(
      "policyHolder",
      "policyHolderForm.paymentReferenceValidation",
      {
        regex: /.+/,
        regexMsg: {
          en: formatMessage(
            props.intl,
            "policyHolder",
            "paymentReferenceValidation.regexMsg.en"
          ),
          fr: formatMessage(
            props.intl,
            "policyHolder",
            "paymentReferenceValidation.regexMsg.fr"
          ),
        },
      }
    );
    this.fields = props.modulesManager.getConf("fe-policyHolder", "fields", {});
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    this._componentDidUpdate(prevProps, prevState, snapshot);
    const { edited } = this.props;
    if (prevProps.edited !== edited) {
      let isFormValid = true;
      if (
        !!this.regexError("phone", edited.phone) ||
        !!this.regexError("fax", edited.fax) ||
        !!this.regexError("email", edited.email) ||
        !!this.regexError("accountancyAccount", edited.accountancyAccount) ||
        !!this.regexError("paymentReference", edited.paymentReference)
      ) {
        isFormValid = false;
      }
      this.props.onValidation(isFormValid);
    }
  }

  regexError = (field, value) => {
    if (!!value) {
      let validation = this[`${field}Validation`];
      return !!validation && !validation["regex"].test(value)
        ? validation["regexMsg"][this.props.intl.locale]
        : false;
    }
    return false;
  };

  shouldValidate = (input) => {
    const { savedPolicyHolderCode } = this.props;
    return input !== savedPolicyHolderCode;
  };

  shouldValidateEmployerTin = (input) => {
    const { savedPolicyHolderEmployerTin } = this.props;
    return input !== savedPolicyHolderEmployerTin;
  };

  render() {
    const {
      intl,
      classes,
      edited,
      mandatoryFieldsEmpty,
      isPolicyHolderPortalUser,
      isCodeValid,
      isCodeValidating,
      validationError,
      isEmployerTinValid,
      isEmployerTinValidating,
      validationEmployerTinError,
    } = this.props;
    console.log("this fields ", this.fields);
    console.log("edited value ", edited);
    return (
      <Fragment>
        <Grid container className={classes.tableTitle}>
          <Grid item>
            <Grid
              container
              align="center"
              justify="center"
              direction="column"
              className={classes.fullHeight}
            >
              <Grid item>
                <Typography>
                  <FormattedMessage
                    module="policyHolder"
                    id="policyHolder.generalInfoPanel.title"
                  />
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Divider />
        {mandatoryFieldsEmpty && (
          <Fragment>
            <div className={classes.item}>
              <FormattedMessage
                module="policyHolder"
                id="mandatoryFieldsEmptyError"
              />
            </div>
            <Divider />
          </Fragment>
        )}
        <Grid container className={classes.item}>
          <Grid item xs={2} className={classes.item}>
            <ValidatedTextInput
              itemQueryIdentifier="policyHolderCode"
              codeTakenLabel="policyHolder.codeTaken"
              shouldValidate={this.shouldValidate}
              isValid={isCodeValid}
              isValidating={isCodeValidating}
              validationError={validationError}
              action={policyHolderCodeValidation}
              clearAction={policyHolderCodeClear}
              setValidAction={policyHolderCodeSetValid}
              module="policyHolder"
              required={true}
              label="code"
              value={!!edited && !!edited.code ? edited.code : ""}
              onChange={(v) => this.updateAttribute("code", v)}
              readOnly={isPolicyHolderPortalUser}
            />
          </Grid>
          <Grid item xs={3} className={classes.item}>
            <ValidatedTextInput
              itemQueryIdentifier="policyHolderEmployerTin"
              codeTakenLabel="policyHolder.employerTinTaken"
              shouldValidate={this.shouldValidateEmployerTin}
              isValid={isEmployerTinValid}
              isValidating={isEmployerTinValidating}
              validationError={validationEmployerTinError}
              action={policyHolderEmployerTinValidation}
              clearAction={policyHolderEmployerTinClear}
              setValidAction={policyHolderEmployerTinSetValid}
              module="policyHolder"
              required={true}
              label="TIN"
              value={!!edited && !!edited.employerTin ? edited.employerTin : ""}
              onChange={(v) => this.updateAttribute("employerTin", v)}
              readOnly={isPolicyHolderPortalUser}
            />
          </Grid>
          <Grid item xs={2} className={classes.item}>
            <TextInput
              module="policyHolder"
              label="tradeName"
              required
              inputProps={{ maxLength: MAX_TRADENAME_LENGTH }}
              value={!!edited && !!edited.tradeName ? edited.tradeName : ""}
              onChange={(v) => this.updateAttribute("tradeName", v)}
              readOnly={isPolicyHolderPortalUser}
            />
          </Grid>
          <Grid item xs={2} className={classes.item}>
            <PublishedComponent
              pubRef="policyHolder.EmployerTypePicker"
              module="policyHolder"
              label="employerType"
              withNull={false}
              value={!!edited ? parseInt(edited.employerType) : null}
              onChange={(v) => this.updateAttribute("employerType", v)}
              readOnly={isPolicyHolderPortalUser}
            />
          </Grid>
          <Grid item xs={8}>
            <PublishedComponent
              pubRef="location.DetailedLocation"
              withNull
              required
              filterLabels={false}
              value={!!edited ? edited.locations : null}
              onChange={(v) => this.updateAttribute("locations", v)}
              readOnly={isPolicyHolderPortalUser}
            />
          </Grid>
          <Grid item xs={2} className={classes.item}>
            <TextAreaInput
              module="policyHolder"
              label="address"
              inputProps={{ maxLength: MAX_ADDRESS_LENGTH }}
              value={!!edited && !!edited.address ? edited.address : ""}
              onChange={(v) => this.updateAttribute("address", v)}
              readOnly={isPolicyHolderPortalUser}
            />
          </Grid>
          <Grid item xs={2} className={classes.item}>
            <TextInput
              module="policyHolder"
              label="phone"
              inputProps={{ maxLength: MAX_PHONE_LENGTH }}
              value={!!edited && !!edited.phone ? edited.phone : ""}
              error={this.regexError("phone", edited.phone)}
              onChange={(v) => this.updateAttribute("phone", v)}
              readOnly={isPolicyHolderPortalUser}
            />
          </Grid>
          <Grid item xs={2} className={classes.item}>
            <TextInput
              module="policyHolder"
              label="fax"
              inputProps={{ maxLength: MAX_FAX_LENGTH }}
              value={!!edited && !!edited.fax ? edited.fax : ""}
              error={this.regexError("fax", edited.fax)}
              onChange={(v) => this.updateAttribute("fax", v)}
              readOnly={isPolicyHolderPortalUser}
            />
          </Grid>
          <Grid item xs={2} className={classes.item}>
            <TextInput
              module="policyHolder"
              label="email"
              inputProps={{ maxLength: MAX_EMAIL_LENGTH }}
              value={!!edited && !!edited.email ? edited.email : ""}
              error={this.regexError("email", edited.email)}
              onChange={(v) => this.updateAttribute("email", v)}
              readOnly={isPolicyHolderPortalUser}
            />
          </Grid>
          <Grid item xs={2} className={classes.item}>
            <TextInput
              module="policyHolder"
              label="contactName"
              value={!!edited && !!edited.contactName ? edited.contactName : ""}
              onChange={(v) => this.updateAttribute("contactName", v)}
              readOnly={isPolicyHolderPortalUser}
            />
          </Grid>
          <Grid item xs={2} className={classes.item}>
            <PublishedComponent
              pubRef="policyHolder.LegalFormPicker"
              module="policyHolder"
              label="legalForm"
              withNull={false}
              value={!!edited ? edited.legalForm : null}
              onChange={(v) => this.updateAttribute("legalForm", v)}
              readOnly={isPolicyHolderPortalUser}
            />
          </Grid>
          <Grid item xs={2} className={classes.item}>
            <PublishedComponent
              pubRef="policyHolder.ActivityCodePicker"
              module="policyHolder"
              label="activityCode"
              withNull={false}
              value={!!edited ? edited.activityCode : null}
              onChange={(v) => this.updateAttribute("activityCode", v)}
              readOnly={isPolicyHolderPortalUser}
            />
          </Grid>
          {this.fields.guaranteeNo !== "N" && (
            <>
              <Grid item xs={2} className={classes.item}>
                <TextInput
                  module="policyHolder"
                  label="accountancyAccount"
                  inputProps={{ maxLength: MAX_ACCOUNTANCYACCOUNT_LENGTH }}
                  value={
                    !!edited && !!edited.accountancyAccount
                      ? edited.accountancyAccount
                      : ""
                  }
                  error={this.regexError(
                    "accountancyAccount",
                    edited.accountancyAccount
                  )}
                  onChange={(v) =>
                    this.updateAttribute("accountancyAccount", v)
                  }
                  readOnly={isPolicyHolderPortalUser}
                />
              </Grid>

              <Grid item xs={2} className={classes.item}>
                <TextInput
                  module="policyHolder"
                  label="bankAccount"
                  value={
                    !!edited && !!edited.bankAccount ? edited.bankAccount : ""
                  }
                  onChange={(v) => this.updateAttribute("bankAccount", v)}
                  readOnly={isPolicyHolderPortalUser}
                />
              </Grid>
              <Grid item xs={2} className={classes.item}>
                <TextInput
                  module="policyHolder"
                  label="paymentReference"
                  inputProps={{ maxLength: MAX_PAYMENTREFERENCE_LENGTH }}
                  value={
                    !!edited && !!edited.paymentReference
                      ? edited.paymentReference
                      : ""
                  }
                  error={this.regexError(
                    "paymentReference",
                    edited.paymentReference
                  )}
                  onChange={(v) => this.updateAttribute("paymentReference", v)}
                  readOnly={isPolicyHolderPortalUser}
                />
              </Grid>
            </>
          )}
          <Grid item xs={2} className={classes.item}>
            <PublishedComponent
              pubRef="core.DatePicker"
              module="policyHolder"
              label="dateValidFrom"
              required
              maxDate={!!edited && !!edited.dateValidTo && edited.dateValidTo}
              value={
                !!edited && !!edited.dateValidFrom ? edited.dateValidFrom : null
              }
              onChange={(v) => this.updateAttribute("dateValidFrom", v)}
              readOnly={(!!edited && !!edited.id) || isPolicyHolderPortalUser}
            />
          </Grid>
          <Grid item xs={2} className={classes.item}>
            <PublishedComponent
              pubRef="core.DatePicker"
              module="policyHolder"
              label="dateValidTo"
              minDate={
                !!edited && !!edited.dateValidFrom && edited.dateValidFrom
              }
              value={
                !!edited && !!edited.dateValidTo ? edited.dateValidTo : null
              }
              onChange={(v) => this.updateAttribute("dateValidTo", v)}
              readOnly={isPolicyHolderPortalUser}
            />
          </Grid>
          <Grid item xs={3} className={classes.item}>
            <TextAreaInput
              module="policyHolder"
              label="remark"
              inputProps={{ maxLength: MAX_ADDRESS_LENGTH }}
              value={!!edited && !!edited.remarks ? edited.remarks : ""}
              onChange={(v) => this.updateAttribute("remarks", v)}
              readOnly={isPolicyHolderPortalUser}
            />
          </Grid>
        </Grid>
      </Fragment>
    );
  }
}

const mapStateToProps = (store) => ({
  isCodeValid: store.policyHolder?.validationFields?.policyHolderCode?.isValid,
  isCodeValidating:
    store.policyHolder?.validationFields?.policyHolderCode?.isValidating,
  validationError:
    store.policyHolder?.validationFields?.policyHolderCode?.validationError,
  savedPolicyHolderCode: store.policyHolder?.policyHolder?.code,
  isEmployerTinValid:
    store.policyHolder?.validationFields?.employerTin?.isValid,
  isEmployerTinValidating:
    store.policyHolder?.validationFields?.employerTin?.isValidating,
  validationEmployerTinError:
    store.policyHolder?.validationFields?.employerTin?.validationError,
  savedPolicyHolderEmployerTin: store.policyHolder?.policyHolder?.employerTin,
});

export default withModulesManager(
  injectIntl(
    connect(
      mapStateToProps,
      null
    )(withTheme(withStyles(styles)(PolicyHolderGeneralInfoPanel)))
  )
);
