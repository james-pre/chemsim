import * as z from 'zod';
import { AtomData, type Atom } from './atom.js';
import { BondData, type Bond } from './bond.js';
import { elements } from './metadata.js';

export const MoleculeData = z.object({
	atoms: AtomData.array(),
	bonds: BondData.array(),
});
export interface MoleculeData extends z.infer<typeof MoleculeData> {}

export class Molecule {
	protected atoms: Atom[] = [];
	protected bonds: Bond[] = [];

	protected nextId = 0;

	addBond(bond: Bond): number {
		this.bonds.push(bond);
		return ++this.nextId;
	}

	addAtom(atom: Atom): number {
		this.atoms.push(atom);
		return ++this.nextId;
	}

	get elementCounts(): number[] {
		const counts: number[] = [];
		for (const atom of this.atoms) {
			counts[atom.element] ??= 0;
			counts[atom.element]++;
		}
		return counts;
	}

	toJSON(): MoleculeData {
		return {
			atoms: this.atoms.map(a => a.toJSON()),
			bonds: this.bonds.map(b => b.toJSON()),
		};
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
