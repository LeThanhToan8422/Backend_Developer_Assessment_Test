import ErrorCustomizer from './error';
import Pagination from './pagination';

export default class ResponseCustomizer {
  data: object;
  error: ErrorCustomizer;
  pagination: Pagination;

  constructor(
    data: object,
    error: ErrorCustomizer = null,
    pagination: Pagination = null,
  ) {
    this.data = data;
    this.error = error;
    this.pagination = pagination;
  }
}
