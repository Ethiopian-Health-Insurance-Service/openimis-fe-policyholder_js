import React from "react";
import BusinessIcon from "@material-ui/icons/Business";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import { FormattedMessage } from "@openimis/fe-core";
import messages_en from "./translations/en.json";
import PolicyHoldersPage from "./pages/PolicyHoldersPage";
import PolicyHolderPage from "./pages/PolicyHolderPage";
import LegalFormPicker from "./pickers/LegalFormPicker";
import ActivityCodePicker from "./pickers/ActivityCodePicker";
import reducer from "./reducer";
import {
    RIGHT_POLICYHOLDERUSER_SEARCH,
    RIGHT_POLICYHOLDER_SEARCH,
    RIGHT_PORTALPOLICYHOLDERUSER_SEARCH,
    RIGHT_PORTALPOLICYHOLDER_SEARCH
} from "./constants";
import TabPanel from "./components/TabPanel";
import {
    PolicyHolderInsureesTabLabel,
    PolicyHolderInsureesTabPanel
} from "./components/PolicyHolderInsureesTab";
import {
    PolicyHolderContributionPlanBundlesTabLabel,
    PolicyHolderContributionPlanBundlesTabPanel
} from "./components/PolicyHolderContributionPlanBundlesTab";
import ConfigBasedPicker from "./pickers/ConfigBasedPicker";
import PolicyHolderPicker from "./pickers/PolicyHolderPicker";
import PolicyHolderContributionPlanBundlePicker from "./pickers/PolicyHolderContributionPlanBundlePicker";
import PolicyHolderInsureePicker from "./pickers/PolicyHolderInsureePicker";
import {
    PolicyHolderPaymentsTabLabel,
    PolicyHolderPaymentsTabPanel
} from "./components/PolicyHolderPaymentsTab";
import PolicyHolderUsersPage from "./pages/PolicyHolderUsersPage";
import { PolicyHolderUsersTabLabel, PolicyHolderUsersTabPanel } from "./components/PolicyHolderUsersTab";
import { POLICYHOLDER_PICKER_PROJECTION } from "./actions";
import EconomicUnitDialog from "./dialogs/EconomicUnitDialog";
import EconomicUnitChangeButton from "./components/EconomicUnitChangeButton";
import EmployerTypePicker from "./pickers/EmployerTypePicker";

const ROUTE_POLICY_HOLDERS = "policyHolders";
const ROUTE_POLICY_HOLDER = "policyHolders/policyHolder";
const ROUTE_POLICY_HOLDER_USERS = "policyHolderUsers";

const DEFAULT_CONFIG = {
    "translations": [{ key: "en", messages: messages_en }],
    "reducers": [{ key: "policyHolder", reducer }],
    "refs": [
        { key: "policyHolder.LegalFormPicker", ref: LegalFormPicker },
        { key: "policyHolder.ActivityCodePicker", ref: ActivityCodePicker },
        { key: "policyHolder.ConfigBasedPicker", ref: ConfigBasedPicker },
        { key: "policyHolder.TabPanel", ref: TabPanel },
        { key: "policyHolder.PolicyHolderPicker", ref: PolicyHolderPicker },
        { key: "policyHolder.PolicyHolderPicker.projection", ref: POLICYHOLDER_PICKER_PROJECTION },
        { key: "policyHolder.PolicyHolderInsureePicker", ref: PolicyHolderInsureePicker },
        { key: "policyHolder.EmployerTypePicker", ref: EmployerTypePicker },
        { key: "policyHolder.PolicyHolderInsureePicker.projection", ref:
            [
                "id",
                "insuree{id,lastName,otherNames}",
                "contributionPlanBundle{id,code,name}"
            ]
        },
        { key: "policyHolder.PolicyHolderContributionPlanBundlePicker", ref: PolicyHolderContributionPlanBundlePicker },
        { key: "policyHolder.PolicyHolderContributionPlanBundlePicker.projection", ref:
            [
                "id",
                "contributionPlanBundle{id,code,name}"
            ]
        },
        { key: "policyHolder.route.policyHolders", ref: ROUTE_POLICY_HOLDERS },
        { key: "policyHolder.route.policyHolder", ref: ROUTE_POLICY_HOLDER }
    ],
    "core.Router": [
        { path: ROUTE_POLICY_HOLDERS, component: PolicyHoldersPage },
        { path: ROUTE_POLICY_HOLDER + "/:policyholder_id?", component: PolicyHolderPage },
        { path: ROUTE_POLICY_HOLDER_USERS, component: PolicyHolderUsersPage }
    ],
    "insuree.MainMenu": [
        {
            text: (
                <FormattedMessage
                    module="policyHolder"
                    id="menu.policyHolders"
                />
            ),
            icon: <BusinessIcon />,
            route: "/" + ROUTE_POLICY_HOLDERS,
            filter: rights =>
                [
                    RIGHT_POLICYHOLDER_SEARCH,
                    RIGHT_PORTALPOLICYHOLDER_SEARCH,
                ].some(right => rights.includes(right))
        }
    ],
    "admin.MainMenu": [
        {
            text: (
                <FormattedMessage
                    module="policyHolder"
                    id="menu.policyHolderUsers"
                />
            ),
            icon: <SupervisorAccountIcon />,
            route: "/" + ROUTE_POLICY_HOLDER_USERS,
            filter: rights =>
                [
                    RIGHT_POLICYHOLDERUSER_SEARCH,
                    RIGHT_PORTALPOLICYHOLDERUSER_SEARCH
                ].some(right => rights.includes(right))
        }
    ],
    "policyHolder.TabPanel.label": [
        PolicyHolderInsureesTabLabel,
        PolicyHolderContributionPlanBundlesTabLabel,
        PolicyHolderPaymentsTabLabel,
        PolicyHolderUsersTabLabel
    ],
    "policyHolder.TabPanel.panel": [
        PolicyHolderInsureesTabPanel,
        PolicyHolderContributionPlanBundlesTabPanel,
        PolicyHolderPaymentsTabPanel,
        PolicyHolderUsersTabPanel
    ],
    "invoice.SubjectAndThirdpartyPicker": [
        {
            type: "policy holder",
            picker: PolicyHolderPicker,
            pickerProjection: POLICYHOLDER_PICKER_PROJECTION
        },
    ],
    "policyholder.EconomicUnitDialog": [EconomicUnitDialog],
    "policyholder.EconomicUnitChangeButton": [EconomicUnitChangeButton],
};

export const PolicyHolderModule = (cfg) => {
    return { ...DEFAULT_CONFIG, ...cfg };
};
