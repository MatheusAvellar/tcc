import { writable } from "svelte/store";

export const Stables = writable([]);
export const Stable = writable("");
export const Sconfig = writable({});
export const Scolumns = writable([]);
export const Stotal_rows = writable(0);
// Accuracy
export const Sout_of_range = writable({});
export const Sout_of_list = writable({});
export const Sdoor = writable({});
// Completeness
export const Snot_nulls = writable({});