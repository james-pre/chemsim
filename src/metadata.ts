import elements from '../data/elements.json' with { type: 'json' };

export interface Element {
	name: string;
	symbol: string;
	/**
	 * Electron configuration.
	 * Indexed as `[n-1][l]`:
	 * - `n` =  principal quantum number
	 * - `l` = angular-momentum quantum number
	 *
	 * The value is the number of electrons in the given sub-shell
	 */
	electrons: readonly (readonly number[])[];
}

elements satisfies readonly Element[];

export { elements };
