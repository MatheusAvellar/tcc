import { writable } from "svelte/store";

export const Stables = writable([]);
export const Stable = writable("");
export const Sconfig = writable({});
export const Scolumns = writable([]);
export const Stotal_rows = writable(0);
// Completeness
export const Snot_nulls = writable({});