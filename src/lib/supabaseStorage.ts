export function getStoragePathFromPublicUrl(url: string, bucket: string) {
	const marker = `/storage/v1/object/public/${bucket}/`;
	const index = url.indexOf(marker);
	if (index === -1) return null;
	return url.slice(index + marker.length);
}
