function isNotNumber(value: string | number): value is string {
  return Number.isNaN(Number(value));
}

export enum ValidationRules {
  notEmpty = "Please enter a value.",
  number = " must be a number.",
}

export class ValidationObject {
  fields: ValidationField[];

  constructor(fields: ValidationField[]) {
    this.fields = fields;
  }

  static empty() {
    return new ValidationObject([]);
  }

  get isValid() {
    return this.fields.length === 0;
  }

  validate({
    dfo,
    notNull,
    number,
  }: {
    dfo: any;
    notNull: string[];
    number: string[];
  }): ValidationObject {
    const errors: ValidationField[] = [];
    for (const r of notNull) {
      if (!dfo[r]) {
        errors.push(new ValidationField(r, dfo[r], [ValidationRules.notEmpty]));
      }
    }

    for (const r of number) {
      if (isNotNumber(dfo[r])) {
        errors.push(new ValidationField(r, dfo[r], [ValidationRules.number]));
      }
    }

    return new ValidationObject(errors);
  }
}

export class ValidationField {
  name: string;
  value: string;
  rules: ValidationRules[];

  constructor(name: string, value: string, rules: ValidationRules[]) {
    this.name = name;
    this.value = value;
    this.rules = rules;
  }

  // Error string will only be relevant to the first validation error found.
  get errorString() {
    switch (this.rules[0]) {
      case ValidationRules.notEmpty:
        return this.rules[0];
      case ValidationRules.number:
        return `${
          this.name.substring(0, 1).toUpperCase() + this.name.substring(1)
        } ${this.rules[0]}`;
      default:
        return "";
    }
  }
}
