import { format as formatDate } from 'date-fns';
import { helper } from '@ember/component/helper';

function formatDateHelper([date, format], options) {
  return formatDate(date, format, options);
}

export default helper(formatDateHelper);
