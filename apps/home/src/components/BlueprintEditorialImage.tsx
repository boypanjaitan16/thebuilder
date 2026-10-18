type BlueprintEditorialImageProps = {
	name: "organization" | "talent" | "continuity" | "conversation";
};

export default function BlueprintEditorialImage({
	name,
}: BlueprintEditorialImageProps) {
	return (
		<figure className="blueprint-editorial-image" aria-hidden="true">
			<img
				src={`${import.meta.env.BASE_URL}images/blueprint-${name}.webp`}
				alt=""
				width="1672"
				height="941"
				loading="lazy"
				decoding="async"
			/>
		</figure>
	);
}
