class pingoptions {
  count: Number;
  payload: String;
  timeout: Number;
  constructor(opts) {
    this.count = opts.count || 1;
    this.payload = opts.payload || 'pinger';
    this.timeout = opts.timeout || 1000;
  }
}

export = pingoptions;
