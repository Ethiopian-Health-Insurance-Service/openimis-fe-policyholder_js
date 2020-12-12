import React, { Component, Fragment } from "react"
import { injectIntl } from 'react-intl';
import { withModulesManager, formatMessage, formatMessageWithValues, formatDateFromISO, coreConfirm, journalize,
    Searcher, PublishedComponent } from "@openimis/fe-core";
import PolicyHolderFilter from "./PolicyHolderFilter";
import { fetchPolicyHolders, deletePolicyHolder } from "../actions"
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { IconButton, Tooltip } from "@material-ui/core";
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { RIGHT_POLICYHOLDER_UPDATE, RIGHT_POLICYHOLDER_DELETE } from "../constants"

class PolicyHolderSearcher extends Component {
    constructor(props) {
        super(props);
        this.rowsPerPageOptions = props.modulesManager.getConf("fe-policyHolder", "policyHolderFilter.rowsPerPageOptions", [10, 20, 50, 100]);
        this.defaultPageSize = props.modulesManager.getConf("fe-policyHolder", "policyHolderFilter.defaultPageSize", 10);
        this.state = {
            toDelete: null,
            deleted: []
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.submittingMutation && !this.props.submittingMutation) {
            this.props.journalize(this.props.mutation);
            this.setState(state => ({ deleted: state.deleted.concat(state.toDelete) }));
        } else if (prevProps.confirmed !== this.props.confirmed && !!this.props.confirmed && !!this.state.confirmedAction) {
            this.state.confirmedAction();
        }
    }

    fetch = (prms) => {
        this.props.fetchPolicyHolders(this.props.modulesManager, prms);
    }

    filtersToQueryParams = state => {
        let prms = Object.keys(state.filters)
            .filter(f => !!state.filters[f]['filter'])
            .map(f => state.filters[f]['filter']);
        prms.push(`first: ${state.pageSize}`);
        if (!state.filters.hasOwnProperty('isDeleted')) {
            prms.push("isDeleted: false");
        }
        if (!!state.afterCursor) {
            prms.push(`after: "${state.afterCursor}"`);
        }
        if (!!state.beforeCursor) {
            prms.push(`before: "${state.beforeCursor}"`);
        }
        if (!!state.orderBy) {
            prms.push(`orderBy: ["${state.orderBy}"]`);
        }
        return prms;
    }

    headers = () => {
        const { rights } = this.props;
        let result = [
            "policyHolder.displayName",
            "policyHolder.location",
            "policyHolder.legalForm",
            "policyHolder.activityCode",
            "policyHolder.dateValidFrom",
            "policyHolder.dateValidTo"
        ];
        if (rights.includes(RIGHT_POLICYHOLDER_UPDATE)) {
            result.push("policyHolder.emptyLabel");
        }
        if (rights.includes(RIGHT_POLICYHOLDER_DELETE)) {
            result.push("policyHolder.emptyLabel");
        }
        return result;
    }

    itemFormatters = () => {
        const { intl, modulesManager, onDoubleClick, policyHolderPageLink, rights } = this.props;
        let result = [
            policyHolder => !!policyHolder.code && policyHolder.tradeName
                ? `${policyHolder.code} ${policyHolder.tradeName}` : "",
            policyHolder => 
                <PublishedComponent
                    pubRef="location.DetailedLocation"
                    withNull={true}
                    readOnly={true}
                    value={!!policyHolder.locations ? policyHolder.locations : null} />,
            policyHolder => !!policyHolder.legalForm
                ? <PublishedComponent
                    pubRef="policyHolder.LegalFormPicker"
                    module="policyHolder"
                    label="legalForm"
                    value={policyHolder.legalForm}
                    disabled={true} />
                : "",
            policyHolder => !!policyHolder.activityCode
                ? <PublishedComponent
                    pubRef="policyHolder.ActivityCodePicker"
                    module="policyHolder"
                    label="activityCode"
                    value={policyHolder.activityCode}
                    disabled={true} />
                : "",
            policyHolder => !!policyHolder.dateValidFrom
                ? formatDateFromISO(modulesManager, intl, policyHolder.dateValidFrom)
                : "",
            policyHolder => !!policyHolder.dateValidTo
                ? formatDateFromISO(modulesManager, intl, policyHolder.dateValidTo)
                : ""
        ];
        if (rights.includes(RIGHT_POLICYHOLDER_UPDATE)) {
            result.push(
                policyHolder => (
                    <Tooltip title={formatMessage(this.props.intl, "policyHolder", "editButton.tooltip")}>
                        <IconButton
                            href={policyHolderPageLink(policyHolder)}
                            onClick={e => e.stopPropagation() && !policyHolder.clientMutationId && onDoubleClick(policyHolder)}
                            disabled={this.state.deleted.includes(policyHolder.id)}>
                                <EditIcon />
                        </IconButton>
                    </Tooltip>
                )
            );
        }
        if (rights.includes(RIGHT_POLICYHOLDER_DELETE)) {
            result.push(
                policyHolder => (
                    <Tooltip title={formatMessage(this.props.intl, "policyHolder", "deleteButton.tooltip")}>
                        <IconButton
                            onClick={() => this.onDelete(policyHolder)}
                            disabled={this.state.deleted.includes(policyHolder.id)}>
                                <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                )
            );
        }
        return result;
    }

