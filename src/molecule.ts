import * as z from 'zod';
import { elements } from './metadata.js';

export const XYZ = z.object({
	x: z.number(),
	y: z.number(),
	z: z.number(),
});

export const Atom = z.object({
	element: z.int().positive(),
	hybridization: z.literal(['sp', 'sp2', 'sp3', 'sp3d', 'sp3d2']).nullish(),
	position: XYZ,
});
export interface Atom extends z.infer<typeof Atom> {}

export const BondKind = z.literal(['covalent', 'ionic', 'metallic', 'delocalized', 'multi-center']);

export const Bond = z.object({
	kind: BondKind,
	atoms: z.int().nonnegative().array(),
	order: z.number().nonnegative(),
});
export interface Bond extends z.infer<typeof Bond> {}

export const MoleculeData = z.object({
	atoms: Atom.array(),
	bonds: Bond.array(),
});
export interface MoleculeData extends z.infer<typeof MoleculeData> {}

export class Molecule implements MoleculeData {
	atoms: Atom[] = [];
	bonds: Bond[] = [];

	get elementCounts(): number[] {
		const counts: number[] = [];
		for (const atom of this.atoms) {
			counts[atom.element] ??= 0;
			counts[atom.element]++;
		}
		return counts;
	}

	toJSON(): MoleculeData {
		return MoleculeData.parse(this);
	}

	toString(): string {
		return this.elementCounts
			.filter(count => count)
			.map((count, z) => {
				const { symbol } = elements[z] || elements[0];
				return count === 1 ? symbol : symbol + count;
			})
			.join('');
	}
}
