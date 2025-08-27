// UI hooks library index
// This provides a clean import interface for all UI-related hooks

// Table sorting hooks
export {
  useTableSorting,
  useEmployeeSorting,
  useDepartmentSorting,
  useMultiColumnSorting,
  type SortDirection,
  type SortableField,
  type UseEmployeeSortingReturn,
} from './useTableSorting';

// Search and filtering hooks
export {
  useSearchFilter,
  useEmployeeSearch,
  useDepartmentSearch,
  useFacetedSearch,
  type SearchConfig,
  type FilterConfig,
  type UseEmployeeSearchReturn,
} from './useSearchFilter';

// Responsive hooks (re-exported from theme)
export {
  useResponsiveGrid,
  useResponsiveValue,
  createResponsiveStyles,
  gridTemplates,
  responsiveSpacing,
  responsiveTypography,
} from '../../theme/responsiveHelpers';