// Styled components library index
// This provides a clean import interface for all styled components

// Table components
export {
  StyledTable,
  StyledTableContainer,
  StyledTableHeader,
  StyledTableRow,
  StyledTableCell,
  StyledEmployeeInfoCell,
  StyledEmptyState,
  StyledSortableHeader,
} from './StyledTable';

// Search components
export {
  StyledSearchBar,
  StyledSearchContainer,
  StyledFilterChip,
  StyledSearchResults,
  StyledMultiFieldSearch,
} from './StyledSearchBar';

// Action components
export {
  StyledButton,
  StyledIconButton,
  StyledFab,
  StyledButtonGroup,
  PrimaryButton,
  SecondaryButton,
  DestructiveButton,
  EditIconButton,
  DeleteIconButton,
  MenuIconButton,
  SaveButton,
  CancelButton,
  SubmitButton,
  DeleteButton,
} from './StyledActionButton';

// Chip components
export {
  StyledChip,
  StatusChip,
  DepartmentChip,
  HierarchyChip,
  FilterChip as ChipFilter,
  TagChip,
  ChipGroup,
  SalaryChip,
} from './StyledChip';

// Card components
export {
  StyledCard,
  StyledCardHeader,
  StyledCardContent,
  StyledCardActions,
  EmployeeCard,
  DepartmentCard,
  StatsCard,
} from './StyledCard';

// Re-export theme utilities for convenience
export { useResponsiveGrid, useResponsiveValue } from '../../../theme/responsiveHelpers';
export { tableStyles } from '../../../theme/tableStyles';
export { formStyles } from '../../../theme/formStyles';
export { actionStyles } from '../../../theme/actionStyles';
export { componentStyles } from '../../../theme/components';