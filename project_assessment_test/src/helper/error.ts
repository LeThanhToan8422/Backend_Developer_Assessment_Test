interface objectError {
  property: string;
  constraints: {
    matches?: string;
    minLength?: string;
    isString?: string;
    isNotEmpty?: string;
  };
}

export default class ErrorCustomizer {
  code: string;
  message: string | objectError[];
  status: number;

  constructor(
    code: string,
    message: string | objectError[],
    status: number = 400,
  ) {
    this.code = code;
    this.message = message;
    this.status = status;
  }
}
