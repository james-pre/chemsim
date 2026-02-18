import * as z from 'zod';
import { pick } from 'utilium';
import type { Atom } from './atom.js';
import type { Molecule } from './molecule.js';

export const BondKind = z.literal(['covalent', 'ionic', 'metallic', 'delocalized', 'multi-center']);
export type BondKind = z.infer<typeof BondKind>;

export const BondData = z.object({
	id: z.int().positive(),
	kind: BondKind,
	atoms: z.int().positive().array(),
	order: z.number().nonnegative(),
});
export interface BondData extends z.infer<typeof BondData> {}

export class Bond {
	public readonly id: number;

	constructor(
		public readonly molecule: Molecule,
		public kind: BondKind,
		public order: number,
		public atoms: Atom[]
	) {
		this.id = molecule.addBond(this);
		for (const atom of atoms) atom.bonds.add(this);
	}

	toJSON(): BondData {
		return {
			...pick(this, 'id', 'kind', 'order'),
			atoms: this.atoms.map(a => a.id),
		};
	}
}
