import * as z from 'zod';
import { elements } from './metadata.js';
import type { Bond } from './bond.js';
import type { Molecule } from './molecule.js';

export const XYZ = z.object({
	x: z.number(),
	y: z.number(),
	z: z.number(),
});

const Hybridization = z.literal(['sp', 'sp2', 'sp3', 'sp3d', 'sp3d2']);
type Hybridization = z.infer<typeof Hybridization>;

export const AtomData = z.object({
	id: z.int().positive(),
	element: z.int().positive(),
});
export interface AtomData extends z.infer<typeof AtomData> {}

export class Atom {
	public readonly id: number;
	public bonds = new Set<Bond>();

	constructor(
		public readonly molecule: Molecule,
		public element: number
	) {
		this.id = molecule.addAtom(this);
	}

	public *neighbors(): Generator<Atom> {
		for (const bond of this.bonds) {
			for (const atom of bond.atoms) if (atom !== this) yield atom;
		}
	}

	get hybridization(): Hybridization | null {
		// @todo compute
		return null;
	}

	get stericNumber(): number {
		// @todo compute
		return 0;
	}

	toJSON(): AtomData {
		return AtomData.parse(this);
	}

	toString(): string {
		return (elements[this.element] || elements[0]).symbol;
	}
}
