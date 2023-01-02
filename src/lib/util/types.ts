const stringTuple = <T extends [string] | string[]>(...data: T): T => data;

export { stringTuple };