    onDelete = policyHolder => {
        const { intl, coreConfirm, deletePolicyHolder } = this.props;
        let confirm = e => coreConfirm(
            formatMessageWithValues(intl, "policyHolder", "deletePolicyHolder.confirm.title",
                {
                    code: policyHolder.code,
                    tradeName: policyHolder.tradeName
                }
            ),
            formatMessageWithValues(intl, "policyHolder", "deletePolicyHolder.confirm.message",
                {
                    code: policyHolder.code,
                    tradeName: policyHolder.tradeName
                }
            )
        );
        let confirmedAction = () => {
            deletePolicyHolder(
                policyHolder,
                formatMessageWithValues(
                    intl,
                    "policyHolder",
                    "DeletePolicyHolder.mutationLabel",
                    { 
                        code: policyHolder.code,
                        tradeName: policyHolder.tradeName
                    }
                )
            );
            this.setState({ toDelete: policyHolder.id });
        }
        this.setState(
            { confirmedAction },
            confirm
        )
    }

    rowDeleted = (_, policyHolder) => this.state.deleted.includes(policyHolder.id);

    sorts = () => {
        return [
            ['code', true],
            null,
            ['legalForm', true],
            ['activityCode', true],
            ['dateValidFrom', true],
            ['dateValidTo', true]
        ]
    }

    render() {
        const { intl, fetchingPolicyHolders, fetchedPolicyHolders, errorPolicyHolders, policyHolders, policyHoldersPageInfo,
            policyHoldersTotalCount, onDoubleClick } = this.props;
        return (
            <Fragment>
                <Searcher
                    module="policyHolder"
                    FilterPane={PolicyHolderFilter}
                    fetch={this.fetch}
                    items={policyHolders}
                    itemsPageInfo={policyHoldersPageInfo}
                    fetchingItems={fetchingPolicyHolders}
                    fetchedItems={fetchedPolicyHolders}
                    errorItems={errorPolicyHolders}
                    tableTitle={formatMessageWithValues(intl, "policyHolder", "policyHolders.searcher.results.title", { policyHoldersTotalCount })}
                    headers={this.headers}
                    itemFormatters={this.itemFormatters}
                    filtersToQueryParams={this.filtersToQueryParams}
                    sorts={this.sorts}
                    rowsPerPageOptions={this.rowsPerPageOptions}
                    defaultPageSize={this.defaultPageSize}
                    defaultOrderBy="code"
                    onDoubleClick={policyHolder => !policyHolder.clientMutationId && onDoubleClick(policyHolder)}
                    rowDisabled={this.rowDeleted}
                    rowLocked={this.rowDeleted}
                />
            </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    fetchingPolicyHolders: state.policyHolder.fetchingPolicyHolders,
    fetchedPolicyHolders: state.policyHolder.fetchedPolicyHolders,
    errorPolicyHolders: state.policyHolder.errorPolicyHolders,
    policyHolders: state.policyHolder.policyHolders,
    policyHoldersPageInfo: state.policyHolder.policyHoldersPageInfo,
    policyHoldersTotalCount: state.policyHolder.policyHoldersTotalCount,
    confirmed: state.core.confirmed,
    submittingMutation: state.policyHolder.submittingMutation,
    mutation: state.policyHolder.mutation
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ fetchPolicyHolders, coreConfirm, deletePolicyHolder, journalize }, dispatch);
};

export default withModulesManager(injectIntl(connect(mapStateToProps, mapDispatchToProps)(PolicyHolderSearcher)));
