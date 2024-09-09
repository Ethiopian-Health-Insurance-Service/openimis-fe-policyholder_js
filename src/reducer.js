import {
  formatServerError,
  formatGraphQLError,
  parseData,
  pageInfo,
  dispatchMutationReq,
  dispatchMutationResp,
  dispatchMutationErr,
} from "@openimis/fe-core";
import { ECONOMIC_UNIT_STORAGE_KEY } from "./constants";

function reducer(
  state = {
    fetchingPolicyHolders: false,
    errorPolicyHolders: null,
    fetchedPolicyHolders: false,
    policyHolders: [],
    policyHoldersPageInfo: {},
    policyHoldersTotalCount: 0,
    submittingMutation: false,
    mutation: {},
    fetchingPolicyHolder: false,
    errorPolicyHolder: null,
    fetchedPolicyHolder: false,
    policyHolder: {},
    fetchingPolicyHolderInsurees: false,
    errorPolicyHolderInsurees: null,
    fetchedPolicyHolderInsurees: false,
    policyHolderInsurees: [],
    policyHolderInsureesPageInfo: {},
    policyHolderInsureesTotalCount: 0,
    fetchingPickerPolicyHolderInsurees: false,
    errorPickerPolicyHolderInsurees: null,
    fetchedPickerPolicyHolderInsurees: false,
    pickerPolicyHolderInsurees: [],
    pickerPolicyHolderInsureesPageInfo: {},
    pickerPolicyHolderInsureesTotalCount: 0,
    fetchingPolicyHolderContributionPlanBundles: false,
    errorPolicyHolderContributionPlanBundles: null,
    fetchedPolicyHolderContributionPlanBundles: false,
    policyHolderContributionPlanBundles: [],
    policyHolderContributionPlanBundlesPageInfo: {},
    policyHolderContributionPlanBundlesTotalCount: 0,
    fetchingPickerPolicyHolderContributionPlanBundles: false,
    errorPickerPolicyHolderContributionPlanBundles: null,
    fetchedPickerPolicyHolderContributionPlanBundles: false,
    pickerPolicyHolderContributionPlanBundles: [],
    pickerPolicyHolderContributionPlanBundlesPageInfo: {},
    pickerPolicyHolderContributionPlanBundlesTotalCount: 0,
    fetchingPolicyHolderUsers: false,
    errorPolicyHolderUsers: null,
    fetchedPolicyHolderUsers: false,
    policyHolderUsers: [],
    policyHolderUsersPageInfo: {},
    policyHolderUsersTotalCount: 0,
    economicUnit: JSON.parse(localStorage.getItem(ECONOMIC_UNIT_STORAGE_KEY) ?? '{}'),
  },
  action
) {
  switch (action.type) {
    case "POLICYHOLDER_POLICYHOLDERS_REQ":
      return {
        ...state,
        fetchingPolicyHolders: true,
        fetchedPolicyHolders: false,
        policyHolders: [],
        policyHoldersPageInfo: {},
        policyHoldersTotalCount: 0,
        errorPolicyHolders: null,
      };
    case "POLICYHOLDER_POLICYHOLDERS_RESP":
      return {
        ...state,
        fetchingPolicyHolders: false,
        fetchedPolicyHolders: true,
        policyHolders: parseData(action.payload.data.policyHolder),
        policyHoldersPageInfo: pageInfo(action.payload.data.policyHolder),
        policyHoldersTotalCount: !!action.payload.data.policyHolder
          ? action.payload.data.policyHolder.totalCount
          : null,
        errorPolicyHolders: formatGraphQLError(action.payload),
      };
    case "POLICYHOLDER_POLICYHOLDERS_ERR":
      return {
        ...state,
        fetchingPolicyHolders: false,
        errorPolicyHolders: formatServerError(action.payload),
      };
    case "POLICYHOLDER_POLICYHOLDER_REQ":
      return {
        ...state,
        fetchingPolicyHolder: true,
        fetchedPolicyHolder: false,
        policyHolder: null,
        errorPolicyHolder: null,
      };
    case "POLICYHOLDER_POLICYHOLDER_RESP":
      return {
        ...state,
        fetchingPolicyHolder: false,
        fetchedPolicyHolder: true,
        policyHolder: parseData(action.payload.data.policyHolder).find(
          (policyHolder) => !!policyHolder
        ),
        errorPolicyHolder: formatGraphQLError(action.payload),
      };
    case "POLICYHOLDER_POLICYHOLDER_CLEAR":
      return {
        ...state,
        fetchingPolicyHolder: true,
        fetchedPolicyHolder: false,
        policyHolder: {},
        errorPolicyHolder: null,
      };
    case "POLICYHOLDER_POLICYHOLDER_ERR":
      return {
        ...state,
        fetchingPolicyHolder: false,
        errorPolicyHolder: formatServerError(action.payload),
      };
    case "POLICYHOLDER_POLICYHOLDERINSUREES_REQ":
      return {
        ...state,
        fetchingPolicyHolderInsurees: true,
        fetchedPolicyHolderInsurees: false,
        policyHolderInsurees: [],
        policyHolderInsureesPageInfo: {},
        policyHolderInsureesTotalCount: 0,
        errorPolicyHolderInsurees: null,
      };
    case "POLICYHOLDER_POLICYHOLDERINSUREES_RESP":
      return {
        ...state,
        fetchingPolicyHolderInsurees: false,
        fetchedPolicyHolderInsurees: true,
        policyHolderInsurees: parseData(
          action.payload.data.policyHolderInsuree
        ),
        policyHolderInsureesPageInfo: pageInfo(
          action.payload.data.policyHolderInsuree
        ),
        policyHolderInsureesTotalCount: !!action.payload.data
          .policyHolderInsuree
          ? action.payload.data.policyHolderInsuree.totalCount
          : null,
        errorPolicyHolderInsurees: formatGraphQLError(action.payload),
      };
    case "POLICYHOLDER_POLICYHOLDERINSUREES_ERR":
      return {
        ...state,
        fetchingPolicyHolderInsurees: false,
        errorPolicyHolderInsurees: formatServerError(action.payload),
      };
    case "POLICYHOLDER_POLICYHOLDERINSUREES_CLEAR":
      return {
        ...state,
        fetchingPolicyHolderInsurees: false,
        fetchedPolicyHolderInsurees: false,
        policyHolderInsurees: [],
        policyHolderInsureesPageInfo: {},
        policyHolderInsureesTotalCount: 0,
        errorPolicyHolderInsurees: null,
      };
    case "POLICYHOLDER_PICKERPOLICYHOLDERINSUREES_REQ":
      return {
        ...state,
        fetchingPickerPolicyHolderInsurees: true,
        fetchedPickerPolicyHolderInsurees: false,
        pickerPolicyHolderInsurees: [],
        pickerPolicyHolderInsureesPageInfo: {},
        pickerPolicyHolderInsureesTotalCount: 0,
        errorPickerPolicyHolderInsurees: null,
      };
    case "POLICYHOLDER_PICKERPOLICYHOLDERINSUREES_RESP":
      return {
        ...state,
        fetchingPickerPolicyHolderInsurees: false,
        fetchedPickerPolicyHolderInsurees: true,
        pickerPolicyHolderInsurees: parseData(
          action.payload.data.policyHolderInsuree
        ),
        pickerPolicyHolderInsureesPageInfo: pageInfo(
          action.payload.data.policyHolderInsuree
        ),
        pickerPolicyHolderInsureesTotalCount: !!action.payload.data
          .policyHolderInsuree
          ? action.payload.data.policyHolderInsuree.totalCount
          : null,
        errorPickerPolicyHolderInsurees: formatGraphQLError(action.payload),
      };
    case "POLICYHOLDER_PICKERPOLICYHOLDERINSUREES_ERR":
      return {
        ...state,
        fetchingPickerPolicyHolderInsurees: false,
        errorPickerPolicyHolderInsurees: formatServerError(action.payload),
      };
    case "POLICYHOLDER_POLICYHOLDERCONTRIBUTIONPLANBUNDLES_REQ":
      return {
        ...state,
        fetchingPolicyHolderContributionPlanBundles: true,
        fetchedPolicyHolderContributionPlanBundles: false,
        policyHolderContributionPlanBundles: [],
        policyHolderContributionPlanBundlesPageInfo: {},
        policyHolderContributionPlanBundlesTotalCount: 0,
        errorPolicyHolderContributionPlanBundles: null,
      };
    case "POLICYHOLDER_POLICYHOLDERCONTRIBUTIONPLANBUNDLES_RESP":
      return {
        ...state,
        fetchingPolicyHolderContributionPlanBundles: false,
        fetchedPolicyHolderContributionPlanBundles: true,
        policyHolderContributionPlanBundles: parseData(
          action.payload.data.policyHolderContributionPlanBundle
        ),
        policyHolderContributionPlanBundlesPageInfo: pageInfo(
          action.payload.data.policyHolderContributionPlanBundle
        ),
        policyHolderContributionPlanBundlesTotalCount: !!action.payload.data
          .policyHolderContributionPlanBundle
          ? action.payload.data.policyHolderContributionPlanBundle.totalCount
          : null,
        errorPolicyHolderContributionPlanBundles: formatGraphQLError(
          action.payload
        ),
      };
    case "POLICYHOLDER_POLICYHOLDERCONTRIBUTIONPLANBUNDLES_ERR":
      return {
        ...state,
        fetchingPolicyHolderContributionPlanBundles: false,
        errorPolicyHolderContributionPlanBundles: formatServerError(
          action.payload
        ),
      };
    case "POLICYHOLDER_PICKERPOLICYHOLDERCONTRIBUTIONPLANBUNDLES_REQ":
      return {
        ...state,
        fetchingPickerPolicyHolderContributionPlanBundles: true,
        fetchedPickerPolicyHolderContributionPlanBundles: false,
        pickerPolicyHolderContributionPlanBundles: [],
        pickerPolicyHolderContributionPlanBundlesPageInfo: {},
        pickerPolicyHolderContributionPlanBundlesTotalCount: 0,
        errorPickerPolicyHolderContributionPlanBundles: null,
      };
    case "POLICYHOLDER_PICKERPOLICYHOLDERCONTRIBUTIONPLANBUNDLES_RESP":
      return {
        ...state,
        fetchingPickerPolicyHolderContributionPlanBundles: false,
        fetchedPickerPolicyHolderContributionPlanBundles: true,
        pickerPolicyHolderContributionPlanBundles: parseData(
          action.payload.data.policyHolderContributionPlanBundle
        ),
        pickerPolicyHolderContributionPlanBundlesPageInfo: pageInfo(
          action.payload.data.policyHolderContributionPlanBundle
        ),
        pickerPolicyHolderContributionPlanBundlesTotalCount: !!action.payload
          .data.policyHolderContributionPlanBundle
          ? action.payload.data.policyHolderContributionPlanBundle.totalCount
          : null,
        errorPickerPolicyHolderContributionPlanBundles: formatGraphQLError(
          action.payload
        ),
      };
    case "POLICYHOLDER_PICKERPOLICYHOLDERCONTRIBUTIONPLANBUNDLES_ERR":
      return {
        ...state,
        fetchingPickerPolicyHolderContributionPlanBundles: false,
        errorPickerPolicyHolderContributionPlanBundles: formatServerError(
          action.payload
        ),
      };
    case "POLICYHOLDER_POLICYHOLDERUSERS_REQ":
      return {
        ...state,
        fetchingPolicyHolderUsers: true,
        fetchedPolicyHolderUsers: false,
        policyHolderUsers: [],
        policyHolderUsersPageInfo: {},
        policyHolderUsersTotalCount: 0,
        errorPolicyHolderUsers: null,
      };
    case "POLICYHOLDER_POLICYHOLDERUSERS_RESP":
      return {
        ...state,
        fetchingPolicyHolderUsers: false,
        fetchedPolicyHolderUsers: true,
        policyHolderUsers: parseData(action.payload.data.policyHolderUser),
        policyHolderUsersPageInfo: pageInfo(
          action.payload.data.policyHolderUser
        ),
        policyHolderUsersTotalCount: !!action.payload.data.policyHolderUser
          ? action.payload.data.policyHolderUser.totalCount
          : null,
        errorPolicyHolderUsers: formatGraphQLError(action.payload),
      };
    case "POLICYHOLDER_POLICYHOLDERUSERS_ERR":
      return {
        ...state,
        fetchingPolicyHolderUsers: false,
        errorPolicyHolderUsers: formatServerError(action.payload),
      };
    case "POLICYHOLDER_CODE_FIELDS_VALIDATION_REQ":
      return {
        ...state,
        validationFields: {
          ...state.validationFields,
          policyHolderCode: {
            isValidating: true,
            isValid: false,
            validationError: null,
          },
        },
      };
    case "POLICYHOLDER_CODE_FIELDS_VALIDATION_RESP":
      return {
        ...state,
        validationFields: {
          ...state.validationFields,
          policyHolderCode: {
            isValidating: false,
            isValid: action.payload?.data?.isValid,
            validationError: formatGraphQLError(action.payload),
          },
        },
      };
    case "POLICYHOLDER_CODE_FIELDS_VALIDATION_ERR":
      return {
        ...state,
        validationFields: {
          ...state.validationFields,
          policyHolderCode: {
            isValidating: false,
            isValid: false,
            validationError: formatServerError(action.payload),
          },
        },
      };
    case "POLICYHOLDER_CODE_FIELDS_VALIDATION_CLEAR":
      return {
        ...state,
        validationFields: {
          ...state.validationFields,
          policyHolderCode: {
            isValidating: true,
            isValid: false,
            validationError: null,
          },
        },
      };
    case "POLICYHOLDER_CODE_FIELDS_VALIDATION_SET_VALID":
      return {
        ...state,
        validationFields: {
          ...state.validationFields,
          policyHolderCode: {
            isValidating: false,
            isValid: true,
            validationError: null,
          },
        },
      };
      case "POLICYHOLDER_EMPLOYER_TIN_FIELDS_VALIDATION_REQ":
      return {
        ...state,
        validationFields: {
          ...state.validationFields,
          employerTin: {
            isValidating: true,
            isValid: false,
            validationError: null,
          },
        },
      };
    case "POLICYHOLDER_EMPLOYER_TIN_FIELDS_VALIDATION_RESP":
      return {
        ...state,
        validationFields: {
          ...state.validationFields,
          employerTin: {
            isValidating: false,
            isValid: action.payload?.data?.isValid,
            validationError: formatGraphQLError(action.payload),
          },
        },
      };
    case "POLICYHOLDER_EMPLOYER_TIN_FIELDS_VALIDATION_ERR":
      return {
        ...state,
        validationFields: {
          ...state.validationFields,
          employerTin: {
            isValidating: false,
            isValid: false,
            validationError: formatServerError(action.payload),
          },
        },
      };
    case "POLICYHOLDER_EMPLOYER_TIN_FIELDS_VALIDATION_CLEAR":
      return {
        ...state,
        validationFields: {
          ...state.validationFields,
          employerTin: {
            isValidating: true,
            isValid: false,
            validationError: null,
          },
        },
      };
    case "POLICYHOLDER_EMPLOYER_TIN_FIELDS_VALIDATION_SET_VALID":
      return {
        ...state,
        validationFields: {
          ...state.validationFields,
          employerTin: {
            isValidating: false,
            isValid: true,
            validationError: null,
          },
        },
      };
    case 'SAVE_ECONOMIC_UNIT':
      return {
        ...state,
        economicUnit: action.payload,
      };
    case "POLICYHOLDER_MUTATION_REQ":
      return dispatchMutationReq(state, action);
    case "POLICYHOLDER_MUTATION_ERR":
      return dispatchMutationErr(state, action);
    case "POLICYHOLDER_CREATE_POLICYHOLDER_RESP":
      return dispatchMutationResp(state, "createPolicyHolder", action);
    case "POLICYHOLDER_UPDATE_POLICYHOLDER_RESP":
      return dispatchMutationResp(state, "updatePolicyHolder", action);
    case "POLICYHOLDER_DELETE_POLICYHOLDER_RESP":
      return dispatchMutationResp(state, "deletePolicyHolder", action);
    case "POLICYHOLDER_CREATE_POLICYHOLDERINSUREE_RESP":
      return dispatchMutationResp(state, "createPolicyHolderInsuree", action);
    case "POLICYHOLDER_UPDATE_POLICYHOLDERINSUREE_RESP":
      return dispatchMutationResp(state, "updatePolicyHolderInsuree", action);
    case "POLICYHOLDER_DELETE_POLICYHOLDERINSUREE_RESP":
      return dispatchMutationResp(state, "deletePolicyHolderInsuree", action);
    case "POLICYHOLDER_REPLACE_POLICYHOLDERINSUREE_RESP":
      return dispatchMutationResp(state, "replacePolicyHolderInsuree", action);
    case "POLICYHOLDER_CREATE_POLICYHOLDERCONTRIBUTIONPLANBUNDLE_RESP":
      return dispatchMutationResp(
        state,
        "createPolicyHolderContributionPlanBundle",
        action
      );
    case "POLICYHOLDER_UPDATE_POLICYHOLDERCONTRIBUTIONPLANBUNDLE_RESP":
      return dispatchMutationResp(
        state,
        "updatePolicyHolderContributionPlanBundle",
        action
      );
    case "POLICYHOLDER_DELETE_POLICYHOLDERCONTRIBUTIONPLANBUNDLE_RESP":
      return dispatchMutationResp(
        state,
        "deletePolicyHolderContributionPlanBundle",
        action
      );
    case "POLICYHOLDER_REPLACE_POLICYHOLDERCONTRIBUTIONPLANBUNDLE_RESP":
      return dispatchMutationResp(
        state,
        "replacePolicyHolderContributionPlanBundle",
        action
      );
    case "POLICYHOLDER_CREATE_POLICYHOLDERUSER_RESP":
      return dispatchMutationResp(state, "createPolicyHolderUser", action);
    case "POLICYHOLDER_UPDATE_POLICYHOLDERUSER_RESP":
      return dispatchMutationResp(state, "updatePolicyHolderUser", action);
    case "POLICYHOLDER_DELETE_POLICYHOLDERUSER_RESP":
      return dispatchMutationResp(state, "deletePolicyHolderUser", action);
    case "POLICYHOLDER_REPLACE_POLICYHOLDERUSER_RESP":
      return dispatchMutationResp(state, "replacePolicyHolderUser", action);
    default:
      return state;
  }
}

export default reducer;
