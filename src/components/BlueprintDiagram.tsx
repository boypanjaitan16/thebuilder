import type { Copy } from "../i18n/translations";

export function BlueprintDiagram({ copy }: { copy: Copy }) {
	const p = copy.brand;
	return (
		<div className="bp-system-diagram" aria-label={p.system} role="img">
			<div className="bp-system-ring bp-system-ring-one" />
			<div className="bp-system-ring bp-system-ring-two" />
			<div className="bp-system-center">
				<span>TB</span>
				<small>{p.system}</small>
			</div>
			<div className="bp-system-node bp-node-one">
				<span>01</span>
				{p.leadership}
			</div>
			<div className="bp-system-node bp-node-two">
				<span>02</span>
				{p.decisions}
			</div>
			<div className="bp-system-node bp-node-three">
				<span>03</span>
				{p.continuity}
			</div>
		</div>
	);
}
